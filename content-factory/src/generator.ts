import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import type { ArticleRequest } from './prompts/types';
import { SYSTEM_PROMPT } from './prompts/system';
import { buildArticlePrompt } from './prompts/article-de';
import { fetchUnsplashImages, CLUSTER_IMAGE_QUERIES } from './images';
import { validateArticle } from './validator';
import { getInternalLinks, selectAuthor } from './queue';
import { computeArticleStats, formatStatsLog } from './stats';
import { generateMockArticle } from './mock-generator';

const LOG_DIR = path.join(__dirname, '../logs');

function getMinWordCount(format: string): number {
  const map: Record<string, number> = {
    'Pillar Guide': 2500,
    'Country Guide': 1800,
    Vergleich: 1500,
    Rangliste: 1500,
    Datentabelle: 1200,
    'FAQ-Artikel': 1200,
    Explainer: 1500,
    Meinungsartikel: 1200,
    'Strategie-Guide': 1800,
    'B2B Guide': 1500,
    'Invoice Settlement': 1500,
    'Corporate Treasury': 1500,
    'Cross-border Payments': 1500,
    Compliance: 1500,
    'Ops Playbooks': 1500,
    Comparison: 1500,
    'Senior Guide': 1400,
    Howto: 1200,
    'RU Guide': 1200,
    'FIRE Guide': 1800,
    'Kalkulator-Artikel': 1500,
    Planungsartikel: 1500,
    'Trust-Artikel': 1000,
    'Lifestyle-Artikel': 1200,
    Szenarioartikel: 1500,
    'Produkt-Feature': 1000,
    'Compliance-Guide': 1200,
  };
  return map[format] || 1500;
}

function enrichRequest(request: ArticleRequest): ArticleRequest {
  const author = request.author ?? selectAuthor(request.cluster, request.category);
  const targetLength = Math.max(request.targetLength, getMinWordCount(request.format));
  return { ...request, author, targetLength };
}

function extractMdxContent(raw: string): string {
  const mdxStart = raw.indexOf('---');
  return mdxStart >= 0 ? raw.slice(mdxStart) : raw;
}

function logGeneration(slug: string, data: Record<string, unknown>): void {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const logPath = path.join(LOG_DIR, `${slug}-${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function generateArticle(
  request: ArticleRequest,
  options: { mock?: boolean } = {},
): Promise<string> {
  const req = enrichRequest(request);
  const useMock = options.mock || process.env.MOCK_GENERATION === '1';

  const imageQueries =
    CLUSTER_IMAGE_QUERIES[req.cluster] || [req.unsplashQuery || 'business crypto payment desk'];
  const images = await fetchUnsplashImages(imageQueries[0], 3, { excludeSlug: req.slug });

  if (useMock) {
    console.log(`🧪 Mock generation (no Claude API): ${req.slug}...`);
    const articleContent = generateMockArticle(req, images);
    return finalizeArticle(req, articleContent, { mock: true, minWordCount: 600 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Use --mock for testing without Claude API.',
    );
  }
  const internalLinks = getInternalLinks(req.slug, 5);

  const userPrompt = buildArticlePrompt(req, images, internalLinks);

  const client = new Anthropic({ apiKey });

  console.log(`🤖 Generating article: ${req.slug}...`);

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Claude response');
  }

  const articleContent = extractMdxContent(textBlock.text);
  return finalizeArticle(req, articleContent, { mock: false });
}

function finalizeArticle(
  req: ArticleRequest,
  articleContent: string,
  meta: { mock: boolean; minWordCount?: number },
): string {
  const minWordCount = meta.minWordCount ?? getMinWordCount(req.format);
  const validation = validateArticle(
    articleContent,
    req.keywordEn || req.keywordDe,
    minWordCount,
  );

  if (!validation.valid) {
    console.error('❌ Validation failed:');
    validation.errors.forEach((e) => console.error(e));
    logGeneration(req.slug, { errors: validation.errors, warnings: validation.warnings, mock: meta.mock });
    throw new Error(`Article validation failed: ${validation.errors.join('; ')}`);
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️ Warnings:');
    validation.warnings.forEach((w) => console.warn(w));
  }

  const stats = computeArticleStats(articleContent, validation);
  console.log(meta.mock ? '✅ Mock validation passed:' : '✅ Validation passed:');
  console.log(`   ${formatStatsLog(stats)}`);

  logGeneration(req.slug, { stats, warnings: validation.warnings, mock: meta.mock });

  return articleContent;
}

export { getMinWordCount };
