# Contributing to GPU Markets

Thank you for your interest. This repo is the Astro site for
gpumarkets.dev — an open reference price index for the GPU rental
market. It is maintained by a single person in their spare time, so
please read the conventions below before filing.

## Issue categories

File an issue (not a PR first) for any of:

1. **Data correction** — a published fixing or observation looks wrong.
   Include the date, series (e.g., `H100.SXM.SPOT`), the observed value,
   and the source you checked against.
2. **New venue request** — a GPU rental provider worth covering that
   isn't in the 12-venue set. Include a link to their public pricing
   endpoint (REST API, GraphQL, or HTML).
3. **Methodology question** — how a specific value is computed, what
   outlier rejection does, how the estimator weights venues.
4. **Bug** — something on the site is broken: a page 404s, a chart
   doesn't render, a link is dead. Include browser + OS + URL.
5. **Design feedback** — proposed changes to the aesthetic, layout, or
   information hierarchy. The design is deliberately restrained
   (financial publication, not SaaS); see `README.md` for why.

## Pull requests

- **Code PRs welcome** for bugs, typos, small improvements.
- **Do not open a PR for methodology changes** without prior issue
  discussion — those changes affect published historical fixings and
  need to be reasoned through first.
- **Do not open a PR that rewrites `public/shared.css`, `public/app.js`,
  or `public/chart-data.js`** — those files are extracted artifacts of
  the design system and are not edited in place.

## Running the site locally

See `README.md`.

## Licensing

Contributions are accepted under the repo's dual license (Apache 2.0
for code, CC BY 4.0 for data). By opening a PR you agree to those terms.

## Contact

For anything the above doesn't cover: john@gpumarkets.dev.
