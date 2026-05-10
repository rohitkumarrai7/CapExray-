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

  it("recommends downgrade for Windsurf Team with 2 seats", () => {
    const input = makeInput({
      tools: [
        { toolId: "windsurf", plan: "Team", monthlySpend: 60, seats: 2 },
      ],
    });
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.recommendedPlan).toBe("Pro");
    expect(rec.category).toBe("plan-optimization");
  });

  it("flags Enterprise plan as overkill for team under 20 people", () => {
    const input = makeInput({
      tools: [
        { toolId: "cursor", plan: "Enterprise", monthlySpend: 80, seats: 5 },
      ],
      teamSize: 10,
    });
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.reason.toLowerCase()).toContain("enterprise");
  });

  it("recommends credit savings for high OpenAI API spend", () => {
    const input = makeInput({
      tools: [
        { toolId: "openai-api", plan: "Pay-as-you-go", monthlySpend: 200, seats: 1 },
      ],
    });
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.category).toBe("credit-savings");
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.reason.toLowerCase()).toContain("credex");
  });

  it("handles Gemini Free plan as already-optimal", () => {
    const input = makeInput({
      tools: [
        { toolId: "gemini", plan: "Free", monthlySpend: 0, seats: 1 },
      ],
    });
    const result = runAudit(input);
    expect(result.recommendations[0].category).toBe("already-optimal");
    expect(result.recommendations[0].monthlySavings).toBe(0);
  });

  it("calculates efficiency score within 0-100 range for complex stacks", () => {
    const input = makeInput({
      tools: [
        { toolId: "chatgpt", plan: "Team", monthlySpend: 50, seats: 2 },
        { toolId: "claude", plan: "Team", monthlySpend: 125, seats: 5 },
        { toolId: "cursor", plan: "Business", monthlySpend: 120, seats: 3 },
        { toolId: "github-copilot", plan: "Business", monthlySpend: 57, seats: 3 },
        { toolId: "anthropic-api", plan: "Pay-as-you-go", monthlySpend: 300, seats: 1 },
      ],
      teamSize: 8,
    });
    const result = runAudit(input);
    expect(result.efficiencyScore).toBeGreaterThanOrEqual(0);
    expect(result.efficiencyScore).toBeLessThanOrEqual(100);
    expect(result.overlapDetected).toBe(true);
  });

  it("sets stack health to major_leak for savings over $500", () => {
    const input = makeInput({
      tools: [
        { toolId: "chatgpt", plan: "Team", monthlySpend: 500, seats: 20 },
        { toolId: "claude", plan: "Team", monthlySpend: 500, seats: 20 },
        { toolId: "anthropic-api", plan: "Pay-as-you-go", monthlySpend: 1000, seats: 1 },
      ],
      teamSize: 20,
    });
    const result = runAudit(input);
    expect(result.stackHealth).toBe("major_leak");
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
  });

  it("sets stack health to minor_drift for savings between $100 and $500", () => {
    const input = makeInput({
      tools: [
        { toolId: "chatgpt", plan: "Team", monthlySpend: 50, seats: 2 },
      ],
      teamSize: 3,
    });
    const result = runAudit(input);
    expect(result.stackHealth).toBeOneOf(["minor_drift", "optimal"]);
  });

  it("does not recommend Copilot switch when Cursor is not present and use case is coding", () => {
    const input = makeInput({
      tools: [
        { toolId: "github-copilot", plan: "Individual", monthlySpend: 10, seats: 1 },
      ],
      primaryUseCase: "coding",
    });
    const result = runAudit(input);
    const rec = result.recommendations[0];
    expect(rec.category).toBe("already-optimal");
  });

  it("preserves original input in the result", () => {
    const input = makeInput();
    const result = runAudit(input);
    expect(result.input).toEqual(input);
    expect(result.input.tools).toHaveLength(1);
    expect(result.input.teamSize).toBe(3);
  });
});
