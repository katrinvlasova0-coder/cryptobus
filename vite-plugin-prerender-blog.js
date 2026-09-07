import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { marked } from 'marked';
import { parseBlogMdx } from './src/lib/blog-parse.js';
import {
  buildArticleJsonLd,
  canonicalBlogIndexUrl,
  canonicalBlogUrl,
} from './src/lib/blog-seo.js';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function replaceAttr(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

function applyMeta(indexHtml, { title, description, canonical, image, jsonLd, bodyHtml }) {
  let html = indexHtml;
  html = replaceAttr(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceAttr(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  html = replaceAttr(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  );
  html = replaceAttr(
    html,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  );
  html = replaceAttr(
    html,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  html = replaceAttr(
    html,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
  );
  html = replaceAttr(
    html,
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="${image ? 'article' : 'website'}" />`,
  );
  if (image) {
    html = replaceAttr(
      html,
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escapeHtml(image)}" />`,
    );
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  if (jsonLd) {
    html = html.replace(
      '</head>',
      `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
    );
  }
  return html;
}

export function prerenderBlog() {
  return {
    name: 'prerender-blog',
    apply: 'build',
    closeBundle() {
      const dist = resolve('dist');
      const indexPath = join(dist, 'index.html');
      if (!existsSync(indexPath)) return;

      const indexHtml = readFileSync(indexPath, 'utf8');
      const blogDir = resolve('content/blog');
      const files = existsSync(blogDir)
        ? readdirSync(blogDir).filter((file) => file.endsWith('.mdx'))
        : [];
      const posts = files.map((file) => {
        const slug = file.replace(/\.mdx$/, '');
        return parseBlogMdx(slug, readFileSync(join(blogDir, file), 'utf8'));
      });

      mkdirSync(join(dist, 'blog'), { recursive: true });

      const listingHtml = applyMeta(indexHtml, {
        title: 'Business crypto settlements blog · Cryptobus',
        description:
          'English guides on paying invoices with crypto, corporate treasury, cross-border settlement, compliance, and ops playbooks for businesses.',
        canonical: canonicalBlogIndexUrl(),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Cryp2bus blog',
          url: canonicalBlogIndexUrl(),
          inLanguage: 'en',
        },
        bodyHtml: `<main><h1>Cryp2bus blog</h1><ul>${posts
          .map(
            (post) =>
              `<li><a href="/blog/${post.slug}/">${escapeHtml(post.title)}</a></li>`,
          )
          .join('')}</ul></main>`,
      });
      writeFileSync(join(dist, 'blog/index.html'), listingHtml);

      for (const post of posts) {
        const dir = join(dist, 'blog', post.slug);
        mkdirSync(dir, { recursive: true });
        const body = marked.parse(post.body || '', { gfm: true, breaks: false });
        const page = applyMeta(indexHtml, {
          title: `${post.title} · Cryptobus`,
          description: post.description,
          canonical: canonicalBlogUrl(post.slug),
          image: post.coverImage,
          jsonLd: buildArticleJsonLd(post),
          bodyHtml: `<article><h1>${escapeHtml(post.title)}</h1>${body}</article>`,
        });
        writeFileSync(join(dir, 'index.html'), page);
      }
    },
  };
}
