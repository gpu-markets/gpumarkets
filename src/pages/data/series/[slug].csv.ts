/**
 * /data/series/{slug}.csv — per-series flat CSV.
 *
 * In Phase 1 each response body contains the single current fix for
 * that series (plus its capacity-weighted companion and any
 * footnotes/off-strike metadata). In Phase 2 this will fatten to the
 * full history back to first observation, without changing the URL
 * shape — downstream consumers can start pinning this URL today.
 *
 * URL contract:
 *
 *   /data/series/h100-sxm-spot.csv   (from GPUM.H100.SXM.SPOT)
 *   /data/series/b200-sxm-spot.csv   (from GPUM.B200.SXM.SPOT)
 *   /data/series/rtx4090-spot.csv    (from GPUM.RTX4090.SPOT)
 *
 * Slug rule: strip "GPUM." prefix, lowercase, replace "." with "-".
 * Matches the slug rule used in FixingTable's row-toggle targets.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import type { Series } from '../../../lib/types';
import { allSeries } from '../../../lib/series-data';

export const prerender = true;

const FIX_DATE_ISO = '2026-04-18';
const FIX_TIME_UTC = '00:30';

function slugify(ticker: string): string {
  return ticker.replace(/^GPUM\./, '').toLowerCase().replace(/\./g, '-');
}

function esc(v: string | number | undefined): string {
  if (v === undefined || v === null) return '';
  const s = String(v);
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export const getStaticPaths: GetStaticPaths = () =>
  allSeries.map((s) => ({
    params: { slug: slugify(s.id) },
    props: { series: s },
  }));

const header = [
  'series_id',
  'tier',
  'chip',
  'vram',
  'tenor',
  'fix_date_utc',
  'fix_time_utc',
  'struck_at_utc',
  'price_usd_per_gpu_hr',
  'delta_1d_pct',
  'delta_7d_pct',
  'delta_30d_pct',
  'observations',
  'venues_eligible',
  'venues_total',
  'price_cw_usd_per_gpu_hr',
  'delta_cw_vs_fix_pct',
  'venue_tier_breakdown',
  'cw_suppressed_reason',
  'footnotes',
];

export const GET: APIRoute = ({ props }) => {
  const s = (props as { series: Series }).series;
  const [eligible, total] = s.venueCount.split('/');
  const struckAt = s.fixedAt ?? `${FIX_DATE_ISO}T${FIX_TIME_UTC}:00Z`;
  const footnotesJoined = (s.footnotes ?? []).join(' || ');

  const row = [
    s.id,
    s.tier,
    esc(s.chipName),
    s.vram,
    esc(s.tenor),
    FIX_DATE_ISO,
    FIX_TIME_UTC,
    struckAt,
    s.price.toFixed(4),
    s.delta1d.toFixed(2),
    s.delta7d.toFixed(2),
    s.delta30d.toFixed(2),
    s.obs,
    eligible,
    total,
    s.priceCW !== undefined ? s.priceCW.toFixed(4) : '',
    s.deltaCWvsFix !== undefined ? s.deltaCWvsFix.toFixed(2) : '',
    esc(s.venueTierBreakdown),
    esc(s.suppressedCW),
    esc(footnotesJoined),
  ].join(',');

  const body = header.join(',') + '\n' + row + '\n';
  const filename = `gpumarkets-${slugify(s.id)}-${FIX_DATE_ISO}.csv`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Link': '<https://gpumarkets.dev/methodology>; rel="describedby", <https://creativecommons.org/licenses/by/4.0/>; rel="license"',
    },
  });
};
