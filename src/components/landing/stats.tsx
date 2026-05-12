"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "9", label: "AI Tools Audited" },
  { value: "$340", label: "Avg Monthly Savings" },
  { value: "60s", label: "Audit Time" },
  { value: "0", label: "Signup Required" },
];

export function SocialProof() {
  return (
    <section className="border-y border-[#374151] bg-[#0e0e0f] py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-mono text-3xl font-bold text-[#F8FAFC]">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-[#64748B]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
