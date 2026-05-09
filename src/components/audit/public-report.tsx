"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Link from "next/link";

interface PublicRecommendation {
  toolId: string;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedAction: string;
  recommendedPlan: string;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  confidence: string;
  reason: string;
  category: string;
}

interface PublicAudit {
  totalMonthlySpend: number;
  totalOptimizedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  efficiencyScore: number;
  spendPerDev: number;
  avgSpendPerDev: number;
  overlapDetected: boolean;
  overlapTools: string[];
  summary: string;
  recommendations: PublicRecommendation[];
}

const CATEGORY_LABELS: Record<string, string> = {
  "plan-optimization": "Plan Optimization",
  "tool-switch": "Tool Switch",
  "credit-savings": "Credit Savings",
  "overlap-removal": "Overlap Removal",
  "already-optimal": "Already Optimal",
};

const CONFIDENCE_STYLES: Record<string, string> = {
  high: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  low: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export function PublicReportView({
  audit,
}: {
  audit: PublicAudit;
}) {
  const hasSavings = audit.totalMonthlySavings > 0;
  const isAboveAvg = audit.spendPerDev > audit.avgSpendPerDev;

  const chartData = audit.recommendations.map((r) => ({
    name: r.toolName.length > 12 ? r.toolName.slice(0, 11) + "…" : r.toolName,
    Current: Math.round(r.currentMonthlySpend),
    Optimized: Math.round(r.optimizedMonthlySpend),
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="text-xl font-bold gradient-text">
            CapExray
          </Link>
          <Button render={<Link href="/audit" />} nativeButton={false} size="sm">
            Run Your Own Audit
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-12 md:px-6">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {hasSavings ? (
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                AI Spend Audit — Shared Report
              </p>
              <h1 className="text-4xl font-bold md:text-5xl">
                <span className="gradient-text">
                  ${audit.totalMonthlySavings.toLocaleString()}/month
                </span>{" "}
                in potential savings
              </h1>
              <p className="text-lg text-muted-foreground">
                ${audit.totalAnnualSavings.toLocaleString()}/year — Efficiency Score:{" "}
                {audit.efficiencyScore}/100
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge className="bg-emerald-500/15 px-4 py-1.5 text-base text-emerald-400 border-emerald-500/30">
                <CheckCircle2 className="size-4" />
                This AI stack is running efficiently
              </Badge>
              <p className="text-lg text-muted-foreground">
                Efficiency Score: {audit.efficiencyScore}/100
              </p>
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card ring-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {audit.summary}
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <section>
          <h2 className="mb-4 text-xl font-bold">Tool Breakdown</h2>
          <div className="space-y-4">
            {audit.recommendations.map((rec, i) => (
              <motion.div
                key={rec.toolId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="glass-card ring-0">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{rec.toolName}</CardTitle>
                        <CardDescription>Current: {rec.currentPlan}</CardDescription>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {CATEGORY_LABELS[rec.category] || rec.category}
                        </Badge>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[rec.confidence] || ""}`}
                        >
                          {rec.confidence}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current: </span>
                        <span className="font-medium">
                          ${rec.currentMonthlySpend.toLocaleString()}/mo
                        </span>
                      </div>
                      {rec.monthlySavings > 0 && (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <TrendingDown className="size-3.5" />
                          <span className="font-semibold">
                            -${rec.monthlySavings.toLocaleString()}/mo
                          </span>
                          <span className="text-xs text-emerald-400/70">
                            (${rec.annualSavings.toLocaleString()}/yr)
                          </span>
                        </div>
                      )}
                      {rec.monthlySavings === 0 && (
                        <div className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="size-3.5" />
                          <span className="text-xs font-medium">Optimal</span>
                        </div>
                      )}
                    </div>
                    <Separator />
                    <p className="text-sm font-semibold">{rec.recommendedAction}</p>
                    <p className="text-sm text-muted-foreground">{rec.reason}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">Savings Comparison</h2>
          <Card className="glass-card ring-0">
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 15, 25, 0.95)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      color: "#e4e4e7",
                      fontSize: 13,
                    }}
                    formatter={(value) => [`$${value}/mo`, undefined]}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 13, color: "#a1a1aa" }}
                    formatter={(value: string) => (
                      <span style={{ color: "#a1a1aa" }}>{value}</span>
                    )}
                  />
                  <Bar dataKey="Current" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Optimized" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="glass-card ring-0">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Spend per Developer</p>
                  <p
                    className={`text-2xl font-bold ${isAboveAvg ? "text-red-400" : "text-emerald-400"}`}
                  >
                    ${audit.spendPerDev.toFixed(0)}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-sm">
                    {isAboveAvg ? (
                      <>
                        <TrendingUp className="size-3.5 text-red-400" />
                        <span className="text-red-400">Above average</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Below average</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Industry Average
                  </p>
                  <p className="text-2xl font-bold">${audit.avgSpendPerDev.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {audit.overlapDetected && (
          <Card className="border-yellow-500/30 bg-yellow-500/5 ring-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-yellow-400">
                <AlertTriangle className="size-5" />
                Overlapping Tools Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {audit.overlapTools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="outline"
                    className="border-yellow-500/40 text-yellow-400"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                These tools have overlapping capabilities. Consolidating can
                reduce spend significantly.
              </p>
            </CardContent>
          </Card>
        )}

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center"
        >
          <h2 className="mb-2 text-2xl font-bold">
            Run your own AI spend audit
          </h2>
          <p className="mb-6 text-muted-foreground">
            Find out how much your team could save — it takes 60 seconds.
          </p>
          <Button render={<Link href="/audit" />} nativeButton={false} size="lg">
            Run Free Audit
            <ArrowRight className="size-4" />
          </Button>
        </motion.section>
      </main>

      <footer className="border-t border-border/50 px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          CapExray AI — Stop overpaying for AI tools.{" "}
          <Link href="/" className="text-primary underline underline-offset-4">
            capexray.app
          </Link>
        </p>
      </footer>
    </div>
  );
}
