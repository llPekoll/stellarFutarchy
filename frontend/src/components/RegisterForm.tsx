"use client";

import { useState } from "react";
import { useWallet } from "./WalletProvider";

interface RegisterFormData {
  name: string;
  descriptionUrl: string;
  baseToken: string;
  quoteToken: string;
  proposalDuration: number; // hours
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
    proposalDuration: 72, // 3 days default
    passThresholdBps: 5000, // 50%
    minBaseLiquidity: 1000,
    ammFeeBps: 30, // 0.3%
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
      // TODO: Call register_dao on the DAO factory contract
      // For now, log the form data
      console.log("Registering DAO:", {
        ...form,
        creator: address,
        proposalDuration: form.proposalDuration * 3600, // convert to seconds
      });

      // Simulate success for demo
      setSuccess(true);
    } catch (err) {
      console.error("Failed to register DAO:", err);
      alert("Failed to register DAO. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">&#x2713;</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          DAO Registered!
        </h3>
        <p className="text-gray-400 mb-6">
          Your futarchy DAO has been created. You can now create proposals.
        </p>
        <a
          href="/"
          className="text-indigo-400 hover:text-indigo-300 underline"
        >
          Back to all DAOs
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Project Name
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          placeholder="My Futarchy DAO"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description URL
        </label>
        <input
          type="url"
          required
          value={form.descriptionUrl}
          onChange={(e) => update("descriptionUrl", e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Base Token (Address)
          </label>
          <input
            type="text"
            required
            value={form.baseToken}
            onChange={(e) => update("baseToken", e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            placeholder="C..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Quote Token (Address)
          </label>
          <input
            type="text"
            required
            value={form.quoteToken}
            onChange={(e) => update("quoteToken", e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            placeholder="C..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Proposal Duration (hours)
          </label>
          <input
            type="number"
            required
            min={1}
            value={form.proposalDuration}
            onChange={(e) =>
              update("proposalDuration", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Pass Threshold (bps)
          </label>
          <input
            type="number"
            required
            min={1}
            max={10000}
            value={form.passThresholdBps}
            onChange={(e) =>
              update("passThresholdBps", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            5000 = 50% (pass price must be above this)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Min Base Liquidity
          </label>
          <input
            type="number"
            required
            min={1}
            value={form.minBaseLiquidity}
            onChange={(e) =>
              update("minBaseLiquidity", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            AMM Fee (bps)
          </label>
          <input
            type="number"
            required
            min={1}
            max={1000}
            value={form.ammFeeBps}
            onChange={(e) => update("ammFeeBps", parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">30 = 0.3%</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!connected || submitting}
        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
      >
        {!connected
          ? "Connect Wallet First"
          : submitting
          ? "Registering..."
          : "Register DAO"}
      </button>
    </form>
  );
}
