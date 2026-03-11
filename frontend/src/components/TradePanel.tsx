"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "./WalletProvider";
import {
  splitTokens,
  mergeTokens,
  swapOnAmm,
  getAmmReserves,
  getVaultBalances,
  redeemTokens,
} from "@/lib/contracts";

interface TradePanelProps {
  proposalId: number;
  vaultAddress: string;
  ammAddress: string;
  state: "Active" | "Passed" | "Failed";
  onClose: () => void;
  onUpdate: () => void;
}

const SCALE = 1_000_000_000;

export function TradePanel({
  proposalId,
  vaultAddress,
  ammAddress,
  state,
  onClose,
  onUpdate,
}: TradePanelProps) {
  const { address } = useWallet();
  const [tab, setTab] = useState<"split" | "swap" | "merge" | "redeem">(
    state === "Active" ? "split" : "redeem"
  );
  const [amount, setAmount] = useState("");
  const [buyPass, setBuyPass] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passBalance, setPassBalance] = useState<number>(0);
  const [failBalance, setFailBalance] = useState<number>(0);
  const [passReserve, setPassReserve] = useState<number>(0);
  const [failReserve, setFailReserve] = useState<number>(0);

  const fetchBalances = useCallback(async () => {
    if (!address) return;
    try {
      const [balances, reserves] = await Promise.all([
        getVaultBalances(vaultAddress, address),
        getAmmReserves(ammAddress, address),
      ]);
      setPassBalance(Number(balances.pass));
      setFailBalance(Number(balances.fail));
      setPassReserve(Number(reserves.pass));
      setFailReserve(Number(reserves.fail));
    } catch (err) {
      console.error("Failed to fetch balances:", err);
    }
  }, [address, vaultAddress, ammAddress]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const passPrice =
    passReserve + failReserve > 0
      ? failReserve / (passReserve + failReserve)
      : 0.5;

  const estimateSwapOut = (amountIn: number) => {
    if (!amountIn || amountIn <= 0) return 0;
    const fee = amountIn * 0.003; // 30 bps
    const netIn = amountIn - fee;
    const [rIn, rOut] = buyPass
      ? [failReserve, passReserve]
      : [passReserve, failReserve];
    if (rIn <= 0 || rOut <= 0) return 0;
    return (rOut * netIn) / (rIn + netIn);
  };

  const handleSplit = async () => {
    if (!address || !amount) return;
    setSubmitting(true);
    try {
      await splitTokens({
        depositor: address,
        amount: parseInt(amount),
        vaultAddress,
      });
      setAmount("");
      await fetchBalances();
      onUpdate();
    } catch (err) {
      console.error("Split failed:", err);
      alert(`Split failed: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwap = async () => {
    if (!address || !amount) return;
    const amountIn = parseInt(amount);
    const sellingToken = buyPass ? "fail" : "pass";
    const sellingBalance = buyPass ? failBalance : passBalance;
    if (sellingBalance < amountIn) {
      alert(
        `Insufficient ${sellingToken} token balance. You have ${sellingBalance} but are trying to sell ${amountIn}. Split base tokens first to get conditional tokens.`
      );
      return;
    }
    const estOut = estimateSwapOut(amountIn);
    if (estOut < 1) {
      alert("Amount too small — output rounds to zero. Try a larger amount.");
      return;
    }
    setSubmitting(true);
    try {
      const minOut = Math.floor(estOut * 0.95); // 5% slippage
      await swapOnAmm({
        user: address,
        buyPass,
        amountIn,
        minAmountOut: minOut,
        ammAddress,
      });
      setAmount("");
      await fetchBalances();
      onUpdate();
    } catch (err) {
      console.error("Swap failed:", err);
      alert(`Swap failed: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMerge = async () => {
    if (!address || !amount) return;
    setSubmitting(true);
    try {
      await mergeTokens({
        user: address,
        amount: parseInt(amount),
        vaultAddress,
      });
      setAmount("");
      await fetchBalances();
      onUpdate();
    } catch (err) {
      console.error("Merge failed:", err);
      alert(`Merge failed: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedeem = async () => {
    if (!address) return;
    setSubmitting(true);
    try {
      await redeemTokens({ user: address, vaultAddress });
      await fetchBalances();
      onUpdate();
    } catch (err) {
      console.error("Redeem failed:", err);
      alert(`Redeem failed: ${err instanceof Error ? err.message : "Error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const amountNum = parseInt(amount) || 0;

  return (
    <div className="border border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          Trade — Proposal #{proposalId}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white text-sm"
        >
          Close
        </button>
      </div>

      {/* Market info */}
      <div className="grid grid-cols-4 gap-3 mb-5 p-3 bg-gray-900/50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500">Pass Price</p>
          <p className="text-sm font-mono text-green-400">
            {(passPrice * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Fail Price</p>
          <p className="text-sm font-mono text-red-400">
            {((1 - passPrice) * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Your Pass</p>
          <p className="text-sm font-mono text-white">{passBalance}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Your Fail</p>
          <p className="text-sm font-mono text-white">{failBalance}</p>
        </div>
      </div>

      {/* Pool reserves */}
      <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-gray-900/50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500">Pool Pass Reserves</p>
          <p className="text-sm font-mono text-white">{passReserve}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Pool Fail Reserves</p>
          <p className="text-sm font-mono text-white">{failReserve}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-900 rounded-lg p-1">
        {state === "Active" ? (
          <>
            {(["split", "swap", "merge"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${
                  tab === t
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </>
        ) : (
          <button
            onClick={() => setTab("redeem")}
            className="flex-1 py-1.5 text-sm rounded-md bg-indigo-600 text-white"
          >
            Redeem
          </button>
        )}
      </div>

      {/* Split tab */}
      {tab === "split" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            Deposit base tokens to receive equal pass + fail conditional tokens.
          </p>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to split"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          {amountNum > 0 && (
            <p className="text-xs text-gray-500">
              You'll receive {amountNum} pass + {amountNum} fail tokens
            </p>
          )}
          <button
            onClick={handleSplit}
            disabled={submitting || !amountNum}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {submitting ? "Splitting..." : "Split Tokens"}
          </button>
        </div>
      )}

      {/* Swap tab */}
      {tab === "swap" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            Swap conditional tokens on the AMM. Buy pass if you think the
            proposal will pass.
          </p>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setBuyPass(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                buyPass
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Buy Pass (sell fail)
            </button>
            <button
              onClick={() => setBuyPass(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                !buyPass
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Buy Fail (sell pass)
            </button>
          </div>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Amount of ${buyPass ? "fail" : "pass"} to sell`}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500">
            Available to sell: {buyPass ? failBalance : passBalance}{" "}
            {buyPass ? "fail" : "pass"} tokens
            {(buyPass ? failBalance : passBalance) === 0 && (
              <span className="text-amber-400 ml-1">
                — Split base tokens first!
              </span>
            )}
          </p>
          {amountNum > 0 && (
            <div className="p-2 bg-gray-900/50 rounded-lg text-xs text-gray-400">
              <p>
                Selling: {amountNum} {buyPass ? "fail" : "pass"} tokens
              </p>
              <p>
                Receiving: ~{estimateSwapOut(amountNum).toFixed(1)}{" "}
                {buyPass ? "pass" : "fail"} tokens
              </p>
              <p>Slippage tolerance: 5%</p>
            </div>
          )}
          <button
            onClick={handleSwap}
            disabled={submitting || !amountNum}
            className={`w-full py-2 ${
              buyPass
                ? "bg-green-600 hover:bg-green-500"
                : "bg-red-600 hover:bg-red-500"
            } disabled:opacity-50 text-white rounded-lg transition-colors`}
          >
            {submitting
              ? "Swapping..."
              : `Buy ${buyPass ? "Pass" : "Fail"}`}
          </button>
        </div>
      )}

      {/* Merge tab */}
      {tab === "merge" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            Burn equal pass + fail tokens to get back base tokens.
          </p>
          <input
            type="number"
            min={1}
            max={Math.min(passBalance, failBalance)}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to merge"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500">
            Max: {Math.min(passBalance, failBalance)} (need equal pass + fail)
          </p>
          <button
            onClick={handleMerge}
            disabled={submitting || !amountNum}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {submitting ? "Merging..." : "Merge Tokens"}
          </button>
        </div>
      )}

      {/* Redeem tab */}
      {tab === "redeem" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            {state === "Passed"
              ? "Proposal passed! Redeem your pass tokens 1:1 for base tokens."
              : state === "Failed"
              ? "Proposal failed. Redeem your fail tokens 1:1 for base tokens."
              : "Proposal must be finalized before redeeming."}
          </p>
          {(state === "Passed" || state === "Failed") && (
            <>
              <p className="text-sm text-white">
                Redeemable:{" "}
                <span className="font-mono">
                  {state === "Passed" ? passBalance : failBalance}
                </span>{" "}
                tokens
              </p>
              <button
                onClick={handleRedeem}
                disabled={
                  submitting ||
                  (state === "Passed" ? passBalance : failBalance) <= 0
                }
                className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {submitting ? "Redeeming..." : "Redeem Tokens"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
