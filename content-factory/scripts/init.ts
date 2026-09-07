#!/usr/bin/env tsx
/**
 * Initialization script for Cryptobus Content Factory
 * - Validates environment variables
 * - Initializes queue from content-plan.json
 * - Marks existing blog articles as completed
 * - Ensures robots.txt is up to date
 * - Regenerates public/sitemap.xml
 */
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import contentPlan from '../config/content-plan.json';
import { ensureRobotsTxt } from '../src/robots';
import { regenerateSitemap } from '../src/sitemap';
import { initQueueFromContentPlan } from '../src/queue';
import type { ArticleRequest } from '../src/prompts/types';

dotenv.config({ path: path.join(__dirname, '../.env') });

const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.resolve(ROOT, process.env.CONTENT_DIR || '../content/blog');

const REQUIRED_ENV = ['ANTHROPIC_API_KEY'] as const;
const OPTIONAL_ENV = [
  'UNSPLASH_ACCESS_KEY',
  'RESEND_API_KEY',
  'NOTIFY_EMAIL',
  'FROM_EMAIL',
  'SITE_BASE_URL',
  'CONTENT_DIR',
  'SITE_PUBLIC_DIR',
] as const;

function checkEnv(): void {
  console.log('\n🔧 Checking environment...\n');

  let hasErrors = false;
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      console.error(`❌ Missing required env: ${key}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${key} is set`);
    }
  }

  for (const key of OPTIONAL_ENV) {
    if (!process.env[key]) {
      console.warn(`⚠️ Optional env not set: ${key}`);
    } else {
      console.log(`✅ ${key} is set`);
    }
  }

  if (hasErrors && process.env.CF_INIT_STRICT === '1') {
    console.error('\nCopy .env.example to .env and fill in required keys.');
    process.exit(1);
  } else if (hasErrors) {
    console.warn('\n⚠️ Continuing init without required API keys (set CF_INIT_STRICT=1 to enforce)');
  }
}

function getExistingSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    return [];
  }
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''));
}

function main(): void {
  console.log('🚀 Cryptobus Content Factory — Initialization\n');

  checkEnv();

  const existingSlugs = getExistingSlugs();
  console.log(`\n📁 Found ${existingSlugs.length} existing articles in content/blog/`);

  initQueueFromContentPlan(contentPlan as ArticleRequest[], existingSlugs);
  console.log('✅ Queue initialized (pending.json, completed.json)');

  ensureRobotsTxt();
  regenerateSitemap(existingSlugs);
  console.log('✅ robots.txt and sitemap.xml updated');

  console.log('\n🎉 Initialization complete!');
  console.log('\nNext steps:');
  console.log('  npm run queue:list');
  console.log('  npm run generate -- <slug> --dry-run');
  console.log('  npm run batch -- -n 3 --commit');
}

main();
