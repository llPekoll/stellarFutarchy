"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
            const stateKey = typeof p.state === "string" ? p.state : Object.keys(p.state)[0];
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
      await fetchData();
    } catch (err) {
      console.error("Failed to create proposal:", err);
      alert(`Failed to create proposal: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalize = async (proposalId: number) => {
    if (!address) return;
    try {
      await finalizeProposal({ proposalId, daoContractId, callerAddress: address });
      await fetchData();
    } catch (err) {
      console.error("Failed to finalize proposal:", err);
      alert(`Failed to finalize: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div style={{ padding: "40px 0 80px" }}>
      <Link
        href="/"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--text-muted)", marginBottom: 24,
          textDecoration: "none", transition: "color 0.2s",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to all projects
      </Link>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 6 }}>
            {daoName || "Loading..."}
          </h1>
          <p style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text-muted)" }}>
            {daoContractId.slice(0, 12)}...{daoContractId.slice(-8)}
          </p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>
            Futarchy governance — trade on proposal outcomes
          </p>
        </div>
        {connected && (
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Cancel" : "New Proposal"}
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="card-static" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Create Proposal</h3>
          <form onSubmit={handleCreateProposal}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="form-label">Description URL</label>
                <input
                  type="url"
                  required
                  value={descUrl}
                  onChange={(e) => setDescUrl(e.target.value)}
                  className="form-input"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="form-label">Initial Liquidity (base token amount)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                  className="form-input"
                  placeholder="1000"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? "Creating..." : "Create Proposal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Proposals */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 0", borderTop: "1px solid var(--border-color)", marginBottom: 20,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, color: "var(--text-secondary)" }}>Proposals</h3>
        <span style={{ fontSize: 14, color: "var(--accent-light)" }}>
          {proposals.length} total
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
          {address ? "Loading proposals..." : "Connect wallet to view proposals"}
        </div>
      ) : proposals.length > 0 ? (
        proposals.map((proposal) => (
          <div key={proposal.id}>
            <ProposalCard
              {...proposal}
              onTrade={() => setTradingProposalId(tradingProposalId === proposal.id ? null : proposal.id)}
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
        <div className="card-static" style={{ textAlign: "center", padding: 48 }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No proposals yet.</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Create the first one!</p>
        </div>
      )}
    </div>
  );
}
