import {
  Account,
  Contract,
  Keypair,
  TransactionBuilder,
  Address,
  xdr,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";
import {
  FACTORY_CONTRACT_ID,
  VAULT_WASM_HASH,
  AMM_WASM_HASH,
  NETWORK_PASSPHRASE,
} from "./constants";
import { server } from "./stellar";
import { signTransaction } from "./wallet";

// --- Helpers ---

async function invokeContract(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  sourceAddress: string
) {
  const account = await server.getAccount(sourceAddress);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: "10000000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(60)
    .build();

  const prepared = await server.prepareTransaction(tx);
  const signedXdr = await signTransaction(prepared.toXDR());
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const response = await server.sendTransaction(signedTx);

  if (response.status === "ERROR") {
    throw new Error(`Transaction failed: ${JSON.stringify(response)}`);
  }

  let result = await server.getTransaction(response.hash);
  while (result.status === "NOT_FOUND") {
    await new Promise((r) => setTimeout(r, 1500));
    result = await server.getTransaction(response.hash);
  }

  if (result.status === "FAILED") {
    throw new Error(`Transaction failed on-chain: ${JSON.stringify(result)}`);
  }

  return result;
}

async function queryContract(
  contractId: string,
  method: string,
  args: xdr.ScVal[],
  sourceAddress?: string
) {
  // For read-only simulations, we don't need a real funded account.
  // Use a dummy keypair with sequence 0 — simulateTransaction doesn't check.
  let account;
  if (sourceAddress) {
    account = await server.getAccount(sourceAddress);
  } else {
    const dummyKp = Keypair.random();
    account = new Account(dummyKp.publicKey(), "0");
  }
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);

  if ("error" in simResult) {
    throw new Error(`Simulation error: ${simResult.error}`);
  }

  if (!("result" in simResult) || !simResult.result) {
    return null;
  }

  return simResult.result.retval;
}

// --- ScVal builders ---

function str(s: string): xdr.ScVal {
  return nativeToScVal(s, { type: "string" });
}
function addr(a: string): xdr.ScVal {
  return new Address(a).toScVal();
}
function u64(v: number): xdr.ScVal {
  return nativeToScVal(v, { type: "u64" });
}
function u32(v: number): xdr.ScVal {
  return nativeToScVal(v, { type: "u32" });
}
function i128(v: number): xdr.ScVal {
  return nativeToScVal(v, { type: "i128" });
}
function bytesN(hex: string): xdr.ScVal {
  const bytes = Buffer.from(hex, "hex");
  return xdr.ScVal.scvBytes(bytes);
}

function buildDaoConfigScVal(params: {
  name: string;
  descriptionUrl: string;
  baseToken: string;
  quoteToken: string;
  proposalDuration: number;
  passThresholdBps: number;
  minBaseLiquidity: number;
  minQuoteLiquidity: number;
  ammFeeBps: number;
  vaultWasmHash: string;
  ammWasmHash: string;
  creator: string;
}): xdr.ScVal {
  // Soroban struct = ScvMap with alphabetically sorted symbol keys
  const fields: [string, xdr.ScVal][] = [
    ["amm_fee_bps", u32(params.ammFeeBps)],
    ["amm_wasm_hash", bytesN(params.ammWasmHash)],
    ["base_token", addr(params.baseToken)],
    ["creator", addr(params.creator)],
    ["description_url", str(params.descriptionUrl)],
    ["min_base_liquidity", i128(params.minBaseLiquidity)],
    ["min_quote_liquidity", i128(params.minQuoteLiquidity)],
    ["name", str(params.name)],
    ["pass_threshold_bps", u32(params.passThresholdBps)],
    ["proposal_duration", u64(params.proposalDuration)],
    ["quote_token", addr(params.quoteToken)],
    ["vault_wasm_hash", bytesN(params.vaultWasmHash)],
  ];

  return xdr.ScVal.scvMap(
    fields.map(
      ([key, val]) =>
        new xdr.ScMapEntry({
          key: xdr.ScVal.scvSymbol(key),
          val,
        })
    )
  );
}

// ============================================================
// Factory contract interactions
// ============================================================

export interface DaoEntry {
  contract_id: string;
  name: string;
  creator: string;
  created_at: number;
}

/** Create a new DAO via the factory. Returns the new DAO contract address. */
export async function createDao(params: {
  creator: string;
  name: string;
  descriptionUrl: string;
  baseToken: string;
  quoteToken: string;
  proposalDuration: number; // seconds
  passThresholdBps: number;
  minBaseLiquidity: number;
  ammFeeBps: number;
}) {
  const configScVal = buildDaoConfigScVal({
    ...params,
    minQuoteLiquidity: params.minBaseLiquidity,
    vaultWasmHash: VAULT_WASM_HASH,
    ammWasmHash: AMM_WASM_HASH,
  });

  return invokeContract(
    FACTORY_CONTRACT_ID,
    "create_dao",
    [addr(params.creator), configScVal],
    params.creator
  );
}

