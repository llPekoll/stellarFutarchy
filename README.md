# Stellar Futarchy

Permissionless futarchy governance on Stellar/Soroban. Proposals are decided by prediction markets instead of token-weighted voting — *vote on values, bet on beliefs*.

Inspired by [MetaDAO](https://github.com/metaDAOproject/programs) on Solana.

## How It Works

1. **Register a DAO** — Anyone can create a futarchy DAO with a governance token and parameters (proposal duration, pass threshold, AMM fee)
2. **Create a Proposal** — Proposer deposits base tokens as initial liquidity. Tokens get split into conditional **pass** and **fail** tokens, seeded into an AMM pool
3. **Market Voting** — Traders buy/sell pass vs fail tokens on the AMM. If you think a proposal will benefit the DAO, buy pass tokens. The market price reflects collective belief
4. **Resolution** — After the voting period, the TWAP (time-weighted average price) determines the outcome. If pass price > threshold, the proposal passes. Winners redeem conditional tokens 1:1 for the underlying

## Architecture

### Smart Contracts (Soroban/Rust)

| Contract | Description |
|---|---|
| `factory` | On-chain registry — deploys and lists all DAOs. Single entry point, no DB needed |
| `dao` | Individual DAO — proposal lifecycle, deploys vault+AMM per proposal, finalizes via TWAP |
| `conditional_vault` | Splits tokens into pass/fail conditionals. Merge, transfer, and redeem after resolution |
| `futarchy_amm` | Constant product AMM (x·y=k) with TWAP oracle for pass/fail token trading |

### Frontend (Next.js + TypeScript + Tailwind)

| Route | Description |
|---|---|
| `/` | List all registered DAOs |
| `/register` | Permissionless DAO registration form |
| `/dao/[id]` | DAO detail — view proposals, create proposals, trade, finalize |

Wallet integration via [Freighter](https://freighter.app/).

## Trading Guide

Once a proposal is active, the Trade panel has three actions:

### Split
Deposit base tokens (e.g. XLM) into the vault. You receive an equal amount of **pass** and **fail** conditional tokens. This is the entry point — you must split before you can trade.

> Example: Split 100 base tokens → get 100 pass + 100 fail tokens

### Swap
Trade conditional tokens on the AMM. If you believe the proposal will pass, sell your fail tokens to buy more pass tokens (and vice versa). The swap uses a constant product formula (x*y=k) with a small fee.

- **Buy Pass (sell fail)**: You think the proposal will succeed
- **Buy Fail (sell pass)**: You think the proposal will fail
- Use at least ~10 tokens per swap to avoid rounding to zero against large reserves
- 5% slippage tolerance is applied automatically

### Merge
Burn equal amounts of pass + fail tokens to get back your base tokens. This is the reverse of split — useful if you want to exit your position without waiting for resolution.

> Example: Merge 50 tokens → burn 50 pass + 50 fail → receive 50 base tokens back

After the proposal is finalized, a **Redeem** button appears instead. Winners redeem their conditional tokens 1:1 for base tokens (pass tokens if proposal passed, fail tokens if it failed).

## Prerequisites

- [Rust](https://rustup.rs/) with `wasm32-unknown-unknown` target
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli) (`cargo install --locked stellar-cli`)
- [Bun](https://bun.sh/) for frontend
- [Freighter wallet](https://freighter.app/) browser extension (set to testnet)

## Quick Start

### Build Contracts

```bash
# Add WASM target if needed
rustup target add wasm32-unknown-unknown

# Build in order (each depends on previous WASMs)
cargo build --release --target wasm32-unknown-unknown -p conditional-vault
cargo build --release --target wasm32-unknown-unknown -p futarchy-amm
cargo build --release --target wasm32-unknown-unknown -p dao
cargo build --release --target wasm32-unknown-unknown -p factory
```

### Deploy to Testnet

```bash
# Generate a testnet keypair and fund it
stellar keys generate default --network testnet --fund

# Deploy all contracts
./scripts/deploy.sh
```

The script outputs contract IDs and WASM hashes. Copy them to `frontend/.env.local`:

```
NEXT_PUBLIC_FACTORY_CONTRACT_ID=C...
NEXT_PUBLIC_VAULT_WASM_HASH=...
NEXT_PUBLIC_AMM_WASM_HASH=...
```

### Run Frontend

```bash
cd frontend
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
cargo test -p conditional-vault
```

## Project Structure

```
stellarFutarchy/
├── Cargo.toml                    # Rust workspace
├── contracts/
│   ├── factory/                  # On-chain DAO registry + deployer
│   ├── dao/                      # Individual DAO + proposal orchestrator
│   ├── conditional_vault/        # Conditional token vault
│   └── futarchy_amm/             # AMM with TWAP oracle
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js pages
│   │   ├── components/           # React components
│   │   └── lib/                  # Stellar SDK helpers, contract calls
│   └── .env.local                # Contract IDs (after deploy)
└── scripts/
    └── deploy.sh                 # Build + deploy to testnet
```

## Testnet

All contracts are deployed on Stellar testnet. See `frontend/.env.local` for current contract IDs.

## License

MIT
