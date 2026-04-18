/**
 * feed.xml — RSS 2.0 for GPU Markets research notes. Prerendered at build
 * time, mirrors the sitemap.xml.ts pattern.
 *
 * Declared by Base.astro's <link rel="alternate" type="application/rss+xml">,
 * and linked from the footer. Items use slug-based non-permalink guids so
 * Phase 2 can introduce /research/{slug} permalinks without subscribers
 * seeing 5 "new" items.
 */
import type { APIRoute } from 'astro';
import { allNotes } from '../lib/research-notes';

export const prerender = true;

const SITE  = 'https://gpumarkets.dev';
const TITLE = 'GPU Markets';
const DESC  =
  'Research notes from GPU Markets \u2014 the open, reproducible price index ' +
  'and research series for the GPU rental market.';
const SELF  = `${SITE}/feed.xml`;

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

export const GET: APIRoute = () => {
  const lastBuildDate = toRfc822(allNotes[0].date);

  const items = allNotes
    .map((n) => {
      const link        = `${SITE}/research`;
      const guid        = `gpu-markets:${n.slug}`;
      const description = n.deck ?? n.title;
      return `  <item>
    <title>${escapeXml(n.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="false">${guid}</guid>
    <pubDate>${toRfc822(n.date)}</pubDate>
    <description><![CDATA[${description}]]></description>
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(TITLE)}</title>
  <link>${SITE}/</link>
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
