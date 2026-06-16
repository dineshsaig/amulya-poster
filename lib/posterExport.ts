import jsPDF from 'jspdf';
import { PosterConfig } from '@/types';

/*
 * posterExport.ts — v24  AUTO-SHRINK PER COLUMN
 *
 * Each column independently calculates the largest font size where all
 * its items fit within the column box height (with wrapping allowed).
 * Font steps down from MAX_FONT (28px) to MIN_FONT (18px) until the
 * total content height fits — then uses that size for the whole column.
 *
 * ═══════════════════════════════════════════════════════════════
 *  PIXEL-ACCURATE BOXES  (1024 × 1819 template, scanned)
 * ═══════════════════════════════════════════════════════════════
 *  TITLE:    x=30,  y=252, w=964, h=175
 *  VEG:      x=20,  y=539, w=318, h=690   right=338
 *  SIDES:    x=355, y=555, w=295, h=408   right=650
 *  DESSERTS: x=355, y=1100,w=295, h=130   right=650
 *  NONVEG:   x=692, y=539, w=295, h=690   right=987
 */

const W = 1024;
const H = 1819;

// ── Layout constants ────────────────────────────────────────────
const MAX_FONT   = 28;   // px — starting font size per column
const MIN_FONT   = 18;   // px — smallest allowed (still legible at print)
const LINE_RATIO = 38 / 28;  // LINE_H / FIXED_FONT — kept proportional as font scales
const ITEM_GAP   =  5;   // px between items (not between wrapped lines)
const DOT_R      =  7;   // px bullet radius

const BOXES = {
  title:    { x:  30, y: 252, w: 964, h: 175 },
  veg:      { x:  20, y: 539, w: 318, h: 690 },
  sides:    { x: 355, y: 555, w: 295, h: 408 },
  desserts: { x: 355, y:1100, w: 295, h: 130 },
  nonveg:   { x: 692, y: 539, w: 295, h: 690 },
} as const;

