/**
 * news.xml — RSS 2.0 for GPU Markets news items. Distinct from
 * /feed.xml (research notes) so subscribers can pick their stream.
 *
 * Market items link to /news#{slug}; press items link out to the
 * external source URL and include a <source url="…"> element per
 * RSS 2.0 spec so readers display the third-party attribution. Every
 * item carries a <category>market|press</category> so filter-aware
 * readers can route.
 *
 * guids are slug-based and marked non-permalink, so a Phase 2 move
 * from anchor links to /news/{slug}/ permalinks won't make existing
 * subscribers see duplicates.
 */
import type { APIRoute } from 'astro';
import { allNews } from '../lib/news';
import type { NewsItem } from '../lib/types';

export const prerender = true;

const SITE  = 'https://gpumarkets.dev';
const TITLE = 'GPU Markets \u00b7 News';
const DESC  =
  'Market events observed in the daily GPU Markets fixing at 00:30 UTC, ' +
  'and third-party coverage of the GPU rental market.';
const SELF  = `${SITE}/news.xml`;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(ymd: string): string {
  const normalized = ymd.replace(/\u2011/g, '-');
  const [y, m, d] = normalized.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 30, 0)).toUTCString();
}

function itemXml(n: NewsItem): string {
  const guid        = `gpu-markets:${n.slug}`;
  const pubDate     = toRfc822(n.date);
  const description = n.deck ?? n.title;
  const title       = escapeXml(n.title);

  if (n.kind === 'press') {
    const link   = n.sourceUrl;
    const source = `<source url="${escapeXml(n.sourceUrl)}">${escapeXml(n.source)}</source>`;
    return `  <item>
    <title>${title}</title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="false">${guid}</guid>
    <pubDate>${pubDate}</pubDate>
    <category>press</category>
    ${source}
    <description><![CDATA[${description}]]></description>
  </item>`;
  }

  const link = `${SITE}/news#${n.slug}`;
  return `  <item>
    <title>${title}</title>
    <link>${link}</link>
    <guid isPermaLink="false">${guid}</guid>
    <pubDate>${pubDate}</pubDate>
    <category>market</category>
    <description><![CDATA[${description}]]></description>
  </item>`;
}

export const GET: APIRoute = () => {
  const lastBuildDate = toRfc822(allNews[0].date);
  const items = allNews.map(itemXml).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(TITLE)}</title>
  <link>${SITE}/news</link>
  <atom:link href="${SELF}" rel="self" type="application/rss+xml" />
  <description>${escapeXml(DESC)}</description>
  <language>en-us</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
