import { ref } from "vue";

import {
  getAccounts,
  getConsensus,
  getBlockNumber,
  signMessage,
  sendNim,
} from "../services/nimiq";

import { getBalance } from "../services/balance";

const account = ref("");
const balance = ref("0.00000 NIM");
const consensus = ref(false);
const block = ref(0);

const loading = ref(false);
const debugStatus = ref("Ready");
const lastError = ref("");
const lastTxHash = ref("");

const message = ref("Hello Nimiq!");
const signature = ref("");
const publicKey = ref("");

const recipient = ref("");
const amount = ref(0);

function getErrorMessage(error: unknown): string {
  console.error("[NIMIQ] RAW ERROR:", error);

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const value = error as Record<string, unknown>;

    if (
      "error" in value &&
      typeof value.error === "object" &&
      value.error !== null
    ) {
      const nested = value.error as Record<string, unknown>;

      if (typeof nested.message === "string") {
        return nested.message;
      }

      if (typeof nested.type === "string") {
        return nested.type;
      }
    }

    if (typeof value.message === "string") {
      return value.message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return "Unknown provider error";
    }
  }

  return String(error);
}

function isProviderMissingError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("provider was not injected") ||
    message.includes("not running inside a nimiq app") ||
    message.includes("nimiq provider")
  );
}

function parseBalance(balanceText: string): number {
  const value = Number(
    balanceText.replace(" NIM", "").trim()
  );

  return Number.isFinite(value) ? value : 0;
}

async function refreshWalletData() {
  if (!account.value) {
    return;
  }

  balance.value = await getBalance(account.value);
  consensus.value = await getConsensus();
  block.value = await getBlockNumber();
}

async function connectWallet() {
  loading.value = true;
  lastError.value = "";
  debugStatus.value = "Connecting...";

  try {
    const accounts = await getAccounts();

    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("No Nimiq account found");
    }

    account.value = accounts[0];

    debugStatus.value = "Loading wallet data...";

    await refreshWalletData();

    debugStatus.value = "Connected";
  } catch (error) {
    console.error("[NIMIQ] CONNECT ERROR:", error);

    if (isProviderMissingError(error)) {
      lastError.value =
        "Nimiq Wallet is not available in this browser. Open this Mini App inside Nimiq Pay.";
      debugStatus.value = "Open in Nimiq Pay";
    } else {
      lastError.value = getErrorMessage(error);
      debugStatus.value = "Connect Failed";
    }
  } finally {
    loading.value = false;
  }
}

async function signWalletMessage() {
  if (!account.value) {
    lastError.value = "Connect your Nimiq wallet first";
    debugStatus.value = "Sign Failed";
    return;
  }

  if (!message.value.trim()) {
    lastError.value = "Message cannot be empty";
    debugStatus.value = "Sign Failed";
    return;
  }

  try {
    loading.value = true;
    debugStatus.value = "Signing...";
    lastError.value = "";

    const result = await signMessage(message.value);

    if (
      typeof result !== "object" ||
      result === null ||
      !("publicKey" in result) ||
      !("signature" in result)
    ) {
      throw new Error("Invalid signing response");
    }

    publicKey.value = String(result.publicKey);
    signature.value = String(result.signature);

    debugStatus.value = "Signed";
  } catch (error) {
    console.error("[NIMIQ] SIGN ERROR:", error);

    if (isProviderMissingError(error)) {
      lastError.value =
        "Nimiq Wallet is not available. Open this Mini App inside Nimiq Pay.";
      debugStatus.value = "Open in Nimiq Pay";
    } else {
      lastError.value = getErrorMessage(error);
      debugStatus.value = "Sign Failed";
    }
  } finally {
    loading.value = false;
  }
}

async function sendTransaction() {
  const cleanRecipient = recipient.value.trim();

  if (!account.value) {
    lastError.value = "Wallet is not connected";
    debugStatus.value = "Transaction Failed";
    return;
  }

  if (!cleanRecipient) {
    lastError.value = "Recipient address is required";
    debugStatus.value = "Transaction Failed";
    return;
  }

  if (
    !Number.isFinite(amount.value) ||
    amount.value <= 0
  ) {
    lastError.value = "Amount must be greater than 0";
    debugStatus.value = "Transaction Failed";
    return;
  }

  const currentBalance = parseBalance(balance.value);

  if (amount.value > currentBalance) {
    lastError.value = "Insufficient balance";
    debugStatus.value = "Transaction Failed";
    return;
  }

  try {
    loading.value = true;
    debugStatus.value = "Waiting for wallet confirmation...";
    lastError.value = "";
    lastTxHash.value = "";

    const result = await sendNim(
      cleanRecipient,
      amount.value
    );

    lastTxHash.value = result;

    debugStatus.value = "Transaction Sent";

    recipient.value = "";
    amount.value = 0;

    await refreshWalletData();
  } catch (error) {
    console.error("[NIMIQ] TRANSACTION ERROR:", error);

    if (isProviderMissingError(error)) {
      lastError.value =
        "Nimiq Wallet is not available. Open this Mini App inside Nimiq Pay.";
      debugStatus.value = "Open in Nimiq Pay";
    } else {
      lastError.value = getErrorMessage(error);
      debugStatus.value = "Transaction Failed";
    }
  } finally {
    loading.value = false;
  }
}

export function useWallet() {
  return {
    account,
    balance,
    consensus,
    block,

    loading,
    debugStatus,
    lastError,
    lastTxHash,

    message,
    signature,
    publicKey,

    recipient,
    amount,

    connectWallet,
    signWalletMessage,
    sendTransaction,
  };
}
