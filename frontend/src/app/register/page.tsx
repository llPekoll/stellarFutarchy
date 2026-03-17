"use client";

import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
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
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 400, marginBottom: 12 }}>
          Register a <span className="serif-italic" style={{ color: "var(--accent-light)" }}>Futarchy DAO</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Create a permissionless DAO where governance decisions are made by
          prediction markets. Anyone can register — no approval needed.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
