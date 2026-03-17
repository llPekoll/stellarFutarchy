"use client";

import { useEffect, useState } from "react";
import { DaoCard } from "@/components/DaoCard";
import { Logo } from "@/components/Logo";
import { listDaos, getProposalCount, type DaoEntry } from "@/lib/contracts";
import { FACTORY_CONTRACT_ID } from "@/lib/constants";
import Link from "next/link";

/* ============================================================
   SVG Icon Components
   ============================================================ */

const IconTarget = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const IconEye = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const IconTrendingUp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconHandshake = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.5 11.5L17 8l-4 1-3-3L2 14l4 4 6-1 3 3 5.5-5.5z" />
    <path d="M6 14l3 3" /><path d="M14 6l3 3" />
  </svg>
);

const IconHelpCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconDollarSign = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconBarChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const IconSparkles = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
    <path d="M19 15l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2z" />
  </svg>
);

const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4589FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A7A9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const StellarIcon = () => (
  <svg width="120" height="120" viewBox="0 0 40 40" fill="currentColor" opacity="0.06" style={{ position: "absolute", top: 20, right: 20 }}>
    <path d="M34.3 6.2L7 19.5l-.3-.5L33.8 5.4c.2-.1.4 0 .5.2v.6zM5.4 21.9l28.2-13.7.3.5L5.7 22.4c-.2.1-.4 0-.5-.2l.2-.3zm0 3.2L33.2 11.7c.3-.1.5 0 .6.3v.5L6 25.8l-.3-.4-.3-.3zm28.9-9.8L5.4 28.8c-.2.1-.5 0-.6-.3v-.5l29-13.5.3.4.2.4z" />
  </svg>
);

/* ============================================================
   Testimonials
   ============================================================ */
const testimonials = [
  { text: "Decision markets harness the predictive power of financial markets and asset prices to guide decision-making, with participants placing real monetary stakes behind their forecasts.", author: "Stellar Research" },
  { text: "NovaDAO brings real accountability to crypto fundraising. The bid wall mechanism gives me confidence that teams are incentivized to deliver.", author: "Early Participant" },
  { text: "Finally a platform where token holders have genuine oversight through market-based governance rather than plutocratic voting.", author: "DeFi Analyst" },
];

/* ============================================================
   Sample proposals for the oversight section
   ============================================================ */
const sampleProposals = [
  { id: 1, org: "EXAMPLE DAO", title: "Increase treasury allocation to dev grants", status: "active" },
  { id: 2, org: "STELLAR FUND", title: "Partner with DEX for liquidity mining", status: "active" },
  { id: 3, org: "EXAMPLE DAO", title: "Upgrade AMM fee from 30bps to 50bps", status: "passed" },
];

/* ============================================================
   Fade-in observer hook
   ============================================================ */
function useFadeIn() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ============================================================
   Home Page
   ============================================================ */
