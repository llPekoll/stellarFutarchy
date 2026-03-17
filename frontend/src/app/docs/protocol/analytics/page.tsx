"use client";

import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <>
      <h1>Protocol Analytics</h1>
      <p>
        NovaDAO is committed to full transparency. All protocol data is on-chain and
        publicly accessible. This page lists the key metrics, data sources, and tools
        for monitoring the protocol.
      </p>

      {/* ── Key Metrics ── */}
      <h2>Key Metrics</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Metric</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Description</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Source</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Total Value Locked (TVL)</td>
            <td style={{ padding: "10px 12px" }}>Sum of all assets held in protocol contracts</td>
            <td style={{ padding: "10px 12px" }}>On-chain (vault + AMM contracts)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Bid Wall Reserves</td>
            <td style={{ padding: "10px 12px" }}>Total XLM backing the NAV floor</td>
            <td style={{ padding: "10px 12px" }}>On-chain (Bid Wall contract)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>NOVA Circulating Supply</td>
            <td style={{ padding: "10px 12px" }}>Total supply minus locked and vesting tokens</td>
            <td style={{ padding: "10px 12px" }}>On-chain (token contract)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>NAV per Token</td>
            <td style={{ padding: "10px 12px" }}>Bid Wall reserves divided by circulating supply</td>
            <td style={{ padding: "10px 12px" }}>Calculated (on-chain inputs)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Total Projects Listed</td>
            <td style={{ padding: "10px 12px" }}>Number of projects registered through the factory</td>
            <td style={{ padding: "10px 12px" }}>On-chain (factory contract)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Active Proposals</td>
            <td style={{ padding: "10px 12px" }}>Governance proposals currently in voting period</td>
            <td style={{ padding: "10px 12px" }}>On-chain (DAO contracts)</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Total Trading Volume</td>
            <td style={{ padding: "10px 12px" }}>Cumulative volume across all AMM pools</td>
            <td style={{ padding: "10px 12px" }}>On-chain (AMM contracts)</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Protocol Revenue</td>
            <td style={{ padding: "10px 12px" }}>Fees collected from trading, listings, and redemptions</td>
            <td style={{ padding: "10px 12px" }}>On-chain (fee collector)</td>
          </tr>
        </tbody>
      </table>

      {/* ── Analytics Platforms ── */}
      <h2>Analytics Platforms</h2>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="docs-card">
          <h4>NovaDAO Dashboard</h4>
          <p>
            The official NovaDAO analytics dashboard provides real-time protocol metrics,
            project-level data, governance activity, and historical charts. Accessible
            directly from the NovaDAO application.
          </p>
        </div>
        <div className="docs-card">
          <h4>DeFiLlama</h4>
          <p>
            NovaDAO TVL and protocol revenue are tracked on DeFiLlama, providing
            independent verification and comparison with other protocols across chains.
          </p>
        </div>
        <div className="docs-card">
          <h4>Stellar Explorers</h4>
          <p>
            StellarExpert and Stellarchain provide transaction-level data, contract
            state inspection, and event logs for all NovaDAO smart contracts on Soroban.
          </p>
        </div>
      </div>

      {/* ── Developer Resources ── */}
      <h2>Developer Resources</h2>
      <p>
        NovaDAO&apos;s smart contracts are fully open source. Developers can query contract
        state, listen to events, and build integrations using the Stellar SDK.
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr" }}>
        <div className="docs-card">
          <h4>Open-Source Contracts</h4>
          <p>
            All Soroban contracts (conditional vault, futarchy AMM, DAO, factory) are
            published on GitHub. The deployed bytecode can be verified against the
            published source using standard Soroban verification tools.
          </p>
        </div>
      </div>

      <h3>API Endpoints</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Endpoint</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Description</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Network</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 13 }}>
              soroban-rpc (mainnet)
            </td>
            <td style={{ padding: "10px 12px" }}>Soroban RPC for contract queries and submissions</td>
            <td style={{ padding: "10px 12px" }}>Mainnet</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 13 }}>
              soroban-rpc (testnet)
            </td>
            <td style={{ padding: "10px 12px" }}>Testnet RPC for development and testing</td>
            <td style={{ padding: "10px 12px" }}>Testnet</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 13 }}>
              Horizon API
            </td>
            <td style={{ padding: "10px 12px" }}>Stellar Horizon for account and transaction data</td>
            <td style={{ padding: "10px 12px" }}>Both</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 13 }}>
              Mercury Indexer
            </td>
            <td style={{ padding: "10px 12px" }}>Indexed Soroban event data for historical queries</td>
            <td style={{ padding: "10px 12px" }}>Both</td>
          </tr>
        </tbody>
      </table>

      {/* ── Soroban Contract Addresses ── */}
      <h2>Soroban Contract Addresses</h2>
      <div className="docs-note">
        <strong>Note:</strong> Contract addresses will be published here once mainnet
        deployment is complete. Testnet addresses are available for development purposes.
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Contract</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Description</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Factory</td>
            <td style={{ padding: "10px 12px" }}>On-chain registry, deploys new DAO contracts</td>
            <td style={{ padding: "10px 12px" }}>Testnet deployed</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Conditional Vault</td>
            <td style={{ padding: "10px 12px" }}>Split/merge/redeem conditional tokens</td>
            <td style={{ padding: "10px 12px" }}>Testnet deployed</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Futarchy AMM</td>
            <td style={{ padding: "10px 12px" }}>Constant product AMM with TWAP oracle</td>
            <td style={{ padding: "10px 12px" }}>Testnet deployed</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>DAO</td>
            <td style={{ padding: "10px 12px" }}>DAO registration and proposal lifecycle</td>
            <td style={{ padding: "10px 12px" }}>Testnet deployed</td>
          </tr>
        </tbody>
      </table>

      {/* ── Protocol Revenue ── */}
      <h2>Protocol Revenue</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Revenue Source</th>
            <th style={{ textAlign: "right", padding: "10px 12px" }}>Fee Rate</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Destination</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>ICO Listing Fee</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>2.5%</td>
            <td style={{ padding: "10px 12px" }}>Protocol treasury</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>AMM Trading Fee</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>0.3%</td>
            <td style={{ padding: "10px 12px" }}>LP providers + protocol treasury</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Bid Wall Redemption Fee</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>1.0%</td>
            <td style={{ padding: "10px 12px" }}>Bid Wall reserves (increases NAV)</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>Governance Proposal Fee</td>
            <td style={{ textAlign: "right", padding: "10px 12px" }}>Variable</td>
            <td style={{ padding: "10px 12px" }}>Protocol treasury (bond-based)</td>
          </tr>
        </tbody>
      </table>

      {/* ── Transparency Commitments ── */}
      <h2>Transparency Commitments</h2>
      <p>
        NovaDAO operates under the following transparency commitments:
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>Open-Source Code</h4>
          <p>
            All smart contract source code is publicly available on GitHub. Deployed
            bytecode can be verified against the published source at any time.
          </p>
        </div>
        <div className="docs-card">
          <h4>On-Chain Governance</h4>
          <p>
            Every governance proposal, vote, and execution is recorded on-chain. There
            are no off-chain governance processes or hidden admin functions.
          </p>
        </div>
        <div className="docs-card">
          <h4>Real-Time Treasury</h4>
          <p>
            Protocol treasury balances are readable on-chain at all times. Fund movements
            require governance approval and are logged as contract events.
          </p>
        </div>
        <div className="docs-card">
          <h4>Independent Audits</h4>
          <p>
            Smart contracts undergo independent security audits before mainnet deployment.
            Audit reports are published publicly and linked from the documentation.
          </p>
        </div>
      </div>

      {/* ── External Links ── */}
      <h2>External Links</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "16px 0", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Resource</th>
            <th style={{ textAlign: "left", padding: "10px 12px" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>GitHub Repository</td>
            <td style={{ padding: "10px 12px" }}>Source code for all smart contracts and the frontend application</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>StellarExpert</td>
            <td style={{ padding: "10px 12px" }}>On-chain explorer for Stellar/Soroban contract inspection</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>DeFiLlama</td>
            <td style={{ padding: "10px 12px" }}>Independent TVL and revenue tracking across chains</td>
          </tr>
          <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
            <td style={{ padding: "10px 12px" }}>Stellar Developer Docs</td>
            <td style={{ padding: "10px 12px" }}>Official Stellar and Soroban developer documentation</td>
          </tr>
          <tr>
            <td style={{ padding: "10px 12px" }}>NovaDAO Discord</td>
            <td style={{ padding: "10px 12px" }}>Community chat, developer support, and governance discussion</td>
          </tr>
        </tbody>
      </table>

      <div className="docs-tip">
        <strong>Tip:</strong> If you are building an integration or analytics tool on
        top of NovaDAO, join the developer channel on Discord. The team provides
        technical support and early access to new API features.
      </div>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Back to:{" "}
          <Link href="/docs/token/details">NOVA Token Details</Link> |{" "}
          <Link href="/docs/token/mechanics">Token Mechanics</Link>
        </p>
      </div>
    </>
  );
}
