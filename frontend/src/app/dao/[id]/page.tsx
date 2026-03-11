"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ProposalCard } from "@/components/ProposalCard";
import { TradePanel } from "@/components/TradePanel";
import { useWallet } from "@/components/WalletProvider";
import {
  getDaoConfig,
  getProposalCount,
  getProposal,
  createProposal,
  finalizeProposal,
} from "@/lib/contracts";

interface ProposalData {
  id: number;
  description: string;
  state: "Active" | "Passed" | "Failed";
  createdAt: number;
  votingEndsAt: number;
  baseLiquidity: string;
  passPrice?: number;
  vault: string;
  amm: string;
}

export default function DaoPage() {
  const params = useParams();
  const daoContractId = params.id as string;
  const { address, connected } = useWallet();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [daoName, setDaoName] = useState<string>("");
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [descUrl, setDescUrl] = useState("");
  const [baseAmount, setBaseAmount] = useState("");
  const [tradingProposalId, setTradingProposalId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const config = await getDaoConfig(daoContractId, address);
      if (config) {
        setDaoName(config.name || "Unnamed DAO");
      }

      const count = await getProposalCount(daoContractId, address);
      const items: ProposalData[] = [];
      for (let i = 0; i < count; i++) {
        try {
          const p = await getProposal(daoContractId, i, address);
          if (p) {
            const stateMap: Record<string, "Active" | "Passed" | "Failed"> = {
              Active: "Active",
              Passed: "Passed",
              Failed: "Failed",
            };
            // The state comes as an enum variant name from scValToNative
            const stateKey =
              typeof p.state === "string" ? p.state : Object.keys(p.state)[0];
            items.push({
              id: p.id,
              description: p.description_url || `Proposal #${p.id}`,
              state: stateMap[stateKey] || "Active",
              createdAt: Number(p.created_at),
              votingEndsAt: Number(p.voting_ends_at),
              baseLiquidity: `${p.base_liquidity}`,
              vault: p.vault,
              amm: p.amm,
            });
          }
        } catch (err) {
          console.error(`Failed to fetch proposal #${i}:`, err);
        }
      }
      setProposals(items);
    } catch (err) {
      console.error("Failed to fetch DAO data:", err);
    } finally {
      setLoading(false);
    }
  }, [daoContractId, address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setSubmitting(true);
    try {
      await createProposal({
        proposer: address,
        descriptionUrl: descUrl,
        baseAmount: parseInt(baseAmount),
        daoContractId,
      });
      setShowCreateForm(false);
      setDescUrl("");
      setBaseAmount("");
      // Refresh proposals
      await fetchData();
    } catch (err) {
      console.error("Failed to create proposal:", err);
      alert(
        `Failed to create proposal: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async (proposalId: number) => {
    if (!address) return;
    try {
      await finalizeProposal({
        proposalId,
        daoContractId,
        callerAddress: address,
      });
      await fetchData();
    } catch (err) {
      console.error("Failed to finalize proposal:", err);
      alert(
        `Failed to finalize: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {daoName || "Loading..."}
          </h1>
          <p className="text-gray-400 text-sm font-mono">
            {daoContractId.slice(0, 12)}...{daoContractId.slice(-8)}
          </p>
          <p className="text-gray-500 text-sm mt-1">
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
          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Description URL
              </label>
              <input
                type="url"
                required
                value={descUrl}
                onChange={(e) => setDescUrl(e.target.value)}
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
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                placeholder="1000"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {submitting ? "Creating..." : "Create Proposal"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">Proposals</h2>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            {address ? "Loading proposals..." : "Connect wallet to view proposals"}
          </div>
        ) : proposals.length > 0 ? (
          proposals.map((proposal) => (
            <div key={proposal.id}>
              <ProposalCard
                {...proposal}
                onTrade={() =>
                  setTradingProposalId(
                    tradingProposalId === proposal.id ? null : proposal.id
                  )
                }
                onFinalize={() => handleFinalize(proposal.id)}
              />
              {tradingProposalId === proposal.id && (
                <TradePanel
                  proposalId={proposal.id}
                  vaultAddress={proposal.vault}
                  ammAddress={proposal.amm}
                  state={proposal.state}
                  onClose={() => setTradingProposalId(null)}
                  onUpdate={fetchData}
                />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No proposals yet. Create the first one!
          </div>
        )}
      </div>
    </div>
  );
}
