import {
  AuditInput,
  AuditResult,
  ToolRecommendation,
  ToolEntry,
  ToolPricing,
} from "@/types/audit";
import { TOOL_PRICING, BENCHMARK_SPEND_PER_DEV, INDUSTRY_AVG_SPEND_PER_DEV } from "./pricing-data";
import { nanoid } from "nanoid";
import type { StackHealth } from "@/types/audit";

// ── Module-level pricing registry (populated from live API or static fallback)
let _activePricing: ToolPricing[] = TOOL_PRICING;

/** Call this before runAudit when you have live pricing from /api/pricing */
export function setPricingData(data: ToolPricing[]) {
  if (data && data.length > 0) _activePricing = data;
}

function getToolPricing(toolId: string) {
  return _activePricing.find((t) => t.id === toolId);
}

function findPlan(toolId: string, planName: string) {
  const tool = getToolPricing(toolId);
  if (!tool) return null;
  return tool.plans.find(
    (p) => p.name.toLowerCase() === planName.toLowerCase()
  );
}

function calcCurrentSpend(entry: ToolEntry): number {
  const plan = findPlan(entry.toolId, entry.plan);
  if (!plan) return entry.monthlySpend;
  if (plan.pricePerSeat > 0) {
    return plan.pricePerSeat * entry.seats;
  }
  return entry.monthlySpend;
}

function findBestPlanForTeamSize(
  toolId: string,
  teamSize: number,
  seats: number
): { plan: string; cost: number } | null {
  const tool = getToolPricing(toolId);
  if (!tool) return null;

  const affordable = tool.plans
    .filter((p) => p.monthlyPrice > 0 && p.pricePerSeat > 0)
    .filter((p) => !p.minUsers || seats >= p.minUsers)
    .sort((a, b) => a.pricePerSeat - b.pricePerSeat);

  if (affordable.length === 0) return null;
  const best = affordable[0];
  return { plan: best.name, cost: best.pricePerSeat * seats };
}

function detectOverlaps(tools: ToolEntry[]): { tools: string[]; reason: string }[] {
  const overlaps: { tools: string[]; reason: string }[] = [];
  const ids = tools.map((t) => t.toolId);

  const hasChatGPT = ids.includes("chatgpt");
  const hasClaude = ids.includes("claude");
  const hasCopilot = ids.includes("github-copilot");
  const hasCursor = ids.includes("cursor");

  if (hasChatGPT && hasClaude) {
    const chatgptEntry = tools.find((t) => t.toolId === "chatgpt")!;
    const claudeEntry = tools.find((t) => t.toolId === "claude")!;

    const isTeamOrAbove = (plan: string) =>
      ["team", "enterprise"].includes(plan.toLowerCase());

    if (isTeamOrAbove(chatgptEntry.plan) && isTeamOrAbove(claudeEntry.plan)) {
      overlaps.push({
        tools: ["ChatGPT", "Claude"],
        reason:
          "Both ChatGPT and Claude at Team+ tiers with overlapping general-purpose AI assistant capabilities. Most teams can standardize on one.",
      });
    }
  }

  if (hasCursor && hasCopilot) {
    overlaps.push({
      tools: ["Cursor", "GitHub Copilot"],
      reason:
        "Cursor includes AI code completions similar to Copilot. Using both is usually redundant for code generation.",
    });
  }

  return overlaps;
}

