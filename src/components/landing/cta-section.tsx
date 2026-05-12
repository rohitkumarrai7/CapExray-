import Link from "next/link";

export function CTASection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center md:px-6">
      <h2 className="mb-8 font-sans text-[32px] font-semibold tracking-tight text-[#F8FAFC]">
        Ready to cut your AI tool spend?
      </h2>
      <p className="mx-auto mb-12 max-w-xl text-[#94A3B8]">
        Join founders and engineering managers using CapExray to find savings
        across Cursor, ChatGPT, Claude, and 6 more AI tools.
      </p>
      <Link
        href="/diagnose"
        className="inline-flex h-14 items-center justify-center rounded-lg bg-[#10B981] px-16 text-lg font-extrabold text-[#2c303b] transition-all hover:scale-105"
      >
        Audit My Stack — It&apos;s Free
      </Link>
    </section>
  );
}
