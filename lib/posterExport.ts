import jsPDF from 'jspdf';
import { PosterConfig } from '@/types';

/*
 * posterExport.ts — v21 FINAL
 *
 * All pixel positions verified from the actual downloaded poster output.
 *
 * ════════════════════════════════════════════════════════════════
 *  PIXEL-ACCURATE BOX MAP  (1024 × 1819px template)
 * ════════════════════════════════════════════════════════════════
 *  TITLE:    x=30,  y=252, w=964, h=175   — below Indian Cuisine + ornament
 *  VEG:      x=12,  y=560, w=328, h=730   — below green Veg badge  (~y=532)
 *  SIDES:    x=342, y=565, w=334, h=398   — below gold Acc. badge  (~y=548)
 *  DESSERTS: x=342, y=1100,w=334, h=193   — below DESSERTS label   (~y=1092)
 *  NONVEG:   x=678, y=560, w=336, h=730   — below maroon badge     (~y=532)
 *
 * ════════════════════════════════════════════════════════════════
 *  FONT / SPACING RULES
 * ════════════════════════════════════════════════════════════════
 *  UNIFORM SIZE: one font size for ALL items in a column.
 *    Start at maxFont, reduce until every item fits maxTextW.
 *
 *  NATURAL SPACING: lineH = min(boxH/n, fontSize * 2.2)
 *    Items are vertically centered as a group inside the box,
 *    so they cluster naturally instead of stretching to fill
 *    the whole column (which looks sparse when items are few).
 */

const W = 1024;
const H = 1819;

const BOXES = {
  title:    { x: 30,  y: 252,  w: 964, h: 175 },
  veg:      { x: 12,  y: 560,  w: 328, h: 730 },
  sides:    { x: 342, y: 565,  w: 334, h: 398 },
  desserts: { x: 342, y: 1100, w: 334, h: 193 },
  nonveg:   { x: 678, y: 560,  w: 336, h: 730 },
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

function drawItems(
  ctx: CanvasRenderingContext2D,
  items: { name: string }[],
  box: { x: number; y: number; w: number; h: number },
  dotColor: string,
  opts: { minFont?: number; maxFont?: number } = {},
) {
  if (items.length === 0) return;
  const { minFont = 20, maxFont = 52 } = opts;
  const n = items.length;

  // ── dot geometry ───────────────────────────────────────────────
  // Use a small fixed dot so text gets maximum room
  const DOT_R  = 7;            // px — fixed small dot
  const DOT_CX = box.x + 5 + DOT_R;
  const TEXT_X = DOT_CX + DOT_R + 9;
  const MAX_W  = box.w - (TEXT_X - box.x) - 6;   // available text width

  // ── STEP 1: uniform font — largest that fits ALL items ─────────
  let fontSize = maxFont;
  ctx.font = fontStack(fontSize);
  while (fontSize > minFont) {
    ctx.font = fontStack(fontSize);
    const allFit = items.every(it => ctx.measureText(it.name).width <= MAX_W);
    if (allFit) break;
    fontSize -= 1;
  }

  // ── STEP 2: natural line height — cap so items don't spread ────
  const maxLineH = fontSize * 2.2;
  const lineH    = Math.min(box.h / n, maxLineH);

  // ── STEP 3: centre the item group vertically in the box ────────
  const groupH = lineH * n;
  const startY = box.y + (box.h - groupH) / 2;

  // ── STEP 4: draw ───────────────────────────────────────────────
  ctx.textBaseline = 'middle';

  items.forEach((item, i) => {
    const cy = startY + i * lineH + lineH * 0.5;

    // Dot
    ctx.beginPath();
    ctx.arc(DOT_CX, cy, DOT_R, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    // Text (truncate only if even minFont overflows)
    ctx.fillStyle = '#1A0800';
    let label = item.name;
    if (ctx.measureText(label).width > MAX_W) {
      while (label.length > 3 && ctx.measureText(label + '…').width > MAX_W)
        label = label.slice(0, -1);
      label = label.trimEnd() + '…';
    }
    ctx.fillText(label, TEXT_X, cy);
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

  drawTitle(ctx, `${day} ${mealType} Buffet`, BOXES.title);

  drawItems(ctx, vegItems,       BOXES.veg,      '#1A6E1A', { minFont: 18, maxFont: 52 });
  drawItems(ctx, accompaniments, BOXES.sides,    '#5C5C2E', { minFont: 16, maxFont: 32 });
  drawItems(ctx, desserts,       BOXES.desserts, '#A05000', { minFont: 16, maxFont: 36 });
  drawItems(ctx, nonVegItems,    BOXES.nonveg,   '#8B0000', { minFont: 18, maxFont: 52 });

  return canvas;
}

export async function downloadPNG(
  _id: string, filename: string,
  config?: PosterConfig, fontName?: string,
): Promise<void> {
  if (!config) throw new Error('Config required');
  const canvas = await generatePosterCanvas(config, fontName);
  const link   = document.createElement('a');
  link.download = `${filename}.png`;
  link.href     = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export async function downloadPDF(
  _id: string, filename: string,
  config?: PosterConfig, fontName?: string,
): Promise<void> {
  if (!config) throw new Error('Config required');
  const canvas  = await generatePosterCanvas(config, fontName);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfW    = 148;
  const pdfH    = (canvas.height / canvas.width) * pdfW;
  const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, pdfH] });
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
  pdf.save(`${filename}.pdf`);
}

export function getPosterFilename(day: string, mealType: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `Amulya_${mealType}_Buffet_${day}_${date}`;
}
