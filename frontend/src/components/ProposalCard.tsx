"use client";

interface ProposalCardProps {
  id: number;
  description: string;
  state: "Active" | "Passed" | "Failed";
  createdAt: number;
  votingEndsAt: number;
  baseLiquidity: string;
  passPrice?: number;
  onFinalize?: () => void;
  onTrade?: () => void;
}

const stateClasses: Record<string, string> = {
  Active: "badge-active",
  Passed: "badge-passed",
  Failed: "badge-failed",
};

export function ProposalCard({
  id,
  description,
  state,
  votingEndsAt,
  baseLiquidity,
  passPrice,
  onFinalize,
  onTrade,
}: ProposalCardProps) {
  const now = Date.now() / 1000;
  const timeLeft = votingEndsAt - now;
  const canFinalize = state === "Active" && timeLeft <= 0;

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Ended";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m left`;
  };

  return (
    <div className="card-static" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h4 style={{ fontSize: 16, fontWeight: 600 }}>Proposal #{id}</h4>
        <span className={`badge ${stateClasses[state]}`}>{state}</span>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>{description}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Liquidity</div>
          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>{baseLiquidity}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Pass Probability</div>
          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>
            {passPrice !== undefined ? `${(passPrice * 100).toFixed(1)}%` : "N/A"}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Time</div>
          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>{formatTime(timeLeft)}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {state === "Active" && timeLeft > 0 && (
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onTrade}>Trade</button>
        )}
        {canFinalize && (
          <button
            className="btn"
            style={{
              flex: 1,
              background: "rgba(241, 194, 27, 0.15)",
              color: "var(--warning)",
              border: "1px solid rgba(241, 194, 27, 0.3)",
            }}
            onClick={onFinalize}
          >
            Finalize
          </button>
        )}
      </div>
    </div>
  );
}
