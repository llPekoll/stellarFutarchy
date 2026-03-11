# CLAUDE.md

## Project Overview

Stellar Futarchy — permissionless futarchy governance on Stellar/Soroban. Port of MetaDAO concepts to Stellar.

## Build & Test Commands

```bash
# Contracts (build order matters: vault → AMM → DAO → factory)
cargo build --release --target wasm32-unknown-unknown -p conditional-vault
cargo build --release --target wasm32-unknown-unknown -p futarchy-amm
cargo build --release --target wasm32-unknown-unknown -p dao
cargo build --release --target wasm32-unknown-unknown -p factory

# Run tests
cargo test -p conditional-vault

# Frontend
cd frontend && bun install && bun dev    # dev server
cd frontend && bun run build             # production build

# Deploy contracts to testnet
./scripts/deploy.sh
```

## Architecture

- **4 Soroban contracts** in `contracts/` (Rust, soroban-sdk 22.0.5):
  - `conditional_vault` — split/merge/redeem conditional pass/fail tokens
  - `futarchy_amm` — constant product AMM with TWAP oracle, depends on vault WASM
  - `dao` — DAO registration + proposal lifecycle, depends on vault + AMM WASMs
  - `factory` — on-chain registry, deploys new DAO contracts, lists all DAOs (no DB needed)
- **Frontend** in `frontend/` (Next.js 16, TypeScript, Tailwind, bun)
  - Wallet: Freighter (`@stellar/freighter-api` v6)
  - SDK: `@stellar/stellar-sdk` v14 — uses `rpc.Server` (not `SorobanRpc.Server`)
- **Contract interaction layer**: `frontend/src/lib/contracts.ts`

## Key Constraints

- Soroban max 10 parameters per contract function — use struct params for complex calls
- `contractimport!` paths resolve relative to the crate's `CARGO_MANIFEST_DIR` (e.g. `../../target/...`)
- Build order matters: vault → AMM → DAO → factory (each depends on previous WASMs via contractimport)
- Freighter API v6: `isConnected()` returns `{ isConnected: boolean }`, not a raw boolean

## Conventions

- Use **bun** (not npm/yarn) for frontend package management
- Contract WASMs output to `target/wasm32-unknown-unknown/release/`
- Testnet env vars go in `frontend/.env.local` (gitignored)
- Soroban structs are encoded as `ScvMap` with alphabetically sorted symbol keys
