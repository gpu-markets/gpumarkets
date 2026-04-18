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
