import jsPDF from 'jspdf';

export async function downloadPNG(elementId: string, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Poster element not found');

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#F5EDD0',
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc) => {
      // ensure images in clone have crossOrigin set
      const imgs = clonedDoc.querySelectorAll('img');
      imgs.forEach((img) => {
        img.crossOrigin = 'anonymous';
      });
    },
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export async function downloadPDF(elementId: string, filename: string): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Poster element not found');

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#F5EDD0',
    logging: false,
    imageTimeout: 15000,
  });

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
