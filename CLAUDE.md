# GPU Markets Site

Astro 5 static site for [gpumarkets.dev](https://gpumarkets.dev) — an open reference price index for GPU rentals. Deployed to Cloudflare Pages from `main`.

## Commands

```sh
npm run dev      # dev server at localhost:4321
npm run build    # static build → ./dist (7 routes)
npm run check    # astro check + tsc (CI gate)
npm run preview  # serve ./dist locally
```

## Architecture

- `src/layouts/Base.astro` — shared shell (masthead, nav, footer, `<head>` with OG/meta). Pass `withAppScripts={true}` only on pages needing the hero chart.
- `src/pages/` — one `.astro` per route: index, methodology, data, venues, research, 404, sitemap.xml.
- `src/components/` — one component per landing-page section, composed in order by `index.astro`.
- `src/lib/types.ts` — `Series`, `Venue`, `ResearchNote` type definitions.
- `src/lib/series-data.ts` — hard-coded fixture data (Phase 1). Phase 2 will use Astro content collections.
- `public/shared.css` — the entire design system. Do not rewrite or replace.
- `public/app.js` + `public/chart-data.js` — vanilla JS for the 180-day hero chart and expandable spec rows. Do not rewrite.

Astro dev server does **not** HMR files in `public/` — hard-refresh after editing shared.css, app.js, or chart-data.js.

## Design Constraints (Critical)

This is a **financial publication**, not a SaaS landing page. Protect the aesthetic:

- Fonts: Source Serif 4 (body/headlines), JetBrains Mono (figures), IBM Plex Sans (UI labels).
- Eyebrow headers use `§ · LABEL` pattern.
- Every section wraps in `<section><div class="wrap">...</div></section>`.
- No gradients, drop shadows, glassmorphism, emoji, or animations (except the 200ms chart redraw).
- No CSS frameworks or component libraries.
- Mirror exact class names from the original HTML so `shared.css` applies unchanged.

## Text Conventions

- Unicode minus `−` (U+2212) for negative numbers in tables, not a hyphen.
- Non-breaking hyphen `‑` (U+2011) inside dates to prevent mid-token wraps.
- `target="_blank" rel="noopener"` on every external link.
- `\uXXXX` escapes only work inside `{...}` JS expressions or frontmatter strings in `.astro` files — **not** in raw markup text. Use literal Unicode characters in prose.

## Deployment

Cloudflare Pages auto-deploys on push to `main`. CI (`.github/workflows/ci.yml`) runs `npm run check` + `npm run build` on PRs.

## Status

Phase 1 shipped. Phase 2 (content collections, per-series/venue detail pages, RSS feed, MDX research notes) not started.
