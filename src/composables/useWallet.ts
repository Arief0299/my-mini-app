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

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  return String(err);
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

    account.value = String(accounts[0]);

    console.log("SELECTED ACCOUNT:");
    console.log(account.value);

    debugStatus.value = "Wallet connected";

    console.log("========== GET BALANCE ==========");

    balance.value = await getBalance(account.value);

    console.log("BALANCE:", balance.value);

    consensus.value = await getConsensus();
    block.value = await getBlockNumber();

    debugStatus.value = "Connected";
  } catch (err) {
    console.error("CONNECT WALLET ERROR:", err);

    lastError.value = getErrorMessage(err);
    debugStatus.value = "Connect Failed";
  } finally {
    loading.value = false;
  }
}

async function signWalletMessage() {
  try {
    debugStatus.value = "Signing...";
    lastError.value = "";

    const result = await signMessage(message.value);

    if (
      typeof result === "object" &&
      result !== null &&
      "publicKey" in result &&
      "signature" in result
    ) {
      publicKey.value = String(result.publicKey);
      signature.value = String(result.signature);

      debugStatus.value = "Signed";
    } else {
      throw new Error("Signing failed");
    }
  } catch (err) {
    console.error("SIGN ERROR:", err);

    lastError.value = getErrorMessage(err);
    debugStatus.value = "Sign Failed";
  }
}

async function sendTransaction() {
  try {
    debugStatus.value = "Sending...";
    lastError.value = "";

    const result = await sendNim(
      recipient.value,
      amount.value
    );

    lastTxHash.value = String(result);

    debugStatus.value = "Transaction Sent";

    if (account.value) {
      balance.value = await getBalance(account.value);
    }

    recipient.value = "";
    amount.value = 0;
  } catch (err) {
    console.error("TRANSACTION ERROR:", err);

    lastError.value = getErrorMessage(err);
    debugStatus.value = "Transaction Failed";
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
