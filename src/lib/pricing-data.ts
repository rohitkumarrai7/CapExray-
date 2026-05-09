import { ToolPricing } from "@/types/audit";

export const TOOL_PRICING: ToolPricing[] = [
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Cursor Inc.",
    category: "AI Code Editor",
    icon: "cursor",
    url: "https://cursor.sh/pricing",
    hasApiOption: false,
    plans: [
      {
        name: "Hobby",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["2 weeks of Pro features", "2000 completions", "50 slow premium requests"],
        bestFor: ["individual exploration"],
      },
      {
        name: "Pro",
        pricePerSeat: 20,
        monthlyPrice: 20,
        features: ["Unlimited completions", "500 fast premium requests/month", "Unlimited slow premium requests"],
        bestFor: ["individual developers", "solo founders", "indie hackers"],
      },
      {
        name: "Business",
        pricePerSeat: 40,
        monthlyPrice: 40,
        features: ["Everything in Pro", "Centralized billing", "Admin dashboard", "Privacy mode", "500 fast premium requests/month"],
        minUsers: 2,
        bestFor: ["teams with centralized billing needs"],
      },
      {
        name: "Enterprise",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Custom pricing", "SAML/S SO", "Dedicated support"],
        bestFor: ["large organizations"],
      },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub (Microsoft)",
    category: "AI Code Assistant",
    icon: "github",
    url: "https://github.com/features/copilot#pricing",
    hasApiOption: false,
    plans: [
      {
        name: "Individual",
        pricePerSeat: 10,
        monthlyPrice: 10,
        features: ["Code completions", "Chat", "PR summaries"],
        bestFor: ["individual developers"],
      },
      {
        name: "Business",
        pricePerSeat: 19,
        monthlyPrice: 19,
        features: ["Everything in Individual", "Organization management", "Policy management", "IP indemnity"],
        minUsers: 2,
        bestFor: ["teams needing centralized management"],
      },
      {
        name: "Enterprise",
        pricePerSeat: 39,
        monthlyPrice: 39,
        features: ["Everything in Business", "Custom models", "Knowledge bases", "SAML SSO"],
        minUsers: 2,
        bestFor: ["enterprises with compliance needs"],
      },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "AI Assistant",
    icon: "claude",
    url: "https://claude.ai/pricing",
    hasApiOption: true,
    apiPricing: "Usage-based, starts at $0.003/1K tokens (Haiku)",
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Limited messages", "Claude Sonnet model", "Web search"],
        bestFor: ["casual users"],
      },
      {
        name: "Pro",
        pricePerSeat: 20,
        monthlyPrice: 20,
        features: ["5x usage vs Free", "Claude Sonnet + Opus", "Projects", "Early access to features"],
        bestFor: ["power users", "researchers", "writers"],
      },
      {
        name: "Max",
        pricePerSeat: 100,
        monthlyPrice: 100,
        features: ["20x usage vs Free", "Claude Opus priority", "Higher rate limits"],
        bestFor: ["heavy AI users", "teams with one power user"],
      },
      {
        name: "Team",
        pricePerSeat: 25,
        monthlyPrice: 25,
        features: ["Everything in Pro", "More usage", "Admin console", "Shared projects"],
        minUsers: 2,
        bestFor: ["small teams collaborating"],
      },
      {
        name: "Enterprise",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Custom pricing", "SSO", "SCIM", "Audit logs"],
        minUsers: 5,
        bestFor: ["organizations needing enterprise features"],
      },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "AI Assistant",
    icon: "chatgpt",
    url: "https://chatgpt.com/pricing",
    hasApiOption: true,
    apiPricing: "Usage-based, GPT-4o at $2.50/1M input tokens",
    plans: [
      {
        name: "Plus",
        pricePerSeat: 20,
        monthlyPrice: 20,
        features: ["GPT-4o access", "DALL-E", "GPTs", "Advanced data analysis"],
        bestFor: ["individual power users"],
      },
      {
        name: "Team",
        pricePerSeat: 25,
        monthlyPrice: 25,
        features: ["Everything in Plus", "Higher limits", "Admin console", "Shared GPTs workspace"],
        minUsers: 2,
        bestFor: ["teams needing shared workspace"],
      },
      {
        name: "Enterprise",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Custom pricing", "Unlimited GPT-4o", "SSO", "SCIM", "Analytics"],
        minUsers: 5,
        bestFor: ["enterprises needing compliance"],
      },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    vendor: "Anthropic",
    category: "AI API",
    icon: "anthropic",
    url: "https://www.anthropic.com/pricing",
    hasApiOption: true,
    apiPricing: "Claude 3.5 Sonnet: $3/M input, $15/M output tokens",
    plans: [
      {
        name: "Pay-as-you-go",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Usage-based pricing", "All Claude models", "No minimum spend"],
        bestFor: ["variable workloads", "prototyping"],
      },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    vendor: "OpenAI",
    category: "AI API",
    icon: "openai",
    url: "https://openai.com/api/pricing/",
    hasApiOption: true,
    apiPricing: "GPT-4o: $2.50/M input, $10/M output tokens",
    plans: [
      {
        name: "Pay-as-you-go",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Usage-based pricing", "All OpenAI models", "No minimum spend"],
        bestFor: ["variable workloads", "prototyping"],
      },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "AI Assistant",
    icon: "gemini",
    url: "https://one.google.com/about/ai-premium",
    hasApiOption: true,
    apiPricing: "Gemini 2.5 Pro: $1.25/M input, $10/M output tokens",
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Gemini model access", "Limited queries"],
        bestFor: ["casual users"],
      },
      {
        name: "Pro",
        pricePerSeat: 0,
        monthlyPrice: 19.99,
        features: ["Gemini Advanced (2.5 Pro)", "Google One 2TB", "Priority access"],
        bestFor: ["individuals in Google ecosystem"],
      },
      {
        name: "API",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Usage-based pricing", "Vertex AI or Google AI Studio"],
        bestFor: ["developers integrating AI"],
      },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    category: "AI Code Editor",
    icon: "windsurf",
    url: "https://windsurf.com/pricing",
    hasApiOption: false,
    plans: [
      {
        name: "Free",
        pricePerSeat: 0,
        monthlyPrice: 0,
        features: ["Basic completions", "Limited AI features"],
        bestFor: ["light users"],
      },
      {
        name: "Pro",
        pricePerSeat: 15,
        monthlyPrice: 15,
        features: ["Unlimited completions", "Premium AI models", "Cascade flows"],
        bestFor: ["individual developers"],
      },
      {
        name: "Team",
        pricePerSeat: 30,
        monthlyPrice: 30,
        features: ["Everything in Pro", "Team management", "Shared context"],
        minUsers: 2,
        bestFor: ["small development teams"],
      },
    ],
  },
];

export const TOOL_NAMES: Record<string, string> = Object.fromEntries(
  TOOL_PRICING.map((t) => [t.id, t.name])
);

export const USE_CASE_LABELS: Record<string, string> = {
  coding: "Software Development",
  writing: "Content & Copy Writing",
  data: "Data Analysis & Analytics",
  research: "Research & Knowledge Work",
  mixed: "Mixed / General Use",
};

export const STARTUP_STAGE_LABELS: Record<string, string> = {
  solo: "Solo Founder / Freelancer",
  "small-team": "Small Team (2-10)",
  growth: "Growth Stage (11-50)",
  scale: "Scaling (50+)",
};

export const BENCHMARK_SPEND_PER_DEV = {
  solo: 45,
  "small-team": 52,
  growth: 68,
  scale: 85,
};

export const INDUSTRY_AVG_SPEND_PER_DEV = 58;
