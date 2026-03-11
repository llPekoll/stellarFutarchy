#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, contracterror, token, Address, Env, Symbol};

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum VaultStatus {
    Active,
    Finalized, // pass wins
    Reverted,  // fail wins
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct VaultConfig {
    pub underlying_token: Address,
    pub authority: Address, // the DAO contract that can resolve
    pub status: VaultStatus,
    pub total_deposited: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub enum DataKey {
    Config,
    PassBalance(Address),
    FailBalance(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum VaultError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    InsufficientBalance = 4,
    VaultNotActive = 5,
    VaultNotResolved = 6,
    InvalidAmount = 7,
}

#[contract]
pub struct ConditionalVaultContract;

#[contractimpl]
impl ConditionalVaultContract {
    /// Initialize vault with an underlying token and authority (DAO contract).
    pub fn initialize(
        env: Env,
        underlying_token: Address,
        authority: Address,
    ) -> Result<(), VaultError> {
        if env.storage().instance().has(&DataKey::Config) {
            return Err(VaultError::AlreadyInitialized);
        }

        let config = VaultConfig {
            underlying_token,
            authority,
            status: VaultStatus::Active,
            total_deposited: 0,
        };
        env.storage().instance().set(&DataKey::Config, &config);
        Ok(())
    }

    /// Deposit underlying tokens, receive equal pass + fail conditional tokens.
    pub fn split(env: Env, depositor: Address, amount: i128) -> Result<(), VaultError> {
        depositor.require_auth();
        if amount <= 0 {
            return Err(VaultError::InvalidAmount);
        }

        let mut config: VaultConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(VaultError::NotInitialized)?;

        if config.status != VaultStatus::Active {
            return Err(VaultError::VaultNotActive);
        }

        // Transfer underlying tokens from depositor to this contract
        let token_client = token::Client::new(&env, &config.underlying_token);
        token_client.transfer(&depositor, &env.current_contract_address(), &amount);

        // Mint pass + fail conditional tokens (tracked internally)
        let pass_key = DataKey::PassBalance(depositor.clone());
        let fail_key = DataKey::FailBalance(depositor.clone());

        let pass_bal: i128 = env.storage().persistent().get(&pass_key).unwrap_or(0);
        let fail_bal: i128 = env.storage().persistent().get(&fail_key).unwrap_or(0);

        env.storage()
            .persistent()
            .set(&pass_key, &(pass_bal + amount));
        env.storage()
            .persistent()
            .set(&fail_key, &(fail_bal + amount));

        config.total_deposited += amount;
        env.storage().instance().set(&DataKey::Config, &config);

        env.events().publish(
            (Symbol::new(&env, "split"), depositor),
            amount,
        );

        Ok(())
    }

    /// Burn equal amounts of pass + fail tokens, receive underlying back.
    pub fn merge(env: Env, user: Address, amount: i128) -> Result<(), VaultError> {
        user.require_auth();
        if amount <= 0 {
            return Err(VaultError::InvalidAmount);
        }

        let mut config: VaultConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(VaultError::NotInitialized)?;

        if config.status != VaultStatus::Active {
            return Err(VaultError::VaultNotActive);
        }

        let pass_key = DataKey::PassBalance(user.clone());
        let fail_key = DataKey::FailBalance(user.clone());

        let pass_bal: i128 = env.storage().persistent().get(&pass_key).unwrap_or(0);
        let fail_bal: i128 = env.storage().persistent().get(&fail_key).unwrap_or(0);

        if pass_bal < amount || fail_bal < amount {
            return Err(VaultError::InsufficientBalance);
        }

        env.storage()
            .persistent()
            .set(&pass_key, &(pass_bal - amount));
        env.storage()
            .persistent()
            .set(&fail_key, &(fail_bal - amount));

        // Return underlying tokens
        let token_client = token::Client::new(&env, &config.underlying_token);
        token_client.transfer(&env.current_contract_address(), &user, &amount);

        config.total_deposited -= amount;
        env.storage().instance().set(&DataKey::Config, &config);

        env.events().publish(
            (Symbol::new(&env, "merge"), user),
            amount,
        );

        Ok(())
    }

    /// Authority-only: mark pass tokens as winners.
    pub fn finalize(env: Env, authority: Address) -> Result<(), VaultError> {
        authority.require_auth();
        let mut config: VaultConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(VaultError::NotInitialized)?;

        if config.authority != authority {
            return Err(VaultError::Unauthorized);
        }
        if config.status != VaultStatus::Active {
            return Err(VaultError::VaultNotActive);
        }

        config.status = VaultStatus::Finalized;
        env.storage().instance().set(&DataKey::Config, &config);

        env.events()
            .publish((Symbol::new(&env, "finalized"),), true);

        Ok(())
    }

    /// Authority-only: mark fail tokens as winners.
    pub fn revert(env: Env, authority: Address) -> Result<(), VaultError> {
        authority.require_auth();
        let mut config: VaultConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(VaultError::NotInitialized)?;

        if config.authority != authority {
            return Err(VaultError::Unauthorized);
        }
        if config.status != VaultStatus::Active {
            return Err(VaultError::VaultNotActive);
        }

        config.status = VaultStatus::Reverted;
        env.storage().instance().set(&DataKey::Config, &config);

        env.events()
            .publish((Symbol::new(&env, "reverted"),), true);

        Ok(())
    }

    /// After resolution, burn winning conditional tokens and receive underlying 1:1.
    pub fn redeem(env: Env, user: Address) -> Result<i128, VaultError> {
        user.require_auth();
        let mut config: VaultConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(VaultError::NotInitialized)?;

        let winning_key = match config.status {
            VaultStatus::Finalized => DataKey::PassBalance(user.clone()),
            VaultStatus::Reverted => DataKey::FailBalance(user.clone()),
            VaultStatus::Active => return Err(VaultError::VaultNotResolved),
        };

        let losing_key = match config.status {
            VaultStatus::Finalized => DataKey::FailBalance(user.clone()),
            VaultStatus::Reverted => DataKey::PassBalance(user.clone()),
            VaultStatus::Active => unreachable!(),
        };

        let winning_bal: i128 = env.storage().persistent().get(&winning_key).unwrap_or(0);
        if winning_bal <= 0 {
            return Err(VaultError::InsufficientBalance);
        }

        // Zero out both balances
        env.storage().persistent().set(&winning_key, &0_i128);
        env.storage().persistent().set(&losing_key, &0_i128);

        // Transfer underlying tokens to user
        let token_client = token::Client::new(&env, &config.underlying_token);
        token_client.transfer(&env.current_contract_address(), &user, &winning_bal);

        config.total_deposited -= winning_bal;
        env.storage().instance().set(&DataKey::Config, &config);

        env.events().publish(
            (Symbol::new(&env, "redeem"), user),
            winning_bal,
        );

        Ok(winning_bal)
    }

    // --- Transfer functions for AMM integration ---

    /// Transfer conditional tokens between accounts (called by AMM or users).
    pub fn transfer_pass(
        env: Env,
        from: Address,
        to: Address,
        amount: i128,
    ) -> Result<(), VaultError> {
        from.require_auth();
        if amount <= 0 {
            return Err(VaultError::InvalidAmount);
        }

        let from_key = DataKey::PassBalance(from.clone());
        let to_key = DataKey::PassBalance(to.clone());

        let from_bal: i128 = env.storage().persistent().get(&from_key).unwrap_or(0);
        if from_bal < amount {
            return Err(VaultError::InsufficientBalance);
        }
        let to_bal: i128 = env.storage().persistent().get(&to_key).unwrap_or(0);

        env.storage()
            .persistent()
            .set(&from_key, &(from_bal - amount));
        env.storage()
            .persistent()
            .set(&to_key, &(to_bal + amount));

        Ok(())
    }

    pub fn transfer_fail(
        env: Env,
        from: Address,
        to: Address,
        amount: i128,
    ) -> Result<(), VaultError> {
        from.require_auth();
        if amount <= 0 {
            return Err(VaultError::InvalidAmount);
        }

        let from_key = DataKey::FailBalance(from.clone());
        let to_key = DataKey::FailBalance(to.clone());

        let from_bal: i128 = env.storage().persistent().get(&from_key).unwrap_or(0);
        if from_bal < amount {
            return Err(VaultError::InsufficientBalance);
        }
        let to_bal: i128 = env.storage().persistent().get(&to_key).unwrap_or(0);

        env.storage()
            .persistent()
            .set(&from_key, &(from_bal - amount));
        env.storage()
            .persistent()
            .set(&to_key, &(to_bal + amount));

        Ok(())
    }

    // --- Query functions ---

    pub fn get_config(env: Env) -> Result<VaultConfig, VaultError> {
        env.storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(VaultError::NotInitialized)
    }

    pub fn get_pass_balance(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::PassBalance(user))
            .unwrap_or(0)
    }

    pub fn get_fail_balance(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::FailBalance(user))
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
