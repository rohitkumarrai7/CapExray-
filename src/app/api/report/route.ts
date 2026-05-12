import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const auditData = await req.json();

    if (!auditData || !auditData.recommendations) {
      return NextResponse.json({ error: "Invalid audit data" }, { status: 400 });
    }

    const slug = auditData.slug || nanoid(10);

    const publicData = {
      slug,
      total_monthly_spend: auditData.totalMonthlySpend,
      total_optimized_spend: auditData.totalOptimizedSpend,
      total_monthly_savings: auditData.totalMonthlySavings,
      total_annual_savings: auditData.totalAnnualSavings,
      efficiency_score: auditData.efficiencyScore,
      stack_health: auditData.stackHealth || "optimal",
      spend_per_dev: auditData.spendPerDev,
      avg_spend_per_dev: auditData.avgSpendPerDev,
      overlap_detected: auditData.overlapDetected || false,
      overlap_tools: auditData.overlapTools || [],
      summary: auditData.summary || "",
      input: auditData.input || null,
      recommendations: auditData.recommendations.map(
        (r: {
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
        }) => ({
          tool_id: r.toolId,
          tool_name: r.toolName,
          current_plan: r.currentPlan,
          current_monthly_spend: r.currentMonthlySpend,
          recommended_action: r.recommendedAction,
          recommended_plan: r.recommendedPlan,
          optimized_monthly_spend: r.optimizedMonthlySpend,
          monthly_savings: r.monthlySavings,
          annual_savings: r.annualSavings,
          confidence: r.confidence,
          reason: r.reason,
          category: r.category,
        })
      ),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("audits")
      .upsert(publicData, { onConflict: "slug" });

    if (error) {
      return NextResponse.json({ slug, stored: false });
    }

    return NextResponse.json({ slug, stored: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
