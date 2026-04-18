/**
 * Source of truth for GPU Markets news items.
 *
 * Consumed by:
 *   - src/components/News.astro (landing § 07 teaser)
 *   - src/pages/news.astro      (full archive)
 *   - src/pages/news.xml.ts     (RSS 2.0 feed)
 *
 * Two discriminated kinds — `market` (first-party observations) and
 * `press` (third-party coverage) — so rendering branches can stay
 * exhaustive. See src/lib/types.ts for the type definitions.
 *
 * Ordering: newest first. The first element is the landing-page lead.
 * Dates use non-breaking hyphens (U+2011) to match the convention used
 * across the rest of the site (research notes, fixing tables, masthead).
 *
 * SEED CONTENT — edit freely. The first few items below are
 * illustrative examples of the two kinds; replace with real entries
 * before the /news page is promoted publicly.
 */
import type { NewsItem } from './types';

export const allNews: NewsItem[] = [
  {
    kind: 'market',
    slug: 'hyperbolic-h100-outlier-0418',
    date: '2026\u201104\u201118',
    title: 'Hyperbolic H100 SXM rejected as outlier at +2.8 MAD',
    deck:
      "Hyperbolic's advertised H100 SXM Spot rate of $1.12 / GPU\u2011hr fell " +
      "2.8 median\u2011absolute\u2011deviations below today's estimator and " +
      "was excluded from the fix. Eligible venues after rejection: 8 / 12.",
    deepLink: '/data#h100-sxm-spot',
  },
  {
    kind: 'press',
    slug: 'coreweave-b200-order-bloomberg-0417',
    date: '2026\u201104\u201117',
    title: 'CoreWeave reportedly orders 14k additional B200s for 2026 Q3 delivery',
    deck:
      'Bloomberg reports CoreWeave has signed an incremental Blackwell purchase ' +
      'order worth $2.1B, front\u2011loading capacity ahead of projected training ' +
      'demand from three unnamed frontier labs.',
    source: 'Bloomberg',
    sourceUrl: 'https://www.bloomberg.com/',
  },
  {
    kind: 'market',
    slug: 'shadeform-aggregator-onboarded-0415',
    date: '2026\u201104\u201115',
    title: 'Shadeform added as cross\u2011check aggregator (venue 12/12)',
    deck:
      'Shadeform\u2019s aggregated venue feed brings the covered\u2011venue count ' +
      'to 12. Its observed rates are ingested as cross\u2011checks against ' +
      'primary venues, not as independent contributors to the estimator.',
    deepLink: '/venues#shadeform',
  },
  {
    kind: 'press',
    slug: 'h200-supply-semianalysis-0414',
    date: '2026\u201104\u201114',
    title: 'H200 supply bottlenecks and the narrowing H100 premium',
    deck:
      'SemiAnalysis argues HBM3e allocation, not silicon, is the binding ' +
      'constraint on H200 availability through mid\u20112026, and that the ' +
      'H200\u2013H100 spot premium will compress to under 15% by Q3.',
    source: 'SemiAnalysis',
    sourceUrl: 'https://semianalysis.com/',
  },
  {
    kind: 'market',
    slug: 'b200-first-obs-datacrunch-0412',
    date: '2026\u201104\u201112',
    title: 'B200 SXM first observed at DataCrunch (enters training tier)',
    deck:
      'DataCrunch\u2019s public pricing endpoint published an advertised ' +
      'B200 SXM Spot rate for the first time today. Backfilled history ' +
      'unavailable; series begins 2026\u201104\u201112.',
    deepLink: '/data#b200-sxm-spot',
  },
  {
    kind: 'press',
    slug: 'neocloud-ma-information-0409',
    date: '2026\u201104\u201109',
    title: 'Neocloud consolidation: M&A discussions heat up among mid\u2011tier providers',
    deck:
      'The Information reports at least three mid\u2011tier neocloud operators ' +
      'are in early acquisition talks, citing margin compression from spot\u2011price ' +
      'declines and increasing HBM allocation scale economies.',
    source: 'The Information',
    sourceUrl: 'https://www.theinformation.com/',
  },
  {
    kind: 'market',
    slug: 'methodology-mad-threshold-0408',
    date: '2026\u201104\u201108',
    title: 'Outlier rejection threshold raised from 2.5 to 3.0 MAD',
    deck:
      'After 60 days of production fixings, the median\u2011absolute\u2011deviation ' +
      'rejection threshold is loosened from 2.5 to 3.0 to reduce false positives ' +
      'on low\u2011venue\u2011count series. Change is retroactive; historical ' +
      'fixings are not revised.',
    deepLink: '/methodology#outlier-rejection',
  },
];

export const leadNews = allNews[0];
export const previousNews = allNews.slice(1, 5);
