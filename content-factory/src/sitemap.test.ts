import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  UNPRERENDERED_SPA_PATHS,
  addArticleToSitemap,
  isIndexableSitemapLoc,
  regenerateSitemap,
} from './sitemap';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function main(): Promise<void> {
  const repoSitemap = fs.readFileSync(path.resolve('../public/sitemap.xml'), 'utf-8');

  for (const pagePath of UNPRERENDERED_SPA_PATHS) {
    assert(
      !repoSitemap.includes(`https://cryp2bus.com${pagePath}`),
      `public/sitemap.xml still lists ${pagePath}`,
    );
  }
  assert(repoSitemap.includes('<loc>https://cryp2bus.com/</loc>'), 'homepage missing from public sitemap');
  assert(
    repoSitemap.includes('<loc>https://cryp2bus.com/blog/</loc>'),
    'blog index missing from public sitemap',
  );
  assert(
    repoSitemap.includes('https://cryp2bus.com/blog/converting-fiat-to-crypto-for-supplier-payouts/'),
    'existing blog post missing from public sitemap',
  );

  process.env.SITE_BASE_URL = 'https://cryp2bus.com';
  assert(isIndexableSitemapLoc('https://cryp2bus.com/'), 'homepage should be indexable');
  assert(isIndexableSitemapLoc('https://cryp2bus.com/blog/'), 'blog index should be indexable');
  assert(
    isIndexableSitemapLoc('https://cryp2bus.com/blog/how-to-pay-business-invoices-with-usdt/'),
    'blog post should be indexable',
  );
  for (const pagePath of UNPRERENDERED_SPA_PATHS) {
    assert(
      !isIndexableSitemapLoc(`https://cryp2bus.com${pagePath}`),
      `${pagePath} must not be indexable until prerendered`,
    );
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cryp2bus-sitemap-'));
  process.env.SITE_PUBLIC_DIR = dir;

  const dirty = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://cryp2bus.com/</loc><lastmod>2026-09-20</lastmod><changefreq>weekly</changefreq><priority>1</priority></url>
<url><loc>https://cryp2bus.com/exchange/</loc><lastmod>2026-09-20</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>
<url><loc>https://cryp2bus.com/faq/</loc><lastmod>2026-09-20</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`;
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), dirty);

  await addArticleToSitemap('how-to-pay-business-invoices-with-usdt', '2026-09-20', 'medium');
  const afterAdd = fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf-8');
  assert(
    afterAdd.includes('https://cryp2bus.com/blog/how-to-pay-business-invoices-with-usdt/'),
    'add dropped the new post',
  );
  assert(afterAdd.includes('<loc>https://cryp2bus.com/</loc>'), 'add dropped homepage');
  for (const pagePath of UNPRERENDERED_SPA_PATHS) {
    assert(!afterAdd.includes(`https://cryp2bus.com${pagePath}`), `add reintroduced ${pagePath}`);
  }

  regenerateSitemap(['accounting-handoff-for-crypto-settlements'], '2026-09-20');
  const afterRegen = fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf-8');
  assert(afterRegen.includes('<loc>https://cryp2bus.com/blog/</loc>'), 'regen dropped blog index');
  assert(
    afterRegen.includes('https://cryp2bus.com/blog/accounting-handoff-for-crypto-settlements/'),
    'regen dropped blog post',
  );
  for (const pagePath of UNPRERENDERED_SPA_PATHS) {
    assert(!afterRegen.includes(`https://cryp2bus.com${pagePath}`), `regen reintroduced ${pagePath}`);
  }

  console.log('sitemap tests passed');
}

main();
