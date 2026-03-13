/**
 * Server-side PDF thumbnail generation using MuPDF (WASM).
 */

const THUMB_WIDTH = 800;
const THUMB_HEIGHT = 1000;

export async function generatePdfThumbnail(pdfBuffer: Buffer): Promise<Buffer | null> {
  try {
    const mupdf = await import('mupdf');

    const doc = mupdf.Document.openDocument(pdfBuffer, 'application/pdf');
    const page = doc.loadPage(0);
    const bounds = page.getBounds();

    const pageWidth = bounds[2] - bounds[0];
    const pageHeight = bounds[3] - bounds[1];
    const scale = Math.min(THUMB_WIDTH / pageWidth, THUMB_HEIGHT / pageHeight);

    const matrix = mupdf.Matrix.scale(scale, scale);
    const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true);

    const pngData = pixmap.asPNG();

    return Buffer.from(pngData);
  } catch (err) {
    console.error('PDF thumbnail generation failed:', err);
    return null;
  }
}
