"use client";

import Link from "next/link";

export default function StampPage() {
  return (
    <>
      <h1>The STAMP</h1>
      <p>
        The <strong>STAMP</strong> (Simple Token Agreement, Market Protected) is NovaDAO&apos;s
        legal framework for token sales. It provides a standardized, investor-friendly
        agreement that combines the simplicity of a SAFE with on-chain market protections.
      </p>

      {/* ── Why the STAMP Exists ── */}
      <h2>Why the STAMP Exists</h2>
      <p>
        Traditional token sale agreements (SAFTs, SAFEs, token warrants) have significant
        shortcomings:
      </p>
      <ul>
        <li>SAFTs were designed for a pre-regulatory era and lack investor protections.</li>
        <li>SAFEs were built for equity and do not map cleanly to token economics.</li>
        <li>Token warrants are complex, jurisdiction-dependent, and expensive to draft.</li>
        <li>None of these instruments incorporate on-chain protections like NAV floors.</li>
      </ul>
      <p>
        The STAMP solves these problems by creating a single, standardized agreement that
        integrates directly with NovaDAO&apos;s smart contract infrastructure — including the{" "}
        <Link href="/docs/how-launches-work/bid-wall">Bid Wall</Link> NAV protection.
      </p>

      {/* ── Who Is the STAMP For ── */}
      <h2>Who Is the STAMP For</h2>
      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>New Startups</h4>
          <p>
            Projects conducting their first token sale. The STAMP provides a clean,
            simple legal structure without the overhead of custom legal work.
          </p>
        </div>
        <div className="docs-card">
          <h4>Existing Projects</h4>
          <p>
            Projects with an existing cap table that want to raise additional funds
            through NovaDAO. The STAMP can accommodate prior investors and existing
            token distributions.
          </p>
        </div>
      </div>

      {/* ── How the STAMP Works ── */}
      <h2>How the STAMP Works</h2>

      <h3>For New Startups</h3>
      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Define Token Economics</h4>
            <p>
              Set your total supply, distribution percentages, vesting schedules,
              and the ICO price. These parameters are locked into the STAMP agreement.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Sign the STAMP</h4>
            <p>
              The founding team signs the STAMP, which commits them to the defined
              tokenomics, the Bid Wall allocation, and the performance package milestones.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>ICO Participants Agree</h4>
            <p>
              Each participant in the ICO agrees to the STAMP terms when they contribute.
              This creates a binding agreement between the project and every token holder.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Smart Contracts Enforce</h4>
            <p>
              The key protections — NAV floor, vesting schedules, performance escrow — are
              enforced by Soroban smart contracts. The legal agreement and the code are aligned.
            </p>
          </div>
        </div>
      </div>

      <h3>For Existing Cap Tables</h3>
      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Disclose Existing Investors</h4>
            <p>
              Provide a full cap table showing all prior investors, their allocations,
              and their vesting terms. This is published as part of the STAMP for
              transparency.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Harmonize Vesting</h4>
            <p>
              Existing investor tokens must be subject to vesting terms that are at least
              as restrictive as the team&apos;s vesting. No insider can have more favorable
              unlock terms than the founding team.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Lock Existing Tokens</h4>
            <p>
              All pre-existing token allocations are locked in the conditional vault
              contract with the agreed vesting schedule. This is a prerequisite for
              the ICO to proceed.
            </p>
          </div>
        </div>
      </div>

      {/* ── Key Terms ── */}
      <h2>Key Terms</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Term</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>NAV Protection</td>
            <td style={{ padding: "10px 12px" }}>
              Token holders can always redeem at the Bid Wall NAV price, providing a
              guaranteed floor backed by on-chain reserves.
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Performance Escrow</td>
            <td style={{ padding: "10px 12px" }}>
              A portion of funds is held in escrow and released only when milestones
              are met, as verified by governance vote.
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Team Vesting</td>
            <td style={{ padding: "10px 12px" }}>
              Team tokens are subject to a minimum 12-month cliff and 36-month linear
              vesting, enforced by smart contract.
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Transparency Commitment</td>
            <td style={{ padding: "10px 12px" }}>
              Projects agree to quarterly financial reporting, monthly development updates,
              and on-chain verifiable fund usage.
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Governing Law</td>
            <td style={{ padding: "10px 12px" }}>
              The STAMP specifies the governing jurisdiction. Smart contract enforcement
              is primary; legal enforcement is the fallback.
            </td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Dispute Resolution</td>
            <td style={{ padding: "10px 12px" }}>
              Disputes are resolved first through on-chain governance, then through
              binding arbitration under the specified jurisdiction.
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Benefits ── */}
      <h2>Benefits</h2>

      <h3>For Founders</h3>
      <ul>
        <li>
          <strong>Standardized:</strong> No need to spend $50K+ on custom legal agreements.
          The STAMP is a battle-tested template that works out of the box.
        </li>
        <li>
          <strong>Credibility:</strong> Using the STAMP signals to investors that you are
          serious about transparency and accountability.
        </li>
        <li>
          <strong>Smart contract alignment:</strong> The legal terms and the on-chain
          enforcement are designed together, eliminating ambiguity.
        </li>
        <li>
          <strong>Community trust:</strong> Investors know exactly what they are getting
          because the STAMP is standardized and publicly documented.
        </li>
      </ul>

      <h3>For Investors</h3>
      <ul>
        <li>
          <strong>NAV guarantee:</strong> The Bid Wall provides a hard floor that is
          enforced by code, not promises.
        </li>
        <li>
          <strong>Milestone accountability:</strong> Funds are released in tranches tied
          to real deliverables, not arbitrary timelines.
        </li>
        <li>
          <strong>Full transparency:</strong> Cap tables, fund usage, and development
          progress are all publicly visible.
        </li>
        <li>
          <strong>Governance rights:</strong> Token holders have a real voice in fund
          releases and project direction through futarchy governance.
        </li>
      </ul>

      <div className="docs-tip">
        <strong>Tip:</strong> The STAMP template is available for review before you begin
        the listing process. Contact the NovaDAO team to receive a copy and discuss any
        questions with your legal counsel.
      </div>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Learn about the NOVA token:{" "}
          <Link href="/docs/token/details">NOVA Token Details</Link>
        </p>
      </div>
    </>
  );
}
