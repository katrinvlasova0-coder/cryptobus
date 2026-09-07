import type { ArticleRequest } from './types';
import { clusterTagEn } from '../../config/cluster-tags';

export function buildArticlePrompt(
  req: ArticleRequest,
  images: Array<{ url: string; altText: string }>,
  internalLinks: Array<{ slug: string; text: string }>,
): string {
  const imgMarkdown = images
    .slice(1)
    .map((img, i) => `Body image ${i + 1}: ![${img.altText}](${img.url})`)
    .join('\n');

  const internalLinksText = internalLinks
    .map((l) => `- [${l.text}](/blog/${l.slug}/)`)
    .join('\n');

  const authorName = req.author?.name ?? 'Cryp2bus Editorial';
  const authorRole = req.author?.role ?? 'Editorial';
  const coverUrl = images[0]?.url?.replace('w=800', 'w=1200') ?? '';
  const title = req.titleEn || req.titleDe;
  const keyword = req.keywordEn || req.keywordDe;

  return `
Write a complete English educational article for the Cryptobus / Cryp2bus blog (business crypto settlements). No investment promises.

## ARTICLE PARAMETERS
- **Slug:** ${req.slug}
- **Title:** ${title}
- **Primary keyword:** "${keyword}" (target density: 0.8–1.2%)
- **LSI keywords:** ${req.lsiKeywords.join(', ')}
- **Format:** ${req.format}
- **Target word count:** ${req.targetLength} words
- **Category:** ${req.category} (one of: Invoice Settlement, Corporate Treasury, Cross-border Payments, Compliance, Ops Playbooks)
- **Audience:** ${getSegmentDesc(req.taSegments)}

## IMAGES
- Do **not** paste the cover image (\`coverImage\` in frontmatter) into the body. The site already renders it above the article.
- Place remaining images later in the body, after at least one H2.
${imgMarkdown || '- (no extra body images)'}

## INTERNAL LINKS
Embed 2–3 as inline mentions only if they fit. **Do not** add a “Further reading” heading or a dump of unpublished slugs.

${internalLinksText || '(none — skip internal links)'}

## AUTHORITATIVE EXTERNAL SOURCES (use where relevant)
- FATF: https://www.fatf-gafi.org
- OECD crypto-assets work: https://www.oecd.org
- IFRS / IASB materials for digital assets accounting context: https://www.ifrs.org
- EU MiCA overview pages from official EU institutions when citing EU context

## REQUIRED CONTENTS

### 1. Frontmatter (exactly this shape)
\`\`\`
---
title: "${title}"
titleEn: "${title}"
description: "[150–160 characters, keyword '${keyword}', no guaranteed returns]"
descriptionEn: "[same as description]"
datePublished: "${req.plannedDate}"
dateModified: "${req.plannedDate}"
author:
  name: "${authorName}"
  role: "${authorRole}"
category: "${req.category}"
readTime: "[X min]"
coverImage: "${coverUrl}"
featured: false
tags: ["${keyword}", "${clusterTagEn(req.cluster)}", "business crypto", "2026"]
tagsEn: ["${keyword}", "${clusterTagEn(req.cluster)}", "business crypto", "2026"]
faq:
  - question: "..."
    answer: "..."
---
\`\`\`

### 2. Article structure (required)
- Intro: hook + core answer in the first 150 words (GEO). Start with the topic, not a compliance dump.
- Do **not** repeat the cover image in the body
- At least 5 H2 headings
- At least 1 data table
- At least 1 numbered list (5+ items)
- One in-body image (not the cover) mid-article
- Risks / limits section (required) — no guaranteed returns
- Practical checklist or how-to
- Closing CTA, verbatim:
  Open a Cryptobus business account to buy crypto, pay invoices, and settle cross-border.
- Required italic disclaimer (see system prompt)
- **Do not** add a “Further reading” section
- **Do not** add a paragraph beginning “This educational snapshot of …”

### 3. FAQ
At least 5 questions in frontmatter. First question must be the most common search query for "${keyword}".
FAQ answers must not promise returns or investment outcomes.

## FORBIDDEN PATTERNS (AGAIN)
- ❌ {#anchor-id}
- ❌ JSX components
- ❌ Guaranteed returns / risk-free profits
- ❌ Invented expert authors
- ❌ H1 in body

Return ONLY the full MDX document (frontmatter + body). No preamble.
`;
}

function getSegmentDesc(segments: string[]): string {
  const map: Record<string, string> = {
    finance: 'finance and treasury leads',
    ops: 'operations and payments ops',
    founders: 'founders and business owners',
    accountants: 'controllers and accountants',
    compliance: 'compliance and KYB owners',
    partners: 'procurement and supplier managers',
  };
  return (segments || []).map((s) => map[s] || s).join(', ') || 'business decision-makers';
}
