"use client";

export default function WhitepaperPage() {
  return (
    <>
      <h1>NovaDAO Technical Whitepaper</h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
        v0.1 &mdash; March 2026 &mdash; Futarchy Governance on Stellar/Soroban
      </p>
      <p>
        NovaDAO is a permissionless futarchy governance protocol built on Stellar&apos;s Soroban smart
        contract platform. It enables any project to create a DAO where treasury spending decisions
        are made by prediction markets instead of token votes. This document describes the technical
        mechanisms that power the system.
      </p>

      <hr />

      {/* ── 1. CONDITIONAL VAULT ── */}
      <h2>1. Conditional Vault</h2>
      <p>
        The Conditional Vault is the foundation of the futarchy mechanism. It takes a base token
        (e.g. NOVA) and splits it into two conditional tokens &mdash; <strong>pToken</strong> (pass)
        and <strong>fToken</strong> (fail) &mdash; each representing a claim on the underlying asset
        conditional on a specific outcome.
      </p>

      <h3>1.1 Split</h3>
      <p>
        A user deposits <em>N</em> base tokens into the vault and receives <em>N</em> pTokens
        and <em>N</em> fTokens. The base tokens are held in escrow by the vault contract.
      </p>
      <pre><code>{`split(depositor, amount):
  require depositor.auth()
  require vault.status == Active
  transfer base_token from depositor to vault (amount)
  pass_balance[depositor] += amount
  fail_balance[depositor] += amount
  total_deposited += amount`}</code></pre>

      <h3>1.2 Merge</h3>
      <p>
        The inverse of split. A user returns equal amounts of pTokens and fTokens to receive the
        underlying base tokens back. This enables arbitrage: if pToken + fToken &lt; base token
        price, a trader can buy both conditional tokens, merge them, and pocket the difference.
      </p>
      <pre><code>{`merge(user, amount):
  require user.auth()
  require vault.status == Active
  require pass_balance[user] >= amount
  require fail_balance[user] >= amount
  pass_balance[user] -= amount
  fail_balance[user] -= amount
  transfer base_token from vault to user (amount)
  total_deposited -= amount`}</code></pre>

      <h3>1.3 Resolution &amp; Redemption</h3>
      <p>
        After the proposal&apos;s voting period ends, the DAO contract (the vault&apos;s authority) calls
        either <code>finalize()</code> (pass wins) or <code>revert()</code> (fail wins). After
        resolution, holders of the <strong>winning</strong> conditional token can redeem 1:1 for
        the underlying base token. The losing token becomes worthless.
      </p>
      <pre><code>{`redeem(user):
  require vault.status != Active  // must be resolved
  winning_token = pass_balance if Finalized, fail_balance if Reverted
  amount = winning_token[user]
  zero out both balances for user
  transfer base_token from vault to user (amount)
  total_deposited -= amount`}</code></pre>

      <div className="docs-note">
        <strong>Design choice:</strong> Conditional tokens are tracked as internal balances in the
        vault contract rather than minted as separate Stellar assets. This simplifies the architecture
        and avoids token management overhead. The vault exposes <code>transfer_pass()</code> and{" "}
        <code>transfer_fail()</code> functions so the AMM can move conditional tokens between accounts.
      </div>

      <hr />

      {/* ── 2. AMM & PRICING ── */}
      <h2>2. Futarchy AMM &amp; Decision Token Pricing</h2>
      <p>
        Each proposal gets its own <strong>constant-product AMM</strong> (x &times; y = k, similar
        to Uniswap v1) that trades pTokens against fTokens. The ratio of reserves determines the
        market&apos;s implied probability of the proposal passing.
      </p>

      <h3>2.1 Price Discovery</h3>
      <p>
        Given reserves <em>R<sub>pass</sub></em> and <em>R<sub>fail</sub></em>, the implied prices are:
      </p>
      <pre><code>{`pass_price = R_fail / (R_pass + R_fail)
fail_price = R_pass / (R_pass + R_fail)

// Example: R_pass = 987, R_fail = 1015
// pass_price = 1015 / 2002 = 50.7%
// fail_price = 987 / 2002 = 49.3%`}</code></pre>
      <p>
        When traders buy pTokens (expressing belief the proposal will pass), <em>R<sub>pass</sub></em>{" "}
        decreases and <em>R<sub>fail</sub></em> increases, pushing the pass price up. The opposite
        happens when traders buy fTokens.
      </p>

      <h3>2.2 Swap Mechanics</h3>
      <p>
        Swaps follow the constant product formula with a configurable fee (default: 0.3%):
      </p>
      <pre><code>{`swap(user, buy_pass, amount_in, min_out):
  fee = amount_in * fee_bps / 10000
  amount_in_net = amount_in - fee

  // Constant product: (R_in + amount_in_net) * (R_out - amount_out) = R_in * R_out
  amount_out = R_out * amount_in_net / (R_in + amount_in_net)

  require amount_out >= min_out  // slippage protection
  update reserves
  update TWAP oracle`}</code></pre>

      <h3>2.3 Liquidity Provision</h3>
      <p>
        Anyone can provide liquidity by depositing equal value of pTokens and fTokens. LP shares
        are calculated as:
      </p>
      <ul>
        <li><strong>First provider:</strong> shares = &radic;(pass_amount &times; fail_amount)</li>
        <li><strong>Subsequent providers:</strong> shares = min(pass_amount / R_pass, fail_amount / R_fail) &times; total_shares</li>
      </ul>
      <p>
        LP providers earn the swap fees proportional to their share of the pool. They can withdraw
        at any time by burning their LP shares.
      </p>

      <hr />

      {/* ── 3. TWAP ORACLE ── */}
      <h2>3. TWAP Oracle &amp; Manipulation Resistance</h2>
      <p>
        The AMM maintains a <strong>Time-Weighted Average Price (TWAP)</strong> oracle on-chain.
        This is critical: the proposal outcome is determined by the TWAP, not the spot price,
        making short-term price manipulation extremely expensive.
      </p>

      <h3>3.1 Cumulative Price Accumulator</h3>
      <p>
        On every trade, the contract updates a cumulative price sum:
      </p>
      <pre><code>{`update_twap(reserves):
  time_delta = now - last_timestamp
  if time_delta > 0 and reserves are non-zero:
    cumulative_pass_price += (R_pass / R_fail) * time_delta
    cumulative_fail_price += (R_fail / R_pass) * time_delta
  last_timestamp = now
  last_reserves = reserves`}</code></pre>
      <p>
        The TWAP over any period is simply:
      </p>
      <pre><code>{`TWAP = (cumulative_price_end - cumulative_price_start) / (time_end - time_start)`}</code></pre>

      <h3>3.2 Why TWAP Resists Manipulation</h3>
      <p>
        To move the TWAP by X%, an attacker must sustain that price distortion for the entire
        observation window. The constant-product AMM means moving the price further requires
        exponentially more capital. Meanwhile, every second the price is distorted creates an
        arbitrage opportunity for other traders to correct it and profit. The cost of manipulation
        grows quadratically with the desired distortion.
      </p>

      <div className="docs-tip">
        <strong>Example:</strong> On a pool with 100,000 tokens per side, moving the TWAP by 5%
        over a 7-day window would require sustaining ~$10,000+ of capital at risk, with
        arbitrageurs constantly working against you. This makes governance manipulation
        economically irrational for all but the most extreme scenarios.
      </div>

      <hr />

      {/* ── 4. PASS/FAIL SYSTEM ── */}
      <h2>4. The Pass/Fail Decision System</h2>
      <p>
        When the voting period ends, anyone can call <code>finalize_proposal()</code>. The DAO
        contract reads the TWAP from the AMM and compares it against a configurable threshold:
      </p>
      <pre><code>{`finalize_proposal(proposal_id):
  require now >= proposal.voting_ends_at
  twap = amm.get_twap()

  // pass_threshold_bps: 5000 = 50% (pass price must be > 50%)
  threshold = SCALE * pass_threshold_bps / 10000

  if twap >= threshold:
    vault.finalize()     // pass tokens win
    proposal.state = Passed
  else:
    vault.revert()       // fail tokens win
    proposal.state = Failed`}</code></pre>

      <p>
        The threshold is configurable per DAO. A threshold of 5000 bps (50%) means the market
        must believe the proposal is more likely to increase token value than decrease it. DAOs
        can set higher thresholds for certain proposal types (e.g., team compensation proposals
        might require 55% to account for conflict of interest).
      </p>

      <hr />

      {/* ── 5. TREASURY ESCROW ── */}
      <h2>5. Treasury Escrow &amp; ICO Fund Protection</h2>
      <p>
        NovaDAO&apos;s architecture provides built-in treasury protection for projects that raise
        capital through token sales. Here is how the escrow mechanism works:
      </p>

      <h3>5.1 Funds Flow Into On-Chain Treasury</h3>
      <p>
        When a project launches through NovaDAO, sale proceeds flow directly into the DAO&apos;s
        on-chain treasury (held as the <code>base_token</code> in the DAO contract). The team
        cannot access these funds directly &mdash; every withdrawal must go through a governance
        proposal.
      </p>

      <h3>5.2 Spend Allowance via Proposals</h3>
      <p>
        To spend treasury funds, the team submits a proposal specifying:
      </p>
      <ul>
        <li>The amount to withdraw</li>
        <li>The recipient address</li>
        <li>A description of what the funds will be used for</li>
      </ul>
      <p>
        The proposal opens a prediction market. If the market believes the spending will increase
        the project&apos;s value, the proposal passes and funds are released. If not, funds stay in
        the treasury.
      </p>

      <h3>5.3 Why This Protects Investors</h3>
      <table>
        <thead>
          <tr>
            <th>Risk</th>
            <th>Traditional ICO</th>
            <th>NovaDAO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Rug pull</strong></td>
            <td>Team drains treasury and disappears</td>
            <td>Impossible &mdash; funds only move via market-approved proposals</td>
          </tr>
          <tr>
            <td><strong>Wasteful spending</strong></td>
            <td>No oversight, team spends freely</td>
            <td>Every allocation judged by the market on value-add basis</td>
          </tr>
          <tr>
            <td><strong>Slow rug</strong></td>
            <td>Team pays themselves excessive salaries</td>
            <td>Higher pass threshold for team proposals (conflict of interest protection)</td>
          </tr>
          <tr>
            <td><strong>No accountability</strong></td>
            <td>Investors have no recourse</td>
            <td>All spending is on-chain, transparent, and market-validated</td>
          </tr>
        </tbody>
      </table>

      <div className="docs-note">
        <strong>Budget constraints:</strong> DAOs can configure per-proposal caps (e.g., max 10% of
        treasury per proposal) and concurrent proposal limits (e.g., max 30% of treasury at risk
        across all active proposals) to prevent excessive drawdowns.
      </div>

      <hr />

      {/* ── 6. STAKING & PROPOSALS ── */}
      <h2>6. Staking Mechanism for Proposals</h2>
      <p>
        To prevent spam and ensure proposals have community support, NovaDAO requires a
        minimum liquidity deposit to create a proposal.
      </p>

      <h3>6.1 Proposal Creation &amp; Initial Liquidity</h3>
      <p>
        When creating a proposal, the proposer must deposit base tokens as initial liquidity:
      </p>
      <pre><code>{`create_proposal(proposer, description_url, base_amount):
  require base_amount >= dao.min_base_liquidity

  // 1. Deploy a new Conditional Vault for this proposal
  vault = deploy(vault_wasm)
  vault.initialize(base_token, dao_address)

  // 2. Deploy a new AMM for this proposal
  amm = deploy(amm_wasm)
  amm.initialize(vault, dao_address, fee_bps)

  // 3. Transfer base tokens from proposer to DAO
  base_token.transfer(proposer, dao, base_amount)

  // 4. Split into conditional tokens
  vault.split(dao, base_amount)  // dao gets N pass + N fail tokens

  // 5. Seed the AMM with equal liquidity
  amm.add_liquidity(dao, base_amount, base_amount)  // 50/50 ratio

  // 6. Record proposal
  proposal = { proposer, vault, amm, voting_ends_at: now + duration }
  return proposal.id`}</code></pre>

      <h3>6.2 What Happens to Staked Liquidity</h3>
      <ul>
        <li>
          The proposer&apos;s tokens are split into conditional tokens and deposited as AMM liquidity.
        </li>
        <li>
          The LP position is held by the DAO contract, not the proposer.
        </li>
        <li>
          After finalization, the liquidity can be withdrawn and the winning conditional tokens
          redeemed for the underlying base tokens.
        </li>
        <li>
          The proposer effectively &quot;stakes&quot; their tokens on the proposal being evaluated
          fairly by the market.
        </li>
      </ul>

      <div className="docs-tip">
        <strong>Skin in the game:</strong> The proposer must commit real capital to open the market.
        This ensures only serious proposals are submitted and provides initial liquidity for
        traders to express their views.
      </div>

      <hr />

      {/* ── 7. CONTRACT ARCHITECTURE ── */}
      <h2>7. Contract Architecture</h2>
      <p>
        The protocol consists of four Soroban smart contracts that compose together:
      </p>

      <table>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Role</th>
            <th>Key Functions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Factory</strong></td>
            <td>
              Permissionless registry. Deploys new DAO instances. Lists all DAOs on-chain
              (no database needed).
            </td>
            <td><code>create_dao</code>, <code>list_daos</code></td>
          </tr>
          <tr>
            <td><strong>DAO</strong></td>
            <td>
              Manages a single DAO&apos;s configuration and proposals. Deploys vault + AMM per
              proposal. Reads TWAP to finalize.
            </td>
            <td><code>register_dao</code>, <code>create_proposal</code>, <code>finalize_proposal</code></td>
          </tr>
          <tr>
            <td><strong>Conditional Vault</strong></td>
            <td>
              Splits/merges/redeems conditional tokens. One vault per proposal. Tracks pass/fail
              balances internally.
            </td>
            <td><code>split</code>, <code>merge</code>, <code>redeem</code>, <code>finalize</code>, <code>revert</code></td>
          </tr>
          <tr>
            <td><strong>Futarchy AMM</strong></td>
            <td>
              Constant-product market maker with TWAP oracle. One AMM per proposal. Trades
              pass vs fail tokens.
            </td>
            <td><code>swap</code>, <code>add_liquidity</code>, <code>remove_liquidity</code>, <code>get_twap</code></td>
          </tr>
        </tbody>
      </table>

      <h3>7.1 Deployment Flow</h3>
      <pre><code>{`Factory
  └── create_dao(config)
        └── deploys DAO contract
              └── create_proposal(...)
                    ├── deploys Conditional Vault
                    └── deploys Futarchy AMM
                          └── linked to vault for token transfers`}</code></pre>

      <h3>7.2 Why Stellar / Soroban</h3>
      <ul>
        <li><strong>Sub-cent fees</strong> &mdash; critical for active market trading in governance</li>
        <li><strong>5-second finality</strong> &mdash; real-time price discovery</li>
        <li><strong>Native USDC</strong> &mdash; no bridge risk for stablecoin pairs</li>
        <li><strong>WASM-based contracts</strong> &mdash; Rust safety guarantees, resource-bounded execution</li>
        <li><strong>Built-in Stellar DEX</strong> &mdash; potential for secondary market trading</li>
      </ul>

      <hr />

      {/* ── 8. LIFECYCLE SUMMARY ── */}
      <h2>8. Full Proposal Lifecycle</h2>
      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>DAO Creation</h4>
            <p>
              A project calls <code>factory.create_dao(config)</code> specifying the governance
              token, proposal duration, pass threshold, minimum liquidity, and fee structure.
              A new DAO contract is deployed on-chain.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Proposal Submission</h4>
            <p>
              A proposer calls <code>dao.create_proposal(description, base_amount)</code>. The DAO
              deploys a new vault and AMM, splits the proposer&apos;s tokens, and seeds the AMM with
              initial liquidity. A prediction market is now live.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Market Trading</h4>
            <p>
              Traders split base tokens into pass/fail pairs and trade on the AMM to express their
              views. The AMM continuously updates the TWAP oracle. Arbitrageurs keep prices honest
              via split/merge operations.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Finalization</h4>
            <p>
              After the voting period ends, anyone calls <code>dao.finalize_proposal(id)</code>.
              The contract reads the TWAP, compares to the threshold, and calls <code>vault.finalize()</code>{" "}
              or <code>vault.revert()</code>. The outcome is permanent and on-chain.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Redemption</h4>
            <p>
              Holders of the winning conditional token call <code>vault.redeem()</code> to receive
              base tokens 1:1. Losing tokens become worthless. LP providers withdraw remaining
              liquidity.
            </p>
          </div>
        </div>
      </div>

      <hr />

      <h2>9. Security Considerations</h2>
      <ul>
        <li>
          <strong>Authority model:</strong> Only the DAO contract (vault authority) can call{" "}
          <code>finalize()</code> or <code>revert()</code> on the vault. No admin keys exist.
        </li>
        <li>
          <strong>TWAP vs spot:</strong> Using TWAP for decisions prevents flash-loan style
          attacks where an attacker manipulates the price in a single transaction.
        </li>
        <li>
          <strong>Constant product invariant:</strong> The AMM enforces x &times; y = k on every
          swap, preventing the pool from being drained through malformed trades.
        </li>
        <li>
          <strong>Soroban resource bounds:</strong> All contract calls have bounded CPU and memory
          usage, preventing DoS through computational exhaustion.
        </li>
        <li>
          <strong>No external dependencies:</strong> The entire protocol runs on-chain with no
          off-chain oracles, keepers, or centralized components.
        </li>
      </ul>

      <hr />

      <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 32 }}>
        NovaDAO &mdash; Permissionless Futarchy on Stellar. Built with Soroban smart contracts.
        All code is open source.
      </p>
    </>
  );
}
