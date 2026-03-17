"use client";

import Link from "next/link";

export default function CreatePage() {
  return (
    <>
      <h1>Getting Listed on NovaDAO</h1>
      <p>
        This guide walks you through everything you need to provide and the process
        for getting your project listed on NovaDAO. Before proceeding, make sure you
        have reviewed the{" "}
        <Link href="/docs/how-launches-work/are-you-ready">Are You Ready?</Link> checklist.
      </p>

      {/* ── What You Need to Provide ── */}
      <h2>What You Need to Provide</h2>
      <p>
        The following eight items are required as part of your listing application.
        Incomplete applications will not be reviewed.
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Project Information</h4>
            <p>
              Project name, one-line description, full description (500 words max),
              website URL, documentation link, and links to all social channels
              (Twitter/X, Discord, Telegram, GitHub).
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Token Details</h4>
            <p>
              Token name, ticker symbol (3-5 characters), total supply, decimal precision,
              and a complete distribution breakdown including team allocation, community
              allocation, treasury, advisors, and any other categories.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Visual Assets</h4>
            <p>
              Project logo in SVG format (minimum 512x512px), banner image (1200x630px),
              and favicon (32x32px). All images must be high-resolution with transparent
              backgrounds where applicable.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Minimum Raise Threshold</h4>
            <p>
              The minimum amount of XLM your ICO must raise for the sale to be considered
              successful. If this threshold is not reached, all funds are returned to
              participants. Choose a realistic number that covers your essential needs.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Monthly Budget</h4>
            <p>
              A detailed monthly budget showing how raised funds will be allocated.
              Categories should include development, marketing, operations, legal,
              infrastructure, and reserves. This budget is published on-chain for
              transparency.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Performance Package</h4>
            <p>
              Define 5 milestone tranches tied to specific, measurable deliverables.
              Each tranche unlocks a portion of funds held in escrow. See the{" "}
              <Link href="/docs/how-launches-work/sale">Sale documentation</Link> for
              the tranche structure.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Intellectual Property Declaration</h4>
            <p>
              A statement confirming that you own or have rights to all intellectual
              property used in the project. If your project uses open-source components,
              list all licenses and confirm compliance.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Legal Entity</h4>
            <p>
              Registration details for your legal entity (foundation, LLC, DAO LLC, or
              equivalent). Include jurisdiction, registration number, registered agent,
              and the names of authorized signatories.
            </p>
          </div>
        </div>
      </div>

      {/* ── The Listing Process ── */}
      <h2>The Listing Process</h2>
      <p>
        Once you have gathered all required materials, the listing process proceeds
        through the following stages:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Submit Your Application</h4>
            <p>
              Complete the listing form on the NovaDAO platform with all eight items
              listed above. You will receive a confirmation and a review timeline
              within 48 hours.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Due Diligence Review</h4>
            <p>
              The NovaDAO review committee evaluates your application. This includes
              verifying your legal entity, auditing your tokenomics, reviewing your
              product, and assessing your team. This stage typically takes 5-10 business days.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Community Governance Vote</h4>
            <p>
              NOVA token holders vote on whether to approve your listing. The proposal
              requires a simple majority with a minimum quorum of 10% of circulating
              NOVA supply. The voting period is 7 days.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Smart Contract Deployment</h4>
            <p>
              Upon approval, NovaDAO deploys the required smart contracts for your
              launch: a conditional vault, a futarchy AMM, and a project-specific
              DAO contract — all registered through the factory contract.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>ICO Goes Live</h4>
            <p>
              Your project page goes live on NovaDAO and the ICO begins. The sale
              runs for the agreed duration (typically 7-14 days). Monitor your
              dashboard and engage with the community throughout.
            </p>
          </div>
        </div>
      </div>

      {/* ── Smart Contract Deployment ── */}
      <h2>Smart Contract Deployment</h2>
      <p>
        NovaDAO uses a factory pattern to deploy all required contracts for your project.
        The following contracts are created:
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr" }}>
        <div className="docs-card">
          <h4>Conditional Vault</h4>
          <p>
            Manages the splitting, merging, and redemption of conditional pass/fail tokens.
            This contract holds the escrowed funds and handles token lifecycle.
          </p>
        </div>
        <div className="docs-card">
          <h4>Futarchy AMM</h4>
          <p>
            A constant-product AMM with a TWAP oracle that facilitates trading between
            pass and fail tokens. The TWAP is used by governance to determine proposal outcomes.
          </p>
        </div>
        <div className="docs-card">
          <h4>DAO Contract</h4>
          <p>
            Manages DAO registration, proposal creation, and the proposal lifecycle.
            Integrates with the vault and AMM to execute governance decisions.
          </p>
        </div>
      </div>

      <div className="docs-note">
        <strong>Note:</strong> All contracts are deployed via the on-chain factory contract,
        which serves as a registry. No off-chain database is required — everything is
        verifiable on Soroban.
      </div>

      {/* ── After Listing ── */}
      <h2>After Listing</h2>
      <p>
        Once your project is listed and the ICO is live, you are responsible for:
      </p>
      <ul>
        <li>Monitoring the ICO dashboard and responding to community questions.</li>
        <li>Publishing regular updates on development progress.</li>
        <li>Meeting milestone targets to unlock performance package tranches.</li>
        <li>
          Participating in NovaDAO governance, including voting on other proposals
          and engaging in community discussions.
        </li>
        <li>
          Providing quarterly financial reports showing how raised funds have been used.
        </li>
      </ul>

      <div className="docs-tip">
        <strong>Tip:</strong> Projects that actively engage with the NovaDAO community
        and deliver on their milestones see significantly better long-term token performance
        and community support.
      </div>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Next: Learn about the sale process in detail:{" "}
          <Link href="/docs/how-launches-work/sale">The ICO</Link>
        </p>
      </div>
    </>
  );
}
