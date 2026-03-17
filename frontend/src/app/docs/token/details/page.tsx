"use client";

import Link from "next/link";

export default function TokenDetailsPage() {
  return (
    <>
      <h1>NOVA Token Details</h1>
      <p>
        NOVA is the native governance and utility token of the NovaDAO protocol.
        This page covers the token&apos;s specifications, distribution, utility,
        and how issuance works.
      </p>

      {/* ── Token Overview ── */}
      <h2>Token Overview</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Property</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Token Name</td>
            <td style={{ padding: "10px 12px" }}>NOVA</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Network</td>
            <td style={{ padding: "10px 12px" }}>Stellar (Soroban smart contracts)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Token Standard</td>
            <td style={{ padding: "10px 12px" }}>Stellar Asset (SEP-41 compatible)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Decimals</td>
            <td style={{ padding: "10px 12px" }}>7</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Initial Supply</td>
            <td style={{ padding: "10px 12px" }}>100,000,000 NOVA</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Hard Cap</td>
            <td style={{ padding: "10px 12px" }}>No hard cap (governance-gated issuance)</td>
          </tr>
        </tbody>
      </table>

      {/* ── Supply Information ── */}
      <h2>Supply Information</h2>
      <p>
        NOVA does not have a fixed hard cap. New tokens can only be minted through a
        governance process that requires approval from existing token holders. This
        design balances flexibility with protection against uncontrolled inflation.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> The current circulating supply, total supply, and all
        mint/burn events are verifiable in real-time on-chain. Use the Stellar explorer
        or the NovaDAO dashboard to check the latest figures.
      </div>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>Real-Time Verification</h4>
          <p>
            Query the NOVA token contract directly on Soroban to verify the current
            total supply. Every mint and burn event is logged as a contract event
            and indexed by Stellar explorers.
          </p>
        </div>
        <div className="docs-card">
          <h4>No Backdoor Minting</h4>
          <p>
            The mint function is gated by the DAO governance contract. No admin key,
            multisig, or team wallet can mint tokens unilaterally. Every issuance
            requires a successful governance vote.
          </p>
        </div>
      </div>

      {/* ── Initial Distribution ── */}
      <h2>Initial Distribution</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Category</th>
            <th style={{ textAlign: "right", padding: "10px 12px" }}>Allocation</th>
            <th style={{ textAlign: "right", padding: "10px 12px" }}>Tokens</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Vesting</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Community ICO</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>40%</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>40,000,000</td>
            <td style={{ padding: "10px 12px" }}>None (immediately liquid)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Protocol Treasury</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>25%</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>25,000,000</td>
            <td style={{ padding: "10px 12px" }}>Governance-controlled</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Core Team</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>20%</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>20,000,000</td>
            <td style={{ padding: "10px 12px" }}>12-month cliff, 36-month linear</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Ecosystem Grants</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>10%</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>10,000,000</td>
            <td style={{ padding: "10px 12px" }}>24-month linear</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Advisors</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>5%</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>5,000,000</td>
            <td style={{ padding: "10px 12px" }}>6-month cliff, 24-month linear</td>
          </tr>
        </tbody>
      </table>

      {/* ── Token Utility ── */}
      <h2>Token Utility</h2>
      <p>NOVA serves three primary functions within the protocol:</p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="docs-card">
          <h4>Governance</h4>
          <p>
            NOVA holders vote on protocol proposals, project listings, fund releases,
            and parameter changes. Voting power is proportional to staked NOVA.
          </p>
        </div>
        <div className="docs-card">
          <h4>Staking</h4>
          <p>
            Stake NOVA to earn a share of protocol fees. Staked NOVA also grants
            enhanced governance weight and access to early project allocations.
          </p>
        </div>
        <div className="docs-card">
          <h4>Fee Token</h4>
          <p>
            Protocol fees (listing fees, trading fees, redemption fees) accrue to
            the treasury and are distributed to NOVA stakers through governance.
          </p>
        </div>
      </div>

      {/* ── Issuance Mechanism ── */}
      <h2>Issuance Mechanism</h2>
      <p>
        New NOVA tokens can only be created through a four-stage governance process:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Proposal Submission</h4>
            <p>
              Any NOVA holder with at least 1% of circulating supply can submit a
              mint proposal specifying the amount, recipient, and justification.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Futarchy Market</h4>
            <p>
              A conditional market is created. Traders buy pass or fail tokens to
              express their view on whether the mint will benefit the protocol.
              The TWAP oracle tracks market sentiment.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Voting Period</h4>
            <p>
              The proposal enters a 7-day voting period. NOVA stakers vote directly,
              and the futarchy market provides an additional signal. A supermajority
              (66%) is required for mint proposals.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Execution</h4>
            <p>
              If approved, the mint is executed by the DAO contract. The new tokens
              are sent to the specified recipient. The event is logged on-chain and
              visible on all explorers.
            </p>
          </div>
        </div>
      </div>

      {/* ── Verification and Transparency ── */}
      <h2>Verification and Transparency</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>What to Verify</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>How to Verify</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Total Supply</td>
            <td style={{ padding: "10px 12px" }}>Query the NOVA token contract on Soroban or check StellarExpert</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Circulating Supply</td>
            <td style={{ padding: "10px 12px" }}>Total supply minus locked (vesting + treasury) balances</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Mint History</td>
            <td style={{ padding: "10px 12px" }}>All mint events are logged as Soroban contract events</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Burn History</td>
            <td style={{ padding: "10px 12px" }}>Bid Wall burns and governance burns are logged on-chain</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Governance Proposals</td>
            <td style={{ padding: "10px 12px" }}>All proposals and votes are stored in the DAO contract state</td>
          </tr>
        </tbody>
      </table>

      {/* ── Regulatory Transparency ── */}
      <h2>Regulatory Transparency</h2>
      <p>
        NovaDAO is committed to regulatory clarity. The NOVA token is designed as a
        utility token with clear functional use within the protocol. Key points:
      </p>
      <ul>
        <li>NOVA is not marketed as an investment or security.</li>
        <li>Token utility (governance, staking, fees) is live from day one.</li>
        <li>
          The team allocation is subject to the longest vesting schedule (12-month cliff,
          36-month linear vesting).
        </li>
        <li>
          All token sales are conducted through the STAMP framework, which provides
          clear legal terms for participants.
        </li>
        <li>
          The protocol operates transparently with on-chain governance and publicly
          verifiable treasury management.
        </li>
      </ul>

      <div className="docs-tip">
        <strong>Tip:</strong> For detailed information about how new tokens are minted
        and the safeguards in place, see{" "}
        <Link href="/docs/token/mechanics">Token Mechanics</Link>.
      </div>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Next: <Link href="/docs/token/mechanics">Token Mechanics</Link> for issuance,
          burn, and inflation details.
        </p>
      </div>
    </>
  );
}
