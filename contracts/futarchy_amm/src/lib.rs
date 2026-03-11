#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, contracterror, Address, Env, Symbol};

mod vault_client {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/conditional_vault.wasm"
    );
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct PoolConfig {
    pub vault: Address,
    pub dao: Address,
    pub fee_bps: u32, // e.g. 30 = 0.3%
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Reserves {
    pub pass: i128,
    pub fail: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct TwapState {
    pub cumulative_pass_price: i128, // scaled by 1e9
    pub cumulative_fail_price: i128,
    pub last_timestamp: u64,
    pub last_pass_reserve: i128,
    pub last_fail_reserve: i128,
    pub start_timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct LpPosition {
    pub shares: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub enum DataKey {
    Config,
    Reserves,
    Twap,
    TotalShares,
    LpShares(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum AmmError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InsufficientLiquidity = 3,
    SlippageExceeded = 4,
    InvalidAmount = 5,
    ZeroReserves = 6,
    InsufficientShares = 7,
}

const SCALE: i128 = 1_000_000_000; // 1e9 for TWAP price precision

#[contract]
pub struct FutarchyAmmContract;

#[contractimpl]
impl FutarchyAmmContract {
    /// Initialize the AMM pool for a conditional vault.
    pub fn initialize(
        env: Env,
        vault: Address,
        dao: Address,
        fee_bps: u32,
    ) -> Result<(), AmmError> {
        if env.storage().instance().has(&DataKey::Config) {
            return Err(AmmError::AlreadyInitialized);
        }

        let config = PoolConfig {
            vault,
            dao,
            fee_bps,
        };

        let reserves = Reserves { pass: 0, fail: 0 };
        let now = env.ledger().timestamp();
        let twap = TwapState {
            cumulative_pass_price: 0,
            cumulative_fail_price: 0,
            last_timestamp: now,
            last_pass_reserve: 0,
            last_fail_reserve: 0,
            start_timestamp: now,
        };

        env.storage().instance().set(&DataKey::Config, &config);
        env.storage().instance().set(&DataKey::Reserves, &reserves);
        env.storage().persistent().set(&DataKey::Twap, &twap);
        env.storage().instance().set(&DataKey::TotalShares, &0_i128);

        Ok(())
    }

    /// Add liquidity to the pool. First provider sets the ratio.
    pub fn add_liquidity(
        env: Env,
        provider: Address,
        pass_amount: i128,
        fail_amount: i128,
    ) -> Result<i128, AmmError> {
        provider.require_auth();
        if pass_amount <= 0 || fail_amount <= 0 {
            return Err(AmmError::InvalidAmount);
        }

        let config: PoolConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(AmmError::NotInitialized)?;

        let mut reserves: Reserves = env
            .storage()
            .instance()
            .get(&DataKey::Reserves)
            .ok_or(AmmError::NotInitialized)?;

        let total_shares: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalShares)
            .unwrap_or(0);

        // Transfer conditional tokens from provider to this contract
        let vault = vault_client::Client::new(&env, &config.vault);
        vault.transfer_pass(&provider, &env.current_contract_address(), &pass_amount);
        vault.transfer_fail(&provider, &env.current_contract_address(), &fail_amount);

        // Calculate LP shares
        let shares = if total_shares == 0 {
            // First provider: shares = sqrt(pass * fail)
            isqrt(pass_amount * fail_amount)
        } else {
            // Proportional: min of (pass_amount/pass_reserve, fail_amount/fail_reserve) * total
            let share_pass = pass_amount * total_shares / reserves.pass;
            let share_fail = fail_amount * total_shares / reserves.fail;
            if share_pass < share_fail {
                share_pass
            } else {
                share_fail
            }
        };

        if shares <= 0 {
            return Err(AmmError::InvalidAmount);
        }

        // Update reserves
        reserves.pass += pass_amount;
        reserves.fail += fail_amount;
        env.storage().instance().set(&DataKey::Reserves, &reserves);

        // Update shares
        let new_total = total_shares + shares;
        env.storage()
            .instance()
            .set(&DataKey::TotalShares, &new_total);

        let lp_key = DataKey::LpShares(provider.clone());
        let existing: i128 = env.storage().persistent().get(&lp_key).unwrap_or(0);
        env.storage()
            .persistent()
            .set(&lp_key, &(existing + shares));

        Self::update_twap(&env, &reserves);

        env.events().publish(
            (Symbol::new(&env, "add_liq"), provider),
            (pass_amount, fail_amount, shares),
        );

        Ok(shares)
    }

    /// Remove liquidity by burning LP shares.
    pub fn remove_liquidity(
        env: Env,
        provider: Address,
        shares: i128,
    ) -> Result<(i128, i128), AmmError> {
        provider.require_auth();
        if shares <= 0 {
            return Err(AmmError::InvalidAmount);
        }

        let config: PoolConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(AmmError::NotInitialized)?;

        let mut reserves: Reserves = env
            .storage()
            .instance()
            .get(&DataKey::Reserves)
            .ok_or(AmmError::NotInitialized)?;

        let total_shares: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalShares)
            .unwrap_or(0);

        let lp_key = DataKey::LpShares(provider.clone());
        let user_shares: i128 = env.storage().persistent().get(&lp_key).unwrap_or(0);
        if user_shares < shares {
            return Err(AmmError::InsufficientShares);
        }

        let pass_out = shares * reserves.pass / total_shares;
        let fail_out = shares * reserves.fail / total_shares;

        reserves.pass -= pass_out;
        reserves.fail -= fail_out;
        env.storage().instance().set(&DataKey::Reserves, &reserves);

        let new_total = total_shares - shares;
        env.storage()
            .instance()
            .set(&DataKey::TotalShares, &new_total);
        env.storage()
            .persistent()
            .set(&lp_key, &(user_shares - shares));

        // Transfer conditional tokens back
        let vault = vault_client::Client::new(&env, &config.vault);
        vault.transfer_pass(&env.current_contract_address(), &provider, &pass_out);
        vault.transfer_fail(&env.current_contract_address(), &provider, &fail_out);

        Self::update_twap(&env, &reserves);

        Ok((pass_out, fail_out))
    }

    /// Swap pass tokens for fail tokens or vice versa.
    /// `buy_pass`: true = buy pass (sell fail), false = buy fail (sell pass).
    pub fn swap(
        env: Env,
        user: Address,
        buy_pass: bool,
        amount_in: i128,
        min_amount_out: i128,
    ) -> Result<i128, AmmError> {
        user.require_auth();
        if amount_in <= 0 {
            return Err(AmmError::InvalidAmount);
        }

        let config: PoolConfig = env
            .storage()
            .instance()
            .get(&DataKey::Config)
            .ok_or(AmmError::NotInitialized)?;

        let mut reserves: Reserves = env
            .storage()
            .instance()
            .get(&DataKey::Reserves)
            .ok_or(AmmError::NotInitialized)?;

        if reserves.pass <= 0 || reserves.fail <= 0 {
            return Err(AmmError::ZeroReserves);
        }

        // Apply fee
        let fee = amount_in * config.fee_bps as i128 / 10_000;
        let amount_in_after_fee = amount_in - fee;

        // Constant product: (reserve_in + amount_in_after_fee) * (reserve_out - amount_out) = reserve_in * reserve_out
        let (reserve_in, reserve_out) = if buy_pass {
            (reserves.fail, reserves.pass)
        } else {
            (reserves.pass, reserves.fail)
        };

        let amount_out =
            reserve_out * amount_in_after_fee / (reserve_in + amount_in_after_fee);

        if amount_out < min_amount_out {
            return Err(AmmError::SlippageExceeded);
        }
        if amount_out >= reserve_out {
            return Err(AmmError::InsufficientLiquidity);
        }

        // Transfer tokens via vault
        let vault = vault_client::Client::new(&env, &config.vault);
        if buy_pass {
            vault.transfer_fail(&user, &env.current_contract_address(), &amount_in);
            vault.transfer_pass(&env.current_contract_address(), &user, &amount_out);
            reserves.fail += amount_in;
            reserves.pass -= amount_out;
        } else {
            vault.transfer_pass(&user, &env.current_contract_address(), &amount_in);
            vault.transfer_fail(&env.current_contract_address(), &user, &amount_out);
            reserves.pass += amount_in;
            reserves.fail -= amount_out;
        }

        env.storage().instance().set(&DataKey::Reserves, &reserves);
        Self::update_twap(&env, &reserves);

        env.events().publish(
            (Symbol::new(&env, "swap"), user),
            (buy_pass, amount_in, amount_out),
        );

        Ok(amount_out)
    }

    /// Get current TWAP of pass token price (pass/fail ratio) over the pool's lifetime.
    pub fn get_twap(env: Env) -> Result<i128, AmmError> {
        let twap: TwapState = env
            .storage()
            .persistent()
            .get(&DataKey::Twap)
            .ok_or(AmmError::NotInitialized)?;

        let now = env.ledger().timestamp();
        let elapsed = now - twap.start_timestamp;

        if elapsed == 0 {
            if twap.last_fail_reserve > 0 {
                return Ok(twap.last_pass_reserve * SCALE / twap.last_fail_reserve);
            }
            return Err(AmmError::ZeroReserves);
        }

        // Bring cumulative up to date
        let time_delta = now - twap.last_timestamp;
        let mut cum_pass = twap.cumulative_pass_price;
        if twap.last_fail_reserve > 0 && time_delta > 0 {
            cum_pass += (twap.last_pass_reserve * SCALE / twap.last_fail_reserve)
                * time_delta as i128;
        }

        Ok(cum_pass / elapsed as i128)
    }

    /// Get current reserves.
    pub fn get_reserves(env: Env) -> Result<Reserves, AmmError> {
        env.storage()
            .instance()
            .get(&DataKey::Reserves)
            .ok_or(AmmError::NotInitialized)
    }

    /// Get current spot price of pass token (scaled by 1e9).
    pub fn get_spot_price(env: Env) -> Result<i128, AmmError> {
        let reserves: Reserves = env
            .storage()
            .instance()
            .get(&DataKey::Reserves)
            .ok_or(AmmError::NotInitialized)?;

        if reserves.fail <= 0 {
            return Err(AmmError::ZeroReserves);
        }

        Ok(reserves.pass * SCALE / reserves.fail)
    }

    pub fn get_lp_shares(env: Env, provider: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::LpShares(provider))
            .unwrap_or(0)
    }

    pub fn get_total_shares(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalShares)
            .unwrap_or(0)
    }

    // --- Internal ---

    fn update_twap(env: &Env, reserves: &Reserves) {
        let now = env.ledger().timestamp();
        let mut twap: TwapState = env
            .storage()
            .persistent()
            .get(&DataKey::Twap)
            .unwrap_or(TwapState {
                cumulative_pass_price: 0,
                cumulative_fail_price: 0,
                last_timestamp: now,
                last_pass_reserve: 0,
                last_fail_reserve: 0,
                start_timestamp: now,
            });

        let time_delta = now - twap.last_timestamp;
        if time_delta > 0 && twap.last_fail_reserve > 0 && twap.last_pass_reserve > 0 {
            twap.cumulative_pass_price += (twap.last_pass_reserve * SCALE
                / twap.last_fail_reserve)
                * time_delta as i128;
            twap.cumulative_fail_price += (twap.last_fail_reserve * SCALE
                / twap.last_pass_reserve)
                * time_delta as i128;
        }

        twap.last_timestamp = now;
        twap.last_pass_reserve = reserves.pass;
        twap.last_fail_reserve = reserves.fail;

        env.storage().persistent().set(&DataKey::Twap, &twap);
    }
}

/// Integer square root (Babylonian method).
fn isqrt(val: i128) -> i128 {
    if val <= 0 {
        return 0;
    }
    let mut x = val;
    let mut y = (x + 1) / 2;
    while y < x {
        x = y;
        y = (x + val / x) / 2;
    }
    x
}
