# GPU Markets — Site Status & Handoff

**Status:** Phase 1 shipped. Phase 2 ~50% complete. Live at [gpumarkets.dev](https://gpumarkets.dev).
**Date:** 2026-04-20
**Maintainer:** John Jung (Vancouver, BC)

---

## What this project is

**GPU Markets** (`gpumarkets.dev`) is an open-source reference price index for the GPU rental market — the public, auditable, reproducible price series for what GPU compute actually costs across 12 rental venues. The mental model is Fed H.15, Platts Dated Brent, FRED — not a SaaS product.

**Brand:** GPU Markets
**Slogan:** "Pricing the GPU economy."
**Aesthetic:** Financial publication / statistical release. Cream background (`#f7f4ed`), Source Serif 4 body + JetBrains Mono figures + IBM Plex Sans UI labels. No gradients, shadows, glassmorphism, SaaS styling, or emoji. The design is locked.

Originated as a single-page HTML artifact built in Claude's design tool; ported to Astro when the site outgrew one page (detail pages per series, RSS, content collections).

---

## Where we are

### ✅ Phase 1 — shipped

The HTML→Astro port is complete. The original handoff's "still needed" list (WhyThisExists / MethodologyQuote / VenueCoverage / Research components, index composition, stub pages, README) is 100% done.

**Live routes (16 HTML + 3 XML + 14 CSV):**

| Route | Notes |
| --- | --- |
| `/` | Landing page, hero chart, both tier tables, venue coverage, research lead |
| `/methodology` | Now carries Fixing Calendar + Revision & Vintage Policy sections (2026-04-20) |
| `/data` | Rewired from stub → real downloads page + BibTeX citation (2026-04-20) |
| `/venues` | 12-venue directory |
| `/research`, `/research/b200-curve-decomposition`, `/research/three-integration-patterns` | Research notes |
| `/news` | Full news archive |
| `/changelog`, `/roadmap`, `/disclaimer`, `/references`, `/404` | Standard pages |
| `/feed.xml`, `/news.xml`, `/sitemap.xml` | RSS 2.0 feeds |
| `/data/fixings.csv` | All-series current fix, RFC-4180 (2026-04-20) |
| `/data/series/{slug}.csv` | 13 per-series endpoints, stable URLs (2026-04-20) |

**Trust / provenance (shipped 2026-04-20):**

- Footer renders `site {sha} · data {sha} · built {time} UTC` from [scripts/build.sh](scripts/build.sh)
- Per-series strike time visible in `FixingTable`; `◦` marker flags off-strike rows
- Footnote superscripts + anchored notes block below each fixing table
- BibTeX / APA / plain-text citation blocks on `/data`
- `n · 30d` sample-size column in venue coverage table
- Revision & Vintage Policy + Fixing Calendar sections documented on `/methodology`

### 🟡 Phase 2 — in flight

| Shipped | Pending |
| --- | --- |
| [x] Deploy at gpumarkets.dev (Cloudflare Workers Builds) | [ ] Astro content collections + Zod schemas for series, venues, research |
| [x] RSS feeds (`/feed.xml`, `/news.xml`) | [ ] Per-series detail pages (`src/pages/series/[slug].astro`, 13 pages) |
| [x] Per-series stable URLs (as CSV today) | [ ] Per-venue detail pages (`src/pages/venues/[slug].astro`, 12 pages) |
| [x] Build-time provenance (site + data SHA, build time) | [ ] MDX research notes (currently hand-rolled `.astro`) |
| [x] Citation blocks (BibTeX/APA/plain) | [ ] Historical data in per-series CSVs (needs `history[]` wire-up) |
| [x] Fixing calendar + revision policy docs | [ ] Vintage cursor UI — client-side bitemporal replay per series |
| | [ ] GitHub Actions rebuild trigger on data-repo commits |

---

## Today's session (2026-04-20) — files touched

Added:

- [src/components/Citation.astro](src/components/Citation.astro) — BibTeX / APA / plain-text copy blocks
- [src/pages/data/fixings.csv.ts](src/pages/data/fixings.csv.ts) — aggregate CSV of current fix
- [src/pages/data/series/[slug].csv.ts](src/pages/data/series/[slug].csv.ts) — per-series CSV routes (13 emitted)
- [scripts/build.sh](scripts/build.sh) — build-time provenance capture (site SHA + data SHA via GitHub API)

Modified:

- [src/layouts/Base.astro](src/layouts/Base.astro) — footer provenance block + SHA fallback chain
- [src/lib/types.ts](src/lib/types.ts) — `Series.fixedAt?`, `Series.footnotes?`
- [src/lib/series-data.ts](src/lib/series-data.ts) — added `snapshotSha` export (placeholder 40-zero SHA); seeded demo footnote on H100 SXM Spot + off-strike demo on MI300X
- [src/components/FixingTable.astro](src/components/FixingTable.astro) — new `strikeAt` prop, off-strike `◦` marker, footnote machinery with superscript refs and anchored notes block
- [src/components/VenueCoverage.astro](src/components/VenueCoverage.astro) — `n · 30d` sample-size column + footnote prose update
- [src/pages/index.astro](src/pages/index.astro) — passes `STRIKE_AT` to both `FixingTable` instances
- [src/pages/methodology.astro](src/pages/methodology.astro) — added Fixing Calendar + Revision & Vintage Policy sections
- [src/pages/data.astro](src/pages/data.astro) — rewired stub → CSV index + Citation component + Phase 2 note
- [package.json](package.json) — `build` now runs via `bash scripts/build.sh`; `build:raw` preserved as escape hatch

**Verified**: `npm run check` → 0 errors/warnings/hints (43 files). `npm run build` → 13 HTML + 3 XML + 14 CSV in 351ms. Provenance line logs `→ build provenance · site=d86b79d · data=dev`.

---

## Next steps (priority order)

1. **Bump `snapshotSha` in [src/lib/series-data.ts](src/lib/series-data.ts)** from the all-zero placeholder to a real 40-char SHA once the data repo has the first published fixing committed. Until then, the footer shows `data dev` — that's honest but not ideal for a public launch.

2. **Investigate why [scripts/build.sh](scripts/build.sh) couldn't resolve the data-repo SHA.** The GitHub API call for `gpu-markets/gpu-markets` HEAD returned empty in today's build. Either the repo is private, renamed, or doesn't exist yet. Two possible fixes: make the data repo public, or pre-export `DATA_REPO_SHA` in Cloudflare Workers Builds env config so the script's outer fallback doesn't need to fire.

3. **Content collections with Zod schemas** — start with `src/content/research/` (only 2 notes, easiest migration), then `src/content/venues/` (12), then `src/content/series/` (13). Will replace the hand-rolled arrays in `src/lib/*.ts` (series-data.ts, research-notes.ts, news.ts, VenueCoverage.astro's local data).

4. **Per-series detail pages** at `src/pages/series/[slug].astro` — semi-blocking for academic inbound links because the BibTeX generator in [src/components/Citation.astro](src/components/Citation.astro#L45) already reserves this URL pattern in its `howpublished` field.

5. **Per-venue detail pages** at `src/pages/venues/[slug].astro` — 12 pages, less urgent than series pages since links from news and research currently go to the venue's own site.

6. **MDX for research notes** — current `/research/b200-curve-decomposition.astro` is hand-rolled `.astro`. Moving to `src/content/research/*.mdx` lets non-Astro writers contribute without touching frontmatter/JSX.

7. **Historical CSV** — when `history[]` is wired per series (from the data repo), fatten `/data/series/{slug}.csv` response bodies with the full daily history. URL stays stable; response size grows.

8. **Vintage cursor UI** — see [src/pages/methodology.astro](src/pages/methodology.astro) § Revision & Vintage Policy for the stated plan. Client-side slider replays bitemporal vintages of a single series. Blocks on the data repo publishing per-vintage JSON.

9. **README drift** — README says "Cloudflare Pages"; actual deploy is Cloudflare **Workers Builds** with worker name `gpumarketsdev`. Fix during next docs pass.

---

## Context for next session

- **Today's date**: 2026-04-20
- **Local build SHA (today)**: `d86b79d` — production SHA will differ on next deploy
- **Live worker name**: `gpumarketsdev` (the older `gpumarkets` worker was deleted 2026-04-19 during post-transfer cleanup)
- **Credentials**: persisted Cloudflare + Buttondown API tokens at `~/.config/gpumarkets/{cf_env,bd_env}` (user authorized 2026-04-19 for autonomous work). Scopes and limits documented in user memory.
- **Deployment target**: Cloudflare Workers Builds from `main` on `gpu-markets/gpumarkets` repo. Build command: `bash scripts/build.sh`. Output: `dist/`.
- **Data repo**: `gpu-markets/gpu-markets` (separate repo). May or may not be public yet — worth confirming when resolving next-step #2.
- **`declare const process` pattern** in [Base.astro](src/layouts/Base.astro) avoids adding `@types/node` — preserve it, don't install the package just to make TS happy about `process.env`.
- **Footnote numbering** in [FixingTable.astro](src/components/FixingTable.astro) is per-tier (1..N per tier), not global. If tiers ever get combined, renumbering is required.
- **Both CSV endpoints** set `Content-Disposition: inline` deliberately — click-to-preview in-browser rather than force-download. Journalists appreciate this; scrapers don't care either way.
- **Two demo footnotes** live in series-data.ts: H100 SXM Spot (Hyperbolic outlier) and MI300X Spot (TensorDock off-strike backfill). **Keep these in sync with real operational events going forward** — don't let them become perpetual fixtures that diverge from reality.
- **Strict reverse-chrono rule** in news.ts / research-notes.ts is documented in user memory. No curated leads; newest first, always.

---

## Conventions — DO NOT change (durable)

- No frameworks or CSS libraries — `shared.css` is the entire design system
- No motion beyond the 200ms chart redraw in `/public/app.js`
- Minus signs are Unicode `−` (U+2212), not hyphen — important for tabular alignment
- Non-breaking hyphens `‑` (U+2011) inside dates to prevent mid-token wraps
- All external venue links use `target="_blank" rel="noopener"`
- Class names mirror the original standalone HTML so `shared.css` applies unchanged
- Every section wraps in `<section><div class="wrap">…</div></section>` — never omit `.wrap`
- `\uXXXX` escapes only work inside `{…}` JS expressions or frontmatter strings in `.astro` — **not** in raw JSX markup text (use literal Unicode characters there)
- Pass `withAppScripts={true}` to `<Base>` only on pages that need the hero chart / row-toggle

## DO NOT touch (extracted assets)

- [public/shared.css](public/shared.css) — 934-line design system, extracted verbatim from the HTML prototype
- [public/app.js](public/app.js) — hero chart + row-toggle JS
- [public/chart-data.js](public/chart-data.js) — 180-day price history

---

## File tree (current)

```text
gpu-markets-site/
├── .gitignore
├── astro.config.mjs
├── CONTRIBUTING.md
├── HANDOFF.md                            # this file
├── LICENSE, LICENSE-DATA
├── README.md                             # stale on deploy method
├── package.json                          # build → scripts/build.sh
├── tsconfig.json
├── public/
│   ├── app.js, chart-data.js, shared.css   # do not modify
│   ├── favicon.svg, og.png
├── scripts/
│   ├── build.sh                          # 2026-04-20 — provenance capture
│   └── push-to-github.sh
└── src/
    ├── layouts/
    │   └── Base.astro                    # footer provenance added 2026-04-20
    ├── lib/
    │   ├── news.ts                       # strict reverse-chrono
    │   ├── research-notes.ts             # strict reverse-chrono
    │   ├── series-data.ts                # snapshotSha + demo footnotes added 2026-04-20
    │   └── types.ts                      # fixedAt/footnotes added 2026-04-20
    ├── components/                       # 16 components
    │   ├── AudienceRow.astro
    │   ├── CapacityWeightedRow.astro
    │   ├── Citation.astro                # NEW 2026-04-20
    │   ├── ConstituentVenues.astro
    │   ├── Eyebrow.astro
    │   ├── FixingTable.astro             # strikeAt + footnotes 2026-04-20
    │   ├── Glossary.astro
    │   ├── Hero.astro
    │   ├── HeroChart.astro
    │   ├── MethodologyQuote.astro
    │   ├── News.astro
    │   ├── Research.astro
    │   ├── TodayAtAGlance.astro
    │   ├── VenueCoverage.astro           # n · 30d column 2026-04-20
    │   ├── WhatThisIs.astro
    │   └── WhyThisExists.astro
    └── pages/
        ├── 404.astro
        ├── changelog.astro
        ├── data.astro                    # rewired 2026-04-20
        ├── disclaimer.astro
        ├── feed.xml.ts
        ├── index.astro                   # strikeAt wired 2026-04-20
        ├── methodology.astro             # Calendar + Revision policy 2026-04-20
        ├── news.astro, news.xml.ts
        ├── references.astro
        ├── research.astro, research/*.astro
        ├── roadmap.astro
        ├── sitemap.xml.ts
        ├── venues.astro
        └── data/
            ├── fixings.csv.ts            # NEW 2026-04-20
            └── series/[slug].csv.ts      # NEW 2026-04-20
```
