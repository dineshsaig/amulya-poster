import jsPDF from 'jspdf';
import { PosterConfig } from '@/types';

/*
 * posterExport.ts — v19 FIXED
 *
 * Direct Canvas 2D drawing on the clean Amulya template (1024×1819px).
 * No html2canvas. No DOM capture. Pure pixel math → perfect PNG every time.
 *
 * ═══════════════════════════════════════════════════════════════
 * PIXEL-VERIFIED BOX POSITIONS  (scanned from actual test_1.png)
 * ═══════════════════════════════════════════════════════════════
 *   TITLE:    x=30,  y=235, w=964, h=197   ← inside gold frame
 *   VEG:      x=12,  y=555, w=328, h=740   ← full column height
 *   SIDES:    x=342, y=530, w=334, h=435   ← above Desserts label
 *   DESSERTS: x=342, y=1015,w=334, h=278   ← below "Desserts" label
 *   NONVEG:   x=678, y=555, w=336, h=740   ← full column height
 *
 * ═══════════════════════════════════════════════════════════════
 * TEXT SIZING: no truncation unless absolutely necessary
 *   1. Compute base font from box height / item count
 *   2. Per-item: shrink font size until name fits maxWidth
 *   3. Only add … as absolute last resort at minFont
 * ═══════════════════════════════════════════════════════════════
 */

const W = 1024;
const H = 1819;

const BOXES = {
  title:    { x: 30,  y: 235,  w: 964, h: 197 },
  veg:      { x: 12,  y: 555,  w: 328, h: 740 },
  sides:    { x: 342, y: 530,  w: 334, h: 435 },
  desserts: { x: 342, y: 1015, w: 334, h: 278 },
  nonveg:   { x: 678, y: 555,  w: 336, h: 740 },
} as const;

function fontStack(size: number, bold = false): string {
  const w = bold ? 'bold ' : '';
  return `${w}${size}px "Book Antiqua","Palatino Linotype",Palatino,Georgia,serif`;
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
  const { minFont = 22, maxFont = 54 } = opts;
  const n      = items.length;
  const lineH  = box.h / n;
  const baseFS = Math.max(minFont, Math.min(maxFont, Math.floor(lineH * 0.52)));

  const dotR  = Math.max(7, Math.floor(baseFS * 0.20));
  const dotCX = box.x + 6 + dotR;
  const textX = dotCX + dotR + 10;
  const maxW  = box.w - (textX - box.x) - 8;

  ctx.textBaseline = 'middle';

  items.forEach((item, i) => {
    const cy = box.y + i * lineH + lineH * 0.5;

    // dot
    ctx.beginPath();
    ctx.arc(dotCX, cy, dotR, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    // text — shrink font per-item before truncating
    let fs = baseFS;
    ctx.font = fontStack(fs);
    while (fs > minFont && ctx.measureText(item.name).width > maxW) {
      fs -= 2;
      ctx.font = fontStack(fs);
    }

    let label = item.name;
    if (ctx.measureText(label).width > maxW) {
      while (label.length > 3 && ctx.measureText(label + '…').width > maxW)
        label = label.slice(0, -1);
      label = label.trimEnd() + '…';
    }

    ctx.fillStyle = '#1A0800';
    ctx.fillText(label, textX, cy);
  });
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  box: { x: number; y: number; w: number; h: number },
) {
  let fs = text.length > 22 ? 60 : text.length > 18 ? 68 : 76;
  ctx.font = fontStack(fs, true);
  while (fs > 36 && ctx.measureText(text).width > box.w - 20) {
    fs -= 2;
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

  drawItems(ctx, vegItems,       BOXES.veg,      '#1A6E1A', { minFont: 22, maxFont: 54 });
  drawItems(ctx, accompaniments, BOXES.sides,    '#5C5C2E', { minFont: 18, maxFont: 34 });
  drawItems(ctx, desserts,       BOXES.desserts, '#A05000', { minFont: 18, maxFont: 40 });
  drawItems(ctx, nonVegItems,    BOXES.nonveg,   '#8B0000', { minFont: 22, maxFont: 54 });

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
