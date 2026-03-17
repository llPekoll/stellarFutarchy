"use client";

import Link from "next/link";

export default function DocsWelcome() {
  return (
    <>
      <h1>NovaDAO</h1>
      <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 32 }}>
        NovaDAO is a fundraising and governance platform built on the Stellar blockchain that
        enables transparent token launches with built-in investor protection. It combines
        community-driven fundraising with futarchy-style decision markets so that projects
        raise capital honestly and token holders govern effectively.
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Link href="/docs/benefits/founders" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>For Founders</h4>
            <p>Launch a token that people actually trust. Raise capital with transparent mechanics and community alignment.</p>
          </div>
        </Link>
        <Link href="/docs/benefits/investors" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>For Investors</h4>
            <p>Invest with dual protection: mechanistic safeguards against treasury rugs and legal protection against revenue rugs.</p>
          </div>
        </Link>
        <Link href="/docs/how-launches-work/create" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>How Launches Work</h4>
            <p>Understand the full lifecycle of a NovaDAO launch, from setup through sale to governance.</p>
          </div>
        </Link>
        <Link href="/docs/token/details" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>NOVA Token</h4>
            <p>Learn about the NOVA token: its mechanics, distribution, and role in the NovaDAO ecosystem.</p>
          </div>
        </Link>
      </div>

      <hr />

      <h2>Community Ownership Matters</h2>
      <p>
        The best crypto projects are the ones where the community has real skin in the game.
        When token holders are genuine stakeholders &mdash; not just speculators &mdash; projects
        build lasting value instead of hype cycles.
      </p>
      <p>
        Consider the examples that have proven this model works:
      </p>
      <ul>
        <li>
          <strong>Hyperliquid</strong> &mdash; Hyperliquid airdropped 31% of its token supply to early
          users with no VC allocation. The result? One of the most successful token launches in history.
          The community rallied behind the project because they felt genuine ownership. The token
          reached a $10B+ fully diluted valuation driven almost entirely by organic community demand.
        </li>
        <li>
          <strong>Yearn Finance</strong> &mdash; Andre Cronje launched YFI with the now-famous message
          &quot;I test in prod.&quot; There was no pre-mine, no VC round, no team allocation. Tokens
          were distributed entirely through liquidity mining. The fair launch created one of DeFi&apos;s
          most dedicated communities, and YFI reached a market cap in the billions.
        </li>
      </ul>
      <p>
        These projects proved that when you give the community real ownership from day one, you
        create alignment that no amount of marketing can replicate.
      </p>

      <h2>But Most Token Launches Are Broken</h2>
      <p>
        Despite these success stories, the vast majority of token launches are fundamentally broken.
        Here are the three core problems:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Insider-Heavy Allocations</h4>
            <p>
              Most projects allocate 50&ndash;80% of tokens to insiders: the team, VCs, and advisors.
              The community gets the scraps. This creates a massive overhang of insider tokens waiting
              to be dumped on retail investors once vesting unlocks hit. Insiders have different
              incentives from the community &mdash; they want to exit, not build.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Opaque Treasury Management</h4>
            <p>
              After raising funds, most project treasuries become black boxes. Teams can spend
              raised capital however they want with zero accountability. There is no mechanism
              for the community to verify that funds are being used as promised. Rug pulls, slow
              rugs, and treasury mismanagement are rampant because there is simply no transparency.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>No Governance Teeth</h4>
            <p>
              Even projects with &quot;governance tokens&quot; rarely give holders real power. Votes
              are advisory at best. The team retains ultimate control over the treasury and product
              direction. Governance becomes theater &mdash; a checkbox for decentralization without
              any of the substance.
            </p>
          </div>
        </div>
      </div>

      <h2>NovaDAO Is for Founders Who Want to Do It Right</h2>
      <p>
        NovaDAO provides the infrastructure for founders who believe in genuine community ownership.
        If you want to build something real, here is how NovaDAO helps:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Transparent Fundraising</h4>
            <p>
              Launch your token through a structured sale where every parameter is set on-chain
              before the sale begins. The community can verify the token supply, allocation
              breakdown, pricing mechanism, and vesting schedule before committing a single dollar.
              No backroom deals, no hidden allocations.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Protected Treasury</h4>
            <p>
              Raised funds flow into an on-chain treasury governed by futarchy-style decision
              markets. Every spending proposal goes through a market-based approval process. If
              the market believes a proposal will increase token value, it passes. If not, it
              fails. This gives the community real control over how their money is spent.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Real Governance from Day One</h4>
            <p>
              Token holders govern the project through decision markets, not advisory votes.
              Governance has teeth because it directly controls treasury spending. Founders
              who build on NovaDAO signal that they are serious about community alignment,
              which in turn attracts more committed investors and community members.
            </p>
          </div>
        </div>
      </div>

      <h2>Why Stellar?</h2>
      <p>
        NovaDAO is built on the Stellar network and its smart contract platform, Soroban.
        Here is why Stellar is the ideal home for fair token launches and community governance:
      </p>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Stellar / Soroban</th>
            <th>Typical L1 / L2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Transaction Fees</strong></td>
            <td>Fractions of a cent</td>
            <td>$0.50 &ndash; $50+</td>
          </tr>
          <tr>
            <td><strong>Finality</strong></td>
            <td>3&ndash;5 seconds</td>
            <td>12 seconds &ndash; 10+ minutes</td>
          </tr>
          <tr>
            <td><strong>Fiat On-Ramps</strong></td>
            <td>Native USDC, MoneyGram, anchors</td>
            <td>Bridge-wrapped stablecoins</td>
          </tr>
          <tr>
            <td><strong>Regulatory Clarity</strong></td>
            <td>Stellar Development Foundation is US-based, compliance-focused</td>
            <td>Varies widely</td>
          </tr>
          <tr>
            <td><strong>Smart Contracts</strong></td>
            <td>Soroban &mdash; Rust-based, WASM, resource-bounded</td>
            <td>EVM / various VMs</td>
          </tr>
          <tr>
            <td><strong>Built-in DEX</strong></td>
            <td>Native order book on Stellar Classic</td>
            <td>Requires separate DEX deployment</td>
          </tr>
          <tr>
            <td><strong>Community</strong></td>
            <td>8M+ funded accounts, strong payments ecosystem</td>
            <td>Varies</td>
          </tr>
        </tbody>
      </table>

      <div className="docs-tip">
        <strong>Low fees matter for governance.</strong> When it costs pennies to vote or trade
        in decision markets, participation goes up dramatically. On high-fee chains, only whales
        can afford to participate in governance, which defeats the purpose of community ownership.
      </div>

      <hr />

      <h2>Get Started</h2>
      <p>
        Ready to dive in? Pick the path that fits you best:
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Link href="/docs/benefits/founders" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>I&apos;m a Founder</h4>
            <p>Learn how to launch your project with transparent fundraising and community governance.</p>
          </div>
        </Link>
        <Link href="/docs/benefits/investors" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>I&apos;m an Investor</h4>
            <p>Understand how NovaDAO protects your investment with mechanistic and legal safeguards.</p>
          </div>
        </Link>
        <Link href="/docs/how-launches-work/create" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>How It Works</h4>
            <p>Explore the technical details of how NovaDAO launches, governance, and decision markets function.</p>
          </div>
        </Link>
        <Link href="/docs/governance/overview" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>Governance Deep Dive</h4>
            <p>Learn how futarchy-style decision markets create better governance outcomes.</p>
          </div>
        </Link>
      </div>
    </>
  );
}
