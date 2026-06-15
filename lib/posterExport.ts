import jsPDF from 'jspdf';
import { PosterConfig } from '@/types';

/*
 * Direct Canvas 2D drawing — 100% reliable PNG export
 * Template: Canva design 1024x1536px
 *
 * Verified box positions:
 *   TITLE:    x=120, y=225, w=770, h=110
 *   VEG:      x=38,  y=496, w=277, h=590
 *   SIDES:    x=351, y=496, w=296, h=440
 *   DESSERTS: x=351, y=960, w=296, h=125
 *   NONVEG:   x=683, y=496, w=302, h=590
 */

const BOXES = {
  title:    { x: 120, y: 225, w: 770, h: 110 },
  veg:      { x: 38,  y: 496, w: 277, h: 590 },
  sides:    { x: 351, y: 496, w: 296, h: 440 },
  desserts: { x: 351, y: 960, w: 296, h: 125 },
  nonveg:   { x: 683, y: 496, w: 302, h: 590 },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

function drawItems(
  ctx: CanvasRenderingContext2D,
  items: { name: string }[],
  box: { x: number; y: number; w: number; h: number },
  dotColor: string,
  fontName: string,
  minFont = 18,
  maxFont = 32,
) {
  if (items.length === 0) return;

  const fontSize = Math.max(minFont, Math.min(maxFont, (box.h / items.length) / 1.5));
  const lineH    = box.h / items.length;
  const dotR     = Math.max(6, fontSize * 0.22);
  const textX    = box.x + dotR * 2 + 10;
  const maxTextW = box.w - dotR * 2 - 14;

  ctx.font         = `${fontSize}px "${fontName}", "Palatino Linotype", Georgia, serif`;
  ctx.textBaseline = 'middle';

  items.forEach((item, i) => {
    const cy = box.y + i * lineH + lineH / 2;

    // Bullet
    ctx.beginPath();
    ctx.arc(box.x + dotR + 2, cy, dotR, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    // Text — truncate if needed
    ctx.fillStyle = '#1A0800';
    let text = item.name;
    while (ctx.measureText(text).width > maxTextW && text.length > 4) {
      text = text.slice(0, -1);
    }
    if (text !== item.name) text = text.slice(0, -2) + '…';
    ctx.fillText(text, textX, cy);
  });
}

export async function generatePosterCanvas(
  config: PosterConfig,
  fontName = 'Book Antiqua',
): Promise<HTMLCanvasElement> {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  const templateImg = await loadImage('/poster-template.png');

  const canvas  = document.createElement('canvas');
  canvas.width  = 1024;
  canvas.height = 1536;
  const ctx     = canvas.getContext('2d')!;

  // Draw background template
  ctx.drawImage(templateImg, 0, 0, 1024, 1536);

  // ── TITLE ──
  const titleText = `${day} ${mealType} Buffet`;
  const titleSize = titleText.length > 22 ? 52 : titleText.length > 18 ? 60 : 68;
  ctx.font         = `900 ${titleSize}px "${fontName}", Georgia, serif`;
  ctx.fillStyle    = '#5C0A00';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    titleText,
    BOXES.title.x + BOXES.title.w / 2,
    BOXES.title.y + BOXES.title.h / 2,
  );
  ctx.textAlign = 'left';

  // ── VEG ITEMS ──
  drawItems(ctx, vegItems, BOXES.veg, '#2E7D32', fontName, 18, 32);

  // ── SIDES ──
  // If desserts exist, shrink sides to make room
  const sidesBox = { ...BOXES.sides };
  if (desserts.length > 0) {
    sidesBox.h = BOXES.desserts.y - BOXES.sides.y - 10;
  }
  drawItems(ctx, accompaniments, sidesBox, '#8B6914', fontName, 16, 26);

  // ── DESSERTS ──
  if (desserts.length > 0) {
    drawItems(ctx, desserts, BOXES.desserts, '#8B4513', fontName, 16, 26);
  }

  // ── NON-VEG ITEMS ──
  drawItems(ctx, nonVegItems, BOXES.nonveg, '#B71C1C', fontName, 18, 32);

  return canvas;
}

export async function downloadPNG(
  _elementId: string,
  filename: string,
  config?: PosterConfig,
  fontName?: string,
): Promise<void> {
  if (!config) throw new Error('Config required');
  const canvas = await generatePosterCanvas(config, fontName);
  const link   = document.createElement('a');
  link.download = `${filename}.png`;
  link.href     = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export async function downloadPDF(
  _elementId: string,
  filename: string,
  config?: PosterConfig,
  fontName?: string,
): Promise<void> {
  if (!config) throw new Error('Config required');
  const canvas  = await generatePosterCanvas(config, fontName);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfW    = 108;
  const pdfH    = (canvas.height * pdfW) / canvas.width;
  const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, pdfH] });
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
  pdf.save(`${filename}.pdf`);
}

export function getPosterFilename(day: string, mealType: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `Amulya_${mealType}_Buffet_${day}_${date}`;
}
