# Cryptobus Content Factory

Autonomous TypeScript pipeline: content plan → queue → English MDX in git → site deploy for [cryp2bus.com](https://cryp2bus.com).

Publication is a git commit of `content/blog/{slug}.mdx`, not a CMS write. The Vite app reads those files at build time and prerenders HTML for SEO/GEO.

## Commands

```bash
cd content-factory
cp .env.example .env
npm install
npm run init
npm run queue:list
npm run generate -- how-to-pay-business-invoices-with-usdt --dry-run --mock
npm run batch -- -n 1
npm run test:compliance
npm run test:fallback
```

`--mock` is for pipeline tests only. Production articles need `ANTHROPIC_API_KEY`.

## Environment

See `.env.example`. `SITE_BASE_URL` defaults to `https://cryp2bus.com`.

## Contract

- English only (no `---en---` block)
- Author: `Cryp2bus Editorial`
- Categories: Invoice Settlement, Corporate Treasury, Cross-border Payments, Compliance, Ops Playbooks
- Required CTA: *Open a Cryptobus business account to buy crypto, pay invoices, and settle cross-border.*
- Required disclaimer: informational / educational purposes only
- Blocked: guaranteed returns, investment solicitation, invented experts
