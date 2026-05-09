"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function Features() {
  return (
    <section className="bg-[#131314] px-4 py-24 md:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-12">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative h-[400px] overflow-hidden rounded-xl border border-[#374151] bg-[#201f20] p-6 md:col-span-8"
        >
          <div className="relative z-10">
            <h3 className="mb-2 font-sans text-[32px] font-semibold text-[#22D3EE]">
              Deep Cluster Analytics
            </h3>
            <p className="max-w-sm text-[#94A3B8]">
              Identify orphaned instances and zombie processes with sub-second latency tracking across multi-cloud environments.
            </p>
          </div>
          {/* Placeholder for the image area */}
          <div className="absolute bottom-0 right-0 flex h-2/3 w-2/3 items-center justify-center rounded-tl-xl border-l border-t border-[#374151] opacity-60">
            <div className="grid w-full grid-cols-3 gap-2 p-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-[#2a2a2b]" />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cyan feature card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex h-[400px] flex-col justify-between rounded-xl bg-[#22D3EE] p-6 md:col-span-4"
        >
          <Zap className="size-10 text-[#131314]" />
          <div>
            <h3 className="mb-2 font-sans text-xl font-semibold text-[#131314]">
              Instant Optimization
            </h3>
            <p className="mb-6 font-sans text-sm text-[#131314]/80">
              Apply automated remediation scripts that trim fat without compromising performance.
            </p>
            <button className="rounded-lg bg-[#131314] px-6 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#22D3EE]">
              Explore Toolkit
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
