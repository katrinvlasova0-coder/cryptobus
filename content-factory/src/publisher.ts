import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import matter from 'gray-matter';
import type { ArticleRequest } from './prompts/types';
import { sendArticleNotification } from './notify';

function getContentDir(): string {
  return path.resolve(process.env.CONTENT_DIR || '../content/blog');
}

export async function publishArticle(
  slug: string,
  content: string,
  request: ArticleRequest,
  autoCommit: boolean = false,
  notifyMeta?: { isFallback?: boolean; fallbackReason?: string },
): Promise<void> {
  const contentDir = getContentDir();
  const filePath = path.join(contentDir, `${slug}.mdx`);

  fs.mkdirSync(contentDir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Article written: ${filePath}`);

  const { data: frontmatter, content: body } = matter(content);
  const wordCountDe = body.split(/\s+/).filter(Boolean).length;
  const wordCountEn = wordCountDe;
  const faqCount = Array.isArray(frontmatter.faq) ? frontmatter.faq.length : 0;

  if (autoCommit) {
    try {
      const repoRoot = path.resolve(contentDir, '../..');
      execSync(
        `git -C "${repoRoot}" add "content/blog/${slug}.mdx" public/sitemap.xml public/robots.txt public/llms.txt`,
        { stdio: 'inherit' },
      );
      execSync(
        `git -C "${repoRoot}" commit -m "feat(blog): add article ${slug}"`,
        { stdio: 'inherit' },
      );
      console.log('✅ Git commit created');
    } catch (e) {
      console.warn('⚠️ Git commit failed (not blocking):', e);
    }
  }

  try {
    await sendArticleNotification({
    slug,
    titleDe: String(frontmatter.title ?? request.titleDe),
    titleEn: String(frontmatter.title ?? frontmatter.titleEn ?? request.titleEn),
    cluster: request.cluster,
    keywordDe: request.keywordDe,
    searchVolDe: request.searchVolDe,
    wordCountDe,
    wordCountEn,
    faqCount,
    publishedDate: String(frontmatter.datePublished ?? request.plannedDate),
    coverImage: String(frontmatter.coverImage ?? ''),
    descriptionDe: String(frontmatter.description ?? ''),
    isFallback: notifyMeta?.isFallback,
    fallbackReason: notifyMeta?.fallbackReason,
    });
  } catch (e) {
    console.warn('⚠️ Email notification failed (article still published):', e);
  }
}
