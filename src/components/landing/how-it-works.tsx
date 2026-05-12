"use client";

import { motion } from "framer-motion";
import { ClipboardList, Zap, Share2 } from "lucide-react";

const steps = [
  {
    phase: "STEP 1",
    title: "Enter your AI tools & plans",
    desc: "Tell us which AI tools your team uses, what plans you're on, and how many seats. Takes 60 seconds.",
    icon: ClipboardList,
    borderColor: "border-l-[#22D3EE]",
    iconColor: "text-[#22D3EE]",
  },
  {
    phase: "STEP 2",
    title: "Get instant savings audit",
    desc: "Our audit engine analyzes your stack for plan optimization, overlaps, and billing inefficiencies in real-time.",
    icon: Zap,
    borderColor: "border-l-[#F59E0B]",
    iconColor: "text-[#F59E0B]",
  },
  {
    phase: "STEP 3",
    title: "Share results & save",
    desc: "Get a shareable report with specific recommendations. Share with your team or CFO and start saving immediately.",
    icon: Share2,
    borderColor: "border-l-[#10B981]",
    iconColor: "text-[#10B981]",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl px-4 py-24 md:px-6"
    >
      <div className="mb-16 text-center">
        <h2 className="mb-4 font-sans text-[32px] font-semibold tracking-tight text-[#F8FAFC]">
          How It Works
        </h2>
        <p className="mx-auto max-w-xl text-[#94A3B8]">
          Three steps to a leaner AI stack. No signup, no credit card, no
          BS.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`group bg-[#131314] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 ${step.borderColor}`}
            style={{ borderLeftWidth: "4px" }}
          >
            <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-[#2a2a2b]">
              <step.icon className={`size-5 ${step.iconColor}`} />
            </div>
            <span className="mb-1 block font-mono text-xs font-medium uppercase text-[#64748B]">
              {step.phase}
            </span>
            <h3 className="mb-2 font-sans text-xl font-semibold text-[#F8FAFC]">
              {step.title}
            </h3>
            <p className="font-sans text-sm text-[#94A3B8]">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
