/**
 * Source of truth for GPU Markets research notes.
 *
 * Consumed by:
 *   - src/components/Research.astro           (landing page § 06)
 *   - src/pages/research.astro                (/research index)
 *   - src/pages/feed.xml.ts                   (RSS 2.0 feed)
 *   - src/pages/research/<slug>.astro         (detail pages; each imports
 *                                              its own named export for
 *                                              title/deck/date rendering)
 *
 * Dates use a non-breaking hyphen (U+2011) so the fixing table and
 * footer don't break across a line.
 *
 * Ordering: strict reverse-chronological in every array. `leadNote` is
 * the most-recently-dated note (i.e. `allNotes[0]`); it is not a
 * curator's pick. `previousNotes` is everything else, likewise newest
 * first. Ties on date break on slug alphabetical.
 *
 * `detailPageSlugs` names the set of notes that have a dedicated
 * `/research/<slug>/` page. Index and landing renderers use membership
 * in this set to decide whether to link a note's title to its detail
 * page or leave it as text pending future publication.
 */
import type { ResearchNote } from './types';

export const leadNote: ResearchNote = {
  slug: 'three-integration-patterns',
  date: '2026\u201104\u201120',
  title:
    'Three integration patterns for a GPU compute derivatives market',
  deck:
    'Six regulated, crypto\u2011native, and auction\u2011based venues for ' +
    'GPU\u2011compute derivatives are in development. Each has the same ' +
    'structural dependency: an independent, auditable, low\u2011friction ' +
    'reference price to settle against. Three integration modes \u2014 ' +
    'cash\u2011settled futures, perpetual funding oracles, and ' +
    'listed\u2011minus\u2011transacted basis trading \u2014 cover the ' +
    'landscape.',
  isLead: true,
};

/**
 * Named export for the B200 decomposition note. Imported directly by
 * its detail page (`/research/b200-curve-decomposition/`) so the
 * page's title/deck/date rendering does not depend on whether b200 is
 * the current lead.
 */
export const b200Note: ResearchNote = {
  slug: 'b200-curve-decomposition',
  date: '2026\u201104\u201111',
  title: 'Decomposing the B200 curve \u2014 where did the demand go?',
  deck:
    "Listed B200 SXM spot on open neocloud venues has fallen 11.6% over 30 days (28% over six months) " +
    "\u2014 even as SemiAnalysis's survey\u2011based contract index reports H100 1\u2011year rates up ~38% " +
    "and on\u2011demand capacity sold out. A log\u2011linear decomposition against CoreWeave's order book " +
    "reads the move as demand absorbed into contracts, not generational obsolescence. Charts and data below.",
};

export const previousNotes: ResearchNote[] = [
  b200Note,
  { slug: 'lambda-vast-spread',     date: '2026\u201104\u201104', title: 'The Lambda\u2013Vast spread is structural, not arbitrage.' },
  { slug: 'forward-curve-reserved', date: '2026\u201103\u201128', title: 'Constructing a forward curve from reserved\u2011rate differentials.' },
  { slug: 'h100-h200-residual',     date: '2026\u201103\u201121', title: 'Implied GPU residual value: H100 vs H200.' },
  { slug: 'hedging-2024-backtest',  date: '2026\u201103\u201114', title: 'Could a neocloud have hedged the 2024 crash? A backtest.' },
];

/** Slugs of notes that have a dedicated `/research/<slug>/` detail page. */
export const detailPageSlugs = new Set<string>([
  leadNote.slug,
  b200Note.slug,
]);

export const allNotes: ResearchNote[] = [leadNote, ...previousNotes];
