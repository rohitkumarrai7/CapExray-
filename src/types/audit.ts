export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type StartupStage =
  | "solo"
  | "small-team"
  | "growth"
  | "scale";

export type StackHealth = "optimal" | "minor_drift" | "major_leak";

export type DiagnosticAction = "downgrade" | "upgrade" | "switch_tool" | "optimize_seats" | "credit_savings" | "none";

export interface ToolEntry {
  toolId: ToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  primaryUseCase: UseCase;
  engineeringHeavy: boolean;
  apiUsageLevel: "low" | "medium" | "high";
  startupStage: StartupStage;
  role?: string;
}

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedAction: DiagnosticAction;
  recommendedPlan: string;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  confidence: "high" | "medium" | "low";
  reason: string;
  category: "plan-optimization" | "tool-switch" | "credit-savings" | "overlap-removal" | "already-optimal";
  alternativeTool?: string;
}

export interface AuditResult {
  id: string;
  slug: string;
  input: AuditInput;
  recommendations: ToolRecommendation[];
  totalMonthlySpend: number;
  totalOptimizedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  efficiencyScore: number;
  stackHealth: StackHealth;
  spendPerDev: number;
  avgSpendPerDev: number;
  overlapDetected: boolean;
  overlapTools: string[];
  summary: string;
  aiSummary: string | null;
  createdAt: string;
}

export interface LeadCapture {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  monthlySavings: number;
}

export interface PricingPlan {
  name: string;
  pricePerSeat: number;
  monthlyPrice: number;
  features: string[];
  maxUsers?: number;
  minUsers?: number;
  bestFor: string[];
}

export interface ToolPricing {
  id: ToolId;
  name: string;
  vendor: string;
  category: string;
  icon: string;
  plans: PricingPlan[];
  hasApiOption: boolean;
  apiPricing?: string;
  url: string;
}