function evaluateTool(
  entry: ToolEntry,
  input: AuditInput,
  allOverlaps: { tools: string[]; reason: string }[]
): ToolRecommendation {
  const tool = getToolPricing(entry.toolId);
  if (!tool) {
    return {
      toolId: entry.toolId,
      toolName: entry.toolId,
      currentPlan: entry.plan,
      currentMonthlySpend: entry.monthlySpend,
      recommendedAction: "none",
      recommendedPlan: entry.plan,
      optimizedMonthlySpend: entry.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      confidence: "low",
      reason: "Could not find pricing data for this tool.",
      category: "already-optimal",
    };
  }

  const currentSpend = calcCurrentSpend(entry);
  const toolName = tool.name;

  const isInOverlap = allOverlaps.find((o) =>
    o.tools.some((t) => t === toolName)
  );

  if (isInOverlap && entry.toolId === "chatgpt") {
    const claudeEntry = input.tools.find((t) => t.toolId === "claude");
    if (claudeEntry) {
      const claudePlan = findPlan("claude", claudeEntry.plan);
      if (
        claudePlan &&
        ["team", "enterprise"].includes(claudeEntry.plan.toLowerCase())
      ) {
        const savings = currentSpend;
        return {
          toolId: entry.toolId,
          toolName,
          currentPlan: entry.plan,
          currentMonthlySpend: currentSpend,
          recommendedAction: "none",
          recommendedPlan: `Consolidate to Claude`,
          optimizedMonthlySpend: 0,
          monthlySavings: savings,
          annualSavings: savings * 12,
          confidence: "high",
          reason: isInOverlap.reason + " Since your team already uses Claude Team, ChatGPT is redundant for general-purpose AI assistance.",
          category: "overlap-removal",
        };
      }
    }
  }

  if (isInOverlap && entry.toolId === "github-copilot") {
    const cursorEntry = input.tools.find((t) => t.toolId === "cursor");
    if (cursorEntry && ["pro", "business"].includes(cursorEntry.plan.toLowerCase())) {
      const savings = currentSpend;
      return {
        toolId: entry.toolId,
        toolName,
        currentPlan: entry.plan,
        currentMonthlySpend: currentSpend,
          recommendedAction: "switch_tool",
        recommendedPlan: "Use Cursor only",
        optimizedMonthlySpend: 0,
        monthlySavings: savings,
        annualSavings: savings * 12,
        confidence: "high",
        reason: isInOverlap.reason,
        category: "overlap-removal",
      };
    }
  }

  if (
    ["team", "business", "enterprise"].includes(entry.plan.toLowerCase()) &&
    entry.seats <= 2 &&
    tool.plans.some(
      (p) =>
        p.name.toLowerCase() === "pro" ||
        p.name.toLowerCase() === "individual" ||
        p.name.toLowerCase() === "plus"
    )
  ) {
    const downgradeTarget = tool.plans.find(
      (p) =>
        p.name.toLowerCase() === "pro" ||
        p.name.toLowerCase() === "individual" ||
        p.name.toLowerCase() === "plus"
    );
    if (downgradeTarget && downgradeTarget.pricePerSeat > 0) {
      const optimizedCost = downgradeTarget.pricePerSeat * entry.seats;
      const savings = currentSpend - optimizedCost;
      if (savings > 0) {
        return {
          toolId: entry.toolId,
          toolName,
          currentPlan: entry.plan,
          currentMonthlySpend: currentSpend,
          recommendedAction: "downgrade",
          recommendedPlan: downgradeTarget.name,
          optimizedMonthlySpend: optimizedCost,
          monthlySavings: savings,
          annualSavings: savings * 12,
          confidence: "high",
          reason: `Team/Business plans are overkill for ${entry.seats} user${entry.seats > 1 ? "s" : ""}. The ${downgradeTarget.name} plan ($${downgradeTarget.pricePerSeat}/seat) covers individual use with the same core AI features.`,
          category: "plan-optimization",
        };
      }
    }
  }

  if (
    entry.plan.toLowerCase() === "enterprise" &&
    input.teamSize < 20
  ) {
    const bestAlt = findBestPlanForTeamSize(entry.toolId, input.teamSize, entry.seats);
    if (bestAlt) {
      const savings = currentSpend - bestAlt.cost;
      if (savings > 0) {
        return {
          toolId: entry.toolId,
          toolName,
          currentPlan: entry.plan,
          currentMonthlySpend: currentSpend,
          recommendedAction: "downgrade",
          recommendedPlan: bestAlt.plan,
          optimizedMonthlySpend: bestAlt.cost,
          monthlySavings: savings,
          annualSavings: savings * 12,
          confidence: "medium",
          reason: `Enterprise plans require significant infrastructure to justify. For a ${input.teamSize}-person team, the ${bestAlt.plan} plan delivers the same core functionality at a fraction of the cost.`,
          category: "plan-optimization",
        };
      }
    }
  }

  if (
    entry.toolId === "cursor" &&
    ["business"].includes(entry.plan.toLowerCase()) &&
    input.primaryUseCase === "coding" &&
    entry.seats <= 3
  ) {
    const proPlan = tool.plans.find((p) => p.name.toLowerCase() === "pro");
    if (proPlan) {
      const optimizedCost = proPlan.pricePerSeat * entry.seats;
      const savings = currentSpend - optimizedCost;
      if (savings > 0) {
        return {
          toolId: entry.toolId,
          toolName,
          currentPlan: entry.plan,
          currentMonthlySpend: currentSpend,
          recommendedAction: "downgrade",
          recommendedPlan: "Pro",
          optimizedMonthlySpend: optimizedCost,
          monthlySavings: savings,
          annualSavings: savings * 12,
          confidence: "high",
          reason: `Business plan adds centralized billing and admin tools that add overhead for a ${entry.seats}-person team. Pro gives you the same AI features at $${proPlan.pricePerSeat}/seat.`,
          category: "plan-optimization",
        };
      }
    }
  }

  if (
    entry.toolId === "claude" &&
    entry.plan.toLowerCase() === "max" &&
    entry.seats === 1 &&
    input.teamSize > 1
  ) {
    const teamPlan = tool.plans.find((p) => p.name.toLowerCase() === "team");
    if (teamPlan && input.teamSize >= 2) {
      const teamCost = teamPlan.pricePerSeat * input.teamSize;
      return {
        toolId: entry.toolId,
        toolName,
        currentPlan: entry.plan,
        currentMonthlySpend: currentSpend,
        recommendedAction: "switch_tool",
        recommendedPlan: "Team",
        optimizedMonthlySpend: teamCost,
        monthlySavings: Math.max(0, currentSpend - teamCost),
        annualSavings: Math.max(0, currentSpend - teamCost) * 12,
        confidence: "medium",
        reason: `Max at $100/mo for one user is expensive when your team has ${input.teamSize} people. Team plan at $${teamPlan.pricePerSeat}/seat spreads cost and gives everyone access.`,
        category: "plan-optimization",
      };
    }
  }

  if (entry.monthlySpend > 100 && (entry.toolId === "anthropic-api" || entry.toolId === "openai-api")) {
    const creditSavings = currentSpend * 0.3;
    return {
      toolId: entry.toolId,
      toolName,
      currentPlan: entry.plan,
      currentMonthlySpend: currentSpend,
      recommendedAction: "credit_savings",
      recommendedPlan: "Credex Credits",
      optimizedMonthlySpend: currentSpend - creditSavings,
      monthlySavings: creditSavings,
      annualSavings: creditSavings * 12,
      confidence: "medium",
      reason: `Spending $${currentSpend.toFixed(0)}/mo on ${toolName} at retail pricing. Discounted credits from Credex can save ~30% on the same API usage with no migration effort.`,
      category: "credit-savings",
    };
  }

  if (
    entry.toolId === "github-copilot" &&
    ["business", "enterprise"].includes(entry.plan.toLowerCase()) &&
    !input.tools.some((t) => t.toolId === "cursor")
  ) {
    const cursorPro = _activePricing.find((t) => t.id === "cursor")?.plans.find(
      (p) => p.name.toLowerCase() === "pro"
    );
    if (cursorPro && input.primaryUseCase === "coding") {
      const cursorCost = cursorPro.pricePerSeat * entry.seats;
      const savings = currentSpend - cursorCost;
      if (savings > 0) {
        return {
          toolId: entry.toolId,
          toolName,
          currentPlan: entry.plan,
          currentMonthlySpend: currentSpend,
          recommendedAction: "switch_tool",
          recommendedPlan: "Cursor Pro",
          optimizedMonthlySpend: cursorCost,
          monthlySavings: savings,
          annualSavings: savings * 12,
          confidence: "medium",
          reason: `Cursor Pro at $${cursorPro.pricePerSeat}/seat is a full AI-powered code editor that replaces Copilot's code completion features, plus gives you a modern editor experience. Save $${savings.toFixed(0)}/mo.`,
          category: "tool-switch",
        };
      }
    }
  }

  if (
    entry.toolId === "chatgpt" &&
    entry.plan.toLowerCase() === "team" &&
    input.primaryUseCase === "coding" &&
    input.engineeringHeavy &&
    !input.tools.some((t) => t.toolId === "cursor")
  ) {
    const cursorPro = _activePricing.find((t) => t.id === "cursor")?.plans.find(
      (p) => p.name.toLowerCase() === "pro"
    );
    if (cursorPro) {
      const cursorCost = cursorPro.pricePerSeat * entry.seats;
      return {
        toolId: entry.toolId,
        toolName,
        currentPlan: entry.plan,
        currentMonthlySpend: currentSpend,
        recommendedAction: "switch_tool",
        recommendedPlan: "Plus",
        optimizedMonthlySpend: 20 * entry.seats + cursorCost,
        monthlySavings: currentSpend - (20 * entry.seats + cursorCost),
        annualSavings: (currentSpend - (20 * entry.seats + cursorCost)) * 12,
        confidence: "medium",
        reason: `Engineering-heavy teams get more value from Cursor Pro ($${cursorPro.pricePerSeat}/seat) for coding tasks. Downgrade ChatGPT to Plus for occasional non-coding use.`,
        category: "tool-switch",
      };
    }
  }

  if (
    entry.toolId === "windsurf" &&
    entry.plan.toLowerCase() === "team" &&
    entry.seats <= 2
  ) {
    const proPlan = tool.plans.find((p) => p.name.toLowerCase() === "pro");
    if (proPlan) {
      const optimizedCost = proPlan.pricePerSeat * entry.seats;
      const savings = currentSpend - optimizedCost;
      if (savings > 0) {
        return {
          toolId: entry.toolId,
          toolName,
          currentPlan: entry.plan,
          currentMonthlySpend: currentSpend,
          recommendedAction: "downgrade",
          recommendedPlan: "Pro",
          optimizedMonthlySpend: optimizedCost,
          monthlySavings: savings,
          annualSavings: savings * 12,
          confidence: "high",
          reason: `Team plan at $${(currentSpend / entry.seats).toFixed(0)}/seat for ${entry.seats} users adds management overhead you don't need. Pro at $${proPlan.pricePerSeat}/seat gives you the same AI capabilities.`,
          category: "plan-optimization",
        };
      }
    }
  }

  if (entry.plan.toLowerCase() === "enterprise" && tool.plans.length > 1) {
    return {
      toolId: entry.toolId,
      toolName,
      currentPlan: entry.plan,
      currentMonthlySpend: currentSpend,
      recommendedAction: "credit_savings",
      recommendedPlan: "Enterprise (review)",
      optimizedMonthlySpend: currentSpend * 0.85,
      monthlySavings: currentSpend * 0.15,
      annualSavings: currentSpend * 0.15 * 12,
      confidence: "low",
      reason: `Enterprise contracts often have room for negotiation. At your team size, consider whether all Enterprise features are actively used. A 15% reduction through contract renegotiation or Credex credits is realistic.`,
      category: "credit-savings",
    };
  }

  return {
    toolId: entry.toolId,
    toolName,
    currentPlan: entry.plan,
    currentMonthlySpend: currentSpend,
    recommendedAction: "none",
    recommendedPlan: entry.plan,
    optimizedMonthlySpend: currentSpend,
    monthlySavings: 0,
    annualSavings: 0,
    confidence: "high",
    reason: `Your ${toolName} ${entry.plan} plan at $${currentSpend.toFixed(0)}/mo is well-suited for your team size and use case. No changes recommended.`,
    category: "already-optimal",
  };
}

