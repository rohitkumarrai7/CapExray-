import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AuditResults } from "@/components/audit/audit-results";
import { supabase } from "@/lib/supabase";
import type { AuditResult, ToolRecommendation } from "@/types/audit";
import { ReportClientFallback } from "./report-client-fallback";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;

  const { data: audit, error } = await supabase
    .from("audits")
    .select("*")
    .eq("slug", id)
    .single();

  if (error || !audit) {
    return <ReportClientFallback />;
  }

  const defaultInput = {
    tools: [],
    teamSize: 1,
    primaryUseCase: "mixed" as const,
    engineeringHeavy: false,
    apiUsageLevel: "low" as const,
    startupStage: "solo" as const,
  };

  const result: AuditResult = {
    id: audit.slug,
    slug: audit.slug,
    totalMonthlySpend: audit.total_monthly_spend,
    totalOptimizedSpend: audit.total_optimized_spend,
    totalMonthlySavings: audit.total_monthly_savings,
    totalAnnualSavings: audit.total_annual_savings,
    efficiencyScore: audit.efficiency_score,
    stackHealth: audit.stack_health || "optimal",
    spendPerDev: audit.spend_per_dev,
    avgSpendPerDev: audit.avg_spend_per_dev,
    overlapDetected: audit.overlap_detected || false,
    overlapTools: audit.overlap_tools || [],
    summary: audit.summary || "",
    aiSummary: null,
    recommendations: (audit.recommendations || []).map(
      (r: Record<string, unknown>) => ({
        toolId: r.tool_id as string,
        toolName: r.tool_name as string,
        currentPlan: r.current_plan as string,
        currentMonthlySpend: r.current_monthly_spend as number,
        recommendedAction: r.recommended_action as string,
        recommendedPlan: r.recommended_plan as string,
        optimizedMonthlySpend: r.optimized_monthly_spend as number,
        monthlySavings: r.monthly_savings as number,
        annualSavings: r.annual_savings as number,
        confidence: r.confidence as "high" | "medium" | "low",
        reason: r.reason as string,
        category: r.category as ToolRecommendation["category"],
      })
    ),
    input: audit.input || defaultInput,
    createdAt: audit.created_at || new Date().toISOString(),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-16">
        <AuditResults result={result} />
      </main>
      <Footer />
    </>
  );
}
