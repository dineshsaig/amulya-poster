import jsPDF from 'jspdf';

export async function downloadPNG(elementId: string, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');

  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  // Pre-load all images as base64
  const images = element.querySelectorAll('img');
  await Promise.all(Array.from(images).map(async (img) => {
    if (!img.src || img.src.startsWith('data:')) return;
    try {
      const res = await fetch(img.src, { cache: 'force-cache' });
      const blob = await res.blob();
      const b64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      img.src = b64;
      await new Promise<void>((res) => { if (img.complete) res(); else img.onload = () => res(); });
    } catch { /* continue */ }
  }));

  // Capture at natural 1024px size — scale:1 = 1024×1536px output
  const canvas = await html2canvas(element, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#F5EDD0',
    logging: false,
    imageTimeout: 30000,
    width: 1024,
    height: element.scrollHeight,
    windowWidth: 1024,
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export async function downloadPDF(elementId: string, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');

  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  const images = element.querySelectorAll('img');
  await Promise.all(Array.from(images).map(async (img) => {
    if (!img.src || img.src.startsWith('data:')) return;
    try {
      const res = await fetch(img.src, { cache: 'force-cache' });
      const blob = await res.blob();
      const b64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      img.src = b64;
      await new Promise<void>((res) => { if (img.complete) res(); else img.onload = () => res(); });
    } catch { /* continue */ }
  }));

  const canvas = await html2canvas(element, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#F5EDD0',
    logging: false,
    imageTimeout: 30000,
    width: 1024,
    height: element.scrollHeight,
    windowWidth: 1024,
  });

  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfW = 108;
  const pdfH = (canvas.height * pdfW) / canvas.width;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfW, pdfH] });
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
  pdf.save(`${filename}.pdf`);
}

export function getPosterFilename(day: string, mealType: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `Amulya_${mealType}_Buffet_${day}_${date}`;
}
