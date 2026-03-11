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
    <Link href={`/dao/${id}`}>
      <div className="border border-gray-800 rounded-xl p-6 hover:border-indigo-500/50 hover:bg-gray-900/50 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
            {proposalCount} proposals
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Token: {baseToken.slice(0, 8)}...</span>
          <span>By: {creator.slice(0, 8)}...</span>
        </div>
      </div>
    </Link>
  );
}
