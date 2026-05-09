"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "CapExray showed us we were paying for ChatGPT Team AND Claude Team. We dropped one and saved $600/month.",
    author: "Sarah K.",
    role: "CTO at DevFlow",
  },
  {
    quote:
      "Had no idea Cursor Pro was cheaper than Copilot Business for our team. Switched in 5 minutes after seeing the diagnosis.",
    author: "Marcus R.",
    role: "Engineering Lead at ShipFast",
  },
  {
    quote:
      "The API spend analysis alone found $2,400/year. This should be mandatory for every startup.",
    author: "Priya M.",
    role: "Founder at DataPulse",
  },
];

export function Testimonials() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          What teams are saying
        </h2>
        <p className="mt-4 text-muted-foreground">
          Real feedback from teams diagnosing their AI spend.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card relative flex flex-col gap-4 rounded-xl p-6 text-left"
            >
              <Quote className="size-6 text-[#10b981]/40" />
              <p className="flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <p className="absolute right-4 bottom-4 text-[10px] italic text-muted-foreground/40">
                mocked for demo
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
