"use client";

interface ProposalCardProps {
  id: number;
  description: string;
  state: "Active" | "Passed" | "Failed";
  createdAt: number;
  votingEndsAt: number;
  baseLiquidity: string;
  passPrice?: number; // 0-1 probability
  onFinalize?: () => void;
  onTrade?: () => void;
}

const stateColors = {
  Active: "bg-green-500/20 text-green-400",
  Passed: "bg-blue-500/20 text-blue-400",
  Failed: "bg-red-500/20 text-red-400",
};

export function ProposalCard({
  id,
  description,
  state,
  createdAt,
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
    <div className="border border-gray-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-md font-semibold text-white">
          Proposal #{id}
        </h4>
        <span
          className={`text-xs px-2 py-1 rounded-full ${stateColors[state]}`}
        >
          {state}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-4">{description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Liquidity</p>
          <p className="text-sm text-white font-mono">{baseLiquidity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Pass Probability</p>
          <p className="text-sm text-white font-mono">
            {passPrice !== undefined
              ? `${(passPrice * 100).toFixed(1)}%`
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Time</p>
          <p className="text-sm text-white font-mono">
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {state === "Active" && timeLeft > 0 && (
          <button
            onClick={onTrade}
            className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
          >
            Trade
          </button>
        )}
        {canFinalize && (
          <button
            onClick={onFinalize}
            className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm rounded-lg transition-colors"
          >
            Finalize
          </button>
        )}
      </div>
    </div>
  );
}
