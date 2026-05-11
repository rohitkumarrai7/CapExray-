# Metrics

## North Star Metric

**Number of audits completed per week.**

Why: This measures both acquisition (people finding the tool) and activation (people completing the core value action). Every downstream metric — leads captured, reports shared, Credex consultations — is a function of completed audits. It's the clearest signal that the product is delivering value.

## Input Metrics

1. **Landing page → audit form conversion rate** — Measures whether the landing page copy effectively communicates the value proposition. Target: >35%. If this drops, the hero copy or CTA needs iteration.

2. **Audit form → results completion rate** — Measures whether the form is easy enough to complete. Target: >65%. If this drops, the form has too much friction (too many fields, confusing UX).

3. **Results page → share/report rate** — Measures whether the results are compelling enough to share or save. Target: >15%. If this drops, the results aren't delivering a "wow" moment.

## What to Instrument First

1. **PostHog event tracking** on: `audit_started`, `audit_completed`, `email_captured`, `report_shared`, `credex_cta_clicked`
2. **Funnel visualization** in PostHog: landing page → form → results → lead capture → share
3. **Error tracking** via Sentry: API failures, form validation errors, JS errors on results page

## Pivot Trigger

If **fewer than 10% of completed audits show any savings**, the product's core premise is wrong — AI tool pricing is already competitive and the market doesn't have the inefficiency we assumed. At that point, pivot from "find savings" to "validate you're spending well" — which is a less compelling but still useful value proposition. The specific number: if after 200 audits the average savings is under $50/month, reconsider the core thesis.
