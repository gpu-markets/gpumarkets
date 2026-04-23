# GPU Markets — site

The public site for **GPU Markets**, an open reference price index for the GPU rental market. Daily fixings for spot, on-demand, and reserved GPU rentals across 12 venues. Open data, open methodology, published every day at 00:30 UTC.

Production: <https://gpumarkets.dev>

## What this repository is

This is the Astro source for the marketing / research site only. It compiles to a fully static bundle and ships through Cloudflare Workers Builds.

The actual fixings, raw observations, and estimator code live in the separate `gpu-markets/gpu-markets` repository. In Phase 1 the site reads from a snapshot of that data hard-coded into `src/lib/series-data.ts`; in Phase 2 it will read from a content collection populated at build time from the data repo.

## Stack

- [Astro 5](https://astro.build) — static output, no client-side hydration
- TypeScript in strict mode
- Hand-rolled CSS in `public/shared.css` — no Tailwind, no UI library
- Two short vanilla-JS files (`public/chart-data.js`, `public/app.js`) for the interactive 180-day hero chart and the expandable specs rows

The site has zero runtime dependencies beyond what ships in `public/`.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # serves ./dist locally
npm run check    # astro check + tsc
```

Astro's dev server has fast HMR for `.astro` components but does **not** watch files in `public/` (that's where `shared.css`, `chart-data.js`, and `app.js` live). After editing any of those, hard-refresh the browser.

## Project layout

```
gpu-markets-site/
├── astro.config.mjs       # static output, Cloudflare-compatible
├── package.json
├── tsconfig.json
├── public/
│   ├── shared.css         # the entire design system, extracted verbatim
│   ├── chart-data.js      # 180-day price history per series
│   └── app.js             # hero chart + row-toggle wiring
└── src/
    ├── layouts/
    │   └── Base.astro     # masthead, nav, footer; loads shared.css
    ├── lib/
    │   ├── types.ts       # Series, Venue, ResearchNote
    │   └── series-data.ts # 13 series, current fixings
    ├── components/        # one .astro per landing-page section
    └── pages/
        ├── index.astro    # the landing page (composes every component)
        ├── methodology.astro
        ├── data.astro
        ├── venues.astro
        └── research.astro
```

Each numbered section on the landing page is its own component. The composition order in `src/pages/index.astro` mirrors the standalone HTML 1:1.

## Design constraints

The aesthetic is locked. It is a financial-publication / statistical-release look, not a SaaS landing page.

**Do:**
- Mirror the exact class names from the original HTML so `shared.css` applies unchanged.
- Always wrap section content in `<section><div class="wrap">…</div></section>`. The `.wrap` class provides the max-width and horizontal padding.
- Use Unicode minus (`\u2212`) for negative numbers in tables, not a hyphen — important for tabular alignment.
- Use non-breaking hyphens (`\u2011`) inside dates so they don't wrap mid-token.
- Use `target="_blank" rel="noopener"` on every external venue link.
- Pass `withAppScripts={true}` to `<Base>` only on pages that need the hero chart or the row-toggle.

**Don't:**
- Don't introduce gradients, drop shadows, glassmorphism, emoji, or animations beyond the single 200ms chart redraw in `app.js`.
- Don't rewrite `public/shared.css`, `public/chart-data.js`, or `public/app.js`.
- Don't add a CSS framework or component library.

## Deployment

Cloudflare Workers Builds, deploying worker `gpumarketsdev` from `main`:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output | `dist` |
| Node version | 20.x |
| Custom domain | `gpumarkets.dev` |

CI (`.github/workflows/ci.yml`) runs `npm run check` (Astro check + TypeScript) and `npm run build` on every pull request and every push to `main`. Cloudflare Workers Builds auto-deploys successful pushes to `main`.

## Phase 2 roadmap

Shipped in Phase 1 and the launch-marketing pass:

- `/feed.xml` — RSS 2.0 for research notes.
- `/news.xml` — RSS 2.0 for the news section (market events + press coverage).
- `/research/b200-curve-decomposition/` — standalone research note detail page.

Still open:

- Astro content collections (`src/content/config.ts`) for series, venues, and research notes, with Zod schemas matched to `src/lib/types.ts`.
- Dynamic route `src/pages/series/[slug].astro` generating one detail page per series (13 pages).
- Dynamic route `src/pages/venues/[slug].astro` for venue detail pages (12 pages).
- MDX support for research notes, with one URL per note.
- GitHub Actions workflow that rebuilds the site whenever the `gpu-markets/gpu-markets` data repo publishes a new fix.

## Licenses

- Data published on this site: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Code in this repository: [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Maintainer

John Jung, Vancouver, BC — <john@gpumarkets.dev>

Not investment advice.
