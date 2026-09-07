import axios from 'axios';
import fs from 'fs';
import path from 'path';

export interface UnsplashImage {
  url: string;
  altText: string;
  photographer: string;
  photographerUrl: string;
}

const BLOG_DIR = path.join(__dirname, '../../content/blog');

const PLACEHOLDER_IMAGES: UnsplashImage[] = [
  {
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop',
    altText: 'Public procurement documents and government buildings',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
  },
  {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop',
    altText: 'Financial data analysis on screen',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
  },
  {
    url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80&auto=format&fit=crop',
    altText: 'Savings and investment growth concept',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
  },
  {
    url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&auto=format&fit=crop',
    altText: 'Documents and checklist on a desk',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
  },
  {
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80&auto=format&fit=crop',
    altText: 'Magnifying glass over financial papers',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
  },
  {
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80&auto=format&fit=crop',
    altText: 'Business planning workspace',
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
  },
];

/** Extract Unsplash photo id from a URL (photo-XXXXXXXX-...). */
export function extractPhotoId(url: string): string | null {
  const match = url.match(/photo-([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

/** Cover photo IDs already used in content/blog/*.mdx frontmatter. */
export function getUsedCoverPhotoIds(excludeSlug?: string): Set<string> {
  const used = new Set<string>();
  if (!fs.existsSync(BLOG_DIR)) return used;

  for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
    const slug = file.replace(/\.mdx$/, '');
    if (excludeSlug && slug === excludeSlug) continue;
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const cover = raw.match(/^coverImage:\s*["']?([^"'\n]+)["']?/m);
    if (!cover) continue;
    const id = extractPhotoId(cover[1]);
    if (id) used.add(id);
  }
  return used;
}

function photoIdFromImage(img: UnsplashImage): string | null {
  return extractPhotoId(img.url);
}

export async function fetchUnsplashImages(
  query: string,
  count: number = 3,
  options: { excludePhotoIds?: Set<string>; excludeSlug?: string } = {},
): Promise<UnsplashImage[]> {
  const exclude = options.excludePhotoIds ?? getUsedCoverPhotoIds(options.excludeSlug);
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  const pickUnique = (candidates: UnsplashImage[]): UnsplashImage[] => {
    const picked: UnsplashImage[] = [];
    const seen = new Set<string>(exclude);
    for (const img of candidates) {
      const id = photoIdFromImage(img);
      if (!id || seen.has(id)) continue;
      seen.add(id);
      picked.push(img);
      if (picked.length >= count) break;
    }
    return picked;
  };

  if (!accessKey) {
    console.warn('⚠️ UNSPLASH_ACCESS_KEY not set — using placeholder images');
    const unique = pickUnique(PLACEHOLDER_IMAGES);
    return unique.length > 0 ? unique : PLACEHOLDER_IMAGES.slice(0, count);
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: Math.min(30, count * 5),
        orientation: 'landscape',
        content_filter: 'high',
      },
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      timeout: 15000,
    });

    const results = (response.data.results ?? []).map(
      (img: {
        urls: { raw: string };
        alt_description?: string;
        description?: string;
        user: { name: string; links: { html: string } };
      }) => ({
        url: `${img.urls.raw}&w=800&q=80&auto=format&fit=crop`,
        altText: img.alt_description || img.description || query,
        photographer: img.user.name,
        photographerUrl: img.user.links.html,
      }),
    );

    const unique = pickUnique(results);
    if (unique.length > 0) return unique;

    console.warn('⚠️ No unique Unsplash results — falling back to unused placeholders');
    return pickUnique(PLACEHOLDER_IMAGES);
  } catch (error) {
    console.warn('⚠️ Unsplash API failed — using placeholder images:', error);
    return pickUnique(PLACEHOLDER_IMAGES);
  }
}

export const CLUSTER_IMAGE_QUERIES: Record<string, string[]> = {
  'Invoice Settlement': ['business invoice payment desk', 'stablecoin settlement laptop', 'accounts payable office'],
  'Corporate Treasury': ['corporate treasury screens', 'finance team monitors', 'wallet security office'],
  'Cross-border Payments': ['global logistics shipping', 'international payment desk', 'currency corridor map'],
  Compliance: ['compliance checklist documents', 'KYB onboarding folder', 'AML review meeting'],
  'Ops Playbooks': ['team approval workflow', 'operations playbook desk', 'maker checker meeting'],
};
