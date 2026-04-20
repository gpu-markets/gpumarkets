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
 * Ordering: position [0] is the curated landing-page lead, chosen for
 * editorial relevance rather than strict chronology. Positions [1]+ are
 * reverse-chronological. Dates use non-breaking hyphens (U+2011) to
 * match the convention used across the rest of the site.
 */
import type { NewsItem } from './types';

export const allNews: NewsItem[] = [
  {
    kind: 'press',
    slug: 'meta-coreweave-21b-0409',
    date: '2026\u201104\u201109',
    title: 'Meta commits additional $21B to CoreWeave through 2032 for Vera Rubin inference',
    deck:
      "Per 8\u2011K filing on April 9: Meta's second major commitment to " +
      'CoreWeave, running 2027\u20112032, structured for inference workloads ' +
      "on NVIDIA's Vera Rubin platform across multiple sites. Brings " +
      'combined Meta+CoreWeave commitments to roughly $35B \u2014 a real\u2011' +
      'world instance of demand being absorbed into long\u2011tenor ' +
      'contracts while listed\u2011side spot compresses.',
    source: 'TNW',
    sourceUrl: 'https://thenextweb.com/news/meta-coreweave-21-billion-ai-cloud-deal',
  },
  {
    kind: 'market',
    slug: 'methodology-listed-surface-0419',
    date: '2026\u201104\u201119',
    title: "Methodology update \u2014 fix surface defined as 'listed advertised rates'",
    deck:
      'The methodology page now explicitly defines the daily fix as a ' +
      'median of listed advertised rates observed on public venue APIs ' +
      'at 00:30 UTC. Negotiated contract rates, private enterprise ' +
      'agreements, and other transacted prices not visible on a public ' +
      'API are out of scope; readers are directed to survey\u2011based ' +
      'indices for the contract\u2011side surface.',
    deepLink: '/methodology',
  },
  {
    kind: 'market',
    slug: 'cross-index-semianalysis-0419',
    date: '2026\u201104\u201119',
    title: "SemiAnalysis H100 1Y contract series now cited as external validation signal",
    deck:
      "The lead research note at /research/b200\u2011curve\u2011decomposition/ " +
      "now references SemiAnalysis's contract\u2011side index to discriminate " +
      'between demand\u2011absorption and demand\u2011exhaustion hypotheses ' +
      'on the listed\u2011side decline. Listed spot down 28% / 6mo while ' +
      'contract 1Y up ~38% over same window \u2014 forces the absorption ' +
      'reading.',
    deepLink: '/research/b200-curve-decomposition/',
  },
  {
    kind: 'press',
    slug: 'datavault-edge-gpu-sites-0417',
    date: '2026\u201104\u201117',
    title: 'Datavault AI launches edge GPU sites in NY/Philadelphia; targets 1,000 U.S. sites by end\u20112026',
    deck:
      'Edge neocloud expansion: up to 48 GPUs per site across 1,000 ' +
      'urban micro\u2011edge sites in 100+ U.S. cities by year\u2011end. ' +
      'Low\u2011latency inference and HPC positioning \u2014 capacity ' +
      'buildout continues even as listed\u2011side spot compresses on ' +
      'incumbent venues.',
    source: 'Electronics Media',
    sourceUrl: 'https://www.electronicsmedia.info/2026/04/17/datavault-ai-edge-gpu-sites/',
  },
  {
    kind: 'press',
    slug: 'coreweave-analyst-upgrade-0413',
    date: '2026\u201104\u201113',
    title: 'CoreWeave surges on analyst upgrade and AI contract momentum',
    deck:
      'Market reaction to compounding contract wins: analyst upgrades ' +
      'and announced contract momentum drive CRWV shares higher. ' +
      "Reinforces capital markets' view that contracted\u2011tier demand " +
      'is accelerating in AI inference even as open marketplace rates ' +
      'compress.',
    source: 'The Motley Fool',
    sourceUrl: 'https://www.fool.com/coverage/stock-market-today/2026/04/13/stock-market-today-april-13-coreweave-surges-on-analyst-upgrade-and-ai-contract-momentum/',
  },
  {
    kind: 'press',
    slug: 'coreweave-financial-engineering-0409',
    date: '2026\u201104\u201109',
    title: 'CoreWeave takes as much financial engineering as datacenter design',
    deck:
      "Timothy Prickett Morgan on CoreWeave's $30\u201335B planned 2026 " +
      "capex against $87.8B of contracted future revenue: the financing " +
      'structure is as load\u2011bearing as the infrastructure itself. ' +
      'A sober read on neocloud capital intensity and the limits of ' +
      'growth\u2011by\u2011contract.',
    source: 'The Next Platform',
    sourceUrl: 'https://www.nextplatform.com/cloud/2026/04/09/coreweave-takes-as-much-financial-engineering-as-it-does-datacenter-design/5215794',
  },
  {
    kind: 'press',
    slug: 'neocloud-storm-credit-0406',
    date: '2026\u201104\u201106',
    title: 'Neocloud storm gathers as data center deals stall over credit risk',
    deck:
      'Colocation operators reportedly rejecting neocloud providers on ' +
      'credit grounds despite premium pricing (~$155\u2013160/kW) and ' +
      '15\u2011year terms. Creditworthiness now dominates rate in deal ' +
      'selection \u2014 evidence of tiering pressure on list\u2011side ' +
      'operators whose spot rates are compressing.',
    source: 'Data Center Knowledge',
    sourceUrl: 'https://www.datacenterknowledge.com/cloud/neocloud-storm-gathers-as-data-center-deals-stall-over-credit-risk',
  },
];

export const leadNews = allNews[0];
export const previousNews = allNews.slice(1, 5);
