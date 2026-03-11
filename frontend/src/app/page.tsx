"use client";

import { useEffect, useState } from "react";
import { DaoCard } from "@/components/DaoCard";
import { listDaos, type DaoEntry } from "@/lib/contracts";
import { FACTORY_CONTRACT_ID } from "@/lib/constants";
import Link from "next/link";

export default function HomePage() {
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

      {loading ? (
        <div className="text-center py-16 text-gray-500">
          Loading DAOs from chain...
        </div>
      ) : daos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No DAOs registered yet.</p>
          <p>Be the first to create a futarchy DAO on Stellar!</p>
        </div>
      )}
    </div>
  );
}
