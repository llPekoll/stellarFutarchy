"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ConnectWallet } from "./ConnectWallet";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <Logo />
          NovaDAO
        </Link>
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
        <div className={`navbar-links${menuOpen ? " open" : ""}`}>
          <Link href="/projects" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>
            All projects
          </Link>
          <Link href="/register" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>
            Register
          </Link>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
