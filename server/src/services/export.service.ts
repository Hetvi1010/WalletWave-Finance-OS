import PDFDocument from "pdfkit";
import { stringify } from "csv-stringify/sync";

export function buildCsv(rows: Record<string, unknown>[]) {
  return stringify(rows, { header: true });
}

export function buildPdf(rows: Record<string, unknown>[]) {
  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.fontSize(20).text("WalletWave Transactions Report");
  doc.moveDown();

  rows.forEach((row) => {
    doc.fontSize(11).text(`${row.date} | ${row.title} | ${row.category} | ${row.type} | ${row.amount}`);
  });

  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
