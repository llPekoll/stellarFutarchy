"use client";

import { useWallet } from "./WalletProvider";

export function ConnectWallet() {
  const { address, connected, connecting, connect, disconnect } = useWallet();

  if (connected && address) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button className="btn btn-wallet" onClick={() => {}}>
          <span className="wallet-dot" />
          {address.slice(0, 4)}...{address.slice(-4)}
        </button>
        <button className="btn btn-outline btn-sm" onClick={disconnect}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary"
      onClick={connect}
      disabled={connecting}
    >
      {connecting ? "Connecting..." : "Sign in"}
    </button>
  );
}
