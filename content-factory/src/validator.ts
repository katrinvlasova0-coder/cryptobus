import {
  FORBIDDEN_PATTERNS,
  FORBIDDEN_PATTERN_MESSAGES,
} from '../config/forbidden-patterns';

const COMPLIANCE_KEYS = [
  'guaranteedReturns',
  'investmentAdvice',
  'fakeExpertAuthor',
] as const;

const REQUIRED_CTA =
  /open a cryptobus business account to buy crypto, pay invoices, and settle cross-border/i;

const REQUIRED_DISCLAIMER =
  /informational and educational purposes only|educational purposes only/i;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    wordCountDe: number;
    wordCountEn: number;
    imageCount: number;
    tableCount: number;
    faqCount: number;
    internalLinks: number;
    externalLinks: number;
    h2Count: number;
    hasEnSection: boolean;
    keywordDensity: number;
    numberedListItems: number;
  };
}

function countTables(text: string): number {
  const lines = text.split('\n');
  let tables = 0;
  let inTable = false;

  for (const line of lines) {
    const isTableLine = line.trim().startsWith('|');
    if (isTableLine && !inTable) {
      tables++;
      inTable = true;
    } else if (!isTableLine) {
      inTable = false;
    }
  }

  return tables;
}

function countKeywordOccurrences(text: string, keyword: string): number {
  const normalized = text.toLowerCase();
  const kw = keyword.toLowerCase().trim();
  if (!kw) return 0;

  if (kw.includes(' ')) {
    const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return (normalized.match(regex) || []).length;
  }

  const words = normalized.split(/\s+/);
  return words.filter((w) => w.replace(/[^\wäöüß-]/g, '') === kw).length;
}

function extractParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(
      (p) =>
        p.length > 80 &&
        !p.startsWith('!') &&
        !p.startsWith('|') &&
        !p.startsWith('#') &&
        !p.startsWith('*') &&
        !p.startsWith('-'),
    );
}

function detectCopyPaste(body: string, label: string): string[] {
  const errors: string[] = [];

  if (FORBIDDEN_PATTERNS.mockAbsatzFiller.test(body)) {
    errors.push(`❌ ${label}: mock copy-paste (Absatz N vertieft) — reject article`);
  }

  const paragraphs = extractParagraphs(body);
  const seen = new Map<string, number>();

  for (const paragraph of paragraphs) {
    const normalized = paragraph.replace(/\s+/g, ' ').toLowerCase();
    const count = (seen.get(normalized) ?? 0) + 1;
    seen.set(normalized, count);

    if (count >= 2) {
      errors.push(
        `❌ ${label}: identical paragraph ${count}x — "${paragraph.slice(0, 72)}…"`,
      );
      break;
    }
  }

  const repeatedOpeners = paragraphs
    .map((p) => p.slice(0, 120).replace(/\s+/g, ' '))
    .filter((opener) => opener.length >= 60);
  const openerCounts = new Map<string, number>();
  for (const opener of repeatedOpeners) {
    const count = (openerCounts.get(opener) ?? 0) + 1;
    openerCounts.set(opener, count);
    if (count >= 3) {
      errors.push(`❌ ${label}: same paragraph opener ${count}x — copy-paste`);
      break;
    }
  }

  return errors;
}

