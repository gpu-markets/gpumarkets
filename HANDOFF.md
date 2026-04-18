# GPU Markets — Astro Port Handoff

**Status:** Phase 1 skeleton, ~65% complete. Extracted assets ready to ship.
**Date:** 2026-04-18
**Maintainer:** John Jung (Vancouver, BC)

---

## What this project is

**GPU Markets** (`gpumarkets.dev`) is an open-source price index for the GPU rental market — the public, auditable, reproducible reference series for what GPU compute actually costs across 12 rental venues. Think Federal Reserve H.15 or Platts Dated Brent, but for H100/H200/B200 spot and reserved rentals.

**Brand:** GPU Markets
**Slogan:** "Pricing the GPU economy."
**Aesthetic:** Financial publication / statistical release. Cream background (`#f7f4ed`), Source Serif 4 + JetBrains Mono. Do NOT introduce gradients, shadows, glassmorphism, SaaS styling, or emoji. The design is locked — it should not be changed.

The project originated as a standalone single-page HTML artifact built in Claude's design tool. The port to Astro is because the site is outgrowing a single page (detail pages per series, content collections for research notes, etc.) and needs proper templating.

---

## Where we are in the port

### ✅ Done — do not rewrite

**Project config:**
- `package.json` — Astro 5.x, TypeScript, `uv`-style scripts
- `astro.config.mjs` — static output, Cloudflare Pages compatible
- `tsconfig.json` — strict
- `.gitignore`

**Extracted assets (critical — these are the heart of the site):**
- `public/shared.css` — 934 lines, the full stylesheet extracted verbatim from the standalone HTML's `<style>` block. CSS variables, typography, table treatments, masthead, nav, footer. Do NOT modify.
- `public/chart-data.js` — 17KB of `const SERIES_DATA = [...]` with 180-day price history for all 13 series. Extracted verbatim from the HTML. Do NOT modify.
- `public/app.js` — Row-toggle + interactive hero chart render logic. Extracted verbatim from the HTML. Do NOT modify.

These three files are loaded via `<link rel="stylesheet" href="/shared.css">` and `<script src="/chart-data.js">` / `<script src="/app.js">` in the Base layout. The HTML structure in the Astro components uses the same class names as the original HTML, so `shared.css` applies unchanged.

**Typed data:**
- `src/lib/types.ts` — `Series`, `Venue`, `ResearchNote` interfaces
- `src/lib/series-data.ts` — All 13 series (8 training, 5 inference) with accurate prices, deltas, sparkPaths, specs. Values match the standalone HTML exactly.

**Layout:**
- `src/layouts/Base.astro` — Top strip, masthead (3 heavy rules), nav, article slot, footer. Optionally includes `chart-data.js` + `app.js` via `withAppScripts={true}` prop.

**Components built:**
- `src/components/Eyebrow.astro` — "§ 01 · Latest Fixing" section headers
- `src/components/Hero.astro` — Landing hero headline + deck
- `src/components/WhatThisIs.astro` — Plain-English explainer paragraph
- `src/components/TodayAtAGlance.astro` — 3-column callout strip (largest decline, cross-venue spread, new outlier)
- `src/components/AudienceRow.astro` — "FOR NEOCLOUD CFOs · FOR ANALYSTS · …" row
- `src/components/FixingTable.astro` — Data-driven table, renders training or inference tier
- `src/components/HeroChart.astro` — SVG scaffold; `/public/app.js` fills it in at runtime
- `src/components/ConstituentVenues.astro` — `<details>` expansion with venue panel
- `src/components/Glossary.astro` — SPOT / OD / R1Y definitions

### ❌ Still needed

**Remaining components (straightforward — read the source HTML for exact markup):**
- `src/components/WhyThisExists.astro` — § 03 · three paragraphs of prose in a `.prose` wrapper
- `src/components/MethodologyQuote.astro` — § 04 · pull-quote block with `.pull` class
- `src/components/VenueCoverage.astro` — § 05 · full 12-venue table with `.venues` class and `.tag` status labels
- `src/components/Research.astro` — § 06 · lead note + 4 previous notes

**Pages:**
- `src/pages/index.astro` — compose all components in the exact order of the standalone HTML (see "Landing page section order" below)
- `src/pages/methodology.astro` — stub page with placeholder content, `currentPage="methodology"`
- `src/pages/data.astro` — stub
- `src/pages/venues.astro` — stub  
- `src/pages/research.astro` — stub

