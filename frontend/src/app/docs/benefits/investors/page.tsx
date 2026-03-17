"use client";

import Link from "next/link";

export default function InvestorsPage() {
  return (
    <>
      <h1>For Investors</h1>
      <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 32 }}>
        NovaDAO provides dual protection for investors: mechanistic safeguards enforced by
        smart contracts and legal protections enforced by real-world agreements. Together,
        they make NovaDAO the safest way to invest in early-stage crypto projects.
      </p>

      <p>
        Most token investments are a leap of faith. You send money to a project, receive tokens,
        and hope the team does what they promised. There is no recourse if they drain the treasury,
        pivot to something else, or simply disappear. NovaDAO changes this by giving you real
        protection at both the protocol level and the legal level.
      </p>

      <h2>Mechanistic Protection Against Treasury Rugs</h2>
      <p>
        The most common way investors get rugged is through treasury mismanagement. A team raises
        $10M, moves it to a multisig they control, and then spends it however they want &mdash;
        or simply drains it. NovaDAO eliminates this risk through on-chain treasury governance:
      </p>

      <ul>
        <li>
          <strong>Raised funds go into a smart contract treasury</strong> &mdash; not a team-controlled
          wallet or multisig. The treasury is governed by the protocol&apos;s futarchy mechanism,
          meaning no single party can withdraw funds without market approval.
        </li>
        <li>
          <strong>Every spending proposal goes through decision markets</strong> &mdash; when the
          team wants to spend treasury funds, they submit a proposal. The market evaluates whether
          the spending will increase or decrease token value. If the market says no, the funds
          stay in the treasury.
        </li>
        <li>
          <strong>TWAP-based finalization</strong> &mdash; proposals are decided by time-weighted
          average prices (TWAPs) in the decision markets, not by a single snapshot vote. This makes
          manipulation expensive and impractical. An attacker would need to maintain artificial
          prices over an extended period, which is economically irrational.
        </li>
        <li>
          <strong>Conditional tokens reveal true market sentiment</strong> &mdash; in a decision
          market, traders buy &quot;pass&quot; or &quot;fail&quot; tokens that only have value if
          the proposal passes or fails respectively. This forces participants to put real money
          behind their assessment of whether a proposal is good for the project.
        </li>
      </ul>

      <div className="docs-warning">
        <strong>No protection is absolute.</strong> Mechanistic protections guard against treasury
        rugs, but they cannot prevent a team from building a bad product or making poor strategic
        decisions. NovaDAO protects your money from being stolen, not from being spent on things
        that do not work. That said, the decision market mechanism is specifically designed to
        filter out bad spending proposals.
      </div>

      <h2>Legal Protection Against Revenue Rugs</h2>
      <p>
        Treasury protection is necessary but not sufficient. Even if the treasury is safe, a team
        could build a product, generate revenue, and then keep all the revenue for themselves
        rather than sharing it with token holders. This is the &quot;revenue rug&quot; &mdash;
        your tokens funded the product, but you never see a return.
      </p>
      <p>
        NovaDAO addresses this through a legal framework that complements the on-chain mechanics:
      </p>

      <ul>
        <li>
          <strong>STAMP (Standard Token Agreement for Market Participants)</strong> &mdash; every
          NovaDAO launch includes a legally binding agreement between the project and its token
          holders. The STAMP defines the relationship between the token and the project&apos;s
          revenue, creating enforceable obligations.
        </li>
        <li>
          <strong>Revenue-sharing commitments</strong> &mdash; projects that launch on NovaDAO
          commit to specific revenue-sharing arrangements with token holders. These commitments
          are defined in the STAMP and are legally enforceable. If a project generates revenue and
          fails to share it as agreed, token holders have legal recourse.
        </li>
        <li>
          <strong>Transparent reporting obligations</strong> &mdash; the STAMP includes
          requirements for regular financial reporting by the project team. Token holders can
          verify that revenue is being accurately reported and shared according to the agreement.
        </li>
      </ul>

      <div className="docs-note">
        <strong>Legal protection requires jurisdiction.</strong> The enforceability of the STAMP
        depends on the legal jurisdictions involved. NovaDAO is designed to work within existing
        legal frameworks, but enforcement across jurisdictions can be complex. Read the full{" "}
        <Link href="/docs/how-launches-work/stamp">STAMP documentation</Link> for details.
      </div>

      <h2>What You Get as a NovaDAO Investor</h2>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>Treasury Transparency</h4>
          <p>
            Every dollar raised is visible on-chain. You can see exactly how much is in the
            treasury and track every outflow. No more wondering whether the team is spending
            responsibly &mdash; you can verify it yourself at any time.
          </p>
        </div>
        <div className="docs-card">
          <h4>Governance Power</h4>
          <p>
            Your tokens give you real governance power through decision markets. You are not
            casting advisory votes that the team can ignore. You are participating in a
            market mechanism that directly controls treasury spending. Your voice matters
            because it is backed by skin in the game.
          </p>
        </div>
        <div className="docs-card">
          <h4>Fair Entry Price</h4>
          <p>
            NovaDAO launches give everyone the same deal. There are no hidden discounts for
            VCs, no OTC deals at 80% off, no friends-and-family rounds. The price you pay
            is the price everyone pays. No information asymmetry, no insider advantage.
          </p>
        </div>
        <div className="docs-card">
          <h4>Legal Recourse</h4>
          <p>
            The STAMP agreement gives you legally enforceable rights as a token holder. If
            a project fails to meet its obligations, you have real legal options &mdash; not
            just angry tweets. This is a level of investor protection that almost no other
            crypto platform provides.
          </p>
        </div>
      </div>

      <h2>How Decision Markets Protect You</h2>
      <p>
        Decision markets are the core mechanism that protects your investment after the token
        sale. Here is how they work in practice:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Team Submits a Proposal</h4>
            <p>
              The project team wants to spend treasury funds &mdash; say, $200K for a
              marketing campaign. They submit a proposal to the DAO with details about what
              the money will be used for and what outcomes they expect.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Decision Market Opens</h4>
            <p>
              A decision market is created with two conditional tokens: &quot;pass&quot; and
              &quot;fail.&quot; Traders can buy and sell these tokens based on their assessment
              of whether the proposal will increase or decrease the project&apos;s token value.
              The base token is split into conditional pass and fail tokens via the vault contract.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Market Price Discovery</h4>
            <p>
              Over a defined trading period, the market discovers the consensus view on the
              proposal. If traders believe the marketing campaign will increase token value,
              the pass token trades at a premium. If they think it is a waste of money, the
              fail token trades at a premium. The prices reflect the collective intelligence
              of the market.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>TWAP Resolution</h4>
            <p>
              The proposal is resolved based on the time-weighted average price (TWAP) of the
              pass and fail tokens over the trading period. If the pass TWAP is higher than the
              fail TWAP, the proposal passes and the funds are released. If the fail TWAP is
              higher, the proposal fails and the funds remain in the treasury. TWAP prevents
              last-minute manipulation.
            </p>
          </div>
        </div>
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Token Redemption</h4>
            <p>
              After resolution, winning conditional tokens can be redeemed for the underlying
              asset through the vault contract. If the proposal passed, pass token holders
              redeem their tokens. If it failed, fail token holders redeem. This creates the
              economic incentive for accurate price discovery.
            </p>
          </div>
        </div>
      </div>

      <div className="docs-tip">
        <strong>You do not have to actively trade in decision markets to benefit from them.</strong> The
        protection works even if you never trade a single conditional token. As long as
        some participants are trading, the market produces price signals that govern treasury
        spending. You benefit from the collective intelligence of the market just by holding
        your tokens.
      </div>

      <h2>Stellar-Native Advantages for Investors</h2>
      <p>
        Investing through NovaDAO on Stellar gives you several advantages over other chains:
      </p>

      <table>
        <thead>
          <tr>
            <th>Advantage</th>
            <th>What It Means for You</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Near-Zero Fees</strong></td>
            <td>
              Participating in token sales, trading in decision markets, and voting in
              governance costs fractions of a cent. You can be an active participant without
              fees eating into your returns.
            </td>
          </tr>
          <tr>
            <td><strong>Native USDC</strong></td>
            <td>
              Your investment is denominated in USDC that lives natively on Stellar, issued
              by Circle. No bridge risk, no wrapped asset risk. The USDC in the treasury is
              real USDC, not a synthetic or bridged version.
            </td>
          </tr>
          <tr>
            <td><strong>Fast Settlement</strong></td>
            <td>
              Transactions finalize in 3&ndash;5 seconds. When you participate in a sale or
              trade in a decision market, you know immediately whether your transaction
              succeeded. No waiting, no uncertainty.
            </td>
          </tr>
          <tr>
            <td><strong>No MEV</strong></td>
            <td>
              Stellar&apos;s consensus protocol does not allow validators to reorder
              transactions for profit. Your trades execute at the price you expect without
              being front-run or sandwiched by MEV bots.
            </td>
          </tr>
          <tr>
            <td><strong>Regulatory-Friendly</strong></td>
            <td>
              Stellar is built by the Stellar Development Foundation, a US-based nonprofit
              focused on financial inclusion. The network&apos;s compliance-forward approach
              reduces regulatory risk for both projects and investors on the platform.
            </td>
          </tr>
          <tr>
            <td><strong>Established Ecosystem</strong></td>
            <td>
              Stellar has 8M+ funded accounts and deep integrations with traditional finance
              through MoneyGram, anchors, and banking partners. This means easier on-ramps
              and off-ramps for your investment capital.
            </td>
          </tr>
        </tbody>
      </table>

      <hr />

      <p>
        Ready to learn more about how launches work?{" "}
        <Link href="/docs/how-launches-work/are-you-ready">See if a project is ready</Link>{" "}
        or read about the{" "}
        <Link href="/docs/how-launches-work/sale">sale mechanics</Link>{" "}
        in detail. You can also explore{" "}
        <Link href="/docs/governance/overview">how governance works</Link>{" "}
        to understand the decision market system.
      </p>
    </>
  );
}
