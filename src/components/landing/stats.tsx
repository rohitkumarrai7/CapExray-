"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const logos = [
  { name: "NEURAL", accent: "X" },
  { name: "SYNTHETIC.", accent: "" },
  { name: "QUANTUM_FLOW", accent: "" },
  { name: "CORE.AI", accent: "" },
];

export function SocialProof() {
  return (
    <section className="border-y border-[#374151] bg-[#0e0e0f] py-12">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-8 text-center font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#64748B]">
          Trusted by founders at Series A startups
        </p>
        <div className="flex flex-wrap items-center justify-center gap-16 opacity-50 grayscale transition-all hover:grayscale-0">
          {logos.map((l, i) => (
            <div key={i} className="font-sans text-xl font-bold text-[#94A3B8]">
              {l.name}
              {l.accent && <span className="text-[#22D3EE]">{l.accent}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
