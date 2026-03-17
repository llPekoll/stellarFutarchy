"use client";

import Link from "next/link";

export default function FoundersPage() {
  return (
    <>
      <h1>For Entrepreneurs</h1>
      <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 32 }}>
        NovaDAO is a place for crypto-native enterprises to raise money that does not suck.
      </p>

      <p>
        If you are building something real and want to raise capital from a community that
        believes in your vision, NovaDAO gives you the tools to do it transparently. No shady
        OTC deals, no insider-heavy allocations, no opaque treasury. Just honest fundraising
        with built-in accountability.
      </p>

      <h2>The Five Ways to Raise Capital in Crypto</h2>
      <p>
        Before understanding what makes NovaDAO different, it helps to see the full landscape
        of crypto fundraising options available today:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>VC Rounds</h4>
            <p>
              The traditional path. You pitch venture capitalists, negotiate terms, and give
              up a significant chunk of your token supply (often 20&ndash;40%) at a discount.
              VCs provide capital and sometimes connections, but they also introduce misaligned
              incentives. Their goal is a return on investment, usually through selling tokens
              after vesting unlocks. This creates persistent sell pressure and a community that
              knows insiders got a better deal than they did.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Launchpad ICOs</h4>
            <p>
              Platforms like CoinList or DAO Maker host token sales for selected projects.
              You get distribution and marketing support, but you also give up control over
              who buys your tokens and at what price. Launchpads take fees and often require
              their own token to participate, limiting your potential community. The selection
              process is opaque and favors projects with existing connections.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Fair Launches / Airdrops</h4>
            <p>
              Distribute tokens directly to users through liquidity mining, airdrops, or
              community campaigns. This is the most community-aligned approach, but it has
              a critical flaw: it does not raise any capital. You need an existing product
              and revenue to sustain development. Most early-stage projects cannot afford
              to go this route.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Pump.fun Style Memecoins</h4>
            <p>
              Launch a token on a bonding curve with zero effort. This approach optimizes
              purely for speculation. There is no treasury, no governance, no product.
              The vast majority of these tokens go to zero within days. While the mechanics
              are transparent, the outcomes are almost universally terrible for everyone
              except the earliest buyers and snipers.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>NovaDAO Launch</h4>
            <p>
              A structured token sale with on-chain transparency, community governance from
              day one, and built-in treasury protection. You raise real capital while giving
              your community genuine ownership and control. The best of honest fundraising
              combined with the accountability of futarchy-style governance.
            </p>
          </div>
        </div>
      </div>

      <div className="docs-tip">
        <strong>NovaDAO sits in the sweet spot</strong> between raising capital (which fair
        launches cannot do) and community alignment (which VC rounds sacrifice). You get funded
        while building a community that trusts you.
      </div>

      <h2>What Makes NovaDAO Different on Stellar</h2>
      <p>
        NovaDAO is not just another launchpad. It is a fundamentally different approach to
        fundraising that leverages Stellar&apos;s unique strengths:
      </p>

      <ul>
        <li>
          <strong>On-Chain Transparency</strong> &mdash; Every parameter of your launch is
          set on-chain before the sale begins. Token supply, allocation breakdown, pricing
          mechanism, vesting schedules &mdash; all verifiable by anyone. No information
          asymmetry between you and your investors.
        </li>
        <li>
          <strong>Low-Cost Participation</strong> &mdash; Stellar&apos;s near-zero transaction
          fees mean that anyone can participate in your sale, not just whales. This creates
          broader distribution and a more diverse community of token holders.
        </li>
        <li>
          <strong>Native USDC Settlement</strong> &mdash; Raises are denominated in USDC,
          which lives natively on Stellar. No bridge risk, no wrapped assets. Investors
          know exactly what they are paying and what they are getting.
        </li>
        <li>
          <strong>Instant Finality</strong> &mdash; Stellar&apos;s 3&ndash;5 second finality
          means your sale executes smoothly without the uncertainty of pending transactions.
          No failed transactions, no MEV, no front-running.
        </li>
        <li>
          <strong>Futarchy Governance</strong> &mdash; After your launch, your treasury is
          governed by decision markets. This is not advisory voting &mdash; it is market-based
          governance that actually controls spending. Your community has real power from day one.
        </li>
      </ul>

      <h2>The NovaDAO Launch in Summary</h2>
      <p>
        Here is the high-level flow of a NovaDAO token launch:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Configure Your Launch</h4>
            <p>
              Set your token parameters: total supply, sale allocation, pricing mechanism,
              vesting schedule, and any reserved allocations. Everything is defined on-chain
              so investors can verify the terms before participating. You also set up your
              project profile with a description, links, and team information.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Run the Sale</h4>
            <p>
              Your token sale goes live on NovaDAO. Investors can participate using USDC on
              Stellar. The sale mechanics are transparent and deterministic &mdash; everyone
              gets the same deal based on the rules you set. No OTC side deals, no hidden
              discounts for insiders.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Treasury Formation</h4>
            <p>
              Raised funds flow into an on-chain treasury governed by your token holders
              through futarchy-style decision markets. The treasury is protected from day
              one &mdash; you cannot simply withdraw all funds. Every spending proposal goes
              through market-based governance.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Govern and Build</h4>
            <p>
              As the founder, you propose how to spend treasury funds on development,
              marketing, partnerships, and operations. Your token holders evaluate each
              proposal through decision markets. Good proposals that the market believes
              will increase token value get funded. This creates a virtuous cycle of
              accountability and progress.
            </p>
          </div>
        </div>
      </div>

      <div className="docs-note">
        <strong>You stay in control of building.</strong> Futarchy governance controls the
        treasury, not the product. You still make day-to-day decisions about what to build
        and how to build it. Governance ensures that the community&apos;s money is spent on
        things the market believes will create value.
      </div>

      <h2>What You Get as a Founder</h2>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>Valuable Tokens</h4>
          <p>
            Tokens launched through NovaDAO carry a credibility premium. Investors know the
            launch was transparent and the treasury is protected. This trust translates into
            stronger price support and a more committed holder base. Your tokens are worth
            more because they were launched honestly.
          </p>
        </div>
        <div className="docs-card">
          <h4>Provable Transparency</h4>
          <p>
            Every aspect of your launch is verifiable on-chain. You can point to the smart
            contracts and say &quot;look, here is exactly what we promised and here is exactly
            what we delivered.&quot; This is not a trust-me situation &mdash; it is a
            verify-it-yourself situation. Transparency is your competitive advantage.
          </p>
        </div>
        <div className="docs-card">
          <h4>Community Entry Point</h4>
          <p>
            NovaDAO gives you access to a community of investors who specifically seek out
            transparent, fairly-launched projects. These are not degen gamblers looking for
            the next 100x memecoin. They are serious participants who want to support
            projects they believe in. Quality community from day one.
          </p>
        </div>
        <div className="docs-card">
          <h4>Flexible Supply</h4>
          <p>
            You control your token&apos;s supply parameters within the framework. Set the
            total supply, determine how much to sell, how much to reserve for the team
            (with vesting), and how much to allocate for future incentives. The framework
            enforces transparency, not rigidity.
          </p>
        </div>
      </div>

      <hr />

      <p>
        Ready to launch your project on NovaDAO?{" "}
        <Link href="/docs/how-launches-work/are-you-ready">Check if you are ready</Link>{" "}
        or jump straight to{" "}
        <Link href="/docs/how-launches-work/create">creating a launch</Link>.
      </p>
    </>
  );
}
