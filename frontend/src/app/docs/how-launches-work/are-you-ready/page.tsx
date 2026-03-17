"use client";

import Link from "next/link";

export default function AreYouReadyPage() {
  return (
    <>
      <h1>Are You Ready?</h1>
      <p>
        Launching on NovaDAO is a serious commitment. Before you begin the listing process,
        make sure your project meets the criteria below and that you understand the
        requirements for a successful launch.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> NovaDAO is not an incubator. We help established projects
        reach their next stage of growth through transparent, community-driven fundraising.
      </div>

      {/* ── Who NovaDAO Is For ── */}
      <h2>Who NovaDAO Is For</h2>
      <p>
        NovaDAO is designed for projects that have already demonstrated traction and are
        ready to scale. Here are the four key attributes of a strong candidate:
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>Working Product</h4>
          <p>
            You have a live product or protocol that users can interact with today. Testnet
            deployments count if there is a clear mainnet timeline. White-paper-only
            projects are not eligible.
          </p>
        </div>
        <div className="docs-card">
          <h4>Existing Users</h4>
          <p>
            Your project has measurable on-chain or off-chain usage. Active wallets,
            TVL, transaction volume, or recurring users demonstrate that real demand
            exists for what you are building.
          </p>
        </div>
        <div className="docs-card">
          <h4>Crypto-Native</h4>
          <p>
            Your product is built on-chain or has a meaningful blockchain integration.
            The token must serve a clear utility within your ecosystem, not just exist for
            fundraising purposes.
          </p>
        </div>
        <div className="docs-card">
          <h4>Limited Prior Raises</h4>
          <p>
            Ideally you have not completed large private rounds at high valuations. NovaDAO
            works best for teams that want to raise transparently from the community rather
            than relying on insider-heavy cap tables.
          </p>
        </div>
      </div>

      {/* ── Pre-Launch Communication ── */}
      <h2>Pre-Launch Communication Requirements</h2>
      <p>
        Transparent communication with your community is critical throughout the launch
        process. Here is what you need to prepare:
      </p>

      <h3>Before the ICO</h3>
      <ul>
        <li>Publish a detailed blog post or forum thread explaining why you are launching on NovaDAO.</li>
        <li>Share your tokenomics, including total supply, distribution, vesting, and utility.</li>
        <li>Announce the raise cap, minimum raise threshold, and timeline publicly.</li>
        <li>Host at least one AMA or community call to address questions from potential participants.</li>
        <li>Ensure your documentation (docs site, whitepaper, or equivalent) is up to date.</li>
      </ul>

      <h3>After the ICO</h3>
      <ul>
        <li>Provide a transparent summary of the raise results within 48 hours.</li>
        <li>Publish a use-of-funds breakdown so participants understand how capital will be deployed.</li>
        <li>Commit to regular progress updates (monthly at minimum).</li>
        <li>Engage with the NovaDAO governance process for milestone-based fund releases.</li>
      </ul>

      {/* ── Pre-Launch Checklist ── */}
      <h2>Pre-Launch Checklist</h2>
      <p>
        Complete every item on this checklist before submitting your listing application:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Finalize Your Tokenomics</h4>
            <p>
              Define your total supply, distribution percentages, vesting schedules,
              and any inflation or burn mechanics. These cannot be changed after listing.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Prepare Visual Assets</h4>
            <p>
              You will need a project logo (SVG, min 512x512), a banner image (1200x630),
              and a favicon. All assets should be high-resolution and on-brand.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Set Your Raise Parameters</h4>
            <p>
              Decide on your minimum raise threshold, discretionary cap, and ICO duration.
              Review the <Link href="/docs/how-launches-work/sale">Sale documentation</Link> for
              guidance on choosing these values.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Draft Your STAMP Agreement</h4>
            <p>
              If applicable, prepare the Simple Token Agreement, Market Protected. See the{" "}
              <Link href="/docs/how-launches-work/stamp">STAMP documentation</Link> for details.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Establish a Legal Entity</h4>
            <p>
              You must have a registered legal entity (foundation, LLC, or equivalent) that
              can enter into binding agreements. Consult with legal counsel familiar with
              your jurisdiction.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Plan Your Communication Strategy</h4>
            <p>
              Draft your pre-launch blog post, schedule your AMA, and prepare responses
              for common questions. First impressions matter — launch communication sets
              the tone for your relationship with the community.
            </p>
          </div>
        </div>
      </div>

      {/* ── What Happens If Not Ready ── */}
      <h2>What Happens If You Are Not Ready</h2>
      <div className="docs-warning">
        <strong>Warning:</strong> Launching before you are ready can permanently damage
        your project&apos;s reputation and your relationship with the community.
      </div>
      <p>
        If your project does not meet the criteria above, the following outcomes are likely:
      </p>
      <ul>
        <li>
          <strong>Failed raise:</strong> If you do not reach the minimum raise threshold, all
          funds are returned to participants and the ICO is cancelled. You may reapply, but
          trust is harder to rebuild.
        </li>
        <li>
          <strong>Weak post-launch performance:</strong> Projects without real users tend to see
          immediate sell pressure after the ICO. The bid wall provides a floor, but sustained
          price depends on genuine demand.
        </li>
        <li>
          <strong>Governance friction:</strong> NovaDAO token holders can vote to restrict fund
          releases if milestones are not being met. A project that overpromises and underdelivers
          will face community pushback.
        </li>
        <li>
          <strong>Reputational risk:</strong> The Stellar ecosystem is small and reputation
          travels fast. A poorly executed launch reflects on your team and makes future
          fundraising more difficult.
        </li>
      </ul>

      <div className="docs-tip">
        <strong>Tip:</strong> If you are not sure whether you are ready, reach out to the
        NovaDAO team for a pre-screening conversation. We are happy to provide honest feedback
        and help you plan a timeline that sets you up for success.
      </div>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          Ready to proceed? Start with{" "}
          <Link href="/docs/how-launches-work/create">Getting Listed on NovaDAO</Link>.
        </p>
      </div>
    </>
  );
}
