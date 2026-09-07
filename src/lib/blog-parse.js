export const BLOG_CATEGORIES = [
  'Invoice Settlement',
  'Corporate Treasury',
  'Cross-border Payments',
  'Compliance',
  'Ops Playbooks',
];

function unquote(value) {
  const trimmed = String(value ?? '').trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseInlineArray(value) {
  const match = String(value).match(/^\[(.*)\]$/);
  if (!match) return [];
  return match[1]
    .split(',')
    .map((item) => unquote(item.trim()))
    .filter(Boolean);
}

function parseFrontmatter(raw) {
  const data = {};
  const lines = raw.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const faqMatch = line.match(/^faq(?:En)?:\s*$/);
    if (faqMatch) {
      const items = [];
      i += 1;
      while (i < lines.length) {
        const q = lines[i].match(/^\s*-\s+question:\s*(.*)$/);
        if (!q) break;
        const question = unquote(q[1]);
        i += 1;
        const a = lines[i]?.match(/^\s+answer:\s*(.*)$/);
        const answer = a ? unquote(a[1]) : '';
        if (a) i += 1;
        items.push({ question, answer });
      }
      data.faq = items;
      continue;
    }

    const authorMatch = line.match(/^author:\s*$/);
    if (authorMatch) {
      const author = {};
      i += 1;
      while (i < lines.length) {
        const nested = lines[i].match(/^\s{2}(\w+):\s*(.*)$/);
        if (!nested) break;
        author[nested[1]] = unquote(nested[2]);
        i += 1;
      }
      data.author = author;
      continue;
    }

    const kv = line.match(/^([A-Za-z][\w]*)\s*:\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const value = kv[2];
      if (value.startsWith('[')) data[key] = parseInlineArray(value);
      else if (value === 'true' || value === 'false') data[key] = value === 'true';
      else data[key] = unquote(value);
    }
    i += 1;
  }

  return data;
}

function imageUrlPath(url) {
  return String(url ?? '').split('?')[0];
}

export function cleanBlogBody(body, coverImage = '') {
  let text = String(body ?? '').trim();

  text = text.replace(
    /^[^\n]*is an educational topic, not a promise of investment returns\.[^\n]*\n*/i,
    '',
  );

  if (coverImage) {
    const coverPath = imageUrlPath(coverImage);
    text = text.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (full, url) =>
      imageUrlPath(url) === coverPath ? '' : full,
    );
  }

  text = text.replace(/\n*##\s*Further reading\s*\n(?:[-*+]\s.*\n|\s*\n)*/i, '\n\n');
  text = text.replace(/^This educational snapshot of .+\n?/gim, '');

  return text.replace(/\n{3,}/g, '\n\n').trim();
}

export function parseBlogMdx(slug, raw) {
  const text = String(raw ?? '');
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const frontmatter = match ? parseFrontmatter(match[1]) : {};
  const rawBody = match ? match[2].trim() : text.trim();
  const body = cleanBlogBody(rawBody, frontmatter.coverImage || '');

  return {
    slug,
    title: frontmatter.title || frontmatter.titleEn || slug,
    description: frontmatter.description || frontmatter.descriptionEn || '',
    datePublished: frontmatter.datePublished || '',
    dateModified: frontmatter.dateModified || frontmatter.datePublished || '',
    author: {
      name: frontmatter.author?.name || 'Cryp2bus Editorial',
      role: frontmatter.author?.role || 'Editorial',
    },
    category: frontmatter.category || 'Invoice Settlement',
    readTime: String(frontmatter.readTime || ''),
    coverImage: frontmatter.coverImage || '',
    featured: Boolean(frontmatter.featured),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    faq: Array.isArray(frontmatter.faq) ? frontmatter.faq : [],
    body,
  };
}

export function sortPosts(posts) {
  return [...posts].sort((a, b) =>
    String(b.datePublished).localeCompare(String(a.datePublished)),
  );
}

export function filterPostsByCategory(posts, category) {
  if (!category || !BLOG_CATEGORIES.includes(category)) return posts;
  return posts.filter((post) => post.category === category);
}

export function getRelatedPosts(posts, slug, limit = 3) {
  const list = Array.isArray(posts) ? posts : [];
  const current = list.find((post) => post.slug === slug);
  const others = list.filter((post) => post.slug !== slug);
  const sameCategory = current
    ? others.filter((post) => post.category === current.category)
    : [];
  const rest = current
    ? others.filter((post) => post.category !== current.category)
    : others;
  return [...sameCategory, ...rest].slice(0, limit);
}

export function splitBodyForBanner(body) {
  const text = String(body ?? '');
  const matches = [...text.matchAll(/^## /gm)];
  if (matches.length < 2) return { before: text, after: '' };
  const index = matches[1].index ?? 0;
  return { before: text.slice(0, index).trim(), after: text.slice(index).trim() };
}
