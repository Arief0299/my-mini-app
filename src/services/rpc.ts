const RPC_URL = "https://rpc.nimiqwatch.com";

export async function rpc(
  method: string,
  params: unknown = {}
) {
  console.log("========== RPC REQUEST ==========");
  console.log("Method:", method);
  console.log("Params:", params);

  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    }),
  });

  const json = await response.json();

  console.log("========== RPC RESPONSE ==========");
  console.log(json);

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.result;
}