import jsPDF from 'jspdf';

async function getCanvas(elementId: string) {
  const { default: html2canvas } = await import('html2canvas');
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Poster element not found');

  // Convert all images to base64 first to avoid CORS issues
  const images = element.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(async (img) => {
      if (!img.src || img.src.startsWith('data:')) return;
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        img.src = base64;
        await new Promise((res) => {
          if (img.complete) res(null);
          else img.onload = res;
        });
      } catch {
        // If fetch fails, continue without conversion
      }
    })
  );

  return html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#F5EDD0',
    logging: false,
    imageTimeout: 30000,
  });
}

export async function downloadPNG(elementId: string, filename: string): Promise<void> {
  const canvas = await getCanvas(elementId);
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export async function downloadPDF(elementId: string, filename: string): Promise<void> {
  const canvas = await getCanvas(elementId);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdfWidth = 108;
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
