import { init } from "@nimiq/mini-app-sdk";

let provider: Awaited<ReturnType<typeof init>> | null = null;

async function getProvider() {
  if (!provider) {
    provider = await init();
  }

  return provider;
}

export async function getAccounts() {
  const nimiq = await getProvider();
  return await nimiq.listAccounts();
}

export async function getConsensus() {
  const nimiq = await getProvider();
  return await nimiq.isConsensusEstablished();
}

export async function getBlockNumber() {
  const nimiq = await getProvider();
  return await nimiq.getBlockNumber();
}

export async function signMessage(message: string) {
  const nimiq = await getProvider();
  return await nimiq.sign(message);
}

export async function sendNim(
  recipient: string,
  amount: number
) {
  const nimiq = await getProvider();

  // Konversi NIM ke Luna
  const luna = Math.round(amount * 100000);

  return await nimiq.sendBasicTransaction({
    recipient,
    value: luna,
  });
}