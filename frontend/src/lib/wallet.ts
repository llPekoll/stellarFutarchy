import freighter from "@stellar/freighter-api";
import { NETWORK_PASSPHRASE } from "./constants";

export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const result = await freighter.isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
}

export async function connectWallet(): Promise<string> {
  await freighter.requestAccess();
  const { address } = await freighter.getAddress();
  return address;
}

export async function signTransaction(txXdr: string): Promise<string> {
  const result = await freighter.signTransaction(txXdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });
  return result.signedTxXdr;
}
