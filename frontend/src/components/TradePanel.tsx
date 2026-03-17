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
    const fee = amountIn * 0.003;
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
      await splitTokens({ depositor: address, amount: parseInt(amount), vaultAddress });
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
      alert(`Insufficient ${sellingToken} token balance. You have ${sellingBalance} but are trying to sell ${amountIn}. Split base tokens first to get conditional tokens.`);
      return;
    }
    const estOut = estimateSwapOut(amountIn);
    if (estOut < 1) {
      alert("Amount too small — output rounds to zero. Try a larger amount.");
      return;
    }
    setSubmitting(true);
    try {
      const minOut = Math.floor(estOut * 0.95);
      await swapOnAmm({ user: address, buyPass, amountIn, minAmountOut: minOut, ammAddress });
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
      await mergeTokens({ user: address, amount: parseInt(amount), vaultAddress });
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
  const tabs = state === "Active" ? (["split", "swap", "merge"] as const) : (["redeem"] as const);

  return (
    <div className="card-static" style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Trade — Proposal #{proposalId}</h3>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", color: "var(--text-muted)",
            cursor: "pointer", fontSize: 13, fontFamily: "inherit",
          }}
        >
          Close
        </button>
      </div>

      {/* Market info */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12,
        marginBottom: 16, padding: 12, background: "var(--bg-secondary)", borderRadius: 10,
      }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Pass Price</div>
          <div style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 600, color: "var(--success)" }}>
            {(passPrice * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Fail Price</div>
          <div style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 600, color: "var(--error)" }}>
            {((1 - passPrice) * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Your Pass</div>
          <div style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 600 }}>{passBalance}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Your Fail</div>
          <div style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 600 }}>{failBalance}</div>
        </div>
      </div>

      {/* Pool reserves */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
        marginBottom: 16, padding: 12, background: "var(--bg-secondary)", borderRadius: 10,
      }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Pool Pass Reserves</div>
          <div style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 600 }}>{passReserve}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Pool Fail Reserves</div>
          <div style={{ fontSize: 14, fontFamily: "monospace", fontWeight: 600 }}>{failReserve}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 16, background: "var(--bg-secondary)",
        borderRadius: 10, padding: 4,
      }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 600,
              borderRadius: 8, border: "none", cursor: "pointer",
              fontFamily: "inherit",
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "white" : "var(--text-muted)",
              transition: "all 0.2s",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Split tab */}
      {tab === "split" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            Deposit base tokens to receive equal pass + fail conditional tokens.
          </p>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to split"
            className="form-input"
            style={{ marginBottom: 12 }}
          />
          {amountNum > 0 && (
            <div style={{
              padding: "10px 16px", background: "var(--bg-secondary)", borderRadius: 10,
              marginBottom: 12, fontSize: 13, color: "var(--text-secondary)",
            }}>
              You&apos;ll receive <strong style={{ color: "white" }}>{amountNum}</strong> pass + <strong style={{ color: "white" }}>{amountNum}</strong> fail tokens
            </div>
          )}
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={handleSplit}
            disabled={submitting || !amountNum}
          >
            {submitting ? "Splitting..." : "Split Tokens"}
          </button>
        </div>
      )}

      {/* Swap tab */}
      {tab === "swap" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            Swap conditional tokens on the AMM. Buy pass if you think the proposal will pass.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              className="btn"
              style={{
                flex: 1,
                background: buyPass ? "rgba(66,190,101,0.15)" : "var(--bg-secondary)",
                color: buyPass ? "var(--success)" : "var(--text-muted)",
                border: buyPass ? "1px solid rgba(66,190,101,0.3)" : "1px solid var(--border-color)",
              }}
              onClick={() => setBuyPass(true)}
            >
              Buy Pass
            </button>
            <button
              className="btn"
              style={{
                flex: 1,
                background: !buyPass ? "rgba(250,77,86,0.15)" : "var(--bg-secondary)",
                color: !buyPass ? "var(--error)" : "var(--text-muted)",
                border: !buyPass ? "1px solid rgba(250,77,86,0.3)" : "1px solid var(--border-color)",
              }}
              onClick={() => setBuyPass(false)}
            >
              Buy Fail
            </button>
          </div>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Amount of ${buyPass ? "fail" : "pass"} to sell`}
            className="form-input"
            style={{ marginBottom: 8 }}
          />
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
            Available: {buyPass ? failBalance : passBalance} {buyPass ? "fail" : "pass"} tokens
            {(buyPass ? failBalance : passBalance) === 0 && (
              <span style={{ color: "var(--warning)", marginLeft: 4 }}>— Split base tokens first!</span>
            )}
          </p>
          {amountNum > 0 && (
            <div style={{
              padding: "10px 16px", background: "var(--bg-secondary)", borderRadius: 10,
              marginBottom: 12, fontSize: 13, color: "var(--text-secondary)",
            }}>
              <div>Selling: <strong style={{ color: "white" }}>{amountNum}</strong> {buyPass ? "fail" : "pass"} tokens</div>
              <div>Receiving: ~<strong style={{ color: "white" }}>{estimateSwapOut(amountNum).toFixed(1)}</strong> {buyPass ? "pass" : "fail"} tokens</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Slippage tolerance: 5%</div>
            </div>
          )}
          <button
            className="btn"
            style={{
              width: "100%",
              background: buyPass ? "rgba(66,190,101,0.15)" : "rgba(250,77,86,0.15)",
              color: buyPass ? "var(--success)" : "var(--error)",
              border: buyPass ? "1px solid rgba(66,190,101,0.3)" : "1px solid rgba(250,77,86,0.3)",
              opacity: submitting || !amountNum ? 0.5 : 1,
              cursor: submitting || !amountNum ? "not-allowed" : "pointer",
            }}
            onClick={handleSwap}
            disabled={submitting || !amountNum}
          >
            {submitting ? "Swapping..." : `Buy ${buyPass ? "Pass" : "Fail"}`}
          </button>
        </div>
      )}

      {/* Merge tab */}
      {tab === "merge" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            Burn equal pass + fail tokens to get back base tokens.
          </p>
          <input
            type="number"
            min={1}
            max={Math.min(passBalance, failBalance)}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to merge"
            className="form-input"
            style={{ marginBottom: 8 }}
          />
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
            Max: {Math.min(passBalance, failBalance)} (need equal pass + fail)
          </p>
          <button
            className="btn"
            style={{
              width: "100%",
              background: "rgba(241, 194, 27, 0.15)",
              color: "var(--warning)",
              border: "1px solid rgba(241, 194, 27, 0.3)",
              opacity: submitting || !amountNum ? 0.5 : 1,
              cursor: submitting || !amountNum ? "not-allowed" : "pointer",
            }}
            onClick={handleMerge}
            disabled={submitting || !amountNum}
          >
            {submitting ? "Merging..." : "Merge Tokens"}
          </button>
        </div>
      )}

      {/* Redeem tab */}
      {tab === "redeem" && (
        <div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            {state === "Passed"
              ? "Proposal passed! Redeem your pass tokens 1:1 for base tokens."
              : state === "Failed"
              ? "Proposal failed. Redeem your fail tokens 1:1 for base tokens."
              : "Proposal must be finalized before redeeming."}
          </p>
          {(state === "Passed" || state === "Failed") && (
            <>
              <div style={{
                padding: "10px 16px", background: "var(--bg-secondary)", borderRadius: 10,
                marginBottom: 12, fontSize: 14,
              }}>
                Redeemable: <strong style={{ fontFamily: "monospace" }}>
                  {state === "Passed" ? passBalance : failBalance}
                </strong> tokens
              </div>
              <button
                className="btn"
                style={{
                  width: "100%",
                  background: "rgba(66,190,101,0.15)",
                  color: "var(--success)",
                  border: "1px solid rgba(66,190,101,0.3)",
                  opacity: submitting || (state === "Passed" ? passBalance : failBalance) <= 0 ? 0.5 : 1,
                  cursor: submitting || (state === "Passed" ? passBalance : failBalance) <= 0 ? "not-allowed" : "pointer",
                }}
                onClick={handleRedeem}
                disabled={submitting || (state === "Passed" ? passBalance : failBalance) <= 0}
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
