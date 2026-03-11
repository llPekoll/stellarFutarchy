export const NETWORK = "TESTNET";
export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";
export const HORIZON_URL = "https://horizon-testnet.stellar.org";

// These will be set after deployment
export const DAO_CONTRACT_ID =
  process.env.NEXT_PUBLIC_DAO_CONTRACT_ID || "";
export const VAULT_WASM_HASH =
  process.env.NEXT_PUBLIC_VAULT_WASM_HASH || "";
export const AMM_WASM_HASH =
  process.env.NEXT_PUBLIC_AMM_WASM_HASH || "";
