"use client";

import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Register a Futarchy DAO</h1>
        <p className="text-gray-400">
          Create a permissionless DAO where governance decisions are made by
          prediction markets. Anyone can register — no approval needed.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
