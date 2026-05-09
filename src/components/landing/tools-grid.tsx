"use client";

import { motion } from "framer-motion";
import { TOOL_PRICING } from "@/lib/pricing-data";

const TOOL_COLORS: Record<string, string> = {
  cursor: "bg-blue-500",
  "github-copilot": "bg-gray-500",
  claude: "bg-orange-500",
  chatgpt: "bg-green-500",
  "anthropic-api": "bg-amber-500",
  "openai-api": "bg-emerald-500",
  gemini: "bg-violet-500",
  windsurf: "bg-cyan-500",
};

export function ToolsGrid() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          We diagnose all major AI tools
        </h2>
        <p className="mt-4 text-muted-foreground">
          Comprehensive diagnostics across coding assistants, chat tools, and API
          providers.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
          {TOOL_PRICING.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass-card flex flex-col items-center gap-3 rounded-xl p-6"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-full ${TOOL_COLORS[tool.id] || "bg-primary"} text-lg font-bold text-white`}
              >
                {tool.name.charAt(0)}
              </div>
              <p className="font-medium">{tool.name}</p>
              <p className="text-xs text-muted-foreground">{tool.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
