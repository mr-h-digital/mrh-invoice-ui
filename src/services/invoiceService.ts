import { v4 as uuid } from 'uuid';
import type { Invoice } from '../types/invoice';
import api from './api';

// ─── Toggle ───────────────────────────────────────────────────────────────
// Set VITE_USE_API=true in .env.local to route all calls to the Spring Boot BFF.
// Leave unset (or false) to use localStorage — works without Docker.
const USE_API = import.meta.env.VITE_USE_API === 'true';

// ─── localStorage implementation (current phase) ─────────────────────────
const STORAGE_KEY = 'mrh_invoices';

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'invoice-001',
    invoiceNumber: 'INV-2026-001',
    status: 'SENT',
    issueDate: '2026-05-01',
    dueDate: '2026-06-01',
    clientId: 'client-001',
    clientSnapshot: {
      companyName: 'Timeline Vehicle Export Company (Pty) Ltd',
      contactName: 'Thabo Seabi',
      email: 'thabo@tveco.co.za',
      phone: '+27 72 266 3988',
      address: '7 Blinkblaar St, Zwartkop, Centurion, 0157',
    },
    lineItems: [
      { id: uuid(), name: 'Custom Website Design & Development', description: 'Fully responsive website with CMS integration', quantity: 1, unitPrice: 4500, amount: 4500, sortOrder: 0 },
      { id: uuid(), name: 'Brand Logo Design', description: 'Primary logo + variations in all formats', quantity: 1, unitPrice: 1200, amount: 1200, sortOrder: 1 },
      { id: uuid(), name: 'SEO Setup & Structured Data', description: 'On-page SEO, meta tags, schema markup', quantity: 1, unitPrice: 800, amount: 800, sortOrder: 2 },
      { id: uuid(), name: 'WhatsApp Enquiry Form Integration', description: 'Click-to-WhatsApp form with auto-message', quantity: 1, unitPrice: 500, amount: 500, sortOrder: 3 },
      { id: uuid(), name: 'Hosting Migration & DNS Setup', description: 'Domain transfer, DNS config, SSL certificate', quantity: 1, unitPrice: 400, amount: 400, sortOrder: 4 },
    ],
    subtotal: 7400,
    discountType: 'AMOUNT',
    discountValue: 1200,
    discountAmount: 1200,
    vatEnabled: false,
    vatRate: 0.15,
    vatAmount: 0,
    total: 6200,
    notes: 'Payment due within 30 days. EFT payments preferred. Please use your invoice number as payment reference.',
    paymentDetails: { bank: 'Capitec Bank', accountName: 'Mr H Digital', accountNumber: '2496091865', accountType: 'Entrepreneur', branchCode: '470010', reference: 'INV-2026-001' },
    createdAt: '2026-05-01T09:00:00.000Z',
    updatedAt: '2026-05-01T09:00:00.000Z',
  },
];

function lsLoad(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INVOICES)); return DEFAULT_INVOICES; }
    return JSON.parse(raw) as Invoice[];
  } catch { return DEFAULT_INVOICES; }
}

function lsSave(invoices: Invoice[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

// ─── API helpers ──────────────────────────────────────────────────────────
// Maps frontend Invoice shape to the InvoiceRequest the backend expects.
function toRequest(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    invoiceNumber: data.invoiceNumber,
    status: data.status,
    clientId: data.clientId ?? undefined,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    lineItems: data.lineItems.map((li, i) => ({
      name: li.name,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      sortOrder: li.sortOrder ?? i,
    })),
    discountType: data.discountType ?? undefined,
    discountValue: data.discountValue,
    vatEnabled: data.vatEnabled,
    vatRate: data.vatRate,
    notes: data.notes,
    paymentDetails: data.paymentDetails,
    clientSnapshot: data.clientSnapshot,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────
export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    if (!USE_API) return lsLoad();
    // Backend returns PageResponse — unwrap .content
    const res = await api.get<{ content: Invoice[] }>('/invoices?size=200&sort=createdAt,desc');
    return res.data.content;
  },

  async getInvoice(id: string): Promise<Invoice> {
    if (!USE_API) {
      const invoice = lsLoad().find((i) => i.id === id);
      if (!invoice) throw new Error(`Invoice ${id} not found`);
      return invoice;
    }
    const res = await api.get<Invoice>(`/invoices/${id}`);
    return res.data;
  },

  async getNextInvoiceNumber(): Promise<string> {
    if (!USE_API) {
      const invoices = lsLoad();
      const year = new Date().getFullYear();
      const max = invoices
        .filter((inv) => inv.invoiceNumber.startsWith(`INV-${year}-`))
        .reduce((m, inv) => Math.max(m, parseInt(inv.invoiceNumber.split('-')[2] ?? '0', 10)), 0);
      return `INV-${year}-${String(max + 1).padStart(3, '0')}`;
    }
    const res = await api.get<{ invoiceNumber: string }>('/invoices/next-number');
    return res.data.invoiceNumber;
  },

  async createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    if (!USE_API) {
      const now = new Date().toISOString();
      const invoice: Invoice = { ...data, id: uuid(), createdAt: now, updatedAt: now };
      lsSave([...lsLoad(), invoice]);
      return invoice;
    }
    const res = await api.post<Invoice>('/invoices', toRequest(data));
    return res.data;
  },

  async updateInvoice(id: string, data: Partial<Omit<Invoice, 'id' | 'createdAt'>>): Promise<Invoice> {
    if (!USE_API) {
      const invoices = lsLoad();
      const idx = invoices.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error(`Invoice ${id} not found`);
      const updated: Invoice = { ...invoices[idx], ...data, updatedAt: new Date().toISOString() };
      invoices[idx] = updated;
      lsSave(invoices);
      return updated;
    }
    // If only status changed use the dedicated PATCH endpoint
    if (data.status && Object.keys(data).length === 1) {
      const res = await api.patch<Invoice>(`/invoices/${id}/status`, { status: data.status });
      return res.data;
    }
    const current = await invoiceService.getInvoice(id);
    const merged = { ...current, ...data };
    const res = await api.put<Invoice>(`/invoices/${id}`, toRequest(merged));
    return res.data;
  },

  async deleteInvoice(id: string): Promise<void> {
    if (!USE_API) { lsSave(lsLoad().filter((i) => i.id !== id)); return; }
    await api.delete(`/invoices/${id}`);
  },

  async duplicateInvoice(id: string): Promise<Invoice> {
    if (!USE_API) {
      const invoices = lsLoad();
      const original = invoices.find((i) => i.id === id);
      if (!original) throw new Error(`Invoice ${id} not found`);
      const year = new Date().getFullYear();
      const max = invoices
        .filter((inv) => inv.invoiceNumber.startsWith(`INV-${year}-`))
        .reduce((m, inv) => Math.max(m, parseInt(inv.invoiceNumber.split('-')[2] ?? '0', 10)), 0);
      const newNumber = `INV-${year}-${String(max + 1).padStart(3, '0')}`;
      const now = new Date().toISOString();
      const duplicate: Invoice = { ...original, id: uuid(), invoiceNumber: newNumber, status: 'DRAFT', issueDate: now.split('T')[0], paymentDetails: { ...original.paymentDetails, reference: newNumber }, createdAt: now, updatedAt: now };
      lsSave([...invoices, duplicate]);
      return duplicate;
    }
    const res = await api.post<Invoice>(`/invoices/${id}/duplicate`);
    return res.data;
  },
};
