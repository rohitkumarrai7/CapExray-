# Architecture

## System Diagram

```mermaid
graph TD
    A[User visits landing page] --> B[Clicks "Run Free Audit"]
    B --> C[Audit Input Form]
    C -->|Persists to localStorage| C
    C -->|Submits| D[Client-side Audit Engine]
    D -->|Deterministic rules| E[AuditResult]
    E -->|Stored in localStorage| F[Results Page]
    F -->|Optional| G[Anthropic API - AI Summary]
    G -->|Fallback| H[Templated Summary]
    F -->|Optional| I[Lead Capture]
    I -->|POST| J[/api/capture-lead]
    J -->|Insert| K[Supabase - leads table]
    J -->|Send| L[Resend - Transactional Email]
    F -->|Optional| M[Share Report]
    M -->|POST| N[/api/report]
    N -->|Upsert| O[Supabase - audits table]
    N -->|Returns slug| P[Public URL]
    P -->|GET| Q[/report/[slug]]
    Q -->|SSR with OG tags| R[Public Report View]
```

## Data Flow

1. **Input**: User adds AI tools (tool, plan, spend, seats) + team info (size, use case, stage)
2. **Processing**: Client-side `runAudit()` evaluates each tool against hardcoded rules:
   - Plan optimization (Team plan for 2 users → downgrade)
   - Overlap detection (ChatGPT + Claude both at Team tier)
   - Credit savings (API spend > $100/mo → Credex credits)
   - Tool switching (Copilot Business → Cursor Pro for coding teams)
3. **Output**: `AuditResult` with per-tool recommendations, total savings, efficiency score, benchmarks
4. **AI Enhancement**: Optional call to Anthropic API for a ~100-word personalized summary
5. **Storage**: Audit saved to Supabase, lead captured with email
6. **Sharing**: Public URL generated with anonymized data and OG meta tags

## Stack Choices

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 App Router | SSR for public reports, API routes, TypeScript support |
| UI | TailwindCSS + shadcn/ui | Rapid development, consistent design system, accessible primitives |
| Forms | React Hook Form + Zod | Type-safe validation, minimal re-renders |
| Database | Supabase | Managed Postgres, generous free tier, TypeScript client |
| Email | Resend | Modern API, free tier covers initial volume |
| Charts | Recharts | Composable, responsive, good dark mode support |
| Testing | Vitest | Fast, native TypeScript, compatible with existing tooling |

## Scaling to 10k Audits/Day

1. **Database**: Move to direct Postgres with PgBouncer connection pooling. Add read replicas for public report views.
2. **Caching**: Add Redis for public report slugs. Cache OG image generation.
3. **Rate Limiting**: Implement token bucket rate limiting at the edge (Vercel Edge Middleware or Cloudflare).
4. **Queue**: Move email sending to a queue (Upstash QStash or BullMQ) instead of synchronous fetch.
5. **CDN**: Serve static assets via CDN. Public reports can be ISR (Incremental Static Regeneration) with 5-minute revalidation.
6. **Monitoring**: Add error tracking (Sentry), analytics (PostHog), and uptime monitoring.
