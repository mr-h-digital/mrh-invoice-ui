export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ClientSnapshot {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export interface PaymentDetails {
  bank: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
  reference: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  clientId: string | null;
  clientSnapshot: ClientSnapshot;
  lineItems: LineItem[];
  subtotal: number;
  discountType: 'amount' | 'percent' | null;
  discountValue: number;
  discountAmount: number;
  vatEnabled: boolean;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes: string;
  paymentDetails: PaymentDetails;
  createdAt: string;
  updatedAt: string;
}
