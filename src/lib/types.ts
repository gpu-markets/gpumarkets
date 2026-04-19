/**
 * Shared type definitions for series, venues, and research notes.
 * These types are enforced across components, pages, and eventually
 * against the content collection schemas in src/content/config.ts.
 */

export type Tier = 'training' | 'inference';

export interface Series {
  /** Canonical ticker, e.g. "GPUM.H100.SXM.SPOT" */
  id: string;
  tier: Tier;
  chipName: string;  // "NVIDIA H100 SXM"
  vram: string;      // "80GB"
  tenor: string;     // "Spot", "On-demand", "1-year reserved"
  price: number;
  delta1d: number;   // percentage, -0.42 means -0.42%
  delta7d: number;
  delta30d: number;
  obs: number;
  venueCount: string; // "9/12"
  sparkPath: string;
  specs: [string, string][];
  /**
   * Daily price series for the hero chart, newest first or oldest first —
   * doesn't matter as long as it's consistent. For the chart script
   * below we expect oldest first, length ~180.
   */
  history?: number[];
  /** Y-axis hints for the hero chart */
  yMin?: number;
  yMax?: number;
  /** Chart label e.g. "H100 SXM Spot" */
  label?: string;

  /**
   * Capacity-weighted companion fix (.cw research series). Weighted median
   * across eligible venues using 3:2:1 tier weights (T1 >10k GPUs, T2
   * 1k–10k, T3 <1k). Absent when the min-sample guard suppresses the fix
   * — in that case `suppressedCW` carries the reason.
   */
  priceCW?: number;
  /** Percentage delta of `priceCW` vs headline `price` — e.g. +1.23 for +1.23%. */
  deltaCWvsFix?: number;
  /** Tier distribution of surviving observations, e.g. "2 T1 · 4 T2 · 3 T3". */
  venueTierBreakdown?: string;
  /** Reason the CW fix is suppressed today (min-sample guard). */
  suppressedCW?: string;
}

export interface Venue {
  slug: string;
  name: string;
  access: string;      // "REST API", "GraphQL API", etc.
  eligible: 'yes' | 'cross-check' | 'reference';
  firstObs: string;    // ISO date
  url: string;
  cadence?: string;
  tosLastReviewed?: string;
  description?: string;
}

export interface ResearchNote {
  slug: string;
  date: string;
  title: string;
  deck?: string;
  isLead?: boolean;
}

/**
 * News items fall into two mutually-exclusive categories:
 *   - `market`  — first-party observations from the daily fixing
 *                 (outlier rejections, venue onboardings, methodology
 *                 updates). Optional deep-link into /data or /venues.
 *   - `press`   — third-party industry coverage. Always has an external
 *                 source URL and an attribution.
 * Discriminated on `kind` so callers can exhaustively switch without
 * optional-field guards.
 */
export type NewsKind = 'market' | 'press';

interface NewsItemBase {
  slug: string;
  date: string;
  title: string;
  deck?: string;
}

export interface MarketEvent extends NewsItemBase {
  kind: 'market';
  deepLink?: string;
}

export interface PressItem extends NewsItemBase {
  kind: 'press';
  source: string;
  sourceUrl: string;
}

export type NewsItem = MarketEvent | PressItem;
