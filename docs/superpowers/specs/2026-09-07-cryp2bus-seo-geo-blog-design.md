# Cryp2bus SEO & GEO Blog — Design Spec

**Date:** 2026-09-07  
**Product:** Cryptobus / cryp2bus.com  
**Brand for content:** Cryp2bus (SEO & content factory: crypto settlements in business)  
**Language:** English  
**Status:** Approved in design review (architecture, content, SEO/GEO, autopost/prod)

## Goal

Ship an indexable, mobile-readable English blog on `https://cryp2bus.com/blog/` about business crypto settlements (invoices, treasury, cross-border, compliance, ops). Seed articles go live on production; a scheduled content-factory keeps publishing every other day — same pattern as B2G Global Nexus.

## Non-goals

- Base44 / CMS-backed articles
- Separate blog subdomain or separate repository
- Migrating Cryptobus from Vite to Next.js
- Russian-language edition
- Investment / trading / “how to earn on crypto” content

## Approach

**Port the B2G Vite + MDX + prerender + GitHub Actions content-factory stack into the existing Cryptobus repo**, rebranded for Cryp2bus and wired to the current site layout, lead modal, and GitHub Pages deploy.

## Architecture

```
content/blog/*.mdx          → source of truth (git commit = publish)
content-factory/            → plan, queue, generate, sitemap/robots/llms, commit
src/pages/Blog.jsx          → /blog index
src/pages/BlogPost.jsx      → /blog/:slug
src/lib/blog*.js            → load/parse/SEO helpers
vite-plugin-prerender-blog  → crawlable HTML shells at build
public/{robots,sitemap,llms}
.github/workflows/
  content-factory.yml       → cron + dispatch
  deploy.yml                → existing Pages deploy (unchanged trigger)
```

- Routes live under existing `SiteLayout` (`App.jsx`).
- Header + footer gain a **Blog** link.
- Article CTAs open the existing lead modal (`Open Business Account` / contact), with blog-specific `source` values.
- Site base URL: `https://cryp2bus.com`.
- Trailing-slash canonicals: `/blog/`, `/blog/{slug}/`.

## Content model

### Positioning

Practical B2B guidance on accepting and settling with cryptocurrency in legitimate business processes. Author byline: **Cryp2bus Editorial**. Compliance tone: not financial advice; no guaranteed returns; no promises of regulatory outcomes.

### Clusters

1. **Invoice & B2B settlement** — paying/receiving invoices in USDT/USDC and related flows  
2. **Corporate treasury** — holding, converting, OTC for companies  
3. **Cross-border payments** — speed/cost vs traditional rails  
4. **Compliance & risk** — AML/KYC for business use, safe claims  
5. **Ops playbooks** — accounting handoffs, roles, implementation checklists  

### Formats & length

- Formats: Howto, Explainer, Comparison, Checklist  
- Target length: ~1400–1800 words  
- On-page template: H1 → intro → H2 sections → FAQ → CTA → related posts  
- Required disclaimer block in article template / generator prompt  

### Launch content

- **5–8 seed MDX articles** published with the initial release  
- Full queue in `content-factory/config/content-plan.json` for ongoing autopost  
- Optional Unsplash (or equivalent) cover images when `UNSPLASH_ACCESS_KEY` is set; otherwise placeholder/brand image path  

## SEO / GEO

| Asset | Behavior |
|-------|----------|
| Prerender | Build writes `dist/blog/index.html` and `dist/blog/{slug}/index.html` with real title, description, canonical, OG/Twitter, and inlined article body for crawlers |
| JSON-LD | Article, BreadcrumbList, FAQPage where FAQ exists |
| `robots.txt` | Allow crawl; point to sitemap |
| `sitemap.xml` | Homepage + key marketing URLs + all blog posts; updated on each factory publish |
| `llms.txt` | Short site/blog summary for AI/GEO crawlers; updated with new posts |
| `index.html` | Ensure site-level canonical / OG baselines exist so prerender can rewrite per page |

Articles must remain readable without JS for primary content (prerendered body). React hydration provides navigation, lead modal, and related UI.

## Mobile readability

- Reuse Cryptobus responsive shell (header/footer)  
- Article column ~65–70ch max width; comfortable type scale and spacing on small screens  
- No card grids in the article body; compact TOC/FAQ if used  
- Images sized with aspect-ratio; lazy-load below the fold  

## Autoposting

- Workflow: `.github/workflows/content-factory.yml`  
- Schedule: `0 8 * * *` UTC  
- Cadence: **every other day** (same skip-day logic as B2G; anchor = first production publish day)  
- Generator: Claude via `ANTHROPIC_API_KEY`; if missing on schedule → safe-fallback article (not empty skip forever)  
- `workflow_dispatch`: count, optional mock/test modes (mirror B2G)  
- After successful commit to `main`, trigger existing `deploy.yml`  
- Secrets: required `ANTHROPIC_API_KEY`; optional `UNSPLASH_ACCESS_KEY`, notify email secrets if ported  

## Production release checklist

1. Implement blog UI, libs, prerender plugin, SEO public files, content-factory  
2. Add seed MDX + content plan  
3. Merge/push to `main` → GitHub Pages deploy  
4. Verify live: `/blog/`, one article URL shows content in View Source, sitemap/robots/llms reachable  
5. Ensure `ANTHROPIC_API_KEY` is set on the repo; enable scheduled content-factory  
6. Smoke one manual `workflow_dispatch` generation if needed  

## Reference implementation

Primary clone source: `/Users/ekaterinavlasova/Desktop/b2g-global-nexus/`  
(`content-factory/`, `vite-plugin-prerender-blog.js`, `src/pages/Blog*.jsx`, `src/lib/blog*.js`, `src/components/blog/*`, workflows).

Adapt copy, `SITE_BASE_URL`, clusters, prompts, CTAs, and visual tokens to Cryptobus — do not copy B2G tender/procurement messaging.

## Success criteria

- Blog index and posts live on `cryp2bus.com`  
- Crawlers see article HTML without executing the SPA  
- Sitemap lists all posts; robots and llms present  
- Mobile layout is readable end-to-end  
- Scheduled autopost runs every other day and deploys new articles to prod  
