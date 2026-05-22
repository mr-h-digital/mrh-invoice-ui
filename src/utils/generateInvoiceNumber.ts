import type { Invoice } from '../types/invoice';

export function generateInvoiceNumber(existingInvoices: Invoice[]): string {
  const year = new Date().getFullYear();
  const yearInvoices = existingInvoices.filter((inv) =>
    inv.invoiceNumber.startsWith(`INV-${year}-`)
  );
  const maxNum = yearInvoices.reduce((max, inv) => {
    const parts = inv.invoiceNumber.split('-');
    const num = parseInt(parts[2] ?? '0', 10);
    return Math.max(max, num);
  }, 0);
  const next = maxNum + 1;
  return `INV-${year}-${String(next).padStart(3, '0')}`;
}
