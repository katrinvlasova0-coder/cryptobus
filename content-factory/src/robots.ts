import fs from 'fs';
import path from 'path';

function getRobotsPath(): string {
  return path.join(process.env.SITE_PUBLIC_DIR || '../public', 'robots.txt');
}

function getBaseUrl(): string {
  return (process.env.SITE_BASE_URL || 'https://cryp2bus.com').replace(/\/$/, '');
}

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'Claude-Web',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
];

export function ensureRobotsTxt(): void {
  const ROBOTS_PATH = getRobotsPath();
  const BASE_URL = getBaseUrl();

  const content = `User-agent: *
Allow: /
Allow: /blog/
Allow: /llms.txt

Disallow: /api/
Disallow: /login
Disallow: /register

Sitemap: ${BASE_URL}/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

${AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /\nAllow: /blog/\nAllow: /llms.txt\n`).join('\n')}
`;

  fs.mkdirSync(path.dirname(ROBOTS_PATH), { recursive: true });
  fs.writeFileSync(ROBOTS_PATH, content, 'utf-8');
  console.log('✅ robots.txt written');
}
