import fs from 'fs';
import path from 'path';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { writeLlmsTxt } from './llms';

function getSitemapPath(): string {
  return path.join(process.env.SITE_PUBLIC_DIR || '../public', 'sitemap.xml');
}

function getBaseUrl(): string {
  return (process.env.SITE_BASE_URL || 'https://cryp2bus.com').replace(/\/$/, '');
}

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  'xhtml:link'?: Array<{ '@_rel': string; '@_hreflang': string; '@_href': string }>;
}

function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

function hreflang(url: string): SitemapEntry['xhtml:link'] {
  const loc = withTrailingSlash(url);
  return [
    { '@_rel': 'alternate', '@_hreflang': 'en', '@_href': loc },
    { '@_rel': 'alternate', '@_hreflang': 'x-default', '@_href': loc },
  ];
}

/**
 * SPA routes that exist in App.jsx but are not prerendered.
 * GitHub Pages returns HTTP 404 (homepage shell, canonical → /) for these.
 * Keep them out of the sitemap until dist/<path>/index.html is emitted.
 */
export const UNPRERENDERED_SPA_PATHS = [
  '/exchange/',
  '/invoice-payments/',
  '/otc/',
  '/markets/',
  '/how-it-works/',
  '/pricing/',
  '/security/',
  '/about/',
  '/faq/',
] as const;

function pathnameOf(loc: string): string {
  const base = getBaseUrl();
  let pathname = loc.startsWith(base) ? loc.slice(base.length) : loc;
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (pathname.length > 1 && !pathname.endsWith('/')) pathname = `${pathname}/`;
  return pathname || '/';
}

/** Homepage, /blog/, and /blog/{slug}/ only. Those are the URLs with real static HTML. */
export function isIndexableSitemapLoc(loc: string): boolean {
  const pathname = pathnameOf(loc);
  if (pathname === '/' || pathname === '/blog/') return true;
  return /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(pathname);
}

function staticEntries(lastmod: string): SitemapEntry[] {
  const BASE_URL = getBaseUrl();
  const paths: Array<{ path: string; changefreq: SitemapEntry['changefreq']; priority: string }> = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/blog/', changefreq: 'daily', priority: '0.8' },
  ];

  return paths.map(({ path: pagePath, changefreq, priority }) => {
    const loc =
      pagePath === '/'
        ? withTrailingSlash(BASE_URL)
        : `${BASE_URL}${pagePath}`;
    return {
      loc,
      lastmod,
      changefreq,
      priority,
      'xhtml:link': hreflang(loc),
    };
  });
}

function buildBlogEntry(
  slug: string,
  lastmod: string,
  priority: 'high' | 'medium' | 'low' = 'medium',
): SitemapEntry {
  const BASE_URL = getBaseUrl();
  const loc = `${BASE_URL}/blog/${slug}/`;
  const priorityMap = { high: '0.9', medium: '0.7', low: '0.5' };

  return {
    loc,
    lastmod,
    changefreq: 'monthly',
    priority: priorityMap[priority],
    'xhtml:link': hreflang(loc),
  };
}

function readSitemap(): { urlset: { url: SitemapEntry[] } } {
  const SITEMAP_PATH = getSitemapPath();
  let sitemap: { urlset: { url: SitemapEntry[] } } = { urlset: { url: [] } };

  if (fs.existsSync(SITEMAP_PATH)) {
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(fs.readFileSync(SITEMAP_PATH, 'utf-8'));
    const urls = parsed?.urlset?.url;
    sitemap.urlset.url = Array.isArray(urls) ? urls : urls ? [urls] : [];
  }

  return sitemap;
}

function writeSitemap(sitemap: { urlset: { url: SitemapEntry[] } }): void {
  sitemap.urlset.url = sitemap.urlset.url.filter((entry) =>
    isIndexableSitemapLoc(String(entry.loc ?? '')),
  );

  const SITEMAP_PATH = getSitemapPath();
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    indentBy: '  ',
    suppressEmptyNode: true,
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${builder.build(sitemap.urlset)}
</urlset>`;

  fs.mkdirSync(path.dirname(SITEMAP_PATH), { recursive: true });
  fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
}

export async function addArticleToSitemap(
  slug: string,
  datePublished: string,
  priority: 'high' | 'medium' | 'low' = 'medium',
): Promise<void> {
  const BASE_URL = getBaseUrl();
  const newEntry = buildBlogEntry(slug, datePublished, priority);
  const sitemap = readSitemap();
  const loc = `${BASE_URL}/blog/${slug}/`;

  sitemap.urlset.url = sitemap.urlset.url.filter((u) => u.loc !== loc);
  sitemap.urlset.url.push(newEntry);
  sitemap.urlset.url.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));

  writeSitemap(sitemap);
  writeLlmsTxt();
  console.log(`✅ Sitemap updated: added /blog/${slug}/`);
}

export function regenerateSitemap(
  slugs: string[],
  defaultDate: string = new Date().toISOString().split('T')[0],
): void {
  const blogEntries = slugs.map((slug) => buildBlogEntry(slug, defaultDate, 'medium'));
  const sitemap = {
    urlset: {
      url: [...staticEntries(defaultDate), ...blogEntries].sort(
        (a, b) => parseFloat(b.priority) - parseFloat(a.priority),
      ),
    },
  };

  writeSitemap(sitemap);
  writeLlmsTxt(slugs);
  console.log(`✅ Sitemap regenerated with ${blogEntries.length} blog entries`);
}
