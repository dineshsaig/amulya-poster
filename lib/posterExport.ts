import jsPDF from 'jspdf';
import { PosterConfig } from '@/types';

/*
 * posterExport.ts — v22  PIXEL-PERFECT
 *
 * Every value below is derived from pixel-scanning the actual
 * downloaded poster, not guessed.
 *
 * ═══════════════════════════════════════════════════════════════
 *  INNER CONTENT BOXES  (1024 × 1819 template)
 * ═══════════════════════════════════════════════════════════════
 *  Measured from template border lines at y=800 scan:
 *
 *  TITLE:    x=30,  y=252, w=964, h=175
 *  VEG:      x=20,  y=539, w=318, h=754   right=338
 *  SIDES:    x=355, y=555, w=295, h=408   right=650  (badge ends ~y=548)
 *  DESSERTS: x=355, y=1100,w=295, h=193   right=650  (label ends ~y=1092)
 *  NONVEG:   x=692, y=539, w=295, h=754   right=987  (border x=672-689, safe start 692)
 *
 * ═══════════════════════════════════════════════════════════════
 *  FONT + SPACING  (3 rules)
 * ═══════════════════════════════════════════════════════════════
 *  1. UNIFORM SIZE — one size for the whole column.
 *     Reduce from maxFont until every item fits maxTextW.
 *
 *  2. TOP-ALIGNED — items start at box.y (no vertical centering).
 *     Previous centring caused a blank gap at the column tops.
 *
 *  3. CAPPED LINE-HEIGHT — lineH = min(boxH/n, fontSize×2.0)
 *     Prevents over-spreading when items are few.
 */

const W = 1024;
const H = 1819;

const BOXES = {
  title:    { x: 30,  y: 252,  w: 964, h: 175 },
  veg:      { x: 20,  y: 539,  w: 318, h: 754 },
  sides:    { x: 355, y: 555,  w: 295, h: 408 },
  desserts: { x: 355, y: 1100, w: 295, h: 193 },
  nonveg:   { x: 692, y: 539,  w: 295, h: 754 },
} as const;

// Fixed dot radius — small enough to leave max text room
const DOT_R = 7;

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
  const { minFont = 18, maxFont = 52 } = opts;
  const n = items.length;

  // Dot and text geometry
  const dotCX  = box.x + 6 + DOT_R;           // dot centre x
  const textX  = dotCX + DOT_R + 9;            // text start x
  const maxW   = box.x + box.w - textX - 6;    // max text width

  // ── Rule 1: UNIFORM font — largest that fits ALL items ─────
  let fs = maxFont;
  ctx.font = fontStack(fs);
  while (fs > minFont) {
    ctx.font = fontStack(fs);
    if (items.every(it => ctx.measureText(it.name).width <= maxW)) break;
    fs -= 1;
  }

  // ── Rule 2 & 3: TOP-aligned + capped line height ───────────
  const lineH  = Math.min(box.h / n, fs * 2.0);   // natural spacing cap
  const startY = box.y;                             // TOP aligned — no centering

  ctx.textBaseline = 'middle';

  items.forEach((item, i) => {
    const cy = startY + i * lineH + lineH * 0.5;

    // Dot
    ctx.beginPath();
    ctx.arc(dotCX, cy, DOT_R, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    // Text — truncate only at absolute minimum
    ctx.fillStyle = '#1A0800';
    let label = item.name;
    if (ctx.measureText(label).width > maxW) {
      while (label.length > 3 && ctx.measureText(label + '…').width > maxW)
        label = label.slice(0, -1);
      label = label.trimEnd() + '…';
    }
    ctx.fillText(label, textX, cy);
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
