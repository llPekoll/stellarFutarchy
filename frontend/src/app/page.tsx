"use client";

import { DaoCard } from "@/components/DaoCard";
import Link from "next/link";

// Demo data — in production this comes from contract queries or event indexing
const DEMO_DAOS = [
  {
    id: "demo-1",
    name: "Stellar DeFi Collective",
    description:
      "A futarchy-governed fund for Stellar DeFi protocol development. Proposals are decided by prediction markets.",
    baseToken: "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
    proposalCount: 3,
    creator: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM",
  },
  {
    id: "demo-2",
    name: "Lumen Grants DAO",
    description:
      "Community-driven grants program using futarchy to allocate XLM to ecosystem projects.",
    baseToken: "CBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    proposalCount: 1,
    creator: "GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Futarchy DAOs</h1>
          <p className="text-gray-400">
            Governance through prediction markets. Let markets decide.
          </p>
        </div>
        <Link
          href="/register"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
        >
          Register New DAO
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEMO_DAOS.map((dao) => (
          <DaoCard key={dao.id} {...dao} />
        ))}
      </div>

      {DEMO_DAOS.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No DAOs registered yet.</p>
          <p>Be the first to create a futarchy DAO on Stellar!</p>
        </div>
      )}
    </div>
  );
}
