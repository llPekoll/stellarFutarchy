"use client";

import Link from "next/link";

export default function GovernanceProposalsPage() {
  return (
    <>
      <h1>Creating Proposals</h1>
      <p>
        Proposals are the core unit of governance in NovaDAO. Each proposal describes an action the
        DAO should take, and the decision markets determine whether it passes or fails. This page
        covers what proposals can do, how to create them, and best practices for proposal authors.
      </p>

      <h2>What Proposals Can Do</h2>
      <p>
        NovaDAO proposals can authorize a wide range of on-chain actions. Here are the most common
        categories:
      </p>

      <div className="docs-card-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="docs-card">
          <h4>Treasury Allocations</h4>
          <p>
            Transfer tokens from the DAO treasury to fund development, partnerships, grants,
            or operational expenses. The proposal specifies the recipient, amount, and vesting
            schedule if applicable.
          </p>
        </div>
        <div className="docs-card">
          <h4>Parameter Changes</h4>
          <p>
            Modify protocol parameters such as fee structures, TWAP observation windows,
            pass thresholds, or activation requirements. These changes take effect automatically
            upon proposal finalization.
          </p>
        </div>
        <div className="docs-card">
          <h4>Protocol Upgrades</h4>
          <p>
            Deploy updated contract code to upgrade the DAO, vault, AMM, or any other protocol
            component. Upgrades are executed atomically — the new code is live as soon as the
            proposal passes.
          </p>
        </div>
        <div className="docs-card">
          <h4>External Integrations</h4>
          <p>
            Authorize the DAO to interact with external protocols, register assets on other
            platforms, or establish cross-chain bridges. Any action that requires the DAO&apos;s
            contract authority can be proposed.
          </p>
        </div>
      </div>

      <h2>Activation Requirements</h2>
      <p>
        To prevent spam and ensure proposals have meaningful community support before consuming
        market resources, NovaDAO requires a <strong>token threshold</strong> for proposal activation.
      </p>

      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Activation Threshold</strong></td>
            <td>200,000 NOVA</td>
            <td>
              Minimum tokens that must be staked to activate a proposal and open its
              conditional markets. This is not spent — tokens are returned after finalization.
            </td>
          </tr>
          <tr>
            <td><strong>Staking Source</strong></td>
            <td>Proposer + Supporters</td>
            <td>
              The proposer can stake the full amount, or other token holders can add their
              stake to help a proposal reach the threshold.
            </td>
          </tr>
          <tr>
            <td><strong>Stake Lock Period</strong></td>
            <td>Until finalization</td>
            <td>
              Staked tokens are locked in the contract until the proposal is finalized
              (passed or failed). This prevents the same tokens from activating multiple
              proposals simultaneously.
            </td>
          </tr>
          <tr>
            <td><strong>Stake Return</strong></td>
            <td>100% returned</td>
            <td>
              Regardless of whether the proposal passes or fails, all staked tokens are
              returned to their original owners after finalization.
            </td>
          </tr>
        </tbody>
      </table>

      <div className="docs-note">
        <strong>Why 200,000 NOVA?</strong> The threshold is set high enough to prevent spam but
        low enough that any serious proposal can gather support. Since stakes are returned after
        finalization, the cost of proposing is only the opportunity cost of locking tokens during
        the trading period — not the tokens themselves.
      </div>

      <h2>The Proposal Lifecycle</h2>
      <p>
        Every proposal follows a defined lifecycle from creation to execution or rejection:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Draft &amp; Submit</h4>
            <p>
              The proposer writes a description of the proposed action, specifies any on-chain
              parameters (recipient address, token amount, contract call data), and submits
              the proposal to the DAO contract. The proposal enters a <strong>Pending</strong> state.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Gather Stakes</h4>
            <p>
              The proposer and supporters stake NOVA tokens toward the activation threshold.
              Once 200,000 NOVA are staked, the proposal automatically transitions to the
              <strong> Active</strong> state and conditional markets open.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Market Trading Period</h4>
            <p>
              The Conditional Vault splits NOVA into pass and fail tokens, and the AMM opens
              trading pools for each. Traders buy and sell conditional tokens to express their
              views on the proposal&apos;s impact. The AMM records price observations for the TWAP
              calculation throughout this period.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Grace Period</h4>
            <p>
              After the main trading period ends, a 24-hour grace period begins. Trading
              continues during this window, but it serves primarily to allow final price
              corrections before the TWAP is computed. See{" "}
              <Link href="/docs/governance/twaps">TWAPs</Link> for details.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Finalization</h4>
            <p>
              The DAO contract computes the final TWAPs for both markets and compares them.
              If the pass TWAP exceeds the fail TWAP (adjusted for any pass threshold), the
              proposal is marked as <strong>Passed</strong> and the on-chain action is executed.
              Otherwise, it is marked as <strong>Failed</strong>. Staked tokens are returned in
              either case.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Redemption</h4>
            <p>
              Holders of the winning conditional token (pNOVA if passed, fNOVA if failed) can
              redeem their tokens 1:1 for NOVA through the vault. The losing conditional token
              becomes worthless.
            </p>
          </div>
        </div>
      </div>

      <h2>Proposal Parameters</h2>

      <h3>Pass Thresholds</h3>
      <p>
        Not all proposals are treated equally. To protect against conflicts of interest, NovaDAO
        applies different pass thresholds depending on who submitted the proposal:
      </p>

      <table>
        <thead>
          <tr>
            <th>Proposer Type</th>
            <th>Pass Threshold</th>
            <th>Rationale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Non-team member</strong></td>
            <td>Pass TWAP &gt; Fail TWAP</td>
            <td>
              Standard threshold. The market simply needs to believe the proposal adds value.
              No additional hurdle is required because there is no inherent conflict of interest.
            </td>
          </tr>
          <tr>
            <td><strong>Team member</strong></td>
            <td>Pass TWAP &gt; Fail TWAP + 5%</td>
            <td>
              Higher threshold for team-originated proposals (such as compensation requests or
              insider transactions). The 5% premium ensures the market strongly believes the
              proposal is beneficial despite the conflict of interest.
            </td>
          </tr>
        </tbody>
      </table>

      <div className="docs-warning">
        <strong>Conflict of interest:</strong> If you are a team member submitting a proposal
        that benefits you directly (e.g., a compensation increase or token grant), the higher
        pass threshold applies automatically. Attempting to submit through a proxy address to
        circumvent this is a governance violation.
      </div>

      <h3>Budget Constraints</h3>
      <p>
        Proposals that request treasury funds are subject to budget constraints set by the DAO:
      </p>
      <ul>
        <li>
          <strong>Per-proposal cap:</strong> No single proposal can request more than a configured
          percentage of the total treasury (default: 10%).
        </li>
        <li>
          <strong>Concurrent proposal limit:</strong> The total value of all active proposals
          (currently in their trading period) cannot exceed a configured percentage of the
          treasury (default: 30%).
        </li>
        <li>
          <strong>Cooldown period:</strong> After a treasury allocation proposal passes, a
          cooldown period may apply before another allocation of similar size can be activated.
        </li>
      </ul>

      <h2>Best Practices for Proposal Authors</h2>
      <p>
        A well-crafted proposal increases the likelihood of accurate market pricing and a fair
        outcome. Follow these guidelines:
      </p>

      <div className="docs-steps">
        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Be Specific</h4>
            <p>
              Clearly define what the proposal does, how much it costs, who benefits, and what
              the expected outcome is. Vague proposals are harder for the market to price and
              more likely to be rejected.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Provide Context</h4>
            <p>
              Include relevant data, analysis, or precedents that support your proposal. Traders
              will use this information to form their views. The more evidence you provide, the
              more informed the market will be.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Define Success Metrics</h4>
            <p>
              State how the community can evaluate whether the proposal achieved its goals.
              This helps the market assess the probability of success and prices the conditional
              tokens more accurately.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Engage Before Submitting</h4>
            <p>
              Discuss your proposal in community channels before formal submission. Early
              feedback can help you refine the proposal, identify potential objections, and
              build support toward the activation threshold.
            </p>
          </div>
        </div>

        <div className="docs-step">
          <div className="docs-step-num" />
          <div className="docs-step-content">
            <h4>Right-Size Your Request</h4>
            <p>
              If your initiative requires a large budget, consider breaking it into smaller
              milestone-based proposals. This reduces risk for the DAO and makes it easier for
              the market to evaluate each phase independently.
            </p>
          </div>
        </div>
      </div>

      <div className="docs-tip">
        <strong>Remember:</strong> The market decides, not voters. A well-researched, clearly
        articulated proposal gives traders the information they need to price it fairly. Your job
        as a proposer is to make the case — the market&apos;s job is to evaluate it.
      </div>

      <hr />
      <p>
        <strong>Next:</strong>{" "}
        <Link href="/docs/governance/twaps">Finalizing Proposals (TWAPs)</Link> — understand how
        time-weighted average prices determine the final outcome. Or go back to{" "}
        <Link href="/docs/governance/overview">Governance Overview</Link> for the big picture.
      </p>
    </>
  );
}
