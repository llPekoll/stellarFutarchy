"use client";

import Link from "next/link";

export default function GovernanceOverviewPage() {
  return (
    <>
      <h1>Introduction to Decision Markets</h1>
      <p>
        NovaDAO uses <strong>decision markets</strong> instead of traditional token voting to govern
        protocol decisions. Rather than asking "what do token holders want?", decision markets ask
        "what will make the token more valuable?" — and let the market answer.
      </p>

      <div className="docs-tip">
        <strong>Key insight:</strong> In a decision market, people put real money behind their
        predictions. This means informed participants are rewarded and uninformed participants lose
        money — creating a powerful incentive to seek the truth.
      </div>

      <h2>First, Some Context</h2>
      <p>
        Token voting — the dominant governance mechanism in crypto — suffers from four well-documented
        failure modes:
      </p>

      <h3>1. Low Participation</h3>
      <p>
        Most token holders never vote. Across major DAOs, voter turnout rarely exceeds 5-10% of the
        token supply. This means a tiny minority of holders make decisions that affect everyone.
        Apathy compounds: when people see that their vote rarely matters, they stop participating
        entirely.
      </p>

      <h3>2. Plutocracy</h3>
      <p>
        One-token-one-vote means whales dominate. A single large holder can override thousands of
        smaller participants. This concentrates power in the hands of early insiders, VCs, and
        exchanges — the very centralization that DAOs claim to eliminate.
      </p>

      <h3>3. Misaligned Incentives</h3>
      <p>
        Voters face no consequences for bad decisions. If a governance vote approves a disastrous
        proposal, the voters who supported it lose nothing beyond what every other holder loses.
        There is no direct cost to voting poorly, so there is no direct incentive to vote well.
      </p>

      <h3>4. Information Poverty</h3>
      <p>
        Voting provides almost no signal about <em>why</em> people support or oppose a proposal.
        A 60/40 vote tells you the outcome but nothing about the reasoning. There is no mechanism to
        aggregate distributed knowledge — a developer who knows a proposal is technically flawed has
        the same single vote as someone who has never read the code.
      </p>

      <h2>How Does It Work?</h2>
      <p>
        When a proposal is submitted to NovaDAO, the protocol creates two conditional markets:
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>Pass Market</h4>
          <p>
            Trades a conditional token representing the value of NOVA <strong>if the proposal passes</strong>.
            If the market prices this token at 1.20 USDC, participants collectively believe the
            proposal will increase NOVA&apos;s value to $1.20.
          </p>
        </div>
        <div className="docs-card">
          <h4>Fail Market</h4>
          <p>
            Trades a conditional token representing the value of NOVA <strong>if the proposal fails</strong>.
            If the market prices this token at 0.95 USDC, participants collectively believe NOVA will
            be worth $0.95 if the proposal is rejected.
          </p>
        </div>
      </div>

      <p>
        After a defined trading period, the protocol compares the <strong>time-weighted average
        prices (TWAPs)</strong> from both markets. If the pass market TWAP exceeds the fail market
        TWAP, the proposal is approved. If not, it is rejected.
      </p>

      <div className="docs-note">
        <strong>Simple rule:</strong> A proposal passes when the market believes it will increase
        the token&apos;s value. Pass TWAP &gt; Fail TWAP = Proposal approved.
      </div>

      <h2>Why Is This Better?</h2>
      <p>
        Decision markets are not a theoretical experiment. They are used across many domains and
        consistently outperform alternative methods of aggregating information.
      </p>

      <h3>Election Forecasting</h3>
      <p>
        Prediction markets like Polymarket and PredictIt have consistently outperformed polls,
        pundits, and statistical models in forecasting elections. In the 2024 US presidential
        election, prediction markets called the outcome correctly while most polling aggregators
        did not. The reason is simple: people who put money on the line seek out better information
        and weight it more carefully than survey respondents.
      </p>

      <h3>Commodity Price Discovery</h3>
      <p>
        Futures markets for commodities like oil, wheat, and metals are how the global economy
        discovers prices. These markets aggregate information from producers, consumers, traders,
        and analysts into a single price signal that reflects collective knowledge about supply,
        demand, and future conditions. No committee or algorithm matches their accuracy.
      </p>

      <h3>Corporate Decision-Making</h3>
      <p>
        Companies including Google, HP, and Ford have experimented with internal prediction markets
        to forecast product launches, project timelines, and strategic outcomes. In every documented
        case, the internal markets outperformed management forecasts — because they aggregated
        information from employees across the entire organization, not just executives.
      </p>

      <h3>The Fundamental Principle</h3>
      <p>
        All of these examples rest on one principle: <strong>when people have skin in the game,
        they reveal truthful information</strong>. A trader who believes a proposal will harm the
        protocol can profit by shorting the pass token. A trader who has done deep research and
        believes a proposal will be transformative can profit by going long. The market price
        reflects the balance of all of these informed opinions, weighted by conviction.
      </p>

      <h2>Why Does This Matter for Governance?</h2>
      <p>
        Decision markets directly address the four failure modes of token voting:
      </p>

      <h3>Governance Capture</h3>
      <p>
        In a decision market, a whale who tries to force through a bad proposal by buying pass tokens
        is simply giving money to informed traders who short the other side. Market manipulation is
        expensive and self-correcting — the more you distort the price, the more profit you create
        for those who correct it. Compare this to token voting, where a whale can vote for a bad
        proposal at zero marginal cost.
      </p>

      <h3>Bad Proposals</h3>
      <p>
        If a proposal is genuinely harmful, informed traders will short the pass market and go long
        the fail market, driving the TWAP below the pass threshold. The proposal fails not because
        of politics or turnout, but because the collective intelligence of the market judged it to
        be value-destructive. The worse a proposal is, the more money there is to be made by
        opposing it.
      </p>

      <h3>Better Information</h3>
      <p>
        The market price at any given moment reflects the best available information about a
        proposal&apos;s likely impact. This is publicly visible and continuously updated — unlike a
        governance forum where the loudest voices dominate, or a vote where you only learn the
        outcome at the end. Decision markets produce a real-time signal that anyone can observe and
        act on.
      </p>

      <h2>How NovaDAO Implements Decision Markets on Stellar</h2>
      <p>
        NovaDAO brings decision markets on-chain using Stellar&apos;s Soroban smart contract platform.
        Here is how each component maps to the system:
      </p>

      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Implementation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Conditional Tokens</strong></td>
            <td>
              The Conditional Vault contract splits NOVA into pass and fail tokens.
              Each token represents a claim on the underlying NOVA, redeemable only
              if the corresponding outcome occurs.
            </td>
          </tr>
          <tr>
            <td><strong>AMM Markets</strong></td>
            <td>
              The Futarchy AMM contract creates constant-product (x*y=k) liquidity pools
              for pass/USDC and fail/USDC pairs. Anyone can trade, and the pool
              continuously discovers the market price.
            </td>
          </tr>
          <tr>
            <td><strong>TWAP Oracle</strong></td>
            <td>
              The AMM records time-weighted average prices on-chain with lagged observations.
              This makes short-term price manipulation extremely expensive and ensures
              the final decision reflects sustained market consensus.
            </td>
          </tr>
          <tr>
            <td><strong>Proposal Lifecycle</strong></td>
            <td>
              The DAO contract manages proposal creation, market deployment, TWAP comparison,
              and finalization. The entire lifecycle — from submission to execution — is
              trustless and on-chain.
            </td>
          </tr>
          <tr>
            <td><strong>Factory Registry</strong></td>
            <td>
              The Factory contract enables permissionless DAO creation. Anyone can deploy
              a new NovaDAO instance with its own token and governance parameters.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Getting Started</h2>
      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Link href="/docs/governance/proposals" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>Creating Proposals</h4>
            <p>
              Learn how to submit proposals, set parameters, and navigate the activation
              requirements.
            </p>
          </div>
        </Link>
        <Link href="/docs/governance/markets" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>Trading Proposals</h4>
            <p>
              Understand how to participate in conditional markets and the strategies
              available to traders.
            </p>
          </div>
        </Link>
        <Link href="/docs/governance/twaps" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>Finalizing Proposals (TWAPs)</h4>
            <p>
              Dive into how time-weighted average prices determine proposal outcomes and
              resist manipulation.
            </p>
          </div>
        </Link>
        <Link href="/docs/token/mechanics" style={{ textDecoration: "none" }}>
          <div className="docs-card">
            <h4>Token Mechanics</h4>
            <p>
              Explore how the NOVA token interacts with the governance system and its
              role in decision markets.
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
