"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ProposalCard } from "@/components/ProposalCard";
import { useWallet } from "@/components/WalletProvider";

// Demo proposals — in production from contract queries
const DEMO_PROPOSALS = [
  {
    id: 0,
    description: "Fund a new Stellar AMM aggregator — 50,000 XLM grant",
    state: "Active" as const,
    createdAt: Date.now() / 1000 - 86400,
    votingEndsAt: Date.now() / 1000 + 172800,
    baseLiquidity: "10,000 XLM",
    passPrice: 0.62,
  },
  {
    id: 1,
    description: "Integrate with Soroswap for token swaps",
    state: "Passed" as const,
    createdAt: Date.now() / 1000 - 604800,
    votingEndsAt: Date.now() / 1000 - 345600,
    baseLiquidity: "5,000 XLM",
    passPrice: 0.78,
  },
  {
    id: 2,
    description: "Change pass threshold from 50% to 60%",
    state: "Failed" as const,
    createdAt: Date.now() / 1000 - 864000,
    votingEndsAt: Date.now() / 1000 - 604800,
    baseLiquidity: "8,000 XLM",
    passPrice: 0.38,
  },
];

export default function DaoPage() {
  const params = useParams();
  const { connected } = useWallet();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            DAO: {params.id}
          </h1>
          <p className="text-gray-400 text-sm">
            Futarchy governance — trade on proposal outcomes
          </p>
        </div>
        {connected && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
          >
            {showCreateForm ? "Cancel" : "New Proposal"}
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="border border-gray-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Create Proposal
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: call create_proposal on DAO contract
              alert("Proposal creation will be connected to the contract");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Description URL
              </label>
              <input
                type="url"
                required
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Initial Liquidity (base token amount)
              </label>
              <input
                type="number"
                required
                min={1}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                placeholder="1000"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
            >
              Create Proposal
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">Proposals</h2>
        {DEMO_PROPOSALS.map((proposal) => (
          <ProposalCard
            key={proposal.id}
            {...proposal}
            onTrade={() =>
              alert(
                `Trading UI for proposal #${proposal.id} — connect to AMM contract`
              )
            }
            onFinalize={() =>
              alert(
                `Finalizing proposal #${proposal.id} — will call finalize_proposal`
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
