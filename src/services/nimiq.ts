import {
  init,
  type ErrorResponse,
} from "@nimiq/mini-app-sdk";

const INIT_TIMEOUT = 10_000;

let provider: Awaited<ReturnType<typeof init>> | null = null;

async function getProvider() {
  if (!provider) {
    console.log("[NIMIQ] Initializing provider...");

    provider = await init({
      timeout: INIT_TIMEOUT,
    });

    console.log("[NIMIQ] Provider initialized");
    console.log("[NIMIQ] connected =", provider.connected);
    console.log("[NIMIQ] network =", provider.getNetwork());
  }

  return provider;
}

function isErrorResponse(
  value: unknown
): value is ErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value
  );
}

function getErrorMessage(
  value: ErrorResponse
): string {
  if (
    value.error &&
    typeof value.error.message === "string"
  ) {
    return value.error.message;
  }

  return "Nimiq provider returned an error";
}

export async function getAccounts(): Promise<string[]> {
  const nimiq = await getProvider();

  console.log("[NIMIQ] Calling listAccounts()");

  const result = await nimiq.listAccounts();

  console.log("[NIMIQ] accounts result =", result);

  if (isErrorResponse(result)) {
    throw new Error(getErrorMessage(result));
  }

  return result;
}

export async function getConsensus(): Promise<boolean> {
  const nimiq = await getProvider();

  console.log(
    "[NIMIQ] Calling isConsensusEstablished()"
  );

  try {
    const result =
      await nimiq.isConsensusEstablished();

    console.log(
      "[NIMIQ] consensus raw =",
      result
    );

    console.log(
      "[NIMIQ] consensus type =",
      typeof result
    );

    console.log(
      "[NIMIQ] connected =",
      nimiq.connected
    );

    console.log(
      "[NIMIQ] network =",
      nimiq.getNetwork()
    );

    return Boolean(result);
  } catch (error) {
    console.error(
      "[NIMIQ] consensus error =",
      error
    );

    throw error;
  }
}

export async function getBlockNumber(): Promise<number> {
  const nimiq = await getProvider();

  console.log(
    "[NIMIQ] Calling getBlockNumber()"
  );

  const result =
    await nimiq.getBlockNumber();

  console.log(
    "[NIMIQ] block =",
    result
  );

  console.log(
    "[NIMIQ] block type =",
    typeof result
  );

  return Number(result);
}

export async function signMessage(
  message: string
) {
  const nimiq = await getProvider();

  const result =
    await nimiq.sign(message);

  if (isErrorResponse(result)) {
    throw new Error(
      getErrorMessage(result)
    );
  }

  return result;
}

export async function sendNim(
  recipient: string,
  amount: number
): Promise<string> {
  const cleanRecipient =
    recipient.trim();

  if (!cleanRecipient) {
    throw new Error(
      "Recipient address is required"
    );
  }

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error(
      "Amount must be greater than 0"
    );
  }

  // 1 NIM = 100,000 Lunas
  const luna =
    Math.round(amount * 100_000);

  if (
    !Number.isSafeInteger(luna) ||
    luna <= 0
  ) {
    throw new Error(
      "Invalid NIM amount"
    );
  }

  const nimiq = await getProvider();

  const result =
    await nimiq.sendBasicTransaction({
      recipient: cleanRecipient,
      value: luna,
    });

  if (isErrorResponse(result)) {
    throw new Error(
      getErrorMessage(result)
    );
  }

  return result;
}