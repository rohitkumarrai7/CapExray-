import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auditData } = body;

    if (!auditData) {
      return NextResponse.json({ error: "Missing audit data" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        summary: generateFallbackSummary(auditData),
        fallback: true,
      });
    }

    const tools = auditData.recommendations
      ?.map((r: { toolName: string; currentPlan: string; monthlySavings: number; recommendedAction: string }) =>
        `${r.toolName} (${r.currentPlan}): ${r.monthlySavings > 0 ? `save $${r.monthlySavings}/mo by ${r.recommendedAction}` : "already optimal"}`
      )
      .join("; ");

    const prompt = `You are a cost optimization analyst for a startup. Write a personalized ~100-word summary of this AI spend audit.

Total monthly spend: $${auditData.totalMonthlySpend || 0}
Total monthly savings opportunity: $${auditData.totalMonthlySavings || 0}
Total annual savings: $${(auditData.totalMonthlySavings || 0) * 12}
Efficiency score: ${auditData.efficiencyScore}/100
Team size: ${auditData.input?.teamSize || "unknown"}
Primary use case: ${auditData.input?.primaryUseCase || "unknown"}

Tool breakdown:
${tools || "No tools listed"}

Write a concise, actionable summary paragraph. Be specific about dollar amounts. If savings are significant, emphasize the annual impact. If the stack is already efficient, acknowledge that. Use a professional but approachable tone. Do not use bullet points.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        summary: generateFallbackSummary(auditData),
        fallback: true,
      });
    }

    const data = await response.json();
    const summary = data.content?.[0]?.text || generateFallbackSummary(auditData);

    return NextResponse.json({ summary, fallback: false });
  } catch {
    return NextResponse.json(
      { summary: "Unable to generate AI summary. Please refer to the detailed breakdown above.", fallback: true },
      { status: 200 }
    );
  }
}

function generateFallbackSummary(auditData: {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  efficiencyScore: number;
  recommendations: Array<{ toolName: string; monthlySavings: number; recommendedAction: string }>;
  overlapDetected: boolean;
}): string {
  const { totalMonthlySpend, totalMonthlySavings, efficiencyScore, recommendations, overlapDetected } = auditData;

  if (totalMonthlySavings === 0) {
    return `Your AI tooling stack is running efficiently at $${totalMonthlySpend}/month with an efficiency score of ${efficiencyScore}/100. We found no immediate optimization opportunities. As your team grows, revisit your stack quarterly to catch new pricing changes and alternative tools.`;
  }

  const topRecs = recommendations
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 3)
    .map((r) => r.recommendedAction);

  let summary = `Your team is spending $${totalMonthlySpend}/month on AI tools with an efficiency score of ${efficiencyScore}/100. `;
  if (overlapDetected) summary += "We detected overlapping subscriptions that could be consolidated. ";
  summary += `We identified $${totalMonthlySavings}/month in potential savings ($${totalMonthlySavings * 12}/year). `;
  if (topRecs.length > 0) summary += `Key opportunities: ${topRecs.join(". ")}.`;

  return summary;
}
