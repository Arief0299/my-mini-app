import { ref } from "vue";

import {
  getAccounts,
  getConsensus,
  getBlockNumber,
  getProviderStatus,
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

const providerConnected = ref(false);
const providerNetwork = ref("Unknown");

const consensusChecks = ref(0);
const lastConsensusCheck = ref("Never");

const message = ref("Hello Nimiq!");
const signature = ref("");
const publicKey = ref("");

const recipient = ref("");
const amount = ref(0);

let consensusTimer: ReturnType<typeof setInterval> | null = null;
let consensusPolling = false;

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

function parseBalance(balanceText: string): number {
  const value = Number(
    balanceText.replace(" NIM", "").trim()
  );

  return Number.isFinite(value) ? value : 0;
}

async function refreshProviderStatus() {
  try {
    const status = await getProviderStatus();

    providerConnected.value = status.connected;
    providerNetwork.value = status.network;

    console.log("[NIMIQ] Provider status:", status);
  } catch (error) {
    console.error(
      "[NIMIQ] Provider status error:",
      error
    );

    lastError.value = getErrorMessage(error);
  }
}

async function refreshConsensus() {
  console.log("[NIMIQ] >>> CONSENSUS CHECK START");

  try {
    const result = await getConsensus();

    consensusChecks.value += 1;
    lastConsensusCheck.value =
      new Date().toLocaleTimeString();

    consensus.value = result;

    console.log("[NIMIQ] >>> CONSENSUS CHECK RESULT", {
      check: consensusChecks.value,
      consensus: result,
      time: lastConsensusCheck.value,
    });

    if (result) {
      debugStatus.value = "Consensus Established";
      stopConsensusPolling();
    } else {
      debugStatus.value = "Waiting for Consensus...";
    }
  } catch (error) {
    console.error(
      "[NIMIQ] Consensus check error:",
      error
    );

    lastError.value = getErrorMessage(error);
  }
}

async function startConsensusPolling() {
  stopConsensusPolling();

  if (consensusPolling) {
    return;
  }

  consensusPolling = true;

  console.log("[NIMIQ] STARTING CONSENSUS POLLING");

  await refreshConsensus();

  if (consensus.value) {
    consensusPolling = false;
    return;
  }

  consensusTimer = setInterval(() => {
    console.log("[NIMIQ] Polling tick...");
    void refreshConsensus();
  }, 3000);
}

function stopConsensusPolling() {
  if (consensusTimer !== null) {
    clearInterval(consensusTimer);
    consensusTimer = null;
  }

  consensusPolling = false;
}

async function refreshWalletData() {
  if (!account.value) {
    return;
  }

  console.log("[NIMIQ] Refreshing wallet data...");

  await refreshProviderStatus();

  try {
    balance.value = await getBalance(account.value);
  } catch (error) {
    console.error("[NIMIQ] Balance error:", error);
    lastError.value = getErrorMessage(error);
  }

  await refreshConsensus();

  try {
    block.value = await getBlockNumber();
  } catch (error) {
    console.error("[NIMIQ] Block error:", error);
    lastError.value = getErrorMessage(error);
  }

  console.log("[NIMIQ] Wallet data refreshed", {
    account: account.value,
    balance: balance.value,
    consensus: consensus.value,
    block: block.value,
  });
}

async function connectWallet() {
  stopConsensusPolling();

  loading.value = true;
  lastError.value = "";
  lastTxHash.value = "";

  debugStatus.value = "Connecting...";

  consensusChecks.value = 0;
  lastConsensusCheck.value = "Never";
  consensus.value = false;

  try {
    console.log("[NIMIQ] Connecting wallet...");

    const accounts = await getAccounts();

    console.log("[NIMIQ] Accounts:", accounts);

    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("No Nimiq account found");
    }

    account.value = accounts[0];

    debugStatus.value = "Loading wallet data...";

    await refreshProviderStatus();

    try {
      balance.value = await getBalance(account.value);
    } catch (error) {
      console.error("[NIMIQ] Balance error:", error);
      lastError.value = getErrorMessage(error);
    }

    try {
      block.value = await getBlockNumber();
    } catch (error) {
      console.error("[NIMIQ] Block error:", error);
      lastError.value = getErrorMessage(error);
    }

    await refreshConsensus();

    if (consensus.value) {
      debugStatus.value = "Consensus Established";
    } else {
      debugStatus.value = "Waiting for Consensus...";
      void startConsensusPolling();
    }
  } catch (error) {
    console.error("[NIMIQ] CONNECT ERROR:", error);

    lastError.value = getErrorMessage(error);
    debugStatus.value = "Connect Failed";

    stopConsensusPolling();
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

    lastError.value = getErrorMessage(error);
    debugStatus.value = "Sign Failed";
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

    debugStatus.value =
      "Waiting for wallet confirmation...";

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

    if (!consensus.value) {
      void startConsensusPolling();
    }
  } catch (error) {
    console.error(
      "[NIMIQ] TRANSACTION ERROR:",
      error
    );

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
    providerConnected,
    providerNetwork,
    consensusChecks,
    lastConsensusCheck,
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
