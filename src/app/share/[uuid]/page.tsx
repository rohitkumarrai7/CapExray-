import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { PublicReportView } from "@/components/audit/public-report";
import Link from "next/link";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uuid } = await params;
  const { data } = await supabase
    .from("audits")
    .select("*")
    .or(`public_uuid.eq.${uuid},slug.eq.${uuid}`)
    .single();

  if (!data) {
    return { title: "Diagnosis Not Found — CapExray" };
  }

  const savingsText =
    data.total_monthly_savings > 0
      ? `$${data.total_monthly_savings}/mo in potential savings`
      : "AI stack running efficiently";

  return {
    title: `AI Stack Diagnosis — ${savingsText} | CapExray`,
    description: data.summary || `CapExray diagnosis result: ${savingsText}`,
    openGraph: {
      title: `AI Stack Diagnosis — ${savingsText}`,
      description: data.summary || `CapExray diagnosis: ${savingsText}`,
      type: "website",
      url: `https://capexray.app/share/${uuid}`,
      siteName: "CapExray",
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Stack Diagnosis — ${savingsText}`,
      description: data.summary || `CapExray diagnosis: ${savingsText}`,
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { uuid } = await params;
  const { data } = await supabase
    .from("audits")
    .select("*")
    .or(`public_uuid.eq.${uuid},slug.eq.${uuid}`)
    .single();

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Diagnosis Not Found</h1>
        <p className="text-muted-foreground">
          This diagnosis link may have expired or doesn&apos;t exist.
        </p>
        <Link
          href="/diagnose"
          className="text-primary underline underline-offset-4"
        >
          Run your own diagnosis
        </Link>
      </div>
    );
  }

  const audit = {
    totalMonthlySpend: data.total_monthly_spend,
    totalOptimizedSpend: data.total_optimized_spend,
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    efficiencyScore: data.efficiency_score,
    stackHealth: data.stack_health || "optimal",
    spendPerDev: data.spend_per_dev,
    avgSpendPerDev: data.avg_spend_per_dev,
    overlapDetected: data.overlap_detected,
    overlapTools: data.overlap_tools || [],
    summary: data.summary,
    recommendations: (data.recommendations || []).map(
      (r: Record<string, unknown>) => ({
        toolId: r.tool_id,
        toolName: r.tool_name,
        currentPlan: r.current_plan,
        currentMonthlySpend: r.current_monthly_spend,
        recommendedAction: r.recommended_action,
        recommendedPlan: r.recommended_plan,
        optimizedMonthlySpend: r.optimized_monthly_spend,
        monthlySavings: r.monthly_savings,
        annualSavings: r.annual_savings,
        confidence: r.confidence,
        reason: r.reason,
        category: r.category,
      })
    ),
  };

  return <PublicReportView audit={audit} />;
}
