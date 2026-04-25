/**
 * sitemap.xml — built at compile time by Astro. Lists every public route.
 * Phase 2 will expand this to include generated series/ and venues/ detail
 * pages, and one URL per research note.
 */
import type { APIRoute } from 'astro';
import { allSeries } from '../lib/series-data';
import { seriesSlug } from '../lib/slug';

export const prerender = true;

const SITE = 'https://gpumarkets.dev';

const STATIC_ROUTES: Array<{ path: string; changefreq: 'daily' | 'monthly' }> = [
  { path: '/',             changefreq: 'daily'   },
  { path: '/methodology',  changefreq: 'monthly' },
  { path: '/data',         changefreq: 'daily'   },
  { path: '/venues',       changefreq: 'monthly' },
  { path: '/research',     changefreq: 'monthly' },
  { path: '/news',         changefreq: 'daily'   },
];

const SERIES_ROUTES: Array<{ path: string; changefreq: 'daily' | 'monthly' }> =
  allSeries.map((s) => ({
    path: `/series/${seriesSlug(s.id)}`,
    changefreq: 'daily',
  }));

const ROUTES = [...STATIC_ROUTES, ...SERIES_ROUTES];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = ROUTES.map(
    ({ path, changefreq }) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
  </url>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