export function validateArticle(
  content: string,
  keyword: string,
  minWordCount: number,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const body = content.replace(/^---[\s\S]*?---\n/, '');

  if (FORBIDDEN_PATTERNS.jsxComponent.test(content)) {
    errors.push('❌ JSX components found — not allowed in MDX');
  }
  if (FORBIDDEN_PATTERNS.anchorId.test(content)) {
    errors.push('❌ Anchor IDs {#id} found — not allowed in MDX');
  }
  if (FORBIDDEN_PATTERNS.internalAnchorLink.test(content)) {
    errors.push('❌ Internal anchor links [text](#id) found — not allowed');
  }
  if (FORBIDDEN_PATTERNS.scriptTag.test(content)) {
    errors.push('❌ <script> tag found — not allowed in MDX');
  }
  if (FORBIDDEN_PATTERNS.h1InBody.test(body)) {
    errors.push('❌ H1 (# Heading) in article body — not allowed');
  }
  if (FORBIDDEN_PATTERNS.yamlBlockTags.test(content)) {
    warnings.push('⚠️ YAML block array for tags found — convert to an inline array');
  }
  if (FORBIDDEN_PATTERNS.mockAbsatzFiller.test(content)) {
    errors.push('❌ Mock copy-paste filler in article — publication blocked');
  }

  for (const key of COMPLIANCE_KEYS) {
    if (FORBIDDEN_PATTERNS[key].test(content)) {
      errors.push(`❌ ${FORBIDDEN_PATTERN_MESSAGES[key]}`);
    }
  }

  const authorMatch = content.match(/^\s*name:\s*["']?(.+?)["']?\s*$/m);
  if (authorMatch && !/cryp2bus\s+editorial/i.test(authorMatch[1])) {
    errors.push('❌ Author must be “Cryp2bus Editorial” (no invented experts)');
  }

  errors.push(...detectCopyPaste(body, 'EN'));

  if (content.includes('---en---')) {
    errors.push('❌ Bilingual ---en--- marker is not used in the EN-only Cryp2bus contract');
  }

  const wordCountDe = body.split(/\s+/).filter(Boolean).length;
  const wordCountEn = 0;
  const imageCount = (content.match(/!\[/g) || []).length;
  const tableCount = countTables(body);
  const faqCount = (content.match(/^\s*-\s+question:/gm) || []).length;
  const internalLinks = (content.match(/\[([^\]]+)\]\(\/blog\//g) || []).length;
  const externalLinks = (content.match(/\[([^\]]+)\]\(https?:\/\//g) || []).length;
  const h2Count = (body.match(/^## /gm) || []).length;
  const numberedListItems = (body.match(/^\d+\.\s+/gm) || []).length;

  const keywordOccurrences = countKeywordOccurrences(body, keyword);
  const keywordDensity = wordCountDe > 0 ? (keywordOccurrences / wordCountDe) * 100 : 0;

  if (wordCountDe < minWordCount) {
    warnings.push(`⚠️ Body too short: ${wordCountDe} words (minimum: ${minWordCount})`);
  }
  if (imageCount < 2) {
    warnings.push(`⚠️ Too few images: ${imageCount} (minimum: 2)`);
  }
  if (tableCount === 0) {
    warnings.push('⚠️ No table found — at least 1 required');
  }
  if (faqCount < 5) {
    warnings.push(`⚠️ Too few FAQ questions: ${faqCount} (minimum: 5)`);
  }
  if (internalLinks < 2) {
    warnings.push(`⚠️ Few internal links: ${internalLinks} (target: 3–5)`);
  }
  if (keywordDensity < 0.3) {
    warnings.push(`⚠️ Keyword density too low: ${keywordDensity.toFixed(2)}%`);
  }
  if (keywordDensity > 2.0) {
    warnings.push(`⚠️ Keyword density too high (keyword stuffing): ${keywordDensity.toFixed(2)}%`);
  }
  if (h2Count < 4) {
    warnings.push(`⚠️ Too few H2 headings: ${h2Count} (target: 5–8)`);
  }
  if (!REQUIRED_DISCLAIMER.test(content)) {
    errors.push('❌ Required disclaimer missing (informational / educational purposes only)');
  }
  if (!REQUIRED_CTA.test(content)) {
    errors.push(
      '❌ Required CTA missing: “Open a Cryptobus business account to buy crypto, pay invoices, and settle cross-border.”',
    );
  }
  if (numberedListItems < 5) {
    warnings.push(`⚠️ Too few numbered list items: ${numberedListItems} (target: 5+)`);
  }

  const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const descMatch = content.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  if (titleMatch) {
    const len = titleMatch[1].length;
    if (len < 50 || len > 70) {
      warnings.push(`⚠️ title length: ${len} characters (target: 55–65)`);
    }
  }
  if (descMatch) {
    const len = descMatch[1].length;
    if (len < 140 || len > 170) {
      warnings.push(`⚠️ description length: ${len} characters (target: 150–160)`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      wordCountDe,
      wordCountEn,
      imageCount,
      tableCount,
      faqCount,
      internalLinks,
      externalLinks,
      h2Count,
      hasEnSection: true,
      keywordDensity,
      numberedListItems,
    },
  };
}
