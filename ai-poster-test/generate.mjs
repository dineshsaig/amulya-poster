/**
 * Generates Amulya poster template variants using HF FLUX.1-schnell.
 * Usage:
 *   $env:HF_TOKEN="hf_xxxx"   (PowerShell)
 *   node generate.mjs
 *
 * Outputs: output/<variant>.png (768×1365 — same 1:1.776 ratio as 1024×1819)
 * To test: copy any output file to ../public/poster-template.png and npm run dev
 */

import { writeFileSync, mkdirSync } from 'fs';

const MODEL = 'black-forest-labs/FLUX.1-schnell';
const API_URL = `https://router.huggingface.co/hf-inference/models/${MODEL}`;

// Portrait size matching the 1024×1819 canvas aspect ratio (≈9:16 / WhatsApp story).
// Free HF tier pixel budget ≈ 1024×1024 = 1,048,576 px.
// 768×1365 = 1,048,320 px — largest portrait that fits within the budget.
const WIDTH  = 768;
const HEIGHT = 1365;

// ── Layout zones the prompts must respect ───────────────────────────────────
// TOP 14% (≈0–190px at 1365h)  : header — logo placement, decorative arch
// MID 54% (≈190–930px)         : KEEP CLEAR — title + 3 menu columns go here
// BOT 32% (≈930–1365px)        : food photos + dark footer strip for address
// ───────────────────────────────────────────────────────────────────────────

const VARIANTS = [
  {
    name: '01-cream-heritage',
    prompt:
      'Indian restaurant buffet menu poster template, cream parchment paper background, ' +
      'dark forest green and antique gold ornate border frame with corner lotus ornaments, ' +
      'top 14 percent has a decorative golden arch and scroll motifs as header area, ' +
      'middle 54 percent is clean plain cream with no decorations — empty space for text overlay, ' +
      'bottom 32 percent shows two rows of four photorealistic Indian curry dishes in traditional ' +
      'brass karahi and copper bowls on a dark wooden surface — biryani, paneer curry, lamb curry, ' +
      'butter chicken, sambar, gulab jamun, fruit custard, rice — warm amber food photography lighting, ' +
      'very bottom strip is a dark forest green band for address text, ' +
      'no text anywhere in the image, vertical portrait 9:16 format, premium restaurant print quality',
  },
  {
    name: '02-cream-festive',
    prompt:
      'Indian restaurant menu poster template background, warm ivory cream paper, ' +
      'elaborate crimson and gold decorative Indian border with paisley and mango-leaf motifs at edges, ' +
      'circular ornamental badge top-left corner, top 14 percent has ornamental header space, ' +
      'middle 54 percent is completely plain cream — clear empty zone for menu text, ' +
      'bottom 32 percent features a rich food photography spread: 8 bowls of Indian buffet dishes ' +
      'arranged in two neat rows — colorful curries, biryanis, desserts in copper serveware — ' +
      'warm restaurant lighting from above, natural textures, photorealistic, ' +
      'bottom banner is deep maroon with small gold leaf motifs, ' +
      'no text, vertical portrait format, vibrant colors, high detail print',
  },
  {
    name: '03-parchment-traditional',
    prompt:
      'traditional Indian cuisine buffet poster template, aged parchment cream background, ' +
      'hand-painted style dark green and gold Indian border frame, ' +
      'ornamental golden divider lines separating three subtle column zones in the middle, ' +
      'top header zone 14 percent has decorative element and open space for logo, ' +
      'middle 54 percent is pale cream with only the faint column dividers — no other decorations, ' +
      'bottom third shows closeup photorealistic Indian food: ' +
      'two rows of earthen clay pots and brass thalis filled with dals, curries, ' +
      'biryani, desserts, warm golden restaurant lighting, beautiful food styling, ' +
      'footer strip is dark chocolate brown with gold dot accents, ' +
      'no text, vertical 9:16 portrait, artisan restaurant quality',
  },
];

async function query(prompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'image/png',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        width: WIDTH,
        height: HEIGHT,
        num_inference_steps: 4,
        guidance_scale: 3.5,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // Model may still be loading — the API returns 503 with estimated_time
    try {
      const json = JSON.parse(text);
      if (json.estimated_time) {
        throw new Error(`Model loading — retry in ~${Math.ceil(json.estimated_time)}s`);
      }
    } catch (e) {
      if (e.message.startsWith('Model loading')) throw e;
    }
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const token = process.env.HF_TOKEN;
  if (!token) {
    console.error('\nERROR: HF_TOKEN is not set.');
    console.error('1. Get a free token at https://huggingface.co/settings/tokens');
    console.error('2. PowerShell: $env:HF_TOKEN="hf_xxxx"');
    console.error('3. Then re-run: node generate.mjs\n');
    process.exit(1);
  }

  mkdirSync('output', { recursive: true });

  console.log(`\nGenerating ${VARIANTS.length} template variants via FLUX.1-schnell...\n`);

  for (const variant of VARIANTS) {
    process.stdout.write(`  ${variant.name} ... `);
    try {
      const img = await query(variant.prompt);
      const path = `output/${variant.name}.png`;
      writeFileSync(path, img);
      console.log(`saved → ${path}`);
    } catch (err) {
      console.log(`FAILED — ${err.message}`);
    }
  }

  console.log('\nDone. To preview a variant in the app:');
  console.log('  copy output\\01-cream-heritage.png ..\\public\\poster-template.png');
  console.log('  cd .. && npm run dev');
  console.log('\nAlso save your logo to: ..\\public\\amulya-logo.png');
  console.log('The canvas code will auto-overlay it in the top header zone.\n');
}

main();
