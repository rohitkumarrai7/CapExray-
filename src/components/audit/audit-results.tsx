"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Share2,
  Copy,
  Check,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Download,
  Mail,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AuditResult, ToolRecommendation } from "@/types/audit";

interface AuditResultsProps {
  result: AuditResult;
}

const CATEGORY_LABELS: Record<ToolRecommendation["category"], string> = {
  "plan-optimization": "Plan Optimization",
  "tool-switch": "Tool Switch",
  "credit-savings": "Credit Savings",
  "overlap-removal": "Overlap Removal",
  "already-optimal": "Already Optimal",
};

const CONFIDENCE_STYLES: Record<ToolRecommendation["confidence"], string> = {
  high: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  low: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <span>
      {prefix}
      {value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      {suffix}
    </span>
  );
}

function EfficiencyCircle({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#f59e0b";
    if (s >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold">{score}</span>
        <span className="text-[10px] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

function SavingsChart({ recommendations }: { recommendations: ToolRecommendation[] }) {
  const data = recommendations.map((r) => ({
    name: r.toolName.length > 12 ? r.toolName.slice(0, 11) + "…" : r.toolName,
    Current: Math.round(r.currentMonthlySpend),
    Optimized: Math.round(r.optimizedMonthlySpend),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <XAxis dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
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
          formatter={(value: string) => <span style={{ color: "#a1a1aa" }}>{value}</span>}
        />
        <Bar dataKey="Current" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Optimized" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RecommendationCard({ rec }: { rec: ToolRecommendation }) {
  const hasSavings = rec.monthlySavings > 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      <Card className="glass-card ring-0">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg">{rec.toolName}</CardTitle>
              <CardDescription>Current plan: {rec.currentPlan}</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-border text-xs">
                {CATEGORY_LABELS[rec.category]}
              </Badge>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[rec.confidence]}`}>
                {rec.confidence}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current: </span>
              <span className="font-medium">${rec.currentMonthlySpend.toLocaleString()}/mo</span>
            </div>
            <div>
              <span className="text-muted-foreground">Optimized: </span>
              <span className="font-medium">${rec.optimizedMonthlySpend.toLocaleString()}/mo</span>
            </div>
            {hasSavings && (
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingDown className="size-3.5" />
                <span className="font-semibold">-${rec.monthlySavings.toLocaleString()}/mo</span>
                <span className="text-xs text-emerald-400/70">(${rec.annualSavings.toLocaleString()}/yr)</span>
              </div>
            )}
            {!hasSavings && (
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                <span className="text-xs font-medium">No changes needed</span>
              </div>
            )}
          </div>
          <Separator />
          <div>
            <p className="mb-1 text-sm font-semibold">
              {hasSavings && <ArrowRight className="mr-1 inline size-3.5 text-primary" />}
              {rec.recommendedAction}
            </p>
            <p className="text-sm text-muted-foreground">{rec.reason}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LeadCaptureSection({ result }: { result: AuditResult }) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          companyName: companyName || undefined,
          role: role || undefined,
          teamSize: result.input.teamSize,
          auditId: result.id,
          monthlySavings: result.totalMonthlySavings,
        }),
      });
      setSubmitted(true);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="glass-card ring-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="size-5 text-primary" />
            Save Your Report
          </CardTitle>
          <CardDescription>Get a copy of your audit results delivered to your inbox.</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-400">
              <CheckCircle2 className="size-4 shrink-0" />
              Report saved! Check your email.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-email">Email *</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-company">Company</Label>
                  <Input
                    id="lead-company"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-role">Role</Label>
                  <Input
                    id="lead-role"
                    placeholder="CTO, Founder, etc."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={submitting || !email}>
                <Mail className="size-4" />
                {submitting ? "Sending..." : "Send Report"}
              </Button>
            </form>
          )}

          {result.totalMonthlySavings > 500 && (
            <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="mb-3 flex items-start gap-2">
                <Sparkles className="mt-0.5 size-5 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Unlock Additional Savings with Credex</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Book a free consultation with Credex to unlock additional savings through discounted AI credits.
                  </p>
                </div>
              </div>
              <Button size="lg" className="mt-2">
                Book Free Consultation
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ShareSection({ result }: { result: AuditResult }) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const data = await res.json();
      if (data.slug) {
        const url = `${window.location.origin}/report/${data.slug}`;
        setShareUrl(url);
      }
    } catch {
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [shareUrl]);

  return (
    <motion.div variants={itemVariants}>
      <Card className="glass-card ring-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Share2 className="size-5 text-primary" />
            Share Your Audit
          </CardTitle>
          <CardDescription>Generate a public link to share your audit results.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!shareUrl ? (
            <Button onClick={handleShare} disabled={sharing}>
              <Share2 className="size-4" />
              {sharing ? "Generating..." : "Generate Share Link"}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your personal information is never shared in public reports.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AuditResults({ result }: AuditResultsProps) {
  const { totalMonthlySavings, totalAnnualSavings, efficiencyScore, spendPerDev, avgSpendPerDev } = result;
  const hasSavings = totalMonthlySavings > 0;
  const isAboveAvg = spendPerDev > avgSpendPerDev;

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 md:px-6">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {hasSavings ? (
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Potential Monthly Savings
            </p>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.2 }}
              className="text-5xl font-bold md:text-6xl"
            >
              <span className="gradient-text">
                <AnimatedCounter target={totalMonthlySavings} prefix="$" suffix="/month" />
              </span>
            </motion.div>
            <p className="text-lg text-muted-foreground">
              ( <span className="font-semibold text-emerald-400">${totalAnnualSavings.toLocaleString()}/year</span> )
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Badge className="bg-emerald-500/15 px-4 py-1.5 text-base text-emerald-400 border-emerald-500/30">
              <CheckCircle2 className="size-4" />
              You&apos;re spending efficiently!
            </Badge>
            <p className="text-muted-foreground">No optimization opportunities found right now.</p>
          </div>
        )}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">Efficiency Score</p>
          <EfficiencyCircle score={efficiencyScore} />
        </div>
        <Separator orientation="vertical" className="hidden h-28 sm:block" />
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-sm font-medium text-muted-foreground">Your Spend per Developer</p>
          <p className="text-3xl font-bold">
            <span className={isAboveAvg ? "text-red-400" : "text-emerald-400"}>
              ${spendPerDev.toFixed(0)}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Industry avg: <span className="font-medium">${avgSpendPerDev.toFixed(0)}</span>
          </p>
          <div className="flex items-center gap-1 text-sm">
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
      </motion.section>

      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <Card className="glass-card ring-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-primary" />
                AI-Powered Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {result.aiSummary || result.summary}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <motion.h3 variants={itemVariants} className="mb-4 text-xl font-bold">
          Tool-by-Tool Breakdown
        </motion.h3>
        <div className="grid grid-cols-1 gap-4">
          {result.recommendations.map((rec) => (
            <RecommendationCard key={rec.toolId} rec={rec} />
          ))}
        </div>
      </motion.section>

      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <h3 className="mb-4 text-xl font-bold">Savings Breakdown</h3>
          <Card className="glass-card ring-0">
            <CardContent className="pt-4">
              <SavingsChart recommendations={result.recommendations} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}>
          <Card className="glass-card ring-0">
            <CardHeader>
              <CardTitle className="text-lg">Benchmark Comparison</CardTitle>
              <CardDescription>How your AI spend compares to similar startups.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Your AI Spend per Developer</p>
                  <p className="text-3xl font-bold">${spendPerDev.toFixed(0)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Similar Startups Average</p>
                  <p className="text-3xl font-bold">${avgSpendPerDev.toFixed(0)}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className={`text-sm ${isAboveAvg ? "text-red-400" : "text-emerald-400"}`}>
                {isAboveAvg
                  ? `You're spending $${(spendPerDev - avgSpendPerDev).toFixed(0)} more per developer than similar startups. Consider the recommendations above to reduce costs.`
                  : `Great job! You're spending $${(avgSpendPerDev - spendPerDev).toFixed(0)} less per developer than similar startups.`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {result.overlapDetected && result.overlapTools.length > 0 && (
        <motion.section variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <Card className="border-yellow-500/30 bg-yellow-500/5 ring-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-yellow-400">
                  <AlertTriangle className="size-5" />
                  Overlapping Tools Detected
                </CardTitle>
                <CardDescription>
                  These tools have overlapping functionality and could be consolidated.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {result.overlapTools.map((tool) => (
                    <Badge key={tool} variant="outline" className="border-yellow-500/40 text-yellow-400">
                      {tool}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  You&apos;re paying for multiple tools that serve similar purposes. Consolidating to a single tool per category can eliminate redundant subscriptions and reduce your monthly spend significantly. Check the recommendations above for specific guidance.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      )}

      <motion.section variants={containerVariants} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LeadCaptureSection result={result} />
          <ShareSection result={result} />
        </div>
      </motion.section>
    </div>
  );
}
