"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="diagnostic-grid relative flex min-h-[795px] flex-col items-center justify-center overflow-hidden px-4 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#131314] via-transparent to-[#131314]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-1 rounded-full border border-[#374151] bg-[#201f20] px-4 py-1"
        >
          <span className="flex size-2 animate-pulse rounded-full bg-[#10B981]" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-[#10B981]">
            Free AI Spend Audit
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 font-sans text-[32px] font-bold leading-[1.2] tracking-tight text-[#F8FAFC] md:text-[48px]"
        >
          Cut Your AI Stack Cost by{" "}
          <span className="gradient-text">40% in 60 Seconds</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mb-12 max-w-2xl font-sans text-base text-[#94A3B8]"
        >
          Free audit for Cursor, ChatGPT, Claude &amp; 6 more tools. No signup
          required.
        </motion.p>

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
            Audit My Stack — It&apos;s Free
          </Link>
          <Link
            href="#how-it-works"
            className="flex h-14 w-full items-center justify-center rounded-lg border border-[#374151] px-12 font-sans text-base font-bold text-[#F8FAFC] transition-colors hover:bg-[#201f20] md:w-auto"
          >
            See How It Works
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="group relative mx-auto max-w-md"
        >
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#10B981] to-[#6366F1] opacity-25 blur transition duration-1000 group-hover:opacity-50" />
          <div className="relative flex items-center justify-between rounded-xl border border-[#374151] bg-[#201f20] p-6 shadow-2xl">
            <div className="flex flex-col items-start">
              <span className="mb-1 font-mono text-xs font-medium uppercase text-[#64748B]">
                Average Savings Found
              </span>
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5 text-[#10B981]"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="font-mono text-xl font-bold text-[#10B981]">
                  $340/mo Saved
                </span>
              </div>
            </div>
            <div className="hidden h-12 w-24 items-end gap-[2px] rounded border border-[#374151] bg-[#2a2a2b] p-1 sm:flex">
              {[40, 60, 90, 70, 100].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#10B981]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
