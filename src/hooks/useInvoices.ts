import { useEffect } from 'react';
import { useInvoiceStore } from '../store/invoiceStore';
import type { Invoice } from '../types/invoice';

export function useInvoices() {
  const { invoices, loading, error, fetchInvoices, addInvoice, updateInvoice, deleteInvoice, duplicateInvoice } =
    useInvoiceStore();

  useEffect(() => {
    if (invoices.length === 0 && !loading) {
      fetchInvoices();
    }
  }, []);

  return { invoices, loading, error, addInvoice, updateInvoice, deleteInvoice, duplicateInvoice, refetch: fetchInvoices };
}

export function useInvoice(id: string | undefined): Invoice | undefined {
  const invoices = useInvoiceStore((s) => s.invoices);
  return invoices.find((i) => i.id === id);
}
