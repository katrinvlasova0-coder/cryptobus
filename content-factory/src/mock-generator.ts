import type { ArticleRequest } from './prompts/types';
import { clusterTagEn } from '../config/cluster-tags';
import type { UnsplashImage } from './images';

const DEPTH = [
  'Business crypto settlement is a payments and controls problem. The invoice, approval trail and settlement proof are the primary sources — not a retail trading tip.',
  'Stablecoins such as USDT and USDC are often used for B2B invoices because teams want a stable unit of account. They still carry operational, network and counterparty risk.',
  'Maker-checker approval, correct network selection and fee awareness prevent the most common ops failures. A wrong-network transfer is usually harder to unwind than a wire recall.',
  'Corporate treasury needs custody rules, conversion policy and reconciliation cadence before wallets are funded. Speculative language does not belong in a company payment playbook.',
  'Cryptobus (Cryp2bus) provides crypto transaction infrastructure for businesses. It is not an investment advisory firm and does not promise returns on assets used for settlement.',
  'Cross-border corridors add KYB, screening and FX documentation. Those are documentary issues first, not marketing issues.',
];

function faqItems(req: ArticleRequest): Array<{ q: string; a: string }> {
  const kw = req.keywordEn || req.keywordDe;
  return [
    {
      q: `What is ${kw}?`,
      a: `${kw} is an educational business-crypto topic. Your invoices, policies and payment partners remain the primary sources for any live settlement.`,
    },
    {
      q: `Does studying ${kw} promise returns?`,
      a: 'No. This briefing never promises returns or profits. Outcomes depend on markets, ops controls and applicable law.',
    },
    {
      q: 'Is Cryptobus an investment advisor?',
      a: 'No. Cryptobus provides crypto transaction infrastructure for businesses. Cryp2bus Editorial content is educational only.',
    },
    {
      q: 'Can you promise that every invoice payment will clear?',
      a: 'No. Screening, network choice, fees and counterparty errors can delay or reverse a payment. Follow your internal controls.',
    },
    {
      q: 'How do I get started with business crypto payments?',
      a: 'Open a Cryptobus business account to buy crypto, pay invoices, and settle cross-border.',
    },
    {
      q: 'Where should I verify facts?',
      a: 'Use signed invoices, internal policy, KYB/AML procedures and primary statements from your banks or crypto-asset service providers as of the action date.',
    },
    {
      q: 'What is the minimum reading checklist?',
      a: 'Invoice identity, beneficiary wallet and network, approvals, fees, settlement proof and accounting handoff.',
    },
  ];
}

export function generateMockArticle(req: ArticleRequest, images: UnsplashImage[]): string {
  const cover = images[0]?.url.replace('w=800', 'w=1200') ?? images[0]?.url ?? '';
  const kw = req.keywordEn || req.keywordDe;
  const title = req.titleEn || req.titleDe;
  const img2 = images[1] ?? images[0];
  const faqs = faqItems(req);
  const faqYaml = faqs.map((f) => `  - question: "${f.q}"\n    answer: "${f.a}"`).join('\n');

  return `---
title: "${title}"
titleEn: "${title}"
description: "${title.slice(0, 120)} Educational briefing on ${kw} for business crypto settlement teams in 2026."
descriptionEn: "${title.slice(0, 120)} Educational briefing on ${kw} for business crypto settlement teams in 2026."
datePublished: "${req.plannedDate}"
dateModified: "${req.plannedDate}"
author:
  name: "Cryp2bus Editorial"
  role: "Editorial"
category: "${req.category}"
readTime: "8 min"
coverImage: "${cover}"
featured: false
tags: ["${kw}", "${clusterTagEn(req.cluster)}", "business crypto", "2026"]
tagsEn: ["${kw}", "${clusterTagEn(req.cluster)}", "business crypto", "2026"]
faq:
${faqYaml}
---

**${kw}** is a working topic for finance and ops teams that settle business invoices with crypto. The first job is to map invoice identity, approvals and settlement evidence — not to assume a market outcome. This briefing explains how to work through ${kw} without treating educational copy as investment advice.

**At a glance:**
- Primary source: signed invoice and internal payment policy
- Typical split: KYB, approvals, settlement proof, accounting handoff
- Cryptobus is business crypto infrastructure, not an investment advisor

## What ${kw} means in a live payment

${DEPTH[0]} ${DEPTH[1]}

| Item | Where it lives | Why it matters |
|------|----------------|----------------|
| Invoice | AP / finance file | Amount, counterparty, due date |
| Approval | Maker-checker log | Dual control before release |
| Settlement | Tx hash / desk ticket | Proof of payment |
| Books | ERP / ledger | Audit trail and FX evidence |

## Why ${kw} matters in 2026

${DEPTH.join('\n\n')}

![${img2.altText} — business crypto settlement](${img2.url})

## How to work through ${kw} — five steps

1. **Confirm invoice number, legal names and settlement asset.**
2. **Verify beneficiary wallet ownership and network.**
3. **Run maker-checker approval with fee awareness.**
4. **Store settlement proof next to the invoice PDF.**
5. **Hand the pack to accounting with an as-of timestamp.**

## Risks and limits

This briefing never promises returns or profits. Market moves can change fiat-equivalent value between receipt and conversion. Operational errors (wrong network, underpayment after fees) can delay settlement. Cryptobus does not replace your policies or counsel.

Sources: [FATF](https://www.fatf-gafi.org), [OECD](https://www.oecd.org), [IFRS](https://www.ifrs.org).

## Conclusion

Treat ${kw} as a controls-and-evidence problem. Verify primary sources as of the action date. Open a Cryptobus business account to buy crypto, pay invoices, and settle cross-border.

*This material is for informational and educational purposes only. It is not legal, tax, investment, or financial advice. Cryptocurrency transactions involve operational, market, and compliance risk. Outcomes depend on your policies, counterparties, corridors, and applicable law. Readers should verify primary sources and internal controls as of the action date.*

## Frequently asked questions about ${kw}

${faqs.map((item) => `### ${item.q}\n\n${item.a}`).join('\n\n')}
`;
}
