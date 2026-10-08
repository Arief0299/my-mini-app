const LUNA_PER_NIM = 100000;

type AccountResponse = {
  address?: string;
  balance?: number | string;
  data?: {
    balance?: number | string;
  };
};

export async function getBalance(address: string): Promise<string> {
  console.log("========== BALANCE CHECK ==========");
  console.log("ADDRESS:", address);

  if (!address) {
    return "0.00000 NIM";
  }

  try {
    const result = await rpc("getAccountByAddress", [address]);

    console.log("ACCOUNT RPC RESULT:");
    console.log(result);

    if (!result || typeof result !== "object") {
      console.error("Invalid RPC result");
      return "0.00000 NIM";
    }

    const account = result as AccountResponse;

    // Nimiq's getAccountByAddress returns Account.balance directly.
    // Keep data.balance as a compatibility fallback for wrapped RPC responses.
    const rawBalance =
      account.balance ?? account.data?.balance;

    console.log("RAW BALANCE:", rawBalance);

    if (rawBalance === undefined) {
      console.error("Balance not found");
      return "0.00000 NIM";
    }

    const luna = Number(rawBalance);

    if (!Number.isFinite(luna)) {
      console.error("Invalid balance:", rawBalance);
      return "0.00000 NIM";
    }

    const nim = luna / LUNA_PER_NIM;

    console.log("LUNA:", luna);
    console.log("NIM:", nim);

    return `${nim.toFixed(5)} NIM`;
  } catch (error) {
    console.error("BALANCE ERROR:", error);

    return "Unavailable";
  }
}
