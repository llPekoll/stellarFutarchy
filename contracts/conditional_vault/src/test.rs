#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, token, Address, Env};

fn setup_test() -> (Env, Address, Address, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let token_admin = Address::generate(&env);

    // Create a test token
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_addr = token_contract.address();
    let token_admin_client = token::StellarAssetClient::new(&env, &token_addr);

    // Create vault
    let vault_id = env.register(ConditionalVaultContract, ());
    let vault_client = ConditionalVaultContractClient::new(&env, &vault_id);

    let authority = Address::generate(&env);
    vault_client.initialize(&token_addr, &authority);

    // Mint some tokens to admin for testing
    token_admin_client.mint(&admin, &10_000);

    (env, vault_id, token_addr, admin, authority)
}

#[test]
fn test_split_and_merge() {
    let (env, vault_id, _token_addr, user, _authority) = setup_test();
    let client = ConditionalVaultContractClient::new(&env, &vault_id);

    // Split 100 tokens
    client.split(&user, &100);

    assert_eq!(client.get_pass_balance(&user), 100);
    assert_eq!(client.get_fail_balance(&user), 100);

    // Merge 50 tokens
    client.merge(&user, &50);

    assert_eq!(client.get_pass_balance(&user), 50);
    assert_eq!(client.get_fail_balance(&user), 50);
}

#[test]
fn test_finalize_and_redeem() {
    let (env, vault_id, _token_addr, user, authority) = setup_test();
    let client = ConditionalVaultContractClient::new(&env, &vault_id);

    client.split(&user, &100);
    client.finalize(&authority);

    let config = client.get_config();
    assert_eq!(config.status, VaultStatus::Finalized);

    // Redeem - should get back 100 (pass tokens win)
    let redeemed = client.redeem(&user);
    assert_eq!(redeemed, 100);

    assert_eq!(client.get_pass_balance(&user), 0);
    assert_eq!(client.get_fail_balance(&user), 0);
}

#[test]
fn test_revert_and_redeem() {
    let (env, vault_id, _token_addr, user, authority) = setup_test();
    let client = ConditionalVaultContractClient::new(&env, &vault_id);

    client.split(&user, &100);
    client.revert(&authority);

    let config = client.get_config();
    assert_eq!(config.status, VaultStatus::Reverted);

    // Redeem - should get back 100 (fail tokens win)
    let redeemed = client.redeem(&user);
    assert_eq!(redeemed, 100);
}

#[test]
fn test_transfer_conditional_tokens() {
    let (env, vault_id, _token_addr, user, _authority) = setup_test();
    let client = ConditionalVaultContractClient::new(&env, &vault_id);

    let recipient = Address::generate(&env);

    client.split(&user, &100);
    client.transfer_pass(&user, &recipient, &30);
    client.transfer_fail(&user, &recipient, &20);

    assert_eq!(client.get_pass_balance(&user), 70);
    assert_eq!(client.get_fail_balance(&user), 80);
    assert_eq!(client.get_pass_balance(&recipient), 30);
    assert_eq!(client.get_fail_balance(&recipient), 20);
}
