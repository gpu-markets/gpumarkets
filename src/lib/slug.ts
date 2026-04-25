/**
 * Canonical series-slug derivation. Strip "GPUM." prefix, lowercase,
 * replace "." with "-".  e.g. GPUM.H100.SXM.SPOT -> h100-sxm-spot
 *
 * Single source of truth — every surface that links to a per-series
 * resource (CSV route, HTML route, /data listing, sitemap) imports
 * from here so a future rule change only happens once.
 */
export function seriesSlug(ticker: string): string {
  return ticker.replace(/^GPUM\./, '').toLowerCase().replace(/\./g, '-');
}
