"use client";

import Link from "next/link";

export default function BidWallPage() {
  return (
    <>
      <h1>Bid Wall (NAV Protection)</h1>
      <p>
        The Bid Wall is NovaDAO&apos;s core investor protection mechanism. It creates
        a permanent buy-side order at the Net Asset Value (NAV) price, ensuring that
        token holders can always exit at a price backed by real treasury assets.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> The Bid Wall is not a market maker or a price peg. It is
        a treasury-backed floor that guarantees minimum redemption value for token holders.
      </div>

      {/* ── How It Works ── */}
      <h2>How It Works</h2>
      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Treasury Funds the Wall</h4>
            <p>
              A portion of the ICO proceeds is allocated to the Bid Wall smart contract.
              These funds are held on-chain and are always visible to anyone.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>NAV Price Is Calculated</h4>
            <p>
              The NAV price is computed as the total Bid Wall reserves divided by the
              circulating token supply. This price updates automatically as reserves and
              supply change.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Standing Buy Order</h4>
            <p>
              The Bid Wall contract maintains a permanent buy order at the NAV price.
              Any token holder can sell into this order at any time, receiving the NAV
              value for their tokens.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Tokens Are Burned</h4>
            <p>
              When tokens are sold into the Bid Wall, they are permanently burned. This
              reduces circulating supply and maintains the NAV price for remaining holders.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>NAV Recalculates</h4>
            <p>
              After each redemption, the NAV is recalculated. Because both the reserves
              and the supply decrease proportionally, the NAV per token remains stable
              or increases for remaining holders.
            </p>
          </div>
        </div>
      </div>

      {/* ── How the Bid Wall Is Funded ── */}
      <h2>How the Bid Wall Is Funded</h2>
      <p>
        The Bid Wall receives funding from multiple sources throughout the lifecycle
        of a project:
      </p>

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-color)",
        borderRadius: 12, padding: 20, margin: "16px 0", fontFamily: "monospace", fontSize: 14,
      }}>
        Bid Wall Reserve = ICO Allocation + Fee Revenue + Governance Deposits
      </div>

      <h3>Example: Initial Funding</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Source</th>
            <th style={{ textAlign: "right", padding: "10px 12px" }}>Amount (XLM)</th>
            <th style={{ textAlign: "right", padding: "10px 12px" }}>% of Raise</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>ICO Proceeds Allocation</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>500,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>50%</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Performance Package Reserve</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>100,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>10%</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Protocol Fee Reserve</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>50,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>5%</td>
          </tr>
          <tr style={{ fontWeight: 600 }}>
            <td style={{ padding: "10px 12px" }}>Total Initial Bid Wall</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>650,000</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>65%</td>
          </tr>
        </tbody>
      </table>

      {/* ── NAV Calculation ── */}
      <h2>NAV Calculation</h2>
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-color)",
        borderRadius: 12, padding: 20, margin: "16px 0", fontFamily: "monospace", fontSize: 14,
      }}>
        NAV = Total Bid Wall Reserves / Circulating Token Supply
      </div>

      <h3>Key Properties</h3>
      <ul>
        <li>
          <strong>Non-decreasing:</strong> The NAV per token can only stay the same or increase
          over time. Redemptions reduce both reserves and supply proportionally, while fee
          revenue adds to reserves without increasing supply.
        </li>
        <li>
          <strong>Fully collateralized:</strong> Every token in circulation is backed by
          at least its NAV value in on-chain reserves. There is no fractional reserve.
        </li>
        <li>
          <strong>Transparent:</strong> Both the reserve balance and the circulating supply
          are readable on-chain at any time. The NAV is a simple division, verifiable by anyone.
        </li>
        <li>
          <strong>Instant settlement:</strong> Redemptions against the Bid Wall settle in a
          single transaction. There is no queue, no delay, and no counterparty risk.
        </li>
      </ul>

      {/* ── Fees ── */}
      <h2>Fees</h2>
      <p>
        A <strong>1% fee</strong> is charged on all Bid Wall redemptions. This fee is
        retained in the Bid Wall reserves, which means it directly increases the NAV
        for remaining token holders.
      </p>

      <div className="docs-tip">
        <strong>Tip:</strong> The 1% redemption fee creates a small incentive to hold
        rather than redeem, while ensuring that each redemption slightly benefits
        remaining holders.
      </div>

      {/* ── How to Use ── */}
      <h2>How to Use the Bid Wall</h2>
      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Connect Your Wallet</h4>
            <p>
              Connect your Freighter wallet to the NovaDAO application. Ensure you are on
              the Stellar mainnet (or testnet for testing).
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Navigate to the Project</h4>
            <p>
              Find the project whose tokens you want to redeem. The current NAV price is
              displayed on the project dashboard.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Select &quot;Redeem at NAV&quot;</h4>
            <p>
              Click the Bid Wall redemption button. Enter the number of tokens you wish
              to redeem. The interface will show the exact amount you will receive after
              the 1% fee.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Confirm the Transaction</h4>
            <p>
              Review the transaction details in your Freighter wallet and approve it.
              The transaction will execute atomically on Soroban.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Receive Your Funds</h4>
            <p>
              The XLM proceeds are sent to your wallet in the same transaction. Your
              redeemed tokens are burned and removed from circulation.
            </p>
          </div>
        </div>
      </div>

      {/* ── Key Constraints ── */}
      <h2>Key Constraints</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Constraint</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Minimum Redemption</td>
            <td style={{ padding: "10px 12px" }}>100 tokens (prevents dust attacks)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Redemption Fee</td>
            <td style={{ padding: "10px 12px" }}>1% (retained in Bid Wall reserves)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Settlement</td>
            <td style={{ padding: "10px 12px" }}>Instant, single transaction</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Reserve Asset</td>
            <td style={{ padding: "10px 12px" }}>XLM (native Stellar asset)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Price Direction</td>
            <td style={{ padding: "10px 12px" }}>NAV can only increase or stay flat, never decrease</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Availability</td>
            <td style={{ padding: "10px 12px" }}>24/7 — no downtime, no maintenance windows</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Learn more about the sale process:{" "}
          <Link href="/docs/how-launches-work/sale">The ICO</Link>
        </p>
      </div>
    </>
  );
}
