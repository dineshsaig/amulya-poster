import jsPDF from 'jspdf';
import { PosterConfig } from '@/types';

/*
 * posterExport.ts — v26  CREAM TEMPLATE
 *
 * Template layout at 1024 × 1819 px
 * ─────────────────────────────────────────────────────────────────────────────
 *  LOGO + LADY      y=0    → y=305   baked into template
 *  TITLE ZONE       y=310  → y=485   "Tuesday Lunch Buffet" drawn here
 *  COLUMN HEADERS   y=490  → y=628   "VEG ITEMS" etc baked into template
 *  COLUMN CONTENT   y=634  → y=1222  menu items drawn here
 *  FOOD PHOTOS      y=1230 → y=1640  baked into template
 *  FRESH strip      y=1640 → y=1730  baked into template
 *  ADDRESS bar      y=1730 → y=1819  baked into template
 *
 *  Three columns (1024px wide):
 *    Left   x=10  w=330  (veg)
 *    Center x=346 w=330  (sides top · desserts bottom)
 *    Right  x=686 w=330  (non-veg)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const W = 1024;
const H = 1819;

const BOXES = {
  title:    { x:  30, y: 310, w: 964, h: 170 },
  veg:      { x:  10, y: 634, w: 330, h: 588 },
  sides:    { x: 346, y: 634, w: 330, h: 415 },
  desserts: { x: 346, y: 1300, w: 330, h: 135 },
  nonveg:   { x: 686, y: 634, w: 330, h: 588 },
} as const;

// ── Typography ────────────────────────────────────────────────────────────────
// Per-column font ranges (max 8 items per list)
const VEG_NONVEG_MAX  = 30;   // Patrick Hand 26–30 px
const VEG_NONVEG_MIN  = 22;
const SIDES_DES_MAX   = 32;   // Patrick Hand 28–32 px
const SIDES_DES_MIN   = 24;

const LINE_RATIO = 38 / 28;   // proportional line height kept constant
const ITEM_GAP   =  5;
const DOT_R      =  7;

// Cinzel Black for the poster title
function titleFont(size: number): string {
  return `900 ${size}px "Cinzel",Georgia,serif`;
}

// Patrick Hand for all menu item columns
function itemFont(size: number): string {
  return `${size}px "Patrick Hand","Comic Sans MS",cursive`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = `${src}?v=${Date.now()}`;
  });
}

function smartWrap(
  ctx: CanvasRenderingContext2D,
  name: string,
  maxW: number,
): [string] | [string, string] {
  if (ctx.measureText(name).width <= maxW) return [name];
  const words = name.split(' ');
  let splitIdx = words.length - 1;
  for (let i = words.length - 1; i >= 1; i--) {
    if (ctx.measureText(words.slice(0, i).join(' ')).width <= maxW) {
      splitIdx = i; break;
    }
  }
  const line1 = words.slice(0, splitIdx).join(' ') || words[0];
  let   line2 = words.slice(splitIdx).join(' ');
  while (line2.length > 1 && ctx.measureText(line2).width > maxW) {
    line2 = line2.slice(0, -1).trimEnd();
  }
  if (line2 !== words.slice(splitIdx).join(' ')) line2 = line2 + '…';
  return [line1, line2];
}

function computeColumnFont(
  ctx: CanvasRenderingContext2D,
  items: { name: string }[],
  box: { x: number; y: number; w: number; h: number },
  maxFont: number,
  minFont: number,
): { fontSize: number; lineH: number } {
  if (items.length === 0) return { fontSize: maxFont, lineH: Math.ceil(maxFont * LINE_RATIO) };
  const dotCX = box.x + 6 + DOT_R;
  const textX = dotCX + DOT_R + 9;
  const maxW  = box.x + box.w - textX - 6;
  for (let fs = maxFont; fs >= minFont; fs--) {
    ctx.font = itemFont(fs);
    const lh = Math.ceil(fs * LINE_RATIO);
    let totalH = -ITEM_GAP;
    for (const item of items) {
      totalH += smartWrap(ctx, item.name, maxW).length * lh + ITEM_GAP;
    }
    if (totalH <= box.h) return { fontSize: fs, lineH: lh };
  }
  return { fontSize: minFont, lineH: Math.ceil(minFont * LINE_RATIO) };
}

function drawItems(
  ctx: CanvasRenderingContext2D,
  items: { name: string }[],
  box: { x: number; y: number; w: number; h: number },
  dotColor: string,
  fontSize: number,
  lineH: number,
) {
  if (items.length === 0) return;
  const dotCX = box.x + 6 + DOT_R;
  const textX = dotCX + DOT_R + 9;
  const maxW  = box.x + box.w - textX - 6;
  ctx.font         = itemFont(fontSize);
  ctx.textBaseline = 'middle';
  let curY = box.y;
  items.forEach((item) => {
    const lines = smartWrap(ctx, item.name, maxW);
    const itemH = lines.length * lineH;
    if (curY + itemH > box.y + box.h) return;
    lines.forEach((line, li) => {
      const cy = curY + li * lineH + lineH * 0.5;
      if (li === 0) {
        ctx.beginPath();
        ctx.arc(dotCX, cy, DOT_R, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }
      ctx.fillStyle = '#1A0800';
      ctx.fillText(line, textX, cy);
    });
    curY += itemH + ITEM_GAP;
  });
}

/**
 * Draws "Tuesday Lunch Buffet" (or whichever day/meal) into the title zone —
 * the gap between the logo and the baked-in column headers.
 * Font auto-scales down from 74 px so the text always fits in one line.
 */
function drawTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  box: { x: number; y: number; w: number; h: number },
) {
  let fs = 145;
  ctx.font = titleFont(fs);
  while (fs > 60 && ctx.measureText(text).width > box.w - 20) {
    fs -= 1;
    ctx.font = titleFont(fs);
  }
  ctx.fillStyle    = '#7A0000';
  ctx.textBaseline = 'middle';
  ctx.textAlign    = 'center';
  ctx.fillText(text, box.x + box.w / 2, box.y + box.h / 2);
  ctx.textAlign = 'left';
}

// ── Main canvas generator ─────────────────────────────────────────────────────
export async function generatePosterCanvas(
  config: PosterConfig,
  _fontName = 'Book Antiqua',
): Promise<HTMLCanvasElement> {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  // Ensure Cinzel + Patrick Hand are loaded before drawing to canvas
  await Promise.all([
    document.fonts.load(`900 145px "Cinzel"`),
    document.fonts.load(`30px "Patrick Hand"`),
  ]);

  const templateImg = await loadImage('/poster-template.png');
  const canvas      = document.createElement('canvas');
  canvas.width      = W;
  canvas.height     = H;
  const ctx         = canvas.getContext('2d')!;

  // 1. Draw template (logo, borders, column headers, food photos, address — all baked in)
  ctx.drawImage(templateImg, 0, 0, W, H);

  // 2. Draw day + meal type as the poster title in the gap zone
  drawTitle(ctx, `${day} ${mealType} Buffet`, BOXES.title);

  // 3. Draw menu item columns — veg/nonveg: 22–30px · sides/desserts: 24–32px
  const vegCol      = computeColumnFont(ctx, vegItems,       BOXES.veg,      VEG_NONVEG_MAX, VEG_NONVEG_MIN);
  const sidesCol    = computeColumnFont(ctx, accompaniments, BOXES.sides,    SIDES_DES_MAX,  SIDES_DES_MIN);
  const dessertsCol = computeColumnFont(ctx, desserts,       BOXES.desserts, SIDES_DES_MAX,  SIDES_DES_MIN);
  const nonvegCol   = computeColumnFont(ctx, nonVegItems,    BOXES.nonveg,   VEG_NONVEG_MAX, VEG_NONVEG_MIN);

  drawItems(ctx, vegItems,       BOXES.veg,      '#1A6E1A', vegCol.fontSize,      vegCol.lineH);
  drawItems(ctx, accompaniments, BOXES.sides,    '#5C5C2E', sidesCol.fontSize,    sidesCol.lineH);
  drawItems(ctx, desserts,       BOXES.desserts, '#A05000', dessertsCol.fontSize, dessertsCol.lineH);
  drawItems(ctx, nonVegItems,    BOXES.nonveg,   '#8B0000', nonvegCol.fontSize,   nonvegCol.lineH);

  return canvas;
}

// ── Download helpers ──────────────────────────────────────────────────────────
function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export async function downloadPNG(
  _id: string, filename: string,
  config?: PosterConfig, fontName?: string,
): Promise<void> {
  if (!config) throw new Error('Config required');
  if (!isIOSDevice()) {
    const canvas = await generatePosterCanvas(config, fontName);
    const link   = document.createElement('a');
    link.download = `${filename}.png`;
    link.href     = canvas.toDataURL('image/png', 1.0);
    link.click();
    return;
  }
  const tab = window.open('', '_blank');
  if (!tab) { alert('Allow pop-ups for this site, then tap Download PNG again.'); return; }
  const canvas  = await generatePosterCanvas(config, fontName);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  tab.document.write(
    `<!DOCTYPE html><html><head>` +
    `<title>${filename}</title>` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<style>body{margin:0;background:#111;display:flex;flex-direction:column;align-items:center;padding:16px;font-family:-apple-system,sans-serif}` +
    `.tip{color:#fff;font-size:14px;text-align:center;background:rgba(255,200,0,.15);border:1px solid rgba(255,200,0,.35);border-radius:10px;padding:10px 14px;margin-bottom:14px;max-width:360px;line-height:1.5}` +
    `img{max-width:100%;height:auto;border-radius:8px}</style></head><body>` +
    `<div class="tip">Long-press the image below and tap <strong>Save to Photos</strong> to save it.</div>` +
    `<img src="${dataUrl}" alt="${filename}"/></body></html>`
  );
  tab.document.close();
}

export async function downloadPDF(
  _id: string, filename: string,
  config?: PosterConfig, fontName?: string,
): Promise<void> {
  if (!config) throw new Error('Config required');
  const ios = isIOSDevice();
  const tab = ios ? window.open('', '_blank') : null;
  if (ios && !tab) { alert('Allow pop-ups for this site, then tap Download PDF again.'); return; }
  const canvas  = await generatePosterCanvas(config, fontName);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfW    = 148;
  const pdfH    = (canvas.height / canvas.width) * pdfW;
  const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, pdfH] });
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
  if (ios && tab) {
    const pdfDataUrl = pdf.output('datauristring');
    tab.document.write(
      `<!DOCTYPE html><html><head><title>${filename}</title>` +
      `<meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<style>body{margin:0;height:100vh}iframe{width:100%;height:100%;border:none}</style>` +
      `</head><body><iframe src="${pdfDataUrl}"></iframe></body></html>`
    );
    tab.document.close();
  } else {
    pdf.save(`${filename}.pdf`);
  }
}

export function getPosterFilename(day: string, mealType: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `Amulya_${mealType}_Buffet_${day}_${date}`;
}
