import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useInvoices } from '../hooks/useInvoices';
import { InvoiceCard } from '../components/invoice/InvoiceCard';
import { EmptyState } from '../components/shared/EmptyState';
import invoicesBg from '../assets/invoices-bg.jpg';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { TopBar } from '../components/layout/TopBar';
import type { InvoiceStatus } from '../types/invoice';

const TABS: { label: string; value: InvoiceStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
];

export function InvoicesPage() {
  const navigate = useNavigate();
  const { invoices, loading, deleteInvoice, duplicateInvoice } = useInvoices();
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = invoices
    .filter((inv) => filter === 'all' || inv.status === filter)
    .filter(
      (inv) =>
        !search ||
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.clientSnapshot.companyName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  async function handleDuplicate(id: string) {
    try {
      const dup = await duplicateInvoice(id);
      toast.success(`Duplicated as ${dup.invoiceNumber}`);
      navigate(`/invoices/${dup.id}/edit`);
    } catch {
      toast.error('Failed to duplicate invoice');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteInvoice(deleteTarget);
      toast.success('Invoice deleted');
    } catch {
      toast.error('Failed to delete invoice');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
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
        title="Invoices"
        subtitle={`${invoices.length} total`}
        actions={
          <Link
            to="/invoices/new"
            className="flex items-center gap-2 px-4 py-2 bg-lime text-brand-dark text-sm font-medium rounded-lg hover:bg-lime-dark transition-colors"
          >
            <Plus size={16} />
            New Invoice
          </Link>
        }
      />

      <div className="p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex bg-brand-card border border-brand-border rounded-lg p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  filter === tab.value
                    ? 'bg-lime text-brand-dark font-medium'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices…"
              className="input-field pl-9 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-brand-muted">Loading…</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            title={search || filter !== 'all' ? 'No matching invoices' : 'No invoices yet'}
            description={
              search || filter !== 'all'
                ? 'Try a different search or filter.'
                : 'Create your first invoice to get started.'
            }
            action={
              !search && filter === 'all' ? (
                <Link
                  to="/invoices/new"
                  className="px-4 py-2 bg-lime text-brand-dark text-sm font-medium rounded-lg hover:bg-lime-dark transition-colors"
                >
                  Create Invoice
                </Link>
              ) : undefined
            }
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((invoice, i) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <InvoiceCard
                    invoice={invoice}
                    onDuplicate={handleDuplicate}
                    onDelete={setDeleteTarget}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description="This action cannot be undone. The invoice will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
      />
      </div>
    </div>
  );
}
