/**
 * fixings.csv — the current daily fix as flat CSV for spreadsheet /
 * dataframe consumers. Prerendered at build time, one row per series.
 *
 * RFC 4180 output. Columns chosen to match the on-site fixing table
 * plus the capacity-weighted companion fields. Dates use plain ASCII
 * hyphens (not U+2011) so consumers can parse them as ISO dates.
 *
 * A per-series historical CSV (with the 180-day series) ships in
 * Phase 2 once `history` is populated against every series.
 */
import type { APIRoute } from 'astro';
import { allSeries } from '../../lib/series-data';

export const prerender = true;

const FIX_DATE_ISO = '2026-04-18';
const FIX_TIME_UTC = '00:30';

function esc(v: string | number | undefined): string {
  if (v === undefined || v === null) return '';
  const s = String(v);
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const header = [
  'series_id',
  'tier',
  'chip',
  'vram',
  'tenor',
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
  'fix_date_utc',
  'fix_time_utc',
];

export const GET: APIRoute = () => {
  const lines: string[] = [header.join(',')];

  for (const s of allSeries) {
    const [eligible, total] = s.venueCount.split('/');
    lines.push(
      [
        s.id,
        s.tier,
        esc(s.chipName),
        s.vram,
        esc(s.tenor),
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
        FIX_DATE_ISO,
        FIX_TIME_UTC,
      ].join(','),
    );
  }

  const body = lines.join('\n') + '\n';
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `inline; filename="gpumarkets-fixings-${FIX_DATE_ISO}.csv"`,
      'Link': '<https://gpumarkets.dev/methodology>; rel="describedby", <https://creativecommons.org/licenses/by/4.0/>; rel="license"',
    },
  });
};
