import { rpc, Contract, TransactionBuilder, Networks } from "@stellar/stellar-sdk";
import { SOROBAN_RPC_URL, NETWORK_PASSPHRASE } from "./constants";

const server = new rpc.Server(SOROBAN_RPC_URL);

export { server };

export async function getAccount(address: string) {
  return server.getAccount(address);
}

export async function prepareAndSign(
  contractId: string,
  method: string,
  args: Parameters<Contract["call"]> extends [string, ...infer R] ? R : never,
  sourceAddress: string
): Promise<string> {
  const account = await getAccount(sourceAddress);
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  return prepared.toXDR();
}

export async function submitTransaction(signedXdr: string) {
  const tx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const response = await server.sendTransaction(tx);

  if (response.status === "PENDING") {
    let result = await server.getTransaction(response.hash);
    while (result.status === "NOT_FOUND") {
      await new Promise((r) => setTimeout(r, 1000));
      result = await server.getTransaction(response.hash);
    }
    return result;
  }

  return response;
}
