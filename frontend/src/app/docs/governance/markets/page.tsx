"use client";

import Link from "next/link";

export default function GovernanceMarketsPage() {
  return (
    <>
      <h1>Trading Proposals</h1>
      <p>
        In NovaDAO, governance decisions are made through <strong>conditional markets</strong>, not
        votes. When a proposal is created, two separate markets open — one for the pass outcome and
        one for the fail outcome. Traders express their views by buying and selling conditional
        tokens, and the market prices determine whether the proposal is approved.
      </p>

      <h2>How Conditional Markets Form</h2>
      <p>
        When a proposal is submitted, the Conditional Vault contract splits the DAO&apos;s governance
        token (NOVA) into two conditional tokens:
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>pNOVA (Pass Token)</h4>
          <p>
            Redeemable 1:1 for NOVA if the proposal <strong>passes</strong>. If the proposal fails,
            pNOVA becomes worthless. The market price of pNOVA reflects what traders believe NOVA
            will be worth in a world where the proposal is executed.
          </p>
        </div>
        <div className="docs-card">
          <h4>fNOVA (Fail Token)</h4>
          <p>
            Redeemable 1:1 for NOVA if the proposal <strong>fails</strong>. If the proposal passes,
            fNOVA becomes worthless. The market price of fNOVA reflects what traders believe NOVA
            will be worth in a world where the proposal is rejected.
          </p>
        </div>
      </div>

      <p>
        Each token trades against USDC in a dedicated AMM pool. The two pools operate independently —
        the pass market and the fail market each discover their own price. After the trading period
        ends, the protocol compares the time-weighted average prices (TWAPs) from both markets to
        determine the outcome.
      </p>

      <div className="docs-note">
        <strong>Important:</strong> You always hold both sides when you split. Depositing 100 NOVA
        into the vault gives you 100 pNOVA <em>and</em> 100 fNOVA. You can then sell whichever side
        you disagree with, or provide liquidity to one or both markets.
      </div>

      <h2>Example: Participating in a Conditional Market</h2>
      <p>
        Suppose a proposal asks the DAO to allocate 500,000 NOVA to fund a new integration
        partnership. Here is how you might participate:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Split Your NOVA</h4>
            <p>
              You deposit 1,000 NOVA into the Conditional Vault and receive 1,000 pNOVA and
              1,000 fNOVA. At this point you have zero net exposure — your total position is
              equivalent to holding 1,000 NOVA regardless of the outcome.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Evaluate the Proposal</h4>
            <p>
              You research the partnership and conclude it will significantly increase
              NOVA&apos;s value. The pass market is currently trading pNOVA at $1.05 and the
              fail market has fNOVA at $1.02.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Express Your View</h4>
            <p>
              Since you believe the proposal is beneficial, you sell your 1,000 fNOVA on the
              fail market for approximately $1,020 USDC. You keep your 1,000 pNOVA.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Wait for Resolution</h4>
            <p>
              The trading period ends and the TWAP comparison runs. If the pass TWAP exceeds
              the fail TWAP, the proposal passes. Your 1,000 pNOVA becomes redeemable for
              1,000 NOVA — and you also kept the $1,020 from selling fNOVA.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Redeem</h4>
            <p>
              You redeem your pNOVA for NOVA through the vault. If the proposal had failed
              instead, your pNOVA would be worthless — but you already received $1,020 from
              selling fNOVA, partially offsetting your loss.
            </p>
          </div>
        </div>
      </div>

      <h2>Trading Strategies for Decision Markets</h2>
      <p>
        Your trading strategy depends on your view of both the proposal&apos;s merit and the current
        market prices. Here are three common approaches:
      </p>

      <h3>Case 1: You Believe the Proposal Is Good</h3>
      <p>
        If you believe the proposal will increase NOVA&apos;s value and the pass market is underpriced
        relative to the fail market:
      </p>
      <ul>
        <li>
          <strong>Buy pNOVA</strong> on the pass market (or split NOVA and sell fNOVA). You profit
          if the proposal passes and pNOVA is redeemable at a value higher than what you paid.
        </li>
        <li>
          <strong>Provide liquidity</strong> to the pass market if you want to earn trading fees
          while maintaining long exposure to the pass outcome.
        </li>
      </ul>

      <h3>Case 2: You Believe the Proposal Is Bad</h3>
      <p>
        If you believe the proposal will harm NOVA&apos;s value and the fail market is underpriced:
      </p>
      <ul>
        <li>
          <strong>Buy fNOVA</strong> on the fail market (or split NOVA and sell pNOVA). You profit
          if the proposal fails and fNOVA is redeemable at a value higher than what you paid.
        </li>
        <li>
          This is the core mechanism that prevents bad proposals — informed traders are <em>paid</em> to
          oppose value-destructive proposals.
        </li>
      </ul>

      <h3>Case 3: You Believe Prices Are Mispriced</h3>
      <p>
        If you believe the market is wrong about relative pricing but you are unsure about the
        proposal itself:
      </p>
      <ul>
        <li>
          <strong>Arbitrage between markets.</strong> If pNOVA + fNOVA combined price is below the
          underlying NOVA price, you can buy both and merge them back into NOVA for a risk-free profit.
        </li>
        <li>
          If the combined price is above NOVA, you can split NOVA and sell both tokens for more than
          the underlying value.
        </li>
      </ul>

      <div className="docs-tip">
        <strong>Arbitrage keeps prices honest.</strong> The ability to split and merge tokens means
        that pNOVA + fNOVA should always trade close to the price of NOVA. Any deviation creates a
        risk-free profit opportunity that arbitrageurs will quickly close.
      </div>

      <h2>Key Mechanics</h2>
      <table>
        <thead>
          <tr>
            <th>Mechanic</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Splitting</strong></td>
            <td>
              Deposit NOVA into the vault to receive equal amounts of pNOVA and fNOVA. This is
              always available while the proposal is active.
            </td>
          </tr>
          <tr>
            <td><strong>Merging</strong></td>
            <td>
              Return equal amounts of pNOVA and fNOVA to the vault to receive NOVA back. This
              enables arbitrage and allows participants to exit positions.
            </td>
          </tr>
          <tr>
            <td><strong>Trading</strong></td>
            <td>
              Buy or sell pNOVA or fNOVA against USDC on the AMM pools. Prices move according
              to the constant product (x*y=k) formula.
            </td>
          </tr>
          <tr>
            <td><strong>Redemption</strong></td>
            <td>
              After the proposal is finalized, holders of the winning token can redeem 1:1
              for NOVA. The losing token becomes worthless.
            </td>
          </tr>
          <tr>
            <td><strong>TWAP Recording</strong></td>
            <td>
              The AMM continuously records price observations on-chain. The time-weighted
              average is computed over the full trading period to resist manipulation.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Trading on Stellar&apos;s SDEX</h2>
      <p>
        NovaDAO&apos;s markets run on Stellar, which provides several advantages for decision market
        trading:
      </p>

      <ul>
        <li>
          <strong>Low fees:</strong> Stellar transactions cost a fraction of a cent, making it
          practical to trade small positions and update orders frequently.
        </li>
        <li>
          <strong>Fast finality:</strong> Transactions confirm in 5-6 seconds, so prices update
          in near real-time and arbitrage opportunities close quickly.
        </li>
        <li>
          <strong>Soroban smart contracts:</strong> The AMM, vault, and TWAP oracle run entirely
          on-chain via Soroban, ensuring trustless execution with no off-chain dependencies.
        </li>
        <li>
          <strong>Wallet support:</strong> Connect with Freighter wallet for a seamless trading
          experience directly in the NovaDAO interface.
        </li>
      </ul>

      <div className="docs-warning">
        <strong>Risk notice:</strong> Trading conditional tokens involves real financial risk.
        If you buy pNOVA and the proposal fails, your tokens become worthless. Only trade with
        funds you can afford to lose, and ensure you understand the mechanics before participating.
      </div>

      <hr />
      <p>
        <strong>Next:</strong>{" "}
        <Link href="/docs/governance/proposals">Creating Proposals</Link> — learn how to submit
        a proposal and set its parameters. Or read about{" "}
        <Link href="/docs/governance/twaps">TWAPs</Link> to understand how the final decision is
        calculated.
      </p>
    </>
  );
}
