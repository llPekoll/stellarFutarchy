"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DaoCard } from "@/components/DaoCard";
import { listDaos, type DaoEntry } from "@/lib/contracts";
import { FACTORY_CONTRACT_ID } from "@/lib/constants";

export default function ProjectsPage() {
  const [daos, setDaos] = useState<DaoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDaos() {
      if (!FACTORY_CONTRACT_ID) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const entries = await listDaos();
        setDaos(entries);
      } catch (err) {
        console.error("Failed to fetch DAOs:", err);
        setDaos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDaos();
  }, []);

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
        Back to home
      </Link>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 400, marginBottom: 8 }}>
            All <span className="serif-italic" style={{ color: "var(--accent-light)" }}>Projects</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Browse all futarchy DAOs launched on Stellar. Join a community and trade on governance proposals.
          </p>
        </div>
        <Link href="/register" className="btn btn-primary">Launch a DAO</Link>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 0", borderTop: "1px solid var(--border-color)", marginBottom: 24,
      }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {daos.length} projects launched to-date
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "var(--text-muted)" }}>
          Loading DAOs from chain...
        </div>
      ) : daos.length > 0 ? (
        <div className="grid-3cards">
          {daos.map((dao) => (
            <DaoCard
              key={dao.contract_id}
              id={dao.contract_id}
              name={dao.name}
              description=""
              baseToken=""
              proposalCount={0}
              creator={dao.creator}
            />
          ))}
        </div>
      ) : (
        <div className="card-static" style={{ textAlign: "center", padding: 48 }}>
          <p style={{ fontSize: 18, marginBottom: 8 }}>No DAOs registered yet.</p>
          <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
            Be the first to create a futarchy DAO on Stellar!
          </p>
          <Link href="/register" className="btn btn-primary">Register DAO</Link>
        </div>
      )}
    </div>
  );
}
