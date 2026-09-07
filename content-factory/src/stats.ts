import readingTime from 'reading-time';
import type { ValidationResult } from './validator';

export interface ArticleStats {
  wordCountDe: number;
  wordCountEn: number;
  totalWords: number;
  readTimeDe: string;
  readTimeEn: string;
  keywordDensity: number;
  fleschEstimate: number;
  imageCount: number;
  tableCount: number;
  faqCount: number;
  internalLinks: number;
  externalLinks: number;
}

function estimateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const words = text.split(/\s+/).filter(Boolean).length || 1;
  const syllables = words * 1.5;
  return Math.round(206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words));
}

export function computeArticleStats(
  content: string,
  validation: ValidationResult,
): ArticleStats {
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const rt = readingTime(body);

  return {
    wordCountDe: validation.stats.wordCountDe,
    wordCountEn: validation.stats.wordCountDe,
    totalWords: validation.stats.wordCountDe,
    readTimeDe: rt.text,
    readTimeEn: rt.text,
    keywordDensity: validation.stats.keywordDensity,
    fleschEstimate: estimateReadability(body),
    imageCount: validation.stats.imageCount,
    tableCount: validation.stats.tableCount,
    faqCount: validation.stats.faqCount,
    internalLinks: validation.stats.internalLinks,
    externalLinks: validation.stats.externalLinks,
  };
}

export function formatStatsLog(stats: ArticleStats): string {
  return [
    `EN: ${stats.wordCountDe} words (${stats.readTimeDe})`,
    `Keyword density: ${stats.keywordDensity.toFixed(2)}%`,
    `Images: ${stats.imageCount} | Tables: ${stats.tableCount} | FAQ: ${stats.faqCount}`,
    `Links: ${stats.internalLinks} internal, ${stats.externalLinks} external`,
  ].join('\n   ');
}
