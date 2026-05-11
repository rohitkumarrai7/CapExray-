# Prompts

## AI Summary Prompt

This is the prompt used to generate the personalized audit summary via the Anthropic API. It's sent in `POST /api/generate-summary`.

```
You are a cost optimization analyst for a startup. Write a personalized ~100-word summary of this AI spend audit.

Total monthly spend: $${totalMonthlySpend}
Total monthly savings opportunity: $${totalMonthlySavings}
Total annual savings: $${totalAnnualSavings}
Efficiency score: ${efficiencyScore}/100
Team size: ${teamSize}
Primary use case: ${primaryUseCase}

Tool breakdown:
${tools}

Write a concise, actionable summary paragraph. Be specific about dollar amounts. If savings are significant, emphasize the annual impact. If the stack is already efficient, acknowledge that. Use a professional but approachable tone. Do not use bullet points.
```

## Why This Prompt Works

1. **Role definition** — "cost optimization analyst" sets the tone as professional, analytical, and startup-relevant.
2. **Structured data injection** — All financial numbers are provided as variables, so the AI doesn't hallucinate amounts.
3. **Length constraint** — "~100 words" keeps summaries concise and readable on the results page.
4. **Tone guidance** — "professional but approachable" matches the CapExray brand.
5. **Format constraint** — "Do not use bullet points" ensures a single readable paragraph.

## What I Tried That Didn't Work

- **Initial version without dollar amounts**: The AI would make up savings numbers. Fix: inject exact figures from the audit engine.
- **Asking for "key recommendations"**: The AI would list all recommendations, making the summary too long. Fix: the tool breakdown is summarized as a single line per tool.
- **Asking for "optimistic" tone**: The AI would overstate savings. Fix: "professional but approachable" keeps it grounded.

## Fallback Strategy

When the Anthropic API is unavailable (no key, rate limit, error), the system falls back to `generateTemplatedSummary()` which uses the same audit data to produce a deterministic summary. The fallback mentions exact dollar amounts and the top 3 recommendations. This ensures every user sees a useful summary regardless of API status.