/** Get total number of DAOs registered. */
export async function getDaoCount(sourceAddress?: string): Promise<number> {
  const result = await queryContract(
    FACTORY_CONTRACT_ID,
    "get_dao_count",
    [],
    sourceAddress
  );
  if (!result) return 0;
  return scValToNative(result) as number;
}

/** Get a single DAO entry by index. */
export async function getDaoEntry(
  index: number,
  sourceAddress?: string
): Promise<DaoEntry | null> {
  const result = await queryContract(
    FACTORY_CONTRACT_ID,
    "get_dao",
    [u32(index)],
    sourceAddress
  );
  if (!result) return null;
  return scValToNative(result) as DaoEntry;
}

/** List all DAOs from the factory. */
export async function listDaos(
  sourceAddress?: string
): Promise<DaoEntry[]> {
  const count = await getDaoCount(sourceAddress);
  const daos: DaoEntry[] = [];
  for (let i = 0; i < count; i++) {
    const entry = await getDaoEntry(i, sourceAddress);
    if (entry) daos.push(entry);
  }
  return daos;
}

// ============================================================
// DAO contract interactions (called on individual DAO contracts)
// ============================================================

export async function getDaoConfig(
  daoContractId: string,
  sourceAddress: string
) {
  const result = await queryContract(
    daoContractId,
    "get_dao_config",
    [],
    sourceAddress
  );
  if (!result) return null;
  return scValToNative(result);
}

export async function getProposalCount(
  daoContractId: string,
  sourceAddress?: string
): Promise<number> {
  const result = await queryContract(
    daoContractId,
    "get_proposal_count",
    [],
    sourceAddress
  );
  if (!result) return 0;
  return scValToNative(result) as number;
}

export async function getProposal(
  daoContractId: string,
  proposalId: number,
  sourceAddress: string
) {
  const result = await queryContract(
    daoContractId,
    "get_proposal",
    [u32(proposalId)],
    sourceAddress
  );
  if (!result) return null;
  return scValToNative(result);
}

export async function createProposal(params: {
  proposer: string;
  descriptionUrl: string;
  baseAmount: number;
  daoContractId: string;
}) {
  return invokeContract(
    params.daoContractId,
    "create_proposal",
    [addr(params.proposer), str(params.descriptionUrl), i128(params.baseAmount)],
    params.proposer
  );
}

export async function finalizeProposal(params: {
  proposalId: number;
  daoContractId: string;
  callerAddress: string;
}) {
  return invokeContract(
    params.daoContractId,
    "finalize_proposal",
    [u32(params.proposalId)],
    params.callerAddress
  );
}

// ============================================================
// Vault interactions (split, merge, redeem, balances)
// ============================================================

export async function splitTokens(params: {
  depositor: string;
  amount: number;
  vaultAddress: string;
}) {
  return invokeContract(
    params.vaultAddress,
    "split",
    [addr(params.depositor), i128(params.amount)],
    params.depositor
  );
}

export async function mergeTokens(params: {
  user: string;
  amount: number;
  vaultAddress: string;
}) {
  return invokeContract(
    params.vaultAddress,
    "merge",
    [addr(params.user), i128(params.amount)],
    params.user
  );
}

export async function redeemTokens(params: {
  user: string;
  vaultAddress: string;
}) {
  return invokeContract(
    params.vaultAddress,
    "redeem",
    [addr(params.user)],
    params.user
  );
}

export async function getVaultBalances(
  vaultAddress: string,
  userAddress: string
): Promise<{ pass: number; fail: number }> {
  const [passResult, failResult] = await Promise.all([
    queryContract(vaultAddress, "get_pass_balance", [addr(userAddress)], userAddress),
    queryContract(vaultAddress, "get_fail_balance", [addr(userAddress)], userAddress),
  ]);
  return {
    pass: passResult ? (scValToNative(passResult) as number) : 0,
    fail: failResult ? (scValToNative(failResult) as number) : 0,
  };
}

// ============================================================
// AMM interactions (swap, reserves)
// ============================================================

export async function swapOnAmm(params: {
  user: string;
  buyPass: boolean;
  amountIn: number;
  minAmountOut: number;
  ammAddress: string;
}) {
  return invokeContract(
    params.ammAddress,
    "swap",
    [
      addr(params.user),
      nativeToScVal(params.buyPass, { type: "bool" }),
      i128(params.amountIn),
      i128(params.minAmountOut),
    ],
    params.user
  );
}

export async function getAmmReserves(
  ammAddress: string,
  sourceAddress?: string
): Promise<{ pass: number; fail: number }> {
  const result = await queryContract(
    ammAddress,
    "get_reserves",
    [],
    sourceAddress
  );
  if (!result) return { pass: 0, fail: 0 };
  const native = scValToNative(result) as { pass: number; fail: number };
  return { pass: Number(native.pass), fail: Number(native.fail) };
}
