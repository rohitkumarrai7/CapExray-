# User Interviews

## Interview 1 — S.R., CTO at DevMetrics (Seed stage, 8-person team)

**Setting:** DM conversation on Twitter, 12 minutes

**Quotes:**
- "We pay for Cursor Pro for everyone, GitHub Copilot Business, ChatGPT Plus for the non-engineers, and I have no idea what our OpenAI API bill is until it hits the card."
- "Nobody owns 'AI tool spend' — it's split across engineering budget, productivity tools, and API costs in different cost centers."
- "I'd definitely use a tool that tells me if we're overpaying, but I wouldn't pay for it — it needs to be obviously free."

**Most surprising:** They're paying for both Cursor Pro AND Copilot Business simultaneously — $20 + $19 per seat — and nobody realized the overlap because different people approved each purchase.

**Design impact:** This confirmed the overlap detection feature as critical. I added specific logic to flag Cursor + Copilot as redundant since they serve the same code completion use case. It also reinforced making the tool completely free with no login wall.

---

## Interview 2 — M.K., Indie Hacker / Solo Founder (Pre-revenue)

**Setting:** Indie Hackers Slack DM, 10 minutes

**Quotes:**
- "I use Claude Pro for coding help, ChatGPT Plus for writing and brainstorming, and I pay OpenAI API for my app. That's $45/month which doesn't sound like much until you realize I'm pre-revenue."
- "I tried to figure out if I should drop one of Claude or ChatGPT but honestly they're both good at different things and I can't decide."
- "A tool that tells me 'you can get 80% of what you need from Claude Free + API' would actually change my behavior."

**Most surprising:** They didn't know Claude Free had web search and Sonnet access — they assumed Free was too limited. This is a knowledge gap, not a pricing problem.

**Design impact:** I added specific recommendations for free/cheaper plans when the user's use case doesn't require the paid tier. The "already optimal" state also matters here — if someone is on free plans, tell them they're doing it right rather than manufacturing savings.

---

## Interview 3 — P.M., Engineering Manager at GrowthCo (Series A, 45 engineers)

**Setting:** College network connection, 15 minutes

**Quotes:**
- "Our AI bill is probably $8,000/month across everything and I've never once looked at whether we're on the right plans. Nobody has time for that."
- "I know we have people on ChatGPT Enterprise, Claude Team, and Cursor Business. At least two people expensed Copilot individually last month. It's chaos."
- "If you could tell my CFO 'you're wasting $2,400/month' with a specific breakdown, she'd implement your recommendations today."

**Most surprising:** The complete lack of centralized visibility. The company has 45 engineers but no single person knows the total AI tool spend because it's scattered across individual expensify reports, department budgets, and a corporate card nobody reviews.

**Design impact:** This shaped the lead capture and shareability features. The "email this report" feature is actually a "forward this to your CFO" feature. The shareable public URL is designed for exactly this use case — an EM generates the audit and sends it to the person who can actually implement changes.