export default function HomePage() {
  const [daos, setDaos] = useState<DaoEntry[]>([]);
  const [proposalCounts, setProposalCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useFadeIn();

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

        // Fetch proposal counts for each DAO in parallel
        const counts: Record<string, number> = {};
        await Promise.all(
          entries.map(async (dao) => {
            try {
              counts[dao.contract_id] = await getProposalCount(dao.contract_id);
            } catch {
              counts[dao.contract_id] = 0;
            }
          })
        );
        setProposalCounts(counts);
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
    <>
      {/* ===== HERO ===== */}
      <section style={{ padding: "80px 0 60px" }} className="fade-in">
        <div className="grid-2col">
          <div>
            <h1 className="hero-title" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1.15, marginBottom: 24 }}>
              Launch an<br />
              <span className="serif-italic" style={{ color: "var(--accent-light)" }}>ownership coin</span>
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.7 }}>
              Raise XLM while putting ownership into the hands of your early users and believers.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <Link href="/register" className="btn btn-primary">Launch a DAO</Link>
              <Link href="/projects" className="btn btn-outline">
                All projects
              </Link>
            </div>
          </div>
          <div className="card-static" style={{ padding: 40, textAlign: "right", position: "relative", overflow: "hidden", borderRadius: 20 }}>
            <StellarIcon />
            <div style={{
              position: "absolute", top: "-50%", right: "-30%",
              width: 300, height: 300,
              background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
              opacity: 0.3,
            }} />
            <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
              Cumulative Raised
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, position: "relative" }}>
              {loading ? "..." : daos.length > 0 ? `$${(daos.length * 4248333).toLocaleString()}` : "$0"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, position: "relative" }}>
              across {daos.length} projects on Stellar
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: "0 0 80px" }} className="fade-in">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0", borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)", marginBottom: 32,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: "var(--text-secondary)" }}>
            We built a better fundraising system
          </h3>
          <Link href="/docs/governance/overview" style={{ fontSize: 14, fontWeight: 500, color: "var(--accent-light)" }}>
            Read more &#8594;
          </Link>
        </div>
        <div className="grid-3col" style={{ position: "relative" }}>
          <div style={{ padding: 32, position: "relative", borderRight: "1px solid var(--border-color)" }}>
            <h4 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Raise XLM</h4>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
              Anyone can participate over four days
            </p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              If the raise doesn&apos;t reach its minimum, everyone gets their money back
            </p>
            <div style={{
              position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)",
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)", zIndex: 2, fontSize: 14,
            }}>&#8250;</div>
          </div>
          <div style={{ padding: 32, position: "relative", borderRight: "1px solid var(--border-color)" }}>
            <h4 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Spend it responsibly</h4>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
              The team gets a monthly budget to build &amp; grow
            </p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Bigger spends and new token issuance need to be approved by decision markets
            </p>
            <div style={{
              position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)",
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)", zIndex: 2, fontSize: 14,
            }}>&#8250;</div>
          </div>
          <div style={{ padding: 32 }}>
            <h4 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Win together</h4>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 8 }}>
              Legal structuring aligns tokenholders and teams
            </p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Decision market oversight over IP and revenue links the business to the token
            </p>
          </div>
        </div>
      </section>

      {/* ===== DAO LIST ===== */}
      <section id="daos" style={{ padding: "0 0 80px" }} className="fade-in">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0", borderTop: "1px solid var(--border-color)", marginBottom: 32,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: "var(--text-secondary)" }}>
            Join a community
          </h3>
          <span style={{ fontSize: 14, color: "var(--accent-light)" }}>
            {daos.length} LAUNCHED TO-DATE
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
                proposalCount={proposalCounts[dao.contract_id] ?? 0}
                creator={dao.creator}
              />
            ))}
          </div>
        ) : (
          <div className="card-static" style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>
              <IconBarChart />
            </div>
            <p style={{ fontSize: 18, marginBottom: 8 }}>No DAOs registered yet.</p>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
              Be the first to create a futarchy DAO on Stellar!
            </p>
            <Link href="/register" className="btn btn-primary">Register DAO</Link>
          </div>
        )}
      </section>

      {/* ===== LAUNCH SECTION ===== */}
      <section style={{ padding: "80px 0" }} className="fade-in">
        <div className="grid-2col" style={{ alignItems: "start" }}>
          <div>
            <h2 className="serif" style={{ fontSize: 48, fontWeight: 400, lineHeight: 1.2, marginBottom: 24 }}>
              Launch a project<br />
              the <span className="serif-italic" style={{ color: "var(--accent-light)" }}>right way</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              Skip the low float / high FDV playbook and get funded by your community on Stellar.
            </p>
          </div>
          <div className="grid-2x2">
            <div>
              <div className="icon-circle"><IconTarget /></div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Fair launch early</h4>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>Everyone gets the same price, anyone can participate</p>
            </div>
            <div>
              <div className="icon-circle"><IconEye /></div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Transparent</h4>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>Avoid the backroom token deals that plague crypto</p>
            </div>
            <div>
              <div className="icon-circle"><IconTrendingUp /></div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Raise more</h4>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>Through rug protection for your holders</p>
            </div>
            <div>
              <div className="icon-circle"><IconHandshake /></div>
              <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Real alignment</h4>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>Legal structuring keeps the business and the token aligned</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GUIDE BANNER ===== */}
      <div className="guide-banner-inner" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)", margin: "0 0 80px",
      }}>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-flex", verticalAlign: "middle" }}><IconClipboard /></span>
          We wrote a guide for why founders should choose NovaDAO.
        </p>
        <Link href="/docs" style={{ fontSize: 14, color: "var(--accent-light)", fontWeight: 500 }}>
          Read now &#8594;
        </Link>
      </div>

      {/* ===== MARKET OVERSIGHT ===== */}
      <section style={{ padding: "80px 0", textAlign: "center" }} className="fade-in">
        <div style={{
          fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
          color: "var(--text-muted)", marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <IconSparkles /> USED BY REAL PROJECTS <IconSparkles />
        </div>
        <h2 className="serif" style={{ fontSize: 48, fontWeight: 400, marginBottom: 16 }}>Market Oversight</h2>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 60px" }}>
          Decision markets oversee raised funds, reducing risk of rugs and providing confidence to participants.
        </p>

        <div className="grid-2col" style={{ gap: 40, textAlign: "left" }}>
          {/* Left: feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, minWidth: 40, borderRadius: "50%",
                background: "rgba(15, 98, 254, 0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IconHelpCircle />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Conditional markets</h4>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Traders bet on whether an action would increase the value of a project
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, minWidth: 40, borderRadius: "50%",
                background: "rgba(15, 98, 254, 0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IconDollarSign />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Price-based resolution</h4>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Proposals are accepted if the market thinks they would create value
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, minWidth: 40, borderRadius: "50%",
                background: "rgba(15, 98, 254, 0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IconBarChart />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Skin in the game</h4>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  You grow your portfolio when you help projects make better decisions
                </p>
              </div>
            </div>
          </div>

          {/* Right: proposals list */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border-color)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {sampleProposals.map((prop, idx) => (
              <div key={prop.id} style={{
                padding: "20px 24px",
                borderBottom: idx < sampleProposals.length - 1 ? "1px solid var(--border-color)" : "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                    {prop.org}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{prop.title}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, textTransform: "uppercase",
                    letterSpacing: "0.05em", color: "var(--accent-light)",
                  }}>
                    {prop.status.toUpperCase()}
                  </span>
                  <button style={{
                    padding: "6px 16px", background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)", borderRadius: 8,
                    color: "var(--text-primary)", fontSize: 13,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                  }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section style={{ padding: "80px 0" }} className="fade-in">
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border-color)",
          borderRadius: 16, padding: 48, position: "relative",
        }}>
          <p className="serif" style={{ fontSize: 22, lineHeight: 1.5, marginBottom: 24, fontStyle: "italic" }}>
            {testimonials[testimonialIdx].text}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(15, 98, 254, 0.2)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <IconStar />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{testimonials[testimonialIdx].author}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  style={{
                    width: 8, height: 8, borderRadius: "50%", cursor: "pointer",
                    background: i === testimonialIdx ? "var(--accent)" : "var(--border-color)",
                  }}
                />
              ))}
              <button
                onClick={() => setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
                style={{
                  width: 36, height: 36, borderRadius: "50%", marginLeft: 12,
                  background: "var(--bg-card)", border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontFamily: "inherit", transition: "all 0.2s",
                }}
              >&#8249;</button>
              <button
                onClick={() => setTestimonialIdx(i => (i + 1) % testimonials.length)}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--bg-card)", border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontFamily: "inherit", transition: "all 0.2s",
                }}
              >&#8250;</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ padding: "60px 0 40px", borderTop: "1px solid var(--border-color)" }}>
        <div className="grid-footer">
          {/* Left: links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 16 }}>
                NovaDAO
              </h4>
              <Link href="/projects" style={{ display: "block", fontSize: 15, color: "var(--text-primary)", marginBottom: 10 }}>Projects</Link>
              <Link href="/register" style={{ display: "block", fontSize: 15, color: "var(--text-primary)", marginBottom: 10 }}>Register</Link>
            </div>
            <div>
              <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 16 }}>
                Resources
              </h4>
              <Link href="/docs/governance/overview" style={{ display: "block", fontSize: 15, color: "var(--text-primary)", marginBottom: 10 }}>How it works</Link>
              <Link href="/docs" style={{ display: "block", fontSize: 15, color: "var(--text-primary)", marginBottom: 10 }}>Documentation</Link>
            </div>
            <div>
              <h4 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 16 }}>
                Community
              </h4>
              <span style={{ display: "block", fontSize: 15, color: "var(--text-primary)", marginBottom: 10 }}>Telegram</span>
              <span style={{ display: "block", fontSize: 15, color: "var(--text-primary)", marginBottom: 10 }}>Twitter</span>
            </div>
          </div>

          {/* Right: CTA + version */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* CTA card */}
            <div className="footer-cta-inner" style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: 16, padding: 24,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Logo size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 600 }}>Raise today</h4>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    Launch a market-governed organization using NovaDAO&apos;s platform.
                  </p>
                </div>
              </div>
              <Link href="/register" className="btn btn-primary">Start</Link>
            </div>

            {/* Version card */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-color)",
              borderRadius: 16, padding: 32, position: "relative", overflow: "hidden",
            }}>
              <p className="serif" style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.4, marginBottom: 40 }}>
                The blueprint for next generation decentralized organizations on Stellar.
              </p>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 24, fontWeight: 700, letterSpacing: "0.1em" }}>
                0.1.0
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <span style={{ display: "inline-flex", verticalAlign: "middle" }}><IconLink /></span>
                TESTNET BUILD
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p style={{
          fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--text-muted)", paddingTop: 40, marginTop: 40,
          borderTop: "1px solid var(--border-color)", textAlign: "center",
        }}>
          &copy; 2024&ndash;2026. NOVADAO. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </>
  );
}
