#!/bin/bash
set -e

# Deploy Stellar Futarchy contracts to testnet
# Prerequisites: stellar CLI installed, funded testnet account

NETWORK="testnet"

echo "=== Building contracts ==="
cargo build --release --target wasm32-unknown-unknown -p conditional-vault
cargo build --release --target wasm32-unknown-unknown -p futarchy-amm
cargo build --release --target wasm32-unknown-unknown -p dao

WASM_DIR="target/wasm32-unknown-unknown/release"

echo ""
echo "=== Uploading WASMs to $NETWORK ==="

echo "Uploading conditional_vault..."
VAULT_WASM_HASH=$(stellar contract upload \
  --wasm "$WASM_DIR/conditional_vault.wasm" \
  --network $NETWORK \
  --source default \
  2>&1 | tail -1)
echo "Vault WASM hash: $VAULT_WASM_HASH"

echo "Uploading futarchy_amm..."
AMM_WASM_HASH=$(stellar contract upload \
  --wasm "$WASM_DIR/futarchy_amm.wasm" \
  --network $NETWORK \
  --source default \
  2>&1 | tail -1)
echo "AMM WASM hash: $AMM_WASM_HASH"

echo "Uploading dao..."
DAO_WASM_HASH=$(stellar contract upload \
  --wasm "$WASM_DIR/dao.wasm" \
  --network $NETWORK \
  --source default \
  2>&1 | tail -1)
echo "DAO WASM hash: $DAO_WASM_HASH"

echo ""
echo "=== Deploying DAO contract ==="
DAO_CONTRACT_ID=$(stellar contract deploy \
  --wasm-hash "$DAO_WASM_HASH" \
  --network $NETWORK \
  --source default \
  2>&1 | tail -1)
echo "DAO Contract ID: $DAO_CONTRACT_ID"

echo ""
echo "=== Done! ==="
echo ""
echo "Add these to frontend/.env.local:"
echo "NEXT_PUBLIC_DAO_CONTRACT_ID=$DAO_CONTRACT_ID"
echo "NEXT_PUBLIC_VAULT_WASM_HASH=$VAULT_WASM_HASH"
echo "NEXT_PUBLIC_AMM_WASM_HASH=$AMM_WASM_HASH"
