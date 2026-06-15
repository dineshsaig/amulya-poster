import jsPDF from 'jspdf';
import { PosterConfig } from '@/types';

/*
 * Direct Canvas 2D drawing on ChatGPT template (1024×1819px)
 *
 * Pixel-verified box positions:
 *   TITLE:    x=120,  y=220,  w=770, h=160
 *   VEG:      x=35,   y=555,  w=283, h=800
 *   SIDES:    x=354,  y=555,  w=301, h=600
 *   DESSERTS: x=354,  y=1155, w=301, h=200
 *   NONVEG:   x=690,  y=555,  w=299, h=800
 */

const W = 1024;
const H = 1819;

const BOXES = {
  title:    { x: 120, y: 220,  w: 770, h: 160 },
  veg:      { x: 35,  y: 555,  w: 283, h: 800 },
  sides:    { x: 354, y: 555,  w: 301, h: 600 },
  desserts: { x: 354, y: 1155, w: 301, h: 200 },
  nonveg:   { x: 690, y: 555,  w: 299, h: 800 },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed: ${src}`));
    img.src = src + '?v=' + Date.now(); // cache bust
  });
}

function drawItems(
  ctx: CanvasRenderingContext2D,
  items: { name: string }[],
  box: { x: number; y: number; w: number; h: number },
  dotColor: string,
  fontName: string,
  minFont = 20,
  maxFont = 38,
) {
  if (items.length === 0) return;
  const fontSize = Math.max(minFont, Math.min(maxFont, (box.h / items.length) / 1.55));
  const lineH    = box.h / items.length;
  const dotR     = Math.max(7, fontSize * 0.23);
  const textX    = box.x + dotR * 2 + 10;
  const maxTextW = box.w - dotR * 2 - 18;

  ctx.font         = `${fontSize}px "${fontName}", "Palatino Linotype", Georgia, serif`;
  ctx.textBaseline = 'middle';

  items.forEach((item, i) => {
    const cy = box.y + i * lineH + lineH / 2;
    // Dot
    ctx.beginPath();
    ctx.arc(box.x + dotR + 2, cy, dotR, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();
    // Text
    ctx.fillStyle = '#1A0800';
    let text = item.name;
    while (ctx.measureText(text).width > maxTextW && text.length > 4) text = text.slice(0, -1);
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
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(templateImg, 0, 0, W, H);

  // TITLE
  const titleText = `${day} ${mealType} Buffet`;
  const titleSize = titleText.length > 22 ? 56 : titleText.length > 18 ? 64 : 72;
  ctx.font         = `900 ${titleSize}px "${fontName}", Georgia, serif`;
  ctx.fillStyle    = '#5C0A00';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleText, BOXES.title.x + BOXES.title.w / 2, BOXES.title.y + BOXES.title.h / 2);
  ctx.textAlign = 'left';

  // VEG
  drawItems(ctx, vegItems, BOXES.veg, '#2E7D32', fontName, 20, 38);

  // SIDES — shrink if desserts exist
  const sidesBox = { ...BOXES.sides };
  if (desserts.length > 0) sidesBox.h = BOXES.desserts.y - BOXES.sides.y - 10;
  drawItems(ctx, accompaniments, sidesBox, '#8B6914', fontName, 18, 30);

  // DESSERTS
  if (desserts.length > 0) {
    drawItems(ctx, desserts, BOXES.desserts, '#8B4513', fontName, 18, 30);
  }

  // NON-VEG
  drawItems(ctx, nonVegItems, BOXES.nonveg, '#B71C1C', fontName, 20, 38);

  return canvas;
}

export async function downloadPNG(
  _id: string, filename: string,
  config?: PosterConfig, fontName?: string,
): Promise<void> {
  if (!config) throw new Error('Config required');
  const canvas = await generatePosterCanvas(config, fontName);
  const link = document.createElement('a');
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
