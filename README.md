# CapExray

**See through your AI stack. Find the leaks. Keep the tools.** CapExray is a free web app that diagnoses startup AI spending and identifies savings opportunities across Cursor, ChatGPT, Claude, GitHub Copilot, Gemini, Windsurf, and API usage. Built for founders, CTOs, and engineering managers who want to know if they're misallocating AI budget.

[Live Demo](https://capexray.app) | [Run Your Diagnosis](https://capexray.app/diagnose)

## Screenshots

*Screenshots to be added after deployment.*

## Quick Start

```bash
git clone https://github.com/your-username/capexray.git
cd capexray
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase, Anthropic, and Resend keys

npm run dev
# Open http://localhost:3000
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/capexray)

Set these environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`

## Decisions

1. **Next.js 15 App Router over Pages Router** — App Router provides server components for the public report pages (OG tags, metadata), better code splitting, and aligns with the React Server Components direction. The tradeoff is a steeper learning curve and some edge cases with client/server boundaries.

2. **Deterministic audit engine over AI-generated recommendations** — The audit logic uses hardcoded rules because financial recommendations need to be reproducible, testable, and defensible. AI is used only for the personalized summary paragraph where it adds genuine value. A finance person should be able to read the reasoning and agree with every number.

3. **localStorage for form persistence instead of URL state** — Form data includes multiple tools with nested fields that would create unwieldy URLs. localStorage is simpler, persists across refreshes, and doesn't leak data in shared URLs. The tradeoff is it doesn't work across devices, but the form is a one-time interaction.

4. **Supabase for storage over custom Postgres** — Supabase provides a managed Postgres instance with a generous free tier, built-in auth, and a TypeScript client. This reduces ops burden for a tool that's primarily read-light (store audits and leads). If this needed 10k audits/day, I'd switch to direct Postgres with connection pooling.

5. **Framer Motion for animations over CSS-only** — The results page needs staggered card entrances, animated counters, and hover effects that CSS alone can't deliver cleanly. Framer Motion provides a declarative API with spring physics. The tradeoff is ~30KB added to the bundle, but it's tree-shakeable and worth the UX improvement for a page designed to be screenshotted and shared.

## Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: TailwindCSS v4, shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Database**: Supabase (Postgres)
- **Email**: Resend
- **AI**: Anthropic Claude API
- **Testing**: Vitest
- **CI**: GitHub Actions
