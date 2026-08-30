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
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "error" in error
  ) {
    const providerError = (
      error as {
        error?: {
          message?: unknown;
        };
      }
    ).error;

    if (
      providerError &&
      typeof providerError.message === "string"
    ) {
      return providerError.message;
    }
  }

  return String(error);
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
  console.log("========== CONNECT WALLET ==========");

  loading.value = true;
  lastError.value = "";
  debugStatus.value = "Connecting...";

  try {
    const accounts = await getAccounts();

    console.log("========== ACCOUNTS ==========");
    console.log(accounts);

    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("No Nimiq account found");
    }

    account.value = accounts[0];

    console.log("SELECTED ACCOUNT:");
    console.log(account.value);

    debugStatus.value = "Loading wallet data...";

    await refreshWalletData();

    debugStatus.value = "Connected";

    console.log("BALANCE:", balance.value);
    console.log("CONSENSUS:", consensus.value);
    console.log("BLOCK:", block.value);
  } catch (error) {
    console.error("CONNECT WALLET ERROR:", error);

    lastError.value = getErrorMessage(error);
    debugStatus.value = "Connect Failed";
  } finally {
    loading.value = false;
  }
}

async function signWalletMessage() {
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
    console.error("SIGN ERROR:", error);

    lastError.value = getErrorMessage(error);
    debugStatus.value = "Sign Failed";
  } finally {
    loading.value = false;
  }
}

async function sendTransaction() {
  const cleanRecipient = recipient.value.trim();

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

  try {
    loading.value = true;
    debugStatus.value = "Sending...";
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

    if (account.value) {
      await refreshWalletData();
    }
  } catch (error) {
    console.error("TRANSACTION ERROR:", error);

    lastError.value = getErrorMessage(error);
    debugStatus.value = "Transaction Failed";
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
