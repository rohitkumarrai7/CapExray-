"use client";

import { motion } from "framer-motion";
import { Layers, Microscope, FileText } from "lucide-react";

const steps = [
  {
    phase: "PHASE 01",
    title: "Input Stack",
    desc: "Connect your cloud providers and API gateways via secure, read-only telemetry bridges.",
    icon: Layers,
    borderColor: "border-l-[#22D3EE]",
    iconColor: "text-[#22D3EE]",
  },
  {
    phase: "PHASE 02",
    title: "AI Diagnostic",
    desc: "Our engine scans every request, detecting pattern anomalies and token inefficiencies in real-time.",
    icon: Microscope,
    borderColor: "border-l-[#F59E0B]",
    iconColor: "text-[#F59E0B]",
  },
  {
    phase: "PHASE 03",
    title: "Instant Report",
    desc: "Receive a comprehensive surgical plan to reclaim wasted spend and optimize cluster health.",
    icon: FileText,
    borderColor: "border-l-[#10B981]",
    iconColor: "text-[#10B981]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="mb-16 text-center">
        <h2 className="mb-4 font-sans text-[32px] font-semibold tracking-tight text-[#F8FAFC]">
          Surgical Workflow
        </h2>
        <p className="mx-auto max-w-xl text-[#94A3B8]">
          Precision diagnostic execution through our proprietary three-stage infrastructure audit.
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
