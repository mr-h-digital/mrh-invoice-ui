import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Pencil, Copy, CheckCircle, Trash2, Printer, ArrowLeft, Sun, Moon } from 'lucide-react';
import { InvoicePreview } from '../components/invoice/InvoicePreview';
import { Badge } from '../components/shared/Badge';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { TopBar } from '../components/layout/TopBar';
import { useInvoices, useInvoice } from '../hooks/useInvoices';
import { usePrint } from '../hooks/usePrint';
import type { InvoiceStatus } from '../types/invoice';
import invoicesBg from '../assets/invoices-bg.jpg';

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateInvoice, deleteInvoice, duplicateInvoice } = useInvoices();
  const invoice = useInvoice(id);
  const { print } = usePrint();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [darkPrint, setDarkPrint] = useState(false);

  if (!invoice) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <p className="text-brand-muted">Invoice not found</p>
        <Link to="/invoices" className="text-lime text-sm hover:underline">
          Back to invoices
        </Link>
      </div>
    );
  }

  async function handleStatusChange(status: InvoiceStatus) {
    if (!id) return;
    try {
      await updateInvoice(id, { status });
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  }

  async function handleDuplicate() {
    if (!id) return;
    try {
      const dup = await duplicateInvoice(id);
      toast.success(`Duplicated as ${dup.invoiceNumber}`);
      navigate(`/invoices/${dup.id}/edit`);
    } catch {
      toast.error('Failed to duplicate');
    }
  }

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteInvoice(id);
      toast.success('Invoice deleted');
      navigate('/invoices');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div
      className="flex-1 relative"
      style={{ backgroundImage: `url(${invoicesBg})`, backgroundSize: 'cover', backgroundPosition: 'center 35%' }}
    >
      <div className="absolute inset-0 bg-brand-dark/88 pointer-events-none" />
      <div className="relative z-10 flex flex-col flex-1">
      <TopBar
        title={invoice.invoiceNumber}
        subtitle={invoice.clientSnapshot.companyName}
        actions={
          <div className="flex items-center gap-2 print:hidden">
            <Badge status={invoice.status} />

            {invoice.status !== 'paid' && (
              <button
                onClick={() => handleStatusChange('paid')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-lime/10 text-lime border border-lime/25 rounded-lg hover:bg-lime/20 transition-colors"
              >
                <CheckCircle size={13} />
                Mark Paid
              </button>
            )}

            <select
              value={invoice.status}
              onChange={(e) => handleStatusChange(e.target.value as InvoiceStatus)}
              className="bg-brand-card border border-brand-border text-brand-text text-xs rounded-lg px-2 py-1.5"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>

            <button
              onClick={() => setDarkPrint((v) => !v)}
              title={darkPrint ? 'Light print mode' : 'Dark print mode'}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-card border border-brand-border transition-colors"
            >
              {darkPrint ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <button
              onClick={print}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-brand-card border border-brand-border text-brand-text rounded-lg hover:bg-brand-card2 transition-colors"
            >
              <Printer size={13} />
              Print / PDF
            </button>

            <button
              onClick={handleDuplicate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-brand-card border border-brand-border text-brand-text rounded-lg hover:bg-brand-card2 transition-colors"
            >
              <Copy size={13} />
              Duplicate
            </button>

            <Link
              to={`/invoices/${id}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-brand-card2 border border-brand-border text-brand-text rounded-lg hover:bg-brand-border transition-colors"
            >
              <Pencil size={13} />
              Edit
            </Link>

            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-brand-muted hover:text-red-400 hover:bg-brand-card border border-brand-border transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        }
      />

      <div className="p-8 max-w-4xl mx-auto">
        <Link
          to="/invoices"
          className="flex items-center gap-1.5 text-sm text-brand-muted hover:text-lime transition-colors mb-6 print:hidden"
        >
          <ArrowLeft size={14} />
          Back to invoices
        </Link>

        <div id="invoice-print-area">
          <InvoicePreview invoice={invoice} darkPrint={darkPrint} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description={`Delete ${invoice.invoiceNumber}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
      </div>
    </div>
  );
}
