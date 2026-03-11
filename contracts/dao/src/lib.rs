#![no_std]

use soroban_sdk::{
    auth::{ContractContext, InvokerContractAuthEntry, SubContractInvocation},
    contract, contractimpl, contracttype, contracterror, token, vec, Address, BytesN, Env,
    IntoVal, String, Symbol,
};

mod vault_client {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/conditional_vault.wasm"
    );
}

mod amm_client {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/futarchy_amm.wasm"
    );
}

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
#[derive(Clone, Debug, PartialEq)]
pub enum ProposalState {
    Active,
    Passed,
    Failed,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Proposal {
    pub id: u32,
    pub proposer: Address,
    pub description_url: String,
    pub state: ProposalState,
    pub vault: Address,
    pub amm: Address,
    pub created_at: u64,
    pub voting_ends_at: u64,
    pub base_liquidity: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub enum DataKey {
    DaoConfig,
    ProposalCount,
    Proposal(u32),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum DaoError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InsufficientLiquidity = 3,
    ProposalNotFound = 4,
    ProposalNotActive = 5,
    VotingNotEnded = 6,
    VotingEnded = 7,
    InvalidAmount = 8,
}

const TWAP_SCALE: i128 = 1_000_000_000;

#[contract]
pub struct DaoContract;

#[contractimpl]
impl DaoContract {
    /// Permissionless DAO registration. Uses a DaoConfig struct to stay under
    /// Soroban's 10-parameter limit.
    pub fn register_dao(env: Env, creator: Address, config: DaoConfig) -> Result<(), DaoError> {
        creator.require_auth();

        if env.storage().instance().has(&DataKey::DaoConfig) {
            return Err(DaoError::AlreadyInitialized);
        }

        env.events().publish(
            (Symbol::new(&env, "dao_created"),),
            config.name.clone(),
        );

        env.storage().instance().set(&DataKey::DaoConfig, &config);
        env.storage()
            .instance()
            .set(&DataKey::ProposalCount, &0_u32);

        Ok(())
    }

    /// Create a new proposal with initial liquidity.
    pub fn create_proposal(
        env: Env,
        proposer: Address,
        description_url: String,
        base_amount: i128,
    ) -> Result<u32, DaoError> {
        proposer.require_auth();

        let config: DaoConfig = env
            .storage()
            .instance()
            .get(&DataKey::DaoConfig)
            .ok_or(DaoError::NotInitialized)?;

        if base_amount < config.min_base_liquidity {
            return Err(DaoError::InsufficientLiquidity);
        }

        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::ProposalCount)
            .unwrap_or(0);

        // Build unique salts for vault and AMM deployments
        let mut vault_salt_bytes = [0u8; 32];
        vault_salt_bytes[31] = (count & 0xFF) as u8;
        vault_salt_bytes[30] = ((count >> 8) & 0xFF) as u8;
        vault_salt_bytes[29] = ((count >> 16) & 0xFF) as u8;
        vault_salt_bytes[28] = ((count >> 24) & 0xFF) as u8;

        let vault_salt = BytesN::from_array(&env, &vault_salt_bytes);
        let vault_addr = env
            .deployer()
            .with_current_contract(vault_salt)
            .deploy_v2(config.vault_wasm_hash.clone(), ());

        let vault = vault_client::Client::new(&env, &vault_addr);
        vault.initialize(&config.base_token, &env.current_contract_address());

        let mut amm_salt_bytes = [0u8; 32];
        amm_salt_bytes[0] = 1; // different prefix from vault
        amm_salt_bytes[31] = (count & 0xFF) as u8;
        amm_salt_bytes[30] = ((count >> 8) & 0xFF) as u8;
        amm_salt_bytes[29] = ((count >> 16) & 0xFF) as u8;
        amm_salt_bytes[28] = ((count >> 24) & 0xFF) as u8;

        let amm_salt = BytesN::from_array(&env, &amm_salt_bytes);
        let amm_addr = env
            .deployer()
            .with_current_contract(amm_salt)
            .deploy_v2(config.amm_wasm_hash.clone(), ());

        let amm = amm_client::Client::new(&env, &amm_addr);
        amm.initialize(&vault_addr, &env.current_contract_address(), &config.amm_fee_bps);

        // Transfer base tokens from proposer to this contract
        let base_client = token::Client::new(&env, &config.base_token);
        base_client.transfer(&proposer, &env.current_contract_address(), &base_amount);

        // Authorize this contract (DAO) to let the vault transfer tokens on its behalf.
        // The vault's split() calls token.transfer(dao, vault, amount), which needs DAO auth.
        env.authorize_as_current_contract(vec![
            &env,
            InvokerContractAuthEntry::Contract(SubContractInvocation {
                context: ContractContext {
                    contract: config.base_token.clone(),
                    fn_name: Symbol::new(&env, "transfer"),
                    args: (
                        env.current_contract_address(),
                        vault_addr.clone(),
                        base_amount,
                    )
                        .into_val(&env),
                },
                sub_invocations: vec![&env],
            }),
        ]);

        // Split into pass/fail conditional tokens
        vault.split(&env.current_contract_address(), &base_amount);

        // Authorize this contract to let the AMM transfer conditional tokens on its behalf.
        // The AMM's add_liquidity() calls vault.transfer_pass(dao, amm, amount) and
        // vault.transfer_fail(dao, amm, amount), both needing DAO auth.
        env.authorize_as_current_contract(vec![
            &env,
            InvokerContractAuthEntry::Contract(SubContractInvocation {
                context: ContractContext {
                    contract: vault_addr.clone(),
                    fn_name: Symbol::new(&env, "transfer_pass"),
                    args: (
                        env.current_contract_address(),
                        amm_addr.clone(),
                        base_amount,
                    )
                        .into_val(&env),
                },
                sub_invocations: vec![&env],
            }),
            InvokerContractAuthEntry::Contract(SubContractInvocation {
                context: ContractContext {
                    contract: vault_addr.clone(),
                    fn_name: Symbol::new(&env, "transfer_fail"),
                    args: (
                        env.current_contract_address(),
                        amm_addr.clone(),
                        base_amount,
                    )
                        .into_val(&env),
                },
                sub_invocations: vec![&env],
            }),
        ]);

        // Seed AMM with equal pass/fail liquidity
        amm.add_liquidity(&env.current_contract_address(), &base_amount, &base_amount);

        let now = env.ledger().timestamp();
        let proposal = Proposal {
            id: count,
            proposer,
            description_url,
            state: ProposalState::Active,
            vault: vault_addr,
            amm: amm_addr,
            created_at: now,
            voting_ends_at: now + config.proposal_duration,
            base_liquidity: base_amount,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Proposal(count), &proposal);

        count += 1;
        env.storage()
            .instance()
            .set(&DataKey::ProposalCount, &count);

        env.events()
            .publish((Symbol::new(&env, "proposal"),), proposal.id);

        Ok(proposal.id)
    }

    /// Finalize a proposal after voting period ends.
    /// Reads TWAP from AMM to determine pass/fail.
    pub fn finalize_proposal(env: Env, proposal_id: u32) -> Result<ProposalState, DaoError> {
        let config: DaoConfig = env
            .storage()
            .instance()
            .get(&DataKey::DaoConfig)
            .ok_or(DaoError::NotInitialized)?;

        let mut proposal: Proposal = env
            .storage()
            .persistent()
            .get(&DataKey::Proposal(proposal_id))
            .ok_or(DaoError::ProposalNotFound)?;

        if proposal.state != ProposalState::Active {
            return Err(DaoError::ProposalNotActive);
        }

        let now = env.ledger().timestamp();
        if now < proposal.voting_ends_at {
            return Err(DaoError::VotingNotEnded);
        }

        // Read TWAP from AMM
        let amm = amm_client::Client::new(&env, &proposal.amm);
        let twap = amm.get_twap();

        // pass_threshold_bps: 5000 = pass price must be > 0.5 (scaled by 1e9)
        let threshold = TWAP_SCALE * config.pass_threshold_bps as i128 / 10_000;

        let vault = vault_client::Client::new(&env, &proposal.vault);

        if twap >= threshold {
            vault.finalize(&env.current_contract_address());
            proposal.state = ProposalState::Passed;
        } else {
            vault.revert(&env.current_contract_address());
            proposal.state = ProposalState::Failed;
        }

        env.storage()
            .persistent()
            .set(&DataKey::Proposal(proposal_id), &proposal);

        env.events().publish(
            (Symbol::new(&env, "finalized"),),
            (proposal_id, proposal.state.clone()),
        );

        Ok(proposal.state)
    }

    // --- Query functions ---

    pub fn get_dao_config(env: Env) -> Result<DaoConfig, DaoError> {
        env.storage()
            .instance()
            .get(&DataKey::DaoConfig)
            .ok_or(DaoError::NotInitialized)
    }

    pub fn get_proposal(env: Env, proposal_id: u32) -> Result<Proposal, DaoError> {
        env.storage()
            .persistent()
            .get(&DataKey::Proposal(proposal_id))
            .ok_or(DaoError::ProposalNotFound)
    }

    pub fn get_proposal_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::ProposalCount)
            .unwrap_or(0)
    }
}
