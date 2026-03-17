"use client";

import Link from "next/link";

export default function GovernanceTwapsPage() {
  return (
    <>
      <h1>Finalizing Proposals (TWAPs)</h1>
      <p>
        Time-Weighted Average Prices (TWAPs) are the mechanism that converts market activity into
        governance decisions. Instead of using a single snapshot price — which could be easily
        manipulated — NovaDAO computes a weighted average over the entire trading period. This page
        explains how TWAPs work, why they resist manipulation, and how they determine proposal
        outcomes.
      </p>

      <h2>TWAPs Decide Pass or Fail</h2>
      <p>
        When a proposal&apos;s trading period ends, the DAO contract computes two TWAPs:
      </p>
      <ul>
        <li>
          <strong>Pass TWAP:</strong> The time-weighted average price of pNOVA (the pass token)
          over the trading period.
        </li>
        <li>
          <strong>Fail TWAP:</strong> The time-weighted average price of fNOVA (the fail token)
          over the trading period.
        </li>
      </ul>
      <p>
        The decision rule is straightforward: if the Pass TWAP exceeds the Fail TWAP (adjusted
        for any applicable threshold), the proposal passes. Otherwise, it fails.
      </p>

      <div className="docs-note">
        <strong>Why averages, not spot prices?</strong> A spot price reflects a single moment
        in time. A trader with enough capital could temporarily push the price in either direction
        right before the deadline. A time-weighted average over days or weeks of trading is orders
        of magnitude more expensive to manipulate, because the attacker must sustain the distorted
        price for the entire observation window.
      </div>

      <h2>Lagged Price Observations</h2>
      <p>
        NovaDAO&apos;s TWAP implementation uses <strong>lagged observations</strong> to further increase
        manipulation resistance. Here is how it works:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Periodic Sampling</h4>
            <p>
              The AMM contract records the current pool price at regular intervals (every slot
              or on every trade, whichever comes first). Each observation is stored on-chain
              with its timestamp.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Cumulative Price Tracking</h4>
            <p>
              Rather than storing individual price snapshots, the contract maintains a
              cumulative price sum. The TWAP for any time window is computed as:
              <br />
              <code>TWAP = (cumulative_price_end - cumulative_price_start) / (time_end - time_start)</code>
              <br />
              This approach is gas-efficient and resistant to single-block manipulation.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Lag Window</h4>
            <p>
              Observations are lagged — the price recorded at time T reflects the pool state
              from a previous checkpoint, not the current instant. This means an attacker
              cannot manipulate the price and have it immediately affect the TWAP. By the time
              the manipulated price enters the average, arbitrageurs have had time to correct it.
            </p>
          </div>
        </div>
      </div>

      <div className="docs-tip">
        <strong>The economics of manipulation:</strong> To move a TWAP by 1% over a 7-day window,
        an attacker would need to sustain a price distortion across the entire period. The constant
        product AMM means larger distortions require exponentially more capital, and every moment
        the price is distorted creates a profit opportunity for arbitrageurs to push it back. The
        cost of manipulation grows with the square of the desired distortion.
      </div>

      <h2>The 24-Hour Grace Period</h2>
      <p>
        After the main trading period ends, a <strong>24-hour grace period</strong> begins before
        the TWAP is finalized. This grace period serves several purposes:
      </p>

      <ul>
        <li>
          <strong>Final corrections:</strong> If late-breaking information emerges (e.g., a
          technical flaw is discovered in the proposal), traders have 24 hours to adjust prices
          before the decision is locked in.
        </li>
        <li>
          <strong>Manipulation detection:</strong> If someone attempted to manipulate the price
          at the end of the trading period, the grace period gives the market time to identify
          and correct the distortion.
        </li>
        <li>
          <strong>Time zone fairness:</strong> A 24-hour window ensures that participants in all
          time zones have an opportunity to react to the final state of the market before the
          outcome is determined.
        </li>
      </ul>

      <div className="docs-warning">
        <strong>Note:</strong> Trading continues during the grace period and still contributes
        to the TWAP. The grace period is not a freeze — it is an extension that provides a buffer
        against last-minute manipulation or information asymmetry.
      </div>

      <h2>Pass Thresholds</h2>
      <p>
        The pass/fail decision is not always a simple comparison. NovaDAO applies different
        thresholds depending on the proposer:
      </p>

      <table>
        <thead>
          <tr>
            <th>Proposer Type</th>
            <th>Pass Condition</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Non-team member</strong></td>
            <td>Pass TWAP &gt; Fail TWAP</td>
            <td>
              If Pass TWAP = $1.05 and Fail TWAP = $1.03, the proposal passes
              because $1.05 &gt; $1.03.
            </td>
          </tr>
          <tr>
            <td><strong>Team member</strong></td>
            <td>Pass TWAP &gt; Fail TWAP + 5%</td>
            <td>
              If Pass TWAP = $1.05 and Fail TWAP = $1.03, the adjusted threshold is
              $1.03 * 1.05 = $1.0815. Since $1.05 &lt; $1.0815, the proposal <strong>fails</strong> despite
              the pass market being higher. The market must demonstrate stronger conviction
              for team-originated proposals.
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        This mechanism protects against insider self-dealing. A team member proposing their own
        compensation increase must demonstrate that the market <em>strongly</em> believes the
        proposal is net positive — not just marginally so.
      </p>

      <h2>Complete Proposal Timeline</h2>
      <p>
        Here is the full timeline for a typical proposal, from submission to final resolution:
      </p>

      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Duration</th>
            <th>What Happens</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Pending</strong></td>
            <td>Variable</td>
            <td>
              Proposal is submitted. Proposer and supporters stake NOVA toward the
              200,000 NOVA activation threshold. No markets are open.
            </td>
          </tr>
          <tr>
            <td><strong>Activation</strong></td>
            <td>Instant</td>
            <td>
              Threshold is met. The Conditional Vault is initialized and the AMM creates
              pass/fail trading pools. Markets open for trading.
            </td>
          </tr>
          <tr>
            <td><strong>Trading Period</strong></td>
            <td>7 days (default)</td>
            <td>
              Traders buy and sell pNOVA and fNOVA. The AMM records price observations
              for the TWAP calculation. This is the primary price discovery window.
            </td>
          </tr>
          <tr>
            <td><strong>Grace Period</strong></td>
            <td>24 hours</td>
            <td>
              Trading continues. Final opportunity for price corrections and manipulation
              detection. TWAP observations continue to accumulate.
            </td>
          </tr>
          <tr>
            <td><strong>Finalization</strong></td>
            <td>Instant</td>
            <td>
              Anyone can call the finalize function. The DAO contract computes final TWAPs,
              applies the pass threshold, and marks the proposal as Passed or Failed.
              If passed, the on-chain action is executed atomically.
            </td>
          </tr>
          <tr>
            <td><strong>Redemption</strong></td>
            <td>Open-ended</td>
            <td>
              Holders of the winning conditional token redeem 1:1 for NOVA. Staked tokens
              are returned to proposer and supporters. There is no deadline for redemption.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Technical Implementation on Stellar</h2>
      <p>
        NovaDAO&apos;s TWAP oracle is implemented directly in the Futarchy AMM Soroban contract.
        Here are the key technical details:
      </p>

      <h3>On-Chain Price Accumulator</h3>
      <p>
        The AMM maintains a cumulative price variable that is updated on every trade. The
        accumulator stores the sum of <code>price * time_elapsed</code> since the market opened.
        To compute the TWAP over any interval, the contract simply divides the difference in
        accumulator values by the time elapsed:
      </p>
      <pre>
        <code>
{`// Pseudo-code for TWAP calculation
let twap = (accumulator_at_end - accumulator_at_start)
         / (timestamp_end - timestamp_start);`}
        </code>
      </pre>

      <h3>Observation Storage</h3>
      <p>
        Price observations are stored in contract storage as a series of checkpoints. Each
        checkpoint records the cumulative price and timestamp. The contract uses Soroban&apos;s
        persistent storage to ensure observations survive across ledger boundaries and cannot
        be tampered with.
      </p>

      <h3>Finalization Call</h3>
      <p>
        Finalization is permissionless — any account can call the <code>finalize</code> function
        after the grace period ends. The function:
      </p>
      <ol>
        <li>Verifies the grace period has elapsed</li>
        <li>Computes the Pass TWAP and Fail TWAP from stored observations</li>
        <li>Applies the appropriate pass threshold based on proposer type</li>
        <li>Updates the proposal state to Passed or Failed</li>
        <li>If passed, executes the proposal&apos;s on-chain action</li>
        <li>Unlocks staked tokens for return to their owners</li>
      </ol>

      <div className="docs-note">
        <strong>Gas considerations:</strong> On Stellar, the finalization transaction&apos;s compute
        cost is bounded because the TWAP is computed from cumulative accumulators (a constant-time
        operation) rather than iterating over individual price samples. This keeps the transaction
        lightweight regardless of how many trades occurred during the market period.
      </div>

      <hr />
      <p>
        <strong>Back to:</strong>{" "}
        <Link href="/docs/governance/overview">Governance Overview</Link> | {" "}
        <Link href="/docs/governance/markets">Trading Proposals</Link> | {" "}
        <Link href="/docs/governance/proposals">Creating Proposals</Link>
      </p>
    </>
  );
}