function fontStack(size: number, bold = false): string {
  return `${bold ? 'bold ' : ''}${size}px "Book Antiqua","Palatino Linotype",Palatino,Georgia,serif`;
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

/**
 * Split a name into 1 or 2 lines so each line fits within maxW.
 * Uses ctx.measureText() for exactness (no char-count guessing).
 * Never produces more than 2 lines; truncates line 2 if necessary.
 */
function smartWrap(
  ctx: CanvasRenderingContext2D,
  name: string,
  maxW: number,
): [string] | [string, string] {
  if (ctx.measureText(name).width <= maxW) return [name];

  const words = name.split(' ');
  let splitIdx = words.length - 1;

  for (let i = words.length - 1; i >= 1; i--) {
    const candidate = words.slice(0, i).join(' ');
    if (ctx.measureText(candidate).width <= maxW) {
      splitIdx = i;
      break;
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

/**
 * Find the largest font size (MAX_FONT → MIN_FONT) where all items
 * fit within box.h using measureText-accurate wrapping.
 * Returns the font size and the proportionally scaled line height.
 */
function computeColumnFont(
  ctx: CanvasRenderingContext2D,
  items: { name: string }[],
  box: { x: number; y: number; w: number; h: number },
): { fontSize: number; lineH: number } {
  if (items.length === 0) return { fontSize: MAX_FONT, lineH: Math.ceil(MAX_FONT * LINE_RATIO) };

  const dotCX = box.x + 6 + DOT_R;
  const textX = dotCX + DOT_R + 9;
  const maxW  = box.x + box.w - textX - 6;

  for (let fs = MAX_FONT; fs >= MIN_FONT; fs--) {
    ctx.font = fontStack(fs);
    const lh = Math.ceil(fs * LINE_RATIO);

    // Total height = sum of (lineCount × lh) + (n−1) × ITEM_GAP
    let totalH = -ITEM_GAP;
    for (const item of items) {
      const lines = smartWrap(ctx, item.name, maxW);
      totalH += lines.length * lh + ITEM_GAP;
    }

    if (totalH <= box.h) return { fontSize: fs, lineH: lh };
  }

  return { fontSize: MIN_FONT, lineH: Math.ceil(MIN_FONT * LINE_RATIO) };
}

/**
 * Draw a column of items using the pre-computed font size and line height.
 */
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

  ctx.font         = fontStack(fontSize);
  ctx.textBaseline = 'middle';

  let curY = box.y;

  items.forEach((item) => {
    const lines = smartWrap(ctx, item.name, maxW);
    const itemH = lines.length * lineH;

    // Safety: don't draw past the bottom of the box
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

function drawTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  box: { x: number; y: number; w: number; h: number },
) {
  let fs = text.length > 22 ? 58 : text.length > 18 ? 66 : 74;
  ctx.font = fontStack(fs, true);
  while (fs > 36 && ctx.measureText(text).width > box.w - 20) {
    fs -= 1;
    ctx.font = fontStack(fs, true);
  }
  ctx.fillStyle    = '#7A0000';
  ctx.textBaseline = 'middle';
  ctx.textAlign    = 'center';
  ctx.fillText(text, box.x + box.w / 2, box.y + box.h / 2);
  ctx.textAlign = 'left';
}

export async function generatePosterCanvas(
  config: PosterConfig,
  _fontName = 'Book Antiqua',
): Promise<HTMLCanvasElement> {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  const templateImg = await loadImage('/poster-template.png');
  const canvas      = document.createElement('canvas');
  canvas.width      = W;
  canvas.height     = H;
  const ctx         = canvas.getContext('2d')!;

  ctx.drawImage(templateImg, 0, 0, W, H);

  // Per-column font sizes — each column uses the largest font that fits all its items
  const vegCol      = computeColumnFont(ctx, vegItems,       BOXES.veg);
  const sidesCol    = computeColumnFont(ctx, accompaniments, BOXES.sides);
  const dessertsCol = computeColumnFont(ctx, desserts,       BOXES.desserts);
  const nonvegCol   = computeColumnFont(ctx, nonVegItems,    BOXES.nonveg);

  drawTitle(ctx, `${day} ${mealType} Buffet`, BOXES.title);
  drawItems(ctx, vegItems,       BOXES.veg,      '#1A6E1A', vegCol.fontSize,      vegCol.lineH);
  drawItems(ctx, accompaniments, BOXES.sides,    '#5C5C2E', sidesCol.fontSize,    sidesCol.lineH);
  drawItems(ctx, desserts,       BOXES.desserts, '#A05000', dessertsCol.fontSize, dessertsCol.lineH);
  drawItems(ctx, nonVegItems,    BOXES.nonveg,   '#8B0000', nonvegCol.fontSize,   nonvegCol.lineH);

  return canvas;
}

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
  if (!tab) {
    alert('Allow pop-ups for this site, then tap Download PNG again.');
    return;
  }

  const canvas  = await generatePosterCanvas(config, fontName);
  const dataUrl = canvas.toDataURL('image/png', 1.0);

  tab.document.write(
    `<!DOCTYPE html><html><head>` +
    `<title>${filename}</title>` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<style>` +
    `body{margin:0;background:#111;display:flex;flex-direction:column;align-items:center;padding:16px;font-family:-apple-system,sans-serif}` +
    `.tip{color:#fff;font-size:14px;text-align:center;background:rgba(255,200,0,.15);` +
    `border:1px solid rgba(255,200,0,.35);border-radius:10px;padding:10px 14px;` +
    `margin-bottom:14px;max-width:360px;line-height:1.5}` +
    `img{max-width:100%;height:auto;border-radius:8px}` +
    `</style></head><body>` +
    `<div class="tip">Long-press the image below and tap <strong>Save to Photos</strong> to save it.</div>` +
    `<img src="${dataUrl}" alt="${filename}"/>` +
    `</body></html>`
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
  if (ios && !tab) {
    alert('Allow pop-ups for this site, then tap Download PDF again.');
    return;
  }

  const canvas  = await generatePosterCanvas(config, fontName);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfW    = 148;
  const pdfH    = (canvas.height / canvas.width) * pdfW;
  const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, pdfH] });
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);

  if (ios && tab) {
    const pdfDataUrl = pdf.output('datauristring');
    tab.document.write(
      `<!DOCTYPE html><html><head>` +
      `<title>${filename}</title>` +
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
