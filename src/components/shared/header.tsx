"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed left-0 top-0 z-[100] flex h-16 w-full items-center justify-between border-b border-[#374151]/30 bg-[#131314]/80 px-4 glass-blur shadow-sm md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" className="size-5 text-[#c3c6d4]" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
        </svg>
        <span className="font-sans text-xl font-bold tracking-tight text-[#c3c6d4]">CapExray</span>
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        <a href="#how-it-works" className="font-mono text-xs text-[#94A3B8] transition-colors hover:text-[#F8FAFC] rounded px-2 py-1">How It Works</a>
        <a href="#faq" className="font-mono text-xs text-[#94A3B8] transition-colors hover:text-[#F8FAFC] rounded px-2 py-1">FAQ</a>
        <Link href="/diagnose" className="rounded bg-[#10B981] px-4 py-2 font-mono text-xs font-bold text-[#2c303b] transition-transform active:scale-95">
          Audit My Stack
        </Link>
      </nav>
    </header>
  );
}
