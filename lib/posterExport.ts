import jsPDF from 'jspdf';
import { PosterConfig } from '@/types';

/*
 * CANVAS-BASED EXPORT — No html2canvas needed
 * 
 * Draws directly onto an HTML5 Canvas:
 * 1. Loads the template PNG as an image
 * 2. Draws it onto the canvas
 * 3. Draws all text items directly using Canvas 2D API
 * 4. Exports as PNG/PDF
 *
 * This is 100% reliable — no DOM capture issues, no CORS problems,
 * no scaling bugs. What you draw is exactly what you get.
 */

const TEMPLATE_WIDTH  = 1024;
const TEMPLATE_HEIGHT = 1536;

// Verified pixel positions from template scan
const BOXES = {
  title:   { x: 15,  y: 235, w: 994, h: 175 },
  veg:     { x: 40,  y: 492, w: 262, h: 666 },
  sides:   { x: 338, y: 492, w: 313, h: 440 },
  desserts:{ x: 338, y: 998, w: 313, h: 140 },
  nonveg:  { x: 662, y: 492, w: 322, h: 666 },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function calcFont(count: number, boxH: number, minSize = 18, maxSize = 34): number {
  if (count === 0) return maxSize;
  const lineH = boxH / count;
  return Math.max(minSize, Math.min(maxSize, lineH / 1.55));
}

function drawItems(
  ctx: CanvasRenderingContext2D,
  items: { name: string }[],
  box: { x: number; y: number; w: number; h: number },
  dotColor: string,
  minFont = 18,
  maxFont = 34,
  font = 'Book Antiqua',
) {
  if (items.length === 0) return;

  const fontSize = calcFont(items.length, box.h, minFont, maxFont);
  const lineH    = box.h / items.length;
  const dotR     = Math.max(5, fontSize * 0.22);
  const dotGap   = dotR * 2 + 8;

  ctx.font = `${fontSize}px "${font}", "Palatino Linotype", Georgia, serif`;
  ctx.fillStyle = '#1A0800';
  ctx.textBaseline = 'middle';

  items.forEach((item, i) => {
    const y = box.y + i * lineH + lineH / 2;

    // Draw bullet dot
    ctx.beginPath();
    ctx.arc(box.x + dotR + 2, y, dotR, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.fill();

    // Draw item name — clip to box width
    ctx.fillStyle = '#1A0800';
    const maxTextW = box.w - dotGap - 4;
    let text = item.name;

    // Truncate if too wide
    while (ctx.measureText(text).width > maxTextW && text.length > 3) {
      text = text.slice(0, -1);
    }
    if (text !== item.name) text = text.slice(0, -1) + '…';

    ctx.fillText(text, box.x + dotGap, y);
  });
}

export async function generatePosterCanvas(config: PosterConfig, fontFamily = 'Book Antiqua'): Promise<HTMLCanvasElement> {
  const { day, mealType, vegItems, nonVegItems, desserts, accompaniments } = config;

  // Load template image
  const templateImg = await loadImage('/poster-template.png');

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width  = TEMPLATE_WIDTH;
  canvas.height = TEMPLATE_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // Draw template background
  ctx.drawImage(templateImg, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);

  // Draw title
  const titleText = `${day} ${mealType} Buffet`;
  const titleBox  = BOXES.title;
  const titleSize = titleText.length > 20 ? 64 : 76;
  ctx.font        = `900 ${titleSize}px "${fontFamily}", Georgia, serif`;
  ctx.fillStyle   = '#3B0A0A';
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleText, titleBox.x + titleBox.w / 2, titleBox.y + titleBox.h / 2);
  ctx.textAlign = 'left';

  // Draw veg items
  drawItems(ctx, vegItems, BOXES.veg, '#2E7D32', 18, 34, fontFamily);

  // Draw sides (proportional height)
  const sidesBox = { ...BOXES.sides };
  if (desserts.length > 0) {
    sidesBox.h = BOXES.sides.h - 60; // leave room for desserts
  }
  drawItems(ctx, accompaniments, sidesBox, '#8B6914', 16, 28, fontFamily);

  // Draw desserts header + items
  if (desserts.length > 0) {
    const dessBox = BOXES.desserts;

    // Desserts label
    ctx.font      = `700 26px "${fontFamily}", Georgia, serif`;
    ctx.fillStyle = '#3B0A0A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Gold lines either side of "Desserts"
    const midX = dessBox.x + dessBox.w / 2;
    const midY = dessBox.y - 30;
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth   = 2;
    ctx.beginPath(); ctx.moveTo(dessBox.x + 20, midY); ctx.lineTo(midX - 70, midY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(midX + 70, midY); ctx.lineTo(dessBox.x + dessBox.w - 20, midY); ctx.stroke();
    ctx.fillText('✦ Desserts ✦', midX, midY);

    ctx.textAlign = 'left';
    drawItems(ctx, desserts, dessBox, '#DAA520', 16, 26, fontFamily);
  }

  // Draw non-veg items
  drawItems(ctx, nonVegItems, BOXES.nonveg, '#B71C1C', 18, 34, fontFamily);

  return canvas;
}

export async function downloadPNG(elementId: string, filename: string, config?: PosterConfig, fontFamily?: string): Promise<void> {
  if (!config) throw new Error('Config required');

  const canvas = await generatePosterCanvas(config, fontFamily);
  const link   = document.createElement('a');
  link.download = `${filename}.png`;
  link.href     = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export async function downloadPDF(elementId: string, filename: string, config?: PosterConfig, fontFamily?: string): Promise<void> {
  if (!config) throw new Error('Config required');

  const canvas  = await generatePosterCanvas(config, fontFamily);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfW    = 108;
  const pdfH    = (canvas.height * pdfW) / canvas.width;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, pdfH] });
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
  pdf.save(`${filename}.pdf`);
}

export function getPosterFilename(day: string, mealType: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `Amulya_${mealType}_Buffet_${day}_${date}`;
}
