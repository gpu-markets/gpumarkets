/**
 * Canonical glossary entries reused by the homepage glossary table and
 * inline term-help popovers in the fixing tables / methodology copy.
 */

export type GlossaryTermId = 'spot' | 'od' | 'r1y' | 'cw' | 't1' | 't2' | 't3';

export interface GlossaryTermDefinition {
  id: GlossaryTermId;
  label: string;
  description: string;
}

export const glossaryTerms: Record<GlossaryTermId, GlossaryTermDefinition> = {
  spot: {
    id: 'spot',
    label: 'SPOT',
    description:
      'Per-hour rate on a marketplace or community cloud. Pay-as-you-go, cheapest, no commitment, supply varies by hour.',
  },
  od: {
    id: 'od',
    label: 'OD',
    description:
      'On-demand rate from a dedicated provider. Higher price than spot, guaranteed supply, cancel anytime.',
  },
  r1y: {
    id: 'r1y',
    label: 'R1Y',
    description:
      'One-year reserved contract. Locked in for 12 months at a discounted rate in exchange for committed capacity.',
  },
  cw: {
    id: 'cw',
    label: 'CW',
    description:
      'Capacity-weighted companion research series. Weighted median of the same surviving observations, using venue-capacity tiers rather than equal weights. Not part of the headline fix family.',
  },
  t1: {
    id: 't1',
    label: 'T1',
    description:
      'Capacity tier 1. Venues with more than 10,000 GPUs. Weight 3 in the capacity-weighted companion.',
  },
  t2: {
    id: 't2',
    label: 'T2',
    description:
      'Capacity tier 2. Venues with 1,000 to 10,000 GPUs. Weight 2 in the capacity-weighted companion.',
  },
  t3: {
    id: 't3',
    label: 'T3',
    description:
      'Capacity tier 3. Venues with fewer than 1,000 GPUs. Weight 1 in the capacity-weighted companion.',
  },
};

export const glossaryOrder: GlossaryTermId[] = ['spot', 'od', 'r1y', 'cw', 't1', 't2', 't3'];

export function getGlossaryTerm(id: GlossaryTermId): GlossaryTermDefinition {
  return glossaryTerms[id];
}
