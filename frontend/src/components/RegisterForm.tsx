"use client";

import { useState } from "react";
import { useWallet } from "./WalletProvider";
import { createDao } from "@/lib/contracts";

interface RegisterFormData {
  name: string;
  descriptionUrl: string;
  baseToken: string;
  quoteToken: string;
  proposalDuration: number;
  passThresholdBps: number;
  minBaseLiquidity: number;
  ammFeeBps: number;
}

export function RegisterForm() {
  const { address, connected } = useWallet();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    descriptionUrl: "",
    baseToken: "",
    quoteToken: "",
    proposalDuration: 72,
    passThresholdBps: 5000,
    minBaseLiquidity: 1000,
    ammFeeBps: 30,
  });

  const update = (field: keyof RegisterFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !address) {
      alert("Please connect your wallet first");
      return;
    }
    setSubmitting(true);
    try {
      await createDao({
        creator: address,
        name: form.name,
        descriptionUrl: form.descriptionUrl,
        baseToken: form.baseToken,
        quoteToken: form.quoteToken,
        proposalDuration: form.proposalDuration * 3600,
        passThresholdBps: form.passThresholdBps,
        minBaseLiquidity: form.minBaseLiquidity,
        ammFeeBps: form.ammFeeBps,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Failed to register DAO:", err);
      alert(`Failed to register DAO: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="card-static" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16, color: "var(--success)" }}>&#x2713;</div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>DAO Registered!</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24, fontSize: 14 }}>
          Your futarchy DAO has been created. You can now create proposals.
        </p>
        <a href="/" className="btn btn-primary">Back to all DAOs</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <label className="form-label">Project Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="form-input"
            placeholder="My Futarchy DAO"
          />
        </div>

        <div>
          <label className="form-label">Description URL</label>
          <input
            type="url"
            required
            value={form.descriptionUrl}
            onChange={(e) => update("descriptionUrl", e.target.value)}
            className="form-input"
            placeholder="https://..."
          />
        </div>

        {/* Token info box */}
        <div style={{
          padding: 16,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: 10,
          fontSize: 12,
          color: "var(--text-secondary)",
        }}>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
            Testnet token addresses (must start with C):
          </p>
          <p>XLM (native): <code style={{ color: "var(--accent-light)", userSelect: "all" }}>CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC</code></p>
          <p>USDC (test): <code style={{ color: "var(--accent-light)", userSelect: "all" }}>CCV3CMLKA6IL342LANM6XIWKURBCFU3RNR5M5QUBMDUOIP5KHI6GLLDJ</code></p>
        </div>

        <div className="grid-form-2col">
          <div>
            <label className="form-label">Base Token (Contract Address)</label>
            <input
              type="text"
              required
              pattern="C[A-Z0-9]{55}"
              title="Must be a Soroban contract address starting with C"
              value={form.baseToken}
              onChange={(e) => update("baseToken", e.target.value)}
              className="form-input"
              style={{ fontFamily: "monospace", fontSize: 11 }}
              placeholder="CDLZFC3SYJ..."
            />
          </div>
          <div>
            <label className="form-label">Quote Token (Contract Address)</label>
            <input
              type="text"
              required
              pattern="C[A-Z0-9]{55}"
              title="Must be a Soroban contract address starting with C"
              value={form.quoteToken}
              onChange={(e) => update("quoteToken", e.target.value)}
              className="form-input"
              style={{ fontFamily: "monospace", fontSize: 11 }}
              placeholder="CCV3CMLKA6..."
            />
          </div>
        </div>

        <div className="grid-form-2col">
          <div>
            <label className="form-label">Proposal Duration (hours)</label>
            <input
              type="number"
              required
              min={1}
              value={form.proposalDuration}
              onChange={(e) => update("proposalDuration", parseInt(e.target.value))}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Pass Threshold (bps)</label>
            <input
              type="number"
              required
              min={1}
              max={10000}
              value={form.passThresholdBps}
              onChange={(e) => update("passThresholdBps", parseInt(e.target.value))}
              className="form-input"
            />
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
              5000 = 50% (pass price must be above this)
            </p>
          </div>
        </div>

        <div className="grid-form-2col">
          <div>
            <label className="form-label">Min Base Liquidity</label>
            <input
              type="number"
              required
              min={1}
              value={form.minBaseLiquidity}
              onChange={(e) => update("minBaseLiquidity", parseInt(e.target.value))}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">AMM Fee (bps)</label>
            <input
              type="number"
              required
              min={1}
              max={1000}
              value={form.ammFeeBps}
              onChange={(e) => update("ammFeeBps", parseInt(e.target.value))}
              className="form-input"
            />
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>30 = 0.3%</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={!connected || submitting}
          className="btn btn-primary"
          style={{ width: "100%", padding: "14px 24px" }}
        >
          {!connected ? "Connect Wallet First" : submitting ? "Registering..." : "Register DAO"}
        </button>
      </div>
    </form>
  );
}
