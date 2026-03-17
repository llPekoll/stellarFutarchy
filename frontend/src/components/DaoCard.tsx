"use client";

import Link from "next/link";

interface DaoCardProps {
  id: string;
  name: string;
  description: string;
  baseToken: string;
  proposalCount: number;
  creator: string;
}

export function DaoCard({
  id,
  name,
  description,
  baseToken,
  proposalCount,
  creator,
}: DaoCardProps) {
  return (
    <Link href={`/dao/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="card" style={{ cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(15, 98, 254, 0.15)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
            </svg>
          </div>
          <span className="badge badge-active">
            {proposalCount} proposals
          </span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{name}</div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>
          {description || "Futarchy governance DAO"}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Token</div>
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>
              {baseToken ? `${baseToken.slice(0, 8)}...` : "—"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Creator</div>
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace" }}>
              {creator.slice(0, 4)}...{creator.slice(-4)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
