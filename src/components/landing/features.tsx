"use client";

import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Calculator, Eye, Calendar } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Plan Optimization",
      desc: "Find out if you're on the wrong plan — downgrade, switch to annual billing, or eliminate overlapping tools.",
      icon: Zap,
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10",
    },
    {
      title: "Stack Overlap Detection",
      desc: "Identify when you're paying for Cursor AND Copilot, or ChatGPT AND Claude — and get consolidation recommendations.",
      icon: Shield,
      color: "text-[#22D3EE]",
      bg: "bg-[#22D3EE]/10",
    },
    {
      title: "Spend Benchmarking",
      desc: "See how your AI spend per developer compares to similar-stage startups. Know if you're overpaying.",
      icon: BarChart3,
      color: "text-[#6366F1]",
      bg: "bg-[#6366F1]/10",
    },
    {
      title: "What-If Scenarios",
      desc: "Model annual billing savings, tool consolidation, and full optimization before making changes.",
      icon: Calculator,
      color: "text-[#A855F7]",
      bg: "bg-[#A855F7]/10",
    },
    {
      title: "Shadow IT Estimate",
      desc: "Based on team size and use case, estimate how many AI tools your team is using that aren't accounted for.",
      icon: Eye,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10",
    },
    {
      title: "Renewal Calendar",
      desc: "Track team and enterprise plans with auto-renewal risk. Get negotiation tips before your contract renews.",
      icon: Calendar,
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10",
    },
  ];

  return (
    <section className="bg-[#131314] px-4 py-24 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-sans text-[32px] font-semibold tracking-tight text-[#F8FAFC]">
            Audit 9 AI Tools in Seconds
          </h2>
          <p className="mx-auto max-w-xl text-[#94A3B8]">
            From Cursor to ChatGPT to Claude — get instant, actionable
            recommendations for every tool in your AI stack.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl border border-[#374151] bg-[#201f20] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#374151]/80"
            >
              <div
                className={`mb-4 flex size-12 items-center justify-center rounded-lg ${feature.bg}`}
              >
                <feature.icon className={`size-5 ${feature.color}`} />
              </div>
              <h3 className="mb-2 font-sans text-lg font-semibold text-[#F8FAFC]">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-[#94A3B8]">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