**Docs:**
- `README.md` at project root — setup (`npm install`, `npm run dev`), deployment (Cloudflare Pages), and the roadmap to Phase 2 (content collections + detail pages)

---

## Landing page section order

The `src/pages/index.astro` must compose components in **this exact order** to match the standalone HTML:

1. `<Hero>` — "A reference price for the GPU rental market."
2. `<WhatThisIs>` — "§ · What This Is"
3. `<TodayAtAGlance>` — "§ · Today At A Glance" (takes 3 items as prop)
4. `<AudienceRow>` — "FOR NEOCLOUD CFOs · …"
5. `<section>` with Eyebrow "§ 01 · Training Tier · Latest Fixing" + `<FixingTable series={trainingTier}>` + footnote paragraph + `<HeroChart>` + `<ConstituentVenues>`
6. `<section>` with Eyebrow "§ 02 · Inference Tier · Latest Fixing" + `<FixingTable series={inferenceTier}>` + footnote paragraph
7. `<section>` with `<Glossary>`
8. `<WhyThisExists>` — "§ 03 · Why This Exists"
9. `<MethodologyQuote>` — "§ 04 · Methodology"
10. `<VenueCoverage>` — "§ 05 · Venue Coverage"
11. `<Research>` — "§ 06 · Research · Lead Note"

Each numbered section in the HTML is wrapped in `<section><div class="wrap">...</div></section>`. The `.wrap` class is critical — it provides the max-width and horizontal padding that `shared.css` applies. **Never omit `<div class="wrap">` inside a section.**

The index page must pass `withAppScripts={true}` to `Base` so the chart and row-toggle work.

---

## Today At A Glance data

The current values to pass into `<TodayAtAGlance>`:

```ts
items={[
  { label: 'Largest Decline · 7d',       ticker: 'NVIDIA B200 SXM · Spot',  big: '\u22124.72%',  bigClass: 'neg',  sub: 'from $6.18 to $5.88' },
  { label: 'Largest Cross-Venue Spread', ticker: 'H100 SXM · Spot',         big: '$0.74',        bigClass: '',     sub: 'Vast.ai $1.87 to Lambda $2.61' },
  { label: 'New Outlier Rejection',      ticker: 'Hyperbolic · H100 SXM',   big: '+2.8 MAD',     bigClass: 'mute', sub: "excluded from today's fix" },
]}
```

---

## Venue coverage data

The 12 venues for the `<VenueCoverage>` table, in display order:

| Venue | URL | Access | Eligible | First obs |
|---|---|---|---|---|
| Vast.ai | https://cloud.vast.ai/create/ | REST API | yes | 2026-02-14 |
| RunPod | https://www.runpod.io/gpu-cloud | GraphQL API | yes | 2026-02-14 |
| Lambda Labs | https://lambdalabs.com/service/gpu-cloud | HTML | yes | 2026-02-14 |
| Prime Intellect | https://www.primeintellect.ai/ | HTML + CLI | yes | 2026-02-17 |
| Hyperstack | https://www.hyperstack.cloud/ | REST API | yes | 2026-02-17 |
| TensorDock | https://www.tensordock.com/ | REST API | yes | 2026-02-18 |
| DataCrunch | https://datacrunch.io/ | REST API | yes | 2026-02-18 |
| Hyperbolic | https://hyperbolic.xyz/ | REST API | yes | 2026-02-21 |
| Shadeform | https://www.shadeform.ai/ | Aggregator | cross | 2026-02-21 |
| AWS (p5 family) | https://aws.amazon.com/ec2/instance-types/p5/ | Official Pricing API | ref | 2026-02-14 |
| GCP (A3 family) | https://cloud.google.com/compute/docs/accelerator-optimized-machines | Cloud Billing API | ref | 2026-02-14 |
| Azure (ND v5) | https://learn.microsoft.com/en-us/azure/virtual-machines/nd-h100-v5-series | Retail Prices API | ref | 2026-02-14 |

Status labels: `yes` → "Yes", `cross` → "Cross-check", `ref` → "Reference". All three use the `.tag.<status>` CSS class.

---

## Research notes data

Lead note (styled differently from the rest):
- Date: 2026-04-11
- Title: "Decomposing the B200 curve — scarcity or generation?"
- Deck: "The B200 SXM spot series has fallen 8.3% over the last 30 days, its steepest drop since launch. A log-linear decomposition against supply announcements and CoreWeave's reported order book suggests demand-side exhaustion, not generational obsolescence. Charts and data below."

