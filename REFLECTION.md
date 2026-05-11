# Reflection

## 1. The Hardest Bug

The hardest bug was the Supabase client initialization failing at build time. When running `next build`, the server-side pages (`/report/[slug]`) import the Supabase client at module level. Since environment variables aren't available during the static generation phase, `createClient("")` threw "supabaseUrl is required" and killed the entire build.

**Hypotheses:**
1. Environment variables weren't being loaded — ruled out because `NEXT_PUBLIC_*` vars should be available.
2. The module-level instantiation happens before Next.js injects env vars — likely.
3. I could add a build-time dummy URL — hacky and would cause runtime issues.

**What I tried:**
- First tried adding a conditional check: `if (!url) return null` — but this required null checks everywhere and TypeScript complained.
- Then tried a getter pattern where the client is created on first use — but the import was still evaluated at build time.
- Finally settled on a Proxy-based lazy initialization: the module exports a Proxy that delegates all property access to a lazily-created client. This way, the `createClient` call only happens when a method is actually invoked at runtime, not at import time.

**What worked:** The Proxy approach. It's transparent to consumers, type-safe, and defers initialization until runtime when env vars are available.

## 2. A Decision I Reversed

I initially planned to store audit results server-side in Supabase immediately on form submission, then redirect to a server-rendered results page. This would have meant a round-trip API call before showing results, adding latency and a failure mode where the user fills out the form but can't see results if Supabase is down.

I reversed this mid-build to keep the audit entirely client-side: the form submits to `runAudit()` which is a pure function, the result goes to localStorage, and the results page reads from localStorage. Storage to Supabase only happens when the user explicitly shares the report or captures the lead. This makes the core audit flow fast, offline-capable, and resilient.

The reversal was driven by the realization that the audit itself should have zero infrastructure dependencies. A user should never be blocked from seeing their savings because a database is down.

## 3. What I Would Build in Week 2

1. **Historical tracking** — Let users save audits over time and see how their AI spend changes month to month. This creates a reason to return and makes the tool sticky.

2. **Team integration** — Connect to billing systems (Stripe, corporate cards) to auto-detect AI tool subscriptions instead of manual entry. Even a browser extension that reads subscription emails would reduce friction.

3. **PDF export** — Generate a downloadable PDF report that founders can share with their board or finance team. This is the format people actually use in budget reviews.

4. **Benchmark comparisons** — Aggregate anonymous audit data to show "teams of your size in your industry spend $X on AI tools." This data becomes more valuable as volume grows.

5. **Alert system** — Email notification when a vendor changes pricing or a new tool becomes available that's cheaper than the user's current stack.

## 4. How I Used AI Tools

**Tool**: Claude (Sonnet 4) via Kilo IDE
**For what**: Scaffolding components, generating boilerplate form fields, writing test cases, and drafting initial documentation.

**What I didn't trust it with:**
- The audit engine logic. I wrote every rule manually because AI-generated financial reasoning would be indefensible. Each recommendation needs to trace to a specific pricing comparison that I can verify.
- Pricing data. AI models have stale training data. I verified every number against current vendor pricing pages.

**When the AI was wrong:**
I asked Claude to generate the audit form with dynamic plan selection. It initially used a pattern where changing the tool would call `setValue` for the plan, but it didn't clear the plan value when the tool changed — so users could end up with a plan name from Tool A applied to Tool B. I caught this during manual testing when I switched from "Cursor Pro" to "ChatGPT" and the plan still showed "Pro" which isn't a valid ChatGPT plan name (it should be "Plus"). Fixed by explicitly clearing the plan field on tool change: `setValue(\`tools.${index}.plan\`, "")`.

## 5. Self-Rating

- **Discipline: 7/10** — Started immediately and built the core in one session, but could have spread work more evenly across the week.
- **Code Quality: 8/10** — Clean TypeScript, consistent patterns, proper error handling, and no obvious bugs. Could improve with more edge case tests.
- **Design Sense: 8/10** — The dark SaaS aesthetic with glass cards and animated counters looks premium. The results page is screenshot-worthy. Could improve mobile spacing.
- **Problem Solving: 9/10** — Solved the Supabase build-time issue elegantly, designed a defensible audit engine, and handled the Anthropic API failure case with a deterministic fallback.
- **Entrepreneurial Thinking: 8/10** — The GTM plan identifies specific channels, the economics model has real numbers, and the product is designed for virality through shareable reports. Could be stronger on the referral mechanism.
