"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="diagnostic-grid relative flex min-h-[795px] flex-col items-center justify-center overflow-hidden px-4 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#131314] via-transparent to-[#131314]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-1 rounded-full border border-[#374151] bg-[#201f20] px-4 py-1"
        >
          <span className="flex size-2 animate-pulse rounded-full bg-[#22D3EE]" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#22D3EE]">
            Precision Infrastructure Audit
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 font-sans text-[32px] font-bold leading-[1.2] tracking-tight text-[#F8FAFC] md:text-[48px]"
        >
          Ex-ray your <span className="text-[#22D3EE]">AI spend</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-12 max-w-2xl font-sans text-base text-[#94A3B8]"
        >
          Stop the bleeding. Our clinical-grade diagnostic engine identifies sub-millisecond inefficiencies in your GPU clusters and API calls with surgical precision.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-24 flex flex-col items-center justify-center gap-4 md:flex-row"
        >
          <Link
            href="/diagnose"
            className="flex h-14 w-full items-center justify-center rounded-lg bg-[#10B981] px-12 font-sans text-base font-bold text-[#2c303b] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] md:w-auto"
          >
            Start Free Diagnostic
          </Link>
          <button className="flex h-14 w-full items-center justify-center rounded-lg border border-[#374151] px-12 font-sans text-base font-bold text-[#F8FAFC] transition-colors hover:bg-[#201f20] md:w-auto">
            Book Technical Deep-dive
          </button>
        </motion.div>

        {/* Telemetry Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="group relative mx-auto max-w-md"
        >
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#22D3EE] to-[#6366F1] opacity-25 blur transition duration-1000 group-hover:opacity-50" />
          <div className="relative flex items-center justify-between rounded-xl border border-[#374151] bg-[#201f20] p-6 shadow-2xl">
            <div className="flex flex-col items-start">
              <span className="mb-1 font-mono text-xs font-medium uppercase text-[#64748B]">
                Live Diagnostics
              </span>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 text-[#F43F5E]">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
                <span className="font-mono text-xl font-bold text-[#F43F5E]">
                  24.8% Leakage Detected
                </span>
              </div>
            </div>
            <div className="hidden h-12 w-24 items-end gap-[2px] rounded border border-[#374151] bg-[#2a2a2b] p-1 sm:flex">
              {[40, 60, 90, 70, 100].map((h, i) => (
                <div key={i} className="w-1 bg-[#F43F5E]" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
