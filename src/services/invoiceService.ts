import { v4 as uuid } from 'uuid';
import type { Invoice } from '../types/invoice';

const STORAGE_KEY = 'mrh_invoices';

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'invoice-001',
    invoiceNumber: 'INV-2026-001',
    status: 'sent',
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
      {
        id: uuid(),
        name: 'Custom Website Design & Development',
        description: 'Fully responsive website with CMS integration',
        quantity: 1,
        unitPrice: 4500,
        amount: 4500,
      },
      {
        id: uuid(),
        name: 'Brand Logo Design',
        description: 'Primary logo + variations in all formats',
        quantity: 1,
        unitPrice: 1200,
        amount: 1200,
      },
      {
        id: uuid(),
        name: 'SEO Setup & Structured Data',
        description: 'On-page SEO, meta tags, schema markup',
        quantity: 1,
        unitPrice: 800,
        amount: 800,
      },
      {
        id: uuid(),
        name: 'WhatsApp Enquiry Form Integration',
        description: 'Click-to-WhatsApp form with auto-message',
        quantity: 1,
        unitPrice: 500,
        amount: 500,
      },
      {
        id: uuid(),
        name: 'Hosting Migration & DNS Setup',
        description: 'Domain transfer, DNS config, SSL certificate',
        quantity: 1,
        unitPrice: 400,
        amount: 400,
      },
    ],
    subtotal: 7400,
    discountType: 'amount',
    discountValue: 1200,
    discountAmount: 1200,
    vatEnabled: false,
    vatRate: 0.15,
    vatAmount: 0,
    total: 6200,
    notes:
      'Payment due within 30 days. EFT payments preferred. Please use your invoice number as payment reference.',
    paymentDetails: {
      bank: 'Capitec Bank',
      accountName: 'Mr H Digital',
      accountNumber: '2496091865',
      accountType: 'Entrepreneur',
      branchCode: '470010',
      reference: 'INV-2026-001',
    },
    createdAt: '2026-05-01T09:00:00.000Z',
    updatedAt: '2026-05-01T09:00:00.000Z',
  },
];

function load(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INVOICES));
      return DEFAULT_INVOICES;
    }
    return JSON.parse(raw) as Invoice[];
  } catch {
    return DEFAULT_INVOICES;
  }
}

function save(invoices: Invoice[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    return load();
  },

  async getInvoice(id: string): Promise<Invoice> {
    const invoices = load();
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice) throw new Error(`Invoice ${id} not found`);
    return invoice;
  },

  async createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const invoices = load();
    const now = new Date().toISOString();
    const invoice: Invoice = { ...data, id: uuid(), createdAt: now, updatedAt: now };
    save([...invoices, invoice]);
    return invoice;
  },

  async updateInvoice(id: string, data: Partial<Omit<Invoice, 'id' | 'createdAt'>>): Promise<Invoice> {
    const invoices = load();
    const idx = invoices.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error(`Invoice ${id} not found`);
    const updated: Invoice = { ...invoices[idx], ...data, updatedAt: new Date().toISOString() };
    invoices[idx] = updated;
    save(invoices);
    return updated;
  },

  async deleteInvoice(id: string): Promise<void> {
    const invoices = load();
    save(invoices.filter((i) => i.id !== id));
  },

  async duplicateInvoice(id: string): Promise<Invoice> {
    const invoices = load();
    const original = invoices.find((i) => i.id === id);
    if (!original) throw new Error(`Invoice ${id} not found`);
    const year = new Date().getFullYear();
    const yearInvoices = invoices.filter((inv) =>
      inv.invoiceNumber.startsWith(`INV-${year}-`)
    );
    const maxNum = yearInvoices.reduce((max, inv) => {
      const parts = inv.invoiceNumber.split('-');
      const num = parseInt(parts[2] ?? '0', 10);
      return Math.max(max, num);
    }, 0);
    const newNumber = `INV-${year}-${String(maxNum + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const duplicate: Invoice = {
      ...original,
      id: uuid(),
      invoiceNumber: newNumber,
      status: 'draft',
      issueDate: now.split('T')[0],
      paymentDetails: { ...original.paymentDetails, reference: newNumber },
      createdAt: now,
      updatedAt: now,
    };
    save([...invoices, duplicate]);
    return duplicate;
  },
};