function generateTemplatedSummary(
  result: Pick<AuditResult, "totalMonthlySavings" | "totalMonthlySpend" | "recommendations" | "efficiencyScore" | "overlapDetected" | "stackHealth">
): string {
  const { totalMonthlySavings, totalMonthlySpend, recommendations, efficiencyScore, overlapDetected, stackHealth } = result;

  if (totalMonthlySavings === 0) {
    return `Your AI spend is well-calibrated at $${totalMonthlySpend.toFixed(0)}/month with a stack health score of ${efficiencyScore}/100. CapExray found no significant leaks. Your plan-tier selections align with your team size. Consider re-running this diagnosis quarterly as your team grows.`;
  }

  const topRecs = recommendations
    .filter((r) => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 3);

  const parts = topRecs.map((r) => r.reason.split(".")[0]);

  let summary = `CapExray found $${totalMonthlySavings.toFixed(0)}/month in misaligned plans and seat counts ($${(totalMonthlySavings * 12).toFixed(0)}/year). Stack health: ${stackHealth === "major_leak" ? "major leak" : stackHealth === "minor_drift" ? "minor drift" : "optimal"}. `;

  if (overlapDetected) {
    summary += `Diagnostic finding: overlapping subscriptions detected that could be consolidated. `;
  }

  if (parts.length > 0) {
    summary += `Key opportunity: ${parts[0]}.`;
  }

  return summary;
}

