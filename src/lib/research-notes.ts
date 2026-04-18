/**
 * Source of truth for GPU Markets research notes.
 *
 * Consumed by:
 *   - src/components/Research.astro (landing page § 06)
 *   - src/pages/feed.xml.ts         (RSS 2.0 feed)
 *
 * Dates use a non-breaking hyphen (U+2011) so the fixing table and footer
 * don't break across a line. When Phase 2 introduces /research/{slug}
 * pages, each note's link becomes `${SITE}/research/${slug}/` — the slug
 * field is already stable enough to hang a URL off.
 *
 * Ordering: newest first in both arrays; `allNotes` preserves that order
 * so the feed's top item is always the current lead.
 */
import type { ResearchNote } from './types';

export const leadNote: ResearchNote = {
  slug: 'b200-curve-decomposition',
  date: '2026\u201104\u201111',
  title: 'Decomposing the B200 curve \u2014 scarcity or generation?',
  deck:
    "The B200 SXM spot series has fallen 8.3% over the last 30 days, its steepest drop since launch. " +
    "A log\u2011linear decomposition against supply announcements and CoreWeave's reported order book " +
    "suggests demand\u2011side exhaustion, not generational obsolescence. Charts and data below.",
  isLead: true,
};

export const previousNotes: ResearchNote[] = [
  { slug: 'lambda-vast-spread',     date: '2026\u201104\u201104', title: 'The Lambda\u2013Vast spread is structural, not arbitrage.' },
  { slug: 'forward-curve-reserved', date: '2026\u201103\u201128', title: 'Constructing a forward curve from reserved\u2011rate differentials.' },
  { slug: 'h100-h200-residual',     date: '2026\u201103\u201121', title: 'Implied GPU residual value: H100 vs H200.' },
  { slug: 'hedging-2024-backtest',  date: '2026\u201103\u201114', title: 'Could a neocloud have hedged the 2024 crash? A backtest.' },
];

export const allNotes: ResearchNote[] = [leadNote, ...previousNotes];
