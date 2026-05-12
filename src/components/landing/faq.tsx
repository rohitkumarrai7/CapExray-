"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How is my data handled?",
    a: "Zero-retention by default. Your stack data is processed in ephemeral memory and purged immediately after the report is generated. No training on user data.",
  },
  {
    q: "Why is the audit free?",
    a: "The initial audit proves the value of CapExray. We only charge for continuous monitoring and automated remediation tools. The audit itself is and will remain free.",
  },
  {
    q: "Do I need to connect my billing?",
    a: "No. You manually enter your AI tools and plans. No bank access, no SSO, no OAuth. Your financial data stays on your screen.",
  },
  {
    q: "Which tools are supported?",
    a: "Cursor, GitHub Copilot, ChatGPT, Claude, Gemini, Windsurf, Anthropic API, and OpenAI API — covering 95% of startup AI spend.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 md:px-6">
      <h2 className="mb-12 text-center font-sans text-[32px] font-semibold tracking-tight text-[#F8FAFC]">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.details
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group rounded-lg border border-[#374151] bg-[#201f20]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-sans text-base font-semibold text-[#F8FAFC]">
              {faq.q}
              <ChevronDown className="ml-2 size-4 shrink-0 text-[#64748B] transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p className="px-6 pb-6 font-sans text-sm text-[#94A3B8]">{faq.a}</p>
          </motion.details>
        ))}
      </div>
    </section>
  );
}
