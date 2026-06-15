import jsPDF from 'jspdf';

async function getCanvas(elementId: string) {
  const { default: html2canvas } = await import('html2canvas');

  // ── Use the HIDDEN full-size poster element for export, not the scaled preview
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Poster element not found');

  // Reset any CSS transform so html2canvas sees natural size
  const originalTransform = element.style.transform;
  const originalTransformOrigin = element.style.transformOrigin;
  element.style.transform = 'none';
  element.style.transformOrigin = 'unset';

  // Pre-load all images as base64 to avoid CORS issues
  const images = element.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(async (img) => {
      if (!img.src || img.src.startsWith('data:')) return;
      try {
        const response = await fetch(img.src, { cache: 'force-cache' });
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        img.src = base64;
        await new Promise<void>((res) => {
          if (img.complete) res();
          else img.onload = () => res();
        });
      } catch {
        // continue if fetch fails
      }
    })
  );

  const canvas = await html2canvas(element, {
    scale: 3,             // 3× = 1260px wide — crisp print quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#F5EDD0',
    logging: false,
    imageTimeout: 30000,
    width: element.scrollWidth,
    height: element.scrollHeight,
  });

  // Restore transform
  element.style.transform = originalTransform;
  element.style.transformOrigin = originalTransformOrigin;

  return canvas;
}

export async function downloadPNG(elementId: string, filename: string): Promise<void> {
  // ── Target the export element (full-size hidden), not the preview
  const exportId = elementId + '-export';
  const exportEl = document.getElementById(exportId);
  const targetId = exportEl ? exportId : elementId;

  const canvas = await getCanvas(targetId);
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export async function downloadPDF(elementId: string, filename: string): Promise<void> {
  const exportId = elementId + '-export';
  const exportEl = document.getElementById(exportId);
  const targetId = exportEl ? exportId : elementId;

  const canvas = await getCanvas(targetId);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfWidth  = 108; // mm (A5-ish, 9:16 ratio)
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${filename}.pdf`);
}

export function getPosterFilename(day: string, mealType: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `Amulya_${mealType}_Buffet_${day}_${date}`;
}
