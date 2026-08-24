/**
 * Builds public/og-image.png using official SVGs from cryptocurrency-icons.
 * Run: node scripts/generate-og.mjs
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const iconsRoot = path.dirname(require.resolve('cryptocurrency-icons/package.json'));
const svgDir = path.join(iconsRoot, 'svg/color');
const outPath = path.join(root, 'public/og-image.png');

const W = 1200;
const H = 675;

const coins = [
  { id: 'btc', size: 168, left: 740, top: 120 },
  { id: 'eth', size: 140, left: 930, top: 95 },
  { id: 'usdt', size: 152, left: 860, top: 265 },
  { id: 'sol', size: 128, left: 710, top: 330 },
  { id: 'usdc', size: 120, left: 1010, top: 320 },
  { id: 'xrp', size: 112, left: 840, top: 470 },
];

async function rasterIcon(id, size) {
  return sharp(path.join(svgDir, `${id}.svg`)).resize(size, size).png().toBuffer();
}

async function softShadow(size) {
  const svg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="rgba(0,0,0,0.35)"/>
    </svg>`,
  );
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: svg, top: 0, left: 0 }])
    .blur(8)
    .png()
    .toBuffer();
}

const baseSvg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="65%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#3d82f6" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#3d82f6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="82%" cy="70%" r="30%">
      <stop offset="0%" stop-color="#20b8b8" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#20b8b8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0a0e14"/>
  <rect width="100%" height="100%" fill="url(#g1)"/>
  <rect width="100%" height="100%" fill="url(#g2)"/>
  <g stroke="#3d82f6" stroke-opacity="0.22" fill="none" stroke-width="1.5">
    <path d="M700 160 L820 130 L960 170 L1080 240"/>
    <path d="M720 300 L840 320 L960 290 L1060 360"/>
    <path d="M740 430 L880 460 L1000 410 L1100 490"/>
    <path d="M820 130 L780 300 L820 430"/>
    <path d="M960 170 L940 320 L1000 410"/>
  </g>
  <g fill="#20b8b8" fill-opacity="0.55">
    <circle cx="700" cy="160" r="3"/><circle cx="820" cy="130" r="3"/>
    <circle cx="960" cy="170" r="3"/><circle cx="1080" cy="240" r="3"/>
    <circle cx="840" cy="320" r="3"/><circle cx="1060" cy="360" r="3"/>
    <circle cx="880" cy="460" r="3"/><circle cx="1100" cy="490" r="3"/>
  </g>
  <text x="72" y="268" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#ebf0f8">CRYPTO</text>
  <text x="358" y="268" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#3d82f6">BUS</text>
  <text x="72" y="330" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="500" fill="#ebf0f8">Pay an invoice. Get crypto.</text>
  <text x="72" y="390" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="500" fill="#8c98aa">B2B Crypto Exchange  ·  0.5%</text>
</svg>
`);

const base = await sharp(baseSvg).png().toBuffer();
const composites = [];

for (const coin of coins) {
  const icon = await rasterIcon(coin.id, coin.size);
  const shadow = await softShadow(coin.size);
  composites.push({ input: shadow, left: coin.left + 4, top: coin.top + 8 });
  composites.push({ input: icon, left: coin.left, top: coin.top });
}

await sharp(base).composite(composites).png().toFile(outPath);
console.log(`Wrote ${path.relative(root, outPath)} (${fs.statSync(outPath).size} bytes)`);
