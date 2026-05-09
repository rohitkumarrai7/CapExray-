import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/audit-engine";
import type { AuditInput } from "@/types/audit";

function makeInput(overrides: Partial<AuditInput> = {}): AuditInput {
  return {
    tools: [
      {
        toolId: "cursor",
        plan: "Pro",
        monthlySpend: 20,
        seats: 1,
      },
    ],
    teamSize: 3,
    primaryUseCase: "coding",
    engineeringHeavy: true,
    apiUsageLevel: "medium",
    startupStage: "small-team",
    ...overrides,
  };
}

describe("runAudit", () => {
  it("returns an already-optimal result for a single Pro plan with 1 seat", () => {
    const result = runAudit(makeInput());
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].category).toBe("already-optimal");
    expect(result.recommendations[0].monthlySavings).toBe(0);
  });

  it("flags Team plan with 2 or fewer seats as overkill and recommends downgrade", () => {
    const input = makeInput({
      tools: [
        {
          toolId: "chatgpt",
          plan: "Team",
          monthlySpend: 50,
          seats: 2,
        },
      ],
    });
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.category).toBe("plan-optimization");
    expect(rec.recommendedPlan).toBe("Plus");
  });

  it("detects overlap when both ChatGPT Team and Claude Team are present", () => {
    const input = makeInput({
      tools: [
        { toolId: "chatgpt", plan: "Team", monthlySpend: 50, seats: 5 },
        { toolId: "claude", plan: "Team", monthlySpend: 125, seats: 5 },
      ],
    });
    const result = runAudit(input);
    expect(result.overlapDetected).toBe(true);
    const chatgptRec = result.recommendations.find(
      (r) => r.toolId === "chatgpt"
    );
    expect(chatgptRec).toBeDefined();
    expect(chatgptRec!.category).toBe("overlap-removal");
    expect(chatgptRec!.monthlySavings).toBeGreaterThan(0);
  });

  it("detects overlap between Cursor and GitHub Copilot", () => {
    const input = makeInput({
      tools: [
        { toolId: "cursor", plan: "Pro", monthlySpend: 20, seats: 3 },
        {
          toolId: "github-copilot",
          plan: "Business",
          monthlySpend: 57,
          seats: 3,
        },
      ],
    });
    const result = runAudit(input);
    expect(result.overlapDetected).toBe(true);
    const copilotRec = result.recommendations.find(
      (r) => r.toolId === "github-copilot"
    );
    expect(copilotRec).toBeDefined();
    expect(copilotRec!.category).toBe("overlap-removal");
  });

  it("recommends credit savings for high API spend", () => {
    const input = makeInput({
      tools: [
        {
          toolId: "anthropic-api",
          plan: "Pay-as-you-go",
          monthlySpend: 250,
          seats: 1,
        },
      ],
      apiUsageLevel: "high",
    });
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.category).toBe("credit-savings");
    expect(rec.reason.toLowerCase()).toContain("credex");
  });

  it("generates correct total savings across multiple tools", () => {
    const input = makeInput({
      tools: [
        { toolId: "chatgpt", plan: "Team", monthlySpend: 50, seats: 2 },
        { toolId: "claude", plan: "Max", monthlySpend: 100, seats: 1 },
        {
          toolId: "openai-api",
          plan: "Pay-as-you-go",
          monthlySpend: 150,
          seats: 1,
        },
      ],
      teamSize: 3,
    });
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
    expect(result.efficiencyScore).toBeGreaterThanOrEqual(0);
    expect(result.efficiencyScore).toBeLessThanOrEqual(100);
  });

  it("calculates spend per developer correctly", () => {
    const input = makeInput({
      tools: [
        { toolId: "cursor", plan: "Pro", monthlySpend: 20, seats: 1 },
      ],
      teamSize: 5,
    });
    const result = runAudit(input);
    expect(result.spendPerDev).toBe(20 / 5);
    expect(result.spendPerDev).toBe(4);
  });

  it("generates a fallback summary when no AI summary is provided", () => {
    const result = runAudit(makeInput());
    expect(result.summary).toBeTruthy();
    expect(result.summary.length).toBeGreaterThan(20);
    expect(result.aiSummary).toBeNull();
  });

  it("handles a single free tool with zero spend", () => {
    const input = makeInput({
      tools: [
        { toolId: "cursor", plan: "Hobby", monthlySpend: 0, seats: 1 },
      ],
    });
    const result = runAudit(input);
    expect(result.recommendations).toHaveLength(1);
    expect(result.totalMonthlySpend).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
  });

  it("generates a unique slug and id for each audit", () => {
    const input = makeInput();
    const result1 = runAudit(input);
    const result2 = runAudit(input);
    expect(result1.slug).toBeTruthy();
    expect(result2.slug).toBeTruthy();
    expect(result1.id).not.toBe(result2.id);
  });
});