Previous notes (styled as an ordered list):
- 2026-04-04 — "The Lambda–Vast spread is structural, not arbitrage."
- 2026-03-28 — "Constructing a forward curve from reserved-rate differentials."
- 2026-03-21 — "Implied GPU residual value: H100 vs H200."
- 2026-03-14 — "Could a neocloud have hedged the 2024 crash? A backtest."

All currently link to `/research` (placeholder — in Phase 2 each gets its own page).

---

## Conventions followed

- Astro v5, TypeScript strict
- Props typed as `export interface Props`
- No frameworks or CSS libraries — the hand-rolled `shared.css` is the entire design system
- No motion beyond what's in the extracted `app.js` (a single 200ms `stroke-dashoffset` chart redraw)
- Minus signs are Unicode `\u2212` (figure minus), not hyphen — important for table alignment
- Non-breaking hyphens (`\u2011`) are used in dates to prevent awkward wrapping
- All external venue links use `target="_blank" rel="noopener"`

---

## How to finish (for next Claude)

**Read these files first, in order:**
1. This handoff document (you're reading it)
2. `/mnt/user-data/uploads/gpu-markets-standalone.html` — the source HTML, lines 447-624 contain the sections that still need porting (§ 03, § 04, § 05, § 06, footer is already done in Base)
3. `public/shared.css` — to confirm which class names to use
4. `src/components/FixingTable.astro` and `src/components/ConstituentVenues.astro` — these are the pattern to follow for the remaining components

**Build order:**
1. `src/components/WhyThisExists.astro` (simplest — 3 `<p>` tags in `.prose`)
2. `src/components/MethodologyQuote.astro` (pull-quote block)
3. `src/components/VenueCoverage.astro` (table, data from the markdown above)
4. `src/components/Research.astro` (lead note + list)
5. `src/pages/index.astro` (compose everything)
6. Four stub pages
7. `README.md`

**Don't:**
- Don't change the aesthetic, class names, or CSS
- Don't add animations, gradients, or decorative elements
- Don't rewrite `shared.css`, `chart-data.js`, or `app.js`
- Don't add a build-time data fetch yet — keep the static data in `src/lib/series-data.ts` for now
- Don't start Phase 2 (content collections, detail pages, Cloudflare Pages config) — that's the next chat after this one

**Do:**
- Mirror the exact class names from the original HTML
- Keep components small and focused
- Pass `withAppScripts={true}` on the index page only
- Commit to `main` when done — no CI/CD until Phase 2

---

## Phase 2 roadmap (for the chat AFTER the next one)

Once Phase 1 ships, the next milestones are:
- Astro content collections (`src/content/config.ts`) for series, venues, research notes with Zod schemas
- Dynamic route `src/pages/series/[slug].astro` that generates one detail page per series (13 pages)
- Dynamic route `src/pages/venues/[slug].astro` for venue detail pages (12 pages)
- MDX support for research notes
- GitHub Actions workflow that rebuilds on content changes
- Cloudflare Pages deployment + custom domain `gpumarkets.dev`
- RSS feed at `/feed.xml`

---

## Files in this handoff

```
gpu-markets-site/
├── .gitignore
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── HANDOFF.md                    # this file
├── public/
│   ├── app.js                    # ✅ extracted, do not modify
│   ├── chart-data.js             # ✅ extracted, do not modify
│   └── shared.css                # ✅ extracted, do not modify
└── src/
    ├── layouts/
    │   └── Base.astro            # ✅ done
    ├── lib/
    │   ├── series-data.ts        # ✅ done
    │   └── types.ts              # ✅ done
    ├── components/
    │   ├── AudienceRow.astro     # ✅ done
    │   ├── ConstituentVenues.astro  # ✅ done
    │   ├── Eyebrow.astro         # ✅ done
    │   ├── FixingTable.astro     # ✅ done
    │   ├── Glossary.astro        # ✅ done
    │   ├── Hero.astro            # ✅ done
    │   ├── HeroChart.astro       # ✅ done
    │   ├── TodayAtAGlance.astro  # ✅ done
    │   └── WhatThisIs.astro      # ✅ done
    └── pages/                    # ❌ empty — needs index.astro + 4 stubs
```
