import fs from 'fs';
import path from 'path';
import type { ArticleRequest } from './prompts/types';

const ROOT_DIR = path.join(__dirname, '..');
const QUEUE_DIR = path.join(ROOT_DIR, 'queue');
const CONFIG_DIR = path.join(ROOT_DIR, 'config');

function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function writeJson(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function getPendingArticles(limit: number = 5): ArticleRequest[] {
  const pending = readJson<ArticleRequest[]>(path.join(QUEUE_DIR, 'pending.json'), []);
  const priorityOrder = { high: 0, medium: 1, low: 2 } as const;

  return pending
    .sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 1;
      const pb = priorityOrder[b.priority] ?? 1;
      if (pa !== pb) return pa - pb;
      return new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime();
    })
    .slice(0, limit);
}

export function markInProgress(slug: string): void {
  const pendingPath = path.join(QUEUE_DIR, 'pending.json');
  const inProgressPath = path.join(QUEUE_DIR, 'in-progress.json');

  const pending = readJson<ArticleRequest[]>(pendingPath, []);
  const inProgress = readJson<ArticleRequest[]>(inProgressPath, []);

  const article = pending.find((a) => a.slug === slug);
  if (!article) return;

  inProgress.push({ ...article, status: 'in-progress' });
  writeJson(inProgressPath, inProgress);
  writeJson(
    pendingPath,
    pending.filter((a) => a.slug !== slug),
  );
}

/** Put a failed in-progress article back at the end of pending so the batch can try the next one. */
export function requeueFailedToEnd(slug: string): void {
  const pendingPath = path.join(QUEUE_DIR, 'pending.json');
  const inProgressPath = path.join(QUEUE_DIR, 'in-progress.json');

  const pending = readJson<ArticleRequest[]>(pendingPath, []);
  const inProgress = readJson<ArticleRequest[]>(inProgressPath, []);
  const article = inProgress.find((a) => a.slug === slug);
  if (!article) return;

  writeJson(
    inProgressPath,
    inProgress.filter((a) => a.slug !== slug),
  );
  if (!pending.some((a) => a.slug === slug)) {
    pending.push({ ...article, status: 'pending' });
    writeJson(pendingPath, pending);
  }
}

export function markAsCompleted(slug: string): void {
  const pendingPath = path.join(QUEUE_DIR, 'pending.json');
  const inProgressPath = path.join(QUEUE_DIR, 'in-progress.json');
  const completedPath = path.join(QUEUE_DIR, 'completed.json');

  const pending = readJson<ArticleRequest[]>(pendingPath, []);
  const inProgress = readJson<ArticleRequest[]>(inProgressPath, []);
  const completed = readJson<ArticleRequest[]>(completedPath, []);

  const article =
    pending.find((a) => a.slug === slug) ||
    inProgress.find((a) => a.slug === slug);

  if (article) {
    completed.push({
      ...article,
      status: 'completed',
      completedAt: new Date().toISOString(),
    } as ArticleRequest & { completedAt: string });
    writeJson(completedPath, completed);
    writeJson(
      pendingPath,
      pending.filter((a) => a.slug !== slug),
    );
    writeJson(
      inProgressPath,
      inProgress.filter((a) => a.slug !== slug),
    );
  }
}

export function addToQueue(article: ArticleRequest): void {
  const pendingPath = path.join(QUEUE_DIR, 'pending.json');
  const pending = readJson<ArticleRequest[]>(pendingPath, []);

  if (pending.some((a) => a.slug === article.slug)) {
    throw new Error(`Article already in queue: ${article.slug}`);
  }

  pending.push(article);
  writeJson(pendingPath, pending);
}

export function getQueueStats(): {
  pending: number;
  inProgress: number;
  completed: number;
} {
  return {
    pending: readJson<unknown[]>(path.join(QUEUE_DIR, 'pending.json'), []).length,
    inProgress: readJson<unknown[]>(path.join(QUEUE_DIR, 'in-progress.json'), []).length,
    completed: readJson<unknown[]>(path.join(QUEUE_DIR, 'completed.json'), []).length,
  };
}

export function getInternalLinks(
  currentSlug: string,
  count: number = 5,
): Array<{ slug: string; text: string }> {
  const linksMap = readJson<Record<string, string>>(
    path.join(CONFIG_DIR, 'internal-links.json'),
    {},
  );

  return Object.entries(linksMap)
    .filter(([slug]) => slug !== currentSlug)
    .slice(0, count)
    .map(([slug, text]) => ({ slug, text }));
}

export function selectAuthor(cluster: string, category: string): { name: string; role: string } {
  const authors = readJson<
    Array<{ name: string; role: string; expertise: string[] }>
  >(path.join(CONFIG_DIR, 'authors.json'), []);

  const topic = `${cluster} ${category}`.toLowerCase();

  const scored = authors.map((author) => {
    const score = author.expertise.reduce((acc, exp) => {
      return topic.includes(exp.toLowerCase()) ? acc + 1 : acc;
    }, 0);
    return { author, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0]?.author ?? authors[0];

  return { name: best.name, role: best.role };
}

export function initQueueFromContentPlan(
  contentPlan: ArticleRequest[],
  existingSlugs: string[],
): void {
  const pending = contentPlan.filter(
    (a) => a.status === 'pending' && !existingSlugs.includes(a.slug),
  );
  const completed = contentPlan.filter(
    (a) => a.status === 'published' || existingSlugs.includes(a.slug),
  );

  writeJson(path.join(QUEUE_DIR, 'pending.json'), pending);
  writeJson(path.join(QUEUE_DIR, 'in-progress.json'), []);
  writeJson(
    path.join(QUEUE_DIR, 'completed.json'),
    completed.map((a) => ({
      ...a,
      status: 'completed',
      completedAt: a.plannedDate,
    })),
  );
}
