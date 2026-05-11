# Tests

## How to Run

```bash
npx vitest run
```

All tests are in `src/__tests__/audit-engine.test.ts`.

## Test Coverage

| # | What it covers | Test name |
|---|---------------|-----------|
| 1 | Already-optimal case for Pro plan with 1 seat | `returns an already-optimal result for a single Pro plan with 1 seat` |
| 2 | Team plan downgrade recommendation | `flags Team plan with 2 or fewer seats as overkill and recommends downgrade` |
| 3 | ChatGPT + Claude overlap detection | `detects overlap when both ChatGPT Team and Claude Team are present` |
| 4 | Cursor + Copilot overlap detection | `detects overlap between Cursor and GitHub Copilot` |
| 5 | API credit savings recommendation | `recommends credit savings for high API spend` |
| 6 | Total savings across multiple tools | `generates correct total savings across multiple tools` |
| 7 | Spend per developer calculation | `calculates spend per developer correctly` |
| 8 | Fallback summary generation | `generates a fallback summary when no AI summary is provided` |
| 9 | Free tool with zero spend | `handles a single free tool with zero spend` |
| 10 | Unique slug and ID generation | `generates a unique slug and id for each audit` |
| 11 | Windsurf Team downgrade | `recommends downgrade for Windsurf Team with 2 seats` |
| 12 | Enterprise plan overkill for small teams | `flags Enterprise plan as overkill for team under 20 people` |
| 13 | OpenAI API credit savings | `recommends credit savings for high OpenAI API spend` |
| 14 | Gemini Free plan optimal | `handles Gemini Free plan as already-optimal` |
| 15 | Complex stack efficiency scoring | `calculates efficiency score within 0-100 range for complex stacks` |
| 16 | Stack health major leak threshold | `sets stack health to major_leak for savings over $500` |
| 17 | Stack health minor drift threshold | `sets stack health to minor_drift for savings between $100 and $500` |
| 18 | Copilot without Cursor edge case | `does not recommend Copilot switch when Cursor is not present and use case is coding` |
| 19 | Input preservation in result | `preserves original input in the result` |

Total: **19 tests**, all passing. CI runs via `.github/workflows/ci.yml` on every push to `main`.
