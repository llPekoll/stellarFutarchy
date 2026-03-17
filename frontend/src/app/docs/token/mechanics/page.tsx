"use client";

import Link from "next/link";

export default function TokenMechanicsPage() {
  return (
    <>
      <h1>Token Mechanics</h1>
      <p>
        This page details how NOVA tokens are minted, burned, and how the protocol
        manages supply over time. For basic token information, see{" "}
        <Link href="/docs/token/details">NOVA Token Details</Link>.
      </p>

      {/* ── Issuance: Governance-Gated Only ── */}
      <h2>Issuance: Governance-Gated Only</h2>
      <p>
        NOVA issuance is strictly controlled by on-chain governance. There is no admin
        key, no multisig override, and no automated emission schedule. Every new token
        must pass through the following four stages:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Stage 1: Proposal</h4>
            <p>
              A governance proposal is submitted specifying the mint amount, the recipient
              address, and the rationale. The proposer must hold at least 1% of circulating
              NOVA to submit a mint proposal. A proposal bond is required and is returned
              only if the proposal passes.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Stage 2: Futarchy Market</h4>
            <p>
              A conditional prediction market is automatically created for the proposal.
              Pass tokens represent approval; fail tokens represent rejection. The market
              runs for 5 days, allowing traders to express informed views on whether the
              mint benefits the protocol.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Stage 3: Governance Vote</h4>
            <p>
              Staked NOVA holders cast their votes over a 7-day period. Mint proposals
              require a supermajority of 66% approval and a minimum quorum of 15% of
              staked supply. The futarchy market outcome is advisory but publicly visible.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Stage 4: Timelock and Execution</h4>
            <p>
              Approved proposals enter a 48-hour timelock before execution. During this
              window, the community can review the outcome and raise concerns. After the
              timelock expires, anyone can trigger the on-chain execution.
            </p>
          </div>
        </div>
      </div>

      <div className="docs-warning">
        <strong>Warning:</strong> There is no emergency mint function. Even in urgent
        situations, the full governance process must be followed. This is a deliberate
        design choice to prevent supply manipulation.
      </div>

      {/* ── Inflation Structure ── */}
      <h2>Inflation Structure</h2>
      <p>
        NOVA has no scheduled emission curve, no block rewards, and no automatic inflation.
        The supply changes only through governance-approved mints and protocol-defined burns.
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>No Scheduled Emissions</h4>
          <p>
            Unlike many protocols with predetermined inflation schedules, NOVA does not
            emit new tokens on a fixed timeline. Every mint is a deliberate governance
            decision with a stated purpose.
          </p>
        </div>
        <div className="docs-card">
          <h4>No Hard Cap</h4>
          <p>
            There is no maximum supply limit. This provides the protocol with flexibility
            to fund growth, but the governance gate ensures that dilution is always
            community-approved.
          </p>
        </div>
      </div>

      <div className="docs-note">
        <strong>Note:</strong> While there is no hard cap, the 66% supermajority
        requirement for mints makes it extremely difficult to pass dilutive proposals
        without broad community support.
      </div>

      {/* ── Burn Mechanisms ── */}
      <h2>Burn Mechanisms</h2>
      <p>
        NOVA is burned (permanently removed from circulation) through multiple mechanisms:
      </p>

      <h3>Bid Wall Burns</h3>
      <p>
        When token holders redeem NOVA through the{" "}
        <Link href="/docs/how-launches-work/bid-wall">Bid Wall</Link>, the redeemed tokens
        are permanently burned. This reduces circulating supply and increases the NAV
        per token for remaining holders.
      </p>

      <h3>Governance Burns</h3>
      <p>
        The DAO can vote to burn tokens from the treasury. This is typically used when
        the treasury holds excess reserves and the community decides that reducing supply
        is more beneficial than deploying capital.
      </p>

      <h3>Fee Burns</h3>
      <p>
        A configurable percentage of protocol fees can be directed to burns rather than
        treasury accumulation. This parameter is set by governance and can be adjusted
        via proposal.
      </p>

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-color)",
        borderRadius: 12, padding: 20, margin: "16px 0", fontFamily: "monospace", fontSize: 14,
      }}>
        Net Supply Change = Governance Mints - Bid Wall Burns - Governance Burns - Fee Burns
      </div>

      {/* ── Onchain Fund Flow ── */}
      <h2>Onchain Fund Flow</h2>
      <p>
        All fund movements within the NovaDAO protocol are executed on-chain via Soroban
        smart contracts. Here is how funds flow through the system:
      </p>

      <ul>
        <li>
          <strong>ICO proceeds:</strong> Collected by the sale contract and distributed to
          the Bid Wall, project treasury, performance escrow, and protocol fee pool.
        </li>
        <li>
          <strong>Trading fees:</strong> Collected by the AMM contract and split between
          the protocol treasury and NOVA stakers.
        </li>
        <li>
          <strong>Redemption fees:</strong> The 1% Bid Wall redemption fee is retained in
          the Bid Wall reserves, increasing NAV for remaining holders.
        </li>
        <li>
          <strong>Listing fees:</strong> Paid by projects when they apply for listing.
          Directed to the protocol treasury.
        </li>
        <li>
          <strong>Staking rewards:</strong> Distributed from the fee pool to staked NOVA
          holders proportionally.
        </li>
      </ul>

      {/* ── Verification and Tracking ── */}
      <h2>Verification and Tracking</h2>
      <p>
        Every token operation is fully transparent and verifiable:
      </p>

      <ul>
        <li>
          <strong>Soroban contract events:</strong> All mints, burns, transfers, and fee
          collections emit contract events that are indexed by Stellar explorers.
        </li>
        <li>
          <strong>NovaDAO dashboard:</strong> The protocol dashboard displays real-time
          supply metrics, burn totals, and mint history.
        </li>
        <li>
          <strong>Third-party indexers:</strong> DeFiLlama, StellarExpert, and other
          third-party services track NOVA supply independently.
        </li>
        <li>
          <strong>Contract source code:</strong> All smart contracts are open source and
          the deployed bytecode can be verified against the published source.
        </li>
      </ul>

      {/* ── Minting Gate Summary ── */}
      <h2>Minting Gate Summary</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Gate</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Requirement</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Proposer Threshold</td>
            <td style={{ padding: "10px 12px" }}>Must hold at least 1% of circulating NOVA</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Proposal Bond</td>
            <td style={{ padding: "10px 12px" }}>Refundable bond required; forfeited if proposal fails</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Futarchy Market</td>
            <td style={{ padding: "10px 12px" }}>5-day prediction market must complete</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Vote Quorum</td>
            <td style={{ padding: "10px 12px" }}>Minimum 15% of staked NOVA must vote</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Supermajority</td>
            <td style={{ padding: "10px 12px" }}>66% approval required</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Timelock</td>
            <td style={{ padding: "10px 12px" }}>48-hour delay between approval and execution</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Emergency Override</td>
            <td style={{ padding: "10px 12px" }}>None — no bypass mechanism exists</td>
          </tr>
        </tbody>
      </table>

      <div className="docs-tip">
        <strong>Tip:</strong> You can track all active and historical mint proposals on
        the NovaDAO governance dashboard. Each proposal includes the full context,
        voting results, and execution status.
      </div>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Next: <Link href="/docs/protocol/analytics">Protocol Analytics</Link> for
          real-time metrics and data sources.
        </p>
      </div>
    </>
  );
}
