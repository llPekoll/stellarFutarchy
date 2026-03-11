#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, Address, BytesN, Env, String, Symbol, Vec,
};

mod dao_client {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/dao.wasm"
    );
}

/// Factory's own copy of DaoConfig (must match the DAO contract's struct layout).
/// We define it here so it appears cleanly in the factory's contract spec,
/// avoiding cross-WASM type resolution issues with the CLI.
#[contracttype]
#[derive(Clone, Debug)]
pub struct DaoConfig {
    pub name: String,
    pub description_url: String,
    pub base_token: Address,
    pub quote_token: Address,
    pub proposal_duration: u64,
    pub pass_threshold_bps: u32,
    pub min_base_liquidity: i128,
    pub min_quote_liquidity: i128,
    pub amm_fee_bps: u32,
    pub vault_wasm_hash: BytesN<32>,
    pub amm_wasm_hash: BytesN<32>,
    pub creator: Address,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct DaoEntry {
    pub contract_id: Address,
    pub name: String,
    pub creator: Address,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub enum DataKey {
    DaoWasmHash,
    DaoCount,
    Dao(u32),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum FactoryError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    DaoNotFound = 3,
}

#[contract]
pub struct FactoryContract;

#[contractimpl]
impl FactoryContract {
    /// Initialize the factory with the DAO contract WASM hash.
    pub fn initialize(env: Env, dao_wasm_hash: BytesN<32>) -> Result<(), FactoryError> {
        if env.storage().instance().has(&DataKey::DaoWasmHash) {
            return Err(FactoryError::AlreadyInitialized);
        }

        env.storage()
            .instance()
            .set(&DataKey::DaoWasmHash, &dao_wasm_hash);
        env.storage().instance().set(&DataKey::DaoCount, &0_u32);

        Ok(())
    }

    /// Permissionless: deploy a new DAO contract and register it.
    pub fn create_dao(
        env: Env,
        creator: Address,
        config: DaoConfig,
    ) -> Result<Address, FactoryError> {
        creator.require_auth();

        let dao_wasm_hash: BytesN<32> = env
            .storage()
            .instance()
            .get(&DataKey::DaoWasmHash)
            .ok_or(FactoryError::NotInitialized)?;

        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::DaoCount)
            .unwrap_or(0);

        let mut salt_bytes = [0u8; 32];
        salt_bytes[31] = (count & 0xFF) as u8;
        salt_bytes[30] = ((count >> 8) & 0xFF) as u8;
        salt_bytes[29] = ((count >> 16) & 0xFF) as u8;
        salt_bytes[28] = ((count >> 24) & 0xFF) as u8;
        let salt = BytesN::from_array(&env, &salt_bytes);

        let dao_addr = env
            .deployer()
            .with_current_contract(salt)
            .deploy_v2(dao_wasm_hash, ());

        // Convert our DaoConfig to the DAO contract's DaoConfig via the raw ScVal.
        // Since the struct layouts are identical, we can pass it directly through
        // the imported client — Soroban encodes structs as maps with the same keys.
        let dao_config = dao_client::DaoConfig {
            name: config.name.clone(),
            description_url: config.description_url.clone(),
            base_token: config.base_token.clone(),
            quote_token: config.quote_token.clone(),
            proposal_duration: config.proposal_duration,
            pass_threshold_bps: config.pass_threshold_bps,
            min_base_liquidity: config.min_base_liquidity,
            min_quote_liquidity: config.min_quote_liquidity,
            amm_fee_bps: config.amm_fee_bps,
            vault_wasm_hash: config.vault_wasm_hash.clone(),
            amm_wasm_hash: config.amm_wasm_hash.clone(),
            creator: config.creator.clone(),
        };

        let dao = dao_client::Client::new(&env, &dao_addr);
        dao.register_dao(&creator, &dao_config);

        let entry = DaoEntry {
            contract_id: dao_addr.clone(),
            name: config.name,
            creator: creator.clone(),
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Dao(count), &entry);

        count += 1;
        env.storage().instance().set(&DataKey::DaoCount, &count);

        env.events().publish(
            (Symbol::new(&env, "dao_created"),),
            (dao_addr.clone(), entry.name),
        );

        Ok(dao_addr)
    }

    // --- Query functions ---

    pub fn get_dao_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::DaoCount)
            .unwrap_or(0)
    }

    pub fn get_dao(env: Env, index: u32) -> Result<DaoEntry, FactoryError> {
        env.storage()
            .persistent()
            .get(&DataKey::Dao(index))
            .ok_or(FactoryError::DaoNotFound)
    }

    pub fn list_daos(env: Env) -> Vec<DaoEntry> {
        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::DaoCount)
            .unwrap_or(0);

        let mut result = Vec::new(&env);
        for i in 0..count {
            if let Some(entry) = env.storage().persistent().get(&DataKey::Dao(i)) {
                result.push_back(entry);
            }
        }
        result
    }
}
