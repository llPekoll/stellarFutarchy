"use client";

import Link from "next/link";

export default function SalePage() {
  return (
    <>
      <h1>The ICO</h1>
      <p>
        NovaDAO ICOs are structured, transparent token sales with built-in investor
        protections. This page explains how the sale works, what happens with the
        funds, and the performance package that keeps teams accountable.
      </p>

      {/* ── How the ICO Works ── */}
      <h2>How the ICO Works</h2>
      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Sale Opens</h4>
            <p>
              The ICO opens for a fixed duration (typically 7-14 days). Participants
              send XLM to the sale contract and receive project tokens at the fixed
              ICO price. All contributions are recorded on-chain.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Discretionary Cap Applies</h4>
            <p>
              The project sets a discretionary cap — the maximum amount the sale will
              accept. Once the cap is reached, the sale closes automatically. This
              prevents over-raising and ensures disciplined capital allocation.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Minimum Threshold Check</h4>
            <p>
              When the sale period ends, the contract checks whether the minimum raise
              threshold was reached. If yes, the sale is successful. If not, all funds
              are returned automatically.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Funds Are Distributed</h4>
            <p>
              On a successful sale, funds are distributed according to the pre-defined
              allocation: Bid Wall reserves, project treasury, performance package
              escrow, and protocol fees.
            </p>
          </div>
        </div>
      </div>

      {/* ── Why a Discretionary Cap ── */}
      <h2>Why a Discretionary Cap</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Without Cap</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>With Discretionary Cap</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Teams raise more than they can deploy</td>
            <td style={{ padding: "10px 12px" }}>Raise is matched to actual needs</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Token dilution is excessive</td>
            <td style={{ padding: "10px 12px" }}>Dilution is predictable and bounded</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Treasury mismanagement risk increases</td>
            <td style={{ padding: "10px 12px" }}>Capital discipline is enforced</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Community trust erodes over time</td>
            <td style={{ padding: "10px 12px" }}>Transparency builds long-term confidence</td>
          </tr>
        </tbody>
      </table>

      {/* ── Token Distribution ── */}
      <h2>Token Distribution Example</h2>
      <p>
        Here is a typical token distribution for a project raising 1,000,000 XLM
        with a 10,000,000 token supply:
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Category</th>
            <th style={{ textAlign: "right", padding: "10px 12px" }}>Tokens</th>
            <th style={{ textAlign: "right", padding: "10px 12px" }}>%</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Vesting</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>ICO Participants</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>4,000,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>40%</td>
            <td style={{ padding: "10px 12px" }}>None (immediately liquid)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Team &amp; Founders</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>2,000,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>20%</td>
            <td style={{ padding: "10px 12px" }}>12-month cliff, 36-month linear</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Treasury / DAO</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>2,000,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>20%</td>
            <td style={{ padding: "10px 12px" }}>Governance-controlled</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Performance Package</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>1,000,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>10%</td>
            <td style={{ padding: "10px 12px" }}>Milestone-based (5 tranches)</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Ecosystem / Community</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>1,000,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>10%</td>
            <td style={{ padding: "10px 12px" }}>24-month linear</td>
          </tr>
        </tbody>
      </table>

      {/* ── Successful Sale ── */}
      <h2>What Happens After a Successful Sale</h2>
      <ul>
        <li>
          <strong>Bid Wall is funded:</strong> A portion of the raised XLM is deposited
          into the Bid Wall contract, establishing the NAV floor. See{" "}
          <Link href="/docs/how-launches-work/bid-wall">Bid Wall documentation</Link>.
        </li>
        <li>
          <strong>Tokens are distributed:</strong> ICO participants receive their tokens
          immediately. Team and other vesting allocations are locked in the vault contract.
        </li>
        <li>
          <strong>Trading begins:</strong> The project token is listed on the NovaDAO AMM
          and can be freely traded. External DEX listings may follow.
        </li>
        <li>
          <strong>Performance tracking starts:</strong> The milestone clock begins and the
          team must hit their first tranche target to unlock escrowed funds.
        </li>
      </ul>

      {/* ── Failed Sale ── */}
      <h2>What Happens When a Sale Fails</h2>
      <div className="docs-warning">
        <strong>Warning:</strong> If the minimum raise threshold is not met, the sale is
        considered failed and cannot be manually overridden.
      </div>
      <ul>
        <li>All contributed XLM is returned to participants automatically via the smart contract.</li>
        <li>No tokens are distributed.</li>
        <li>The project may reapply for a future listing after a 30-day cooling-off period.</li>
        <li>There are no fees charged on a failed sale.</li>
      </ul>

      {/* ── Performance Package ── */}
      <h2>Performance Package</h2>
      <p>
        The Performance Package is an escrow mechanism that ties fund releases to
        measurable milestones. It ensures that teams remain accountable and deliver
        on their promises.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Tranche</th>
            <th style={{ textAlign: "right", padding: "10px 12px" }}>% of Escrow</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Timeline</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Unlock Condition</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Tranche 1</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>10%</td>
            <td style={{ padding: "10px 12px" }}>Month 1</td>
            <td style={{ padding: "10px 12px" }}>Initial deployment and setup complete</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Tranche 2</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>20%</td>
            <td style={{ padding: "10px 12px" }}>Month 3</td>
            <td style={{ padding: "10px 12px" }}>Core product milestone achieved</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Tranche 3</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>25%</td>
            <td style={{ padding: "10px 12px" }}>Month 6</td>
            <td style={{ padding: "10px 12px" }}>User growth targets met</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Tranche 4</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>25%</td>
            <td style={{ padding: "10px 12px" }}>Month 9</td>
            <td style={{ padding: "10px 12px" }}>Revenue or TVL targets met</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Tranche 5</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>20%</td>
            <td style={{ padding: "10px 12px" }}>Month 12</td>
            <td style={{ padding: "10px 12px" }}>Full roadmap delivery and audit complete</td>
          </tr>
        </tbody>
      </table>

      <div className="docs-note">
        <strong>Note:</strong> Each tranche requires a governance vote from NOVA token
        holders to unlock. The team must submit evidence of milestone completion, and
        the community votes to approve or reject the release.
      </div>

      {/* ── Key Parameters ── */}
      <h2>Key Parameters</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Parameter</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Sale Duration</td>
            <td style={{ padding: "10px 12px" }}>7-14 days (project-defined)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Minimum Raise</td>
            <td style={{ padding: "10px 12px" }}>Set by project (must be realistic)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Discretionary Cap</td>
            <td style={{ padding: "10px 12px" }}>Set by project (maximum raise)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Protocol Fee</td>
            <td style={{ padding: "10px 12px" }}>2.5% of total raise</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Bid Wall Allocation</td>
            <td style={{ padding: "10px 12px" }}>Minimum 50% of raise</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Failed Sale Refund</td>
            <td style={{ padding: "10px 12px" }}>100% automatic, no fees</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Cooling-Off Period</td>
            <td style={{ padding: "10px 12px" }}>30 days before reapplication</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Learn about the STAMP agreement:{" "}
          <Link href="/docs/how-launches-work/stamp">The STAMP</Link>
        </p>
      </div>
    </>
  );
}
