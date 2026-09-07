import { parseBlogMdx, sortPosts, filterPostsByCategory } from './blog-parse.js';

const modules = import.meta.glob('../../content/blog/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function fileSlug(filePath) {
  const file = String(filePath).split('/').pop() || '';
  return file.replace(/\.mdx$/, '');
}

export function getAllPosts() {
  const posts = Object.entries(modules).map(([filePath, raw]) =>
    parseBlogMdx(fileSlug(filePath), raw),
  );
  return sortPosts(posts);
}

export function getPostBySlug(slug) {
  return getAllPosts().find((post) => post.slug === slug) || null;
}

export function getPostsByCategory(category) {
  return filterPostsByCategory(getAllPosts(), category);
}

export {
  BLOG_CATEGORIES,
  cleanBlogBody,
  parseBlogMdx,
  sortPosts,
  filterPostsByCategory,
  getRelatedPosts,
  splitBodyForBanner,
} from './blog-parse.js';
