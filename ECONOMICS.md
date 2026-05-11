# Economics

## Unit Economics for CapExray as a Credex Lead Generation Tool

### Converted Lead Value

A converted lead for Credex is a startup purchasing discounted AI credits. Based on publicly available information about AI credit marketplaces:

- **Average customer spend on AI credits:** $2,000-5,000/month
- **Credex take rate (commission):** ~10-15% of credit value
- **Average customer lifetime:** 8-12 months (startups grow or pivot)
- **Revenue per converted customer:** $2,000/mo × 12mo × 12.5% = **$3,000 LTV**

This is conservative. Enterprise customers who find Credex through the audit tool may spend significantly more.

### Cost Per Acquisition by Channel

| Channel | CAC (estimated) | Notes |
|---------|-----------------|-------|
| Organic Reddit/HN posts | $0 (time only) | High intent, but limited volume |
| Twitter/X threads | $0 (time only) | Good for awareness, moderate intent |
| SEO (long-tail keywords) | $0-50/content | Takes 2-3 months to rank |
| Product Hunt launch | $0 (if organic upvotes) | Spike traffic, moderate conversion |
| Referral from existing users | $0 | Highest intent, lowest volume initially |

**Blended CAC target: <$50** for the first 1,000 users (all organic channels).

### Conversion Funnel

```
Landing page visitors:     1,000
Audit form started:          400 (40% — high intent from relevant channels)
Audit completed:             280 (70% of starts — form is quick, <60s)
Email captured:               84 (30% of completed audits)
High-savings (>$500/mo):      28 (10% of completed audits)
Credex consultation:           7 (25% of high-savings users)
Credit purchase:               2 (30% of consultations)
```

**Conversion rate from audit completed → credit purchase: ~0.7%**

At this rate:
- 1,000 audits completed → 7 credit purchases
- Revenue from 7 customers: 7 × $3,000 LTV = **$21,000**

Cost to acquire 1,000 audits: ~$500 (content creation time)
**CAC per credit customer: $500 / 7 = $71**
**LTV:CAC ratio: $3,000 / $71 = 42:1** — extremely healthy

### Path to $1M ARR in 18 Months

**Month 1-3 (Launch):** 500 audits/month → 3 credit customers/month → $9,000 cumulative revenue

**Month 4-6 (Product Hunt + SEO):** 2,000 audits/month → 12 credit customers/month → $54,000 cumulative

**Month 7-12 (Viral loop + referral):** 5,000 audits/month → 30 credit customers/month → $270,000 cumulative

**Month 13-18 (Scale):** 10,000 audits/month → 60 credit customers/month → $1M+ cumulative revenue

**Assumptions that must be true:**
1. 40% of landing page visitors start the audit (requires compelling copy + CTA)
2. 10% of audits show >$500/mo savings (requires realistic pricing gaps in market)
3. 25% of high-savings users book a Credex consultation (requires clear, non-pushy CTA)
4. 30% of consultations convert to credit purchase (requires Credex sales execution)
5. Organic growth compounds at 15% month-over-month (requires shareable results)

**Key risk:** If the percentage of audits showing significant savings is lower than expected, the funnel dries up. Mitigation: continuously update pricing data and add more tools to increase the probability of finding savings.

### Infrastructure Costs (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $0-20 | Free tier covers 100k requests |
| Supabase | $0-25 | Free tier covers 500MB, 50k rows |
| Resend | $0 | 100 emails/day free |
| Anthropic API | $10-50 | ~100 words per summary, low volume |
| Domain | $1 | Annual cost amortized |
| **Total** | **$11-96/mo** | Profitable from month 1 |