export { generateTemplatedSummary };

export function runAudit(input: AuditInput, livePricing?: ToolPricing[]): AuditResult {
  // Use live pricing from /api/pricing when available, otherwise fall back to static
  if (livePricing && livePricing.length > 0) {
    setPricingData(livePricing);
  }
  const slug = nanoid(10);
  const id = nanoid();

  const overlaps = detectOverlaps(input.tools);

  const recommendations = input.tools.map((entry) =>
    evaluateTool(entry, input, overlaps)
  );

  const totalMonthlySpend = recommendations.reduce(
    (sum, r) => sum + r.currentMonthlySpend,
    0
  );
  const totalOptimizedSpend = recommendations.reduce(
    (sum, r) => sum + r.optimizedMonthlySpend,
    0
  );
  const totalMonthlySavings = totalMonthlySpend - totalOptimizedSpend;
  const totalAnnualSavings = totalMonthlySavings * 12;

  const savingsCount = recommendations.filter((r) => r.monthlySavings > 0).length;
  const maxSavingsRatio = totalMonthlySpend > 0 ? totalMonthlySavings / totalMonthlySpend : 0;
  const efficiencyScore = Math.round(
    Math.max(0, Math.min(100, 100 - maxSavingsRatio * 120 - savingsCount * 5))
  );

  const spendPerDev = input.teamSize > 0 ? totalMonthlySpend / input.teamSize : totalMonthlySpend;
  const avgSpendPerDev = BENCHMARK_SPEND_PER_DEV[input.startupStage] || INDUSTRY_AVG_SPEND_PER_DEV;

  const overlapToolNames = overlaps.flatMap((o) => o.tools);

  let stackHealth: StackHealth = "optimal";
  if (totalMonthlySavings > 500) stackHealth = "major_leak";
  else if (totalMonthlySavings > 100) stackHealth = "minor_drift";

  const result: AuditResult = {
    id,
    slug,
    input,
    recommendations,
    totalMonthlySpend,
    totalOptimizedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    efficiencyScore,
    stackHealth,
    spendPerDev,
    avgSpendPerDev,
    overlapDetected: overlaps.length > 0,
    overlapTools: overlapToolNames,
    summary: "",
    aiSummary: null,
    createdAt: new Date().toISOString(),
  };

  result.summary = generateTemplatedSummary(result);

  return result;
}
