import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { useInvoices } from '../hooks/useInvoices';
import { useClients } from '../hooks/useClients';
import { Badge } from '../components/shared/Badge';
import { TopBar } from '../components/layout/TopBar';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateShort } from '../utils/formatDate';

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="bg-brand-card border border-brand-border rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: color + '20', color }}
        >
          <Icon size={18} />
        </div>
      </div>
      <p className="text-brand-muted text-sm mb-1">{label}</p>
      <p className="font-mono font-bold text-brand-white text-2xl">{formatCurrency(value)}</p>
    </motion.div>
  );
}

export function DashboardPage() {
  const { invoices, loading } = useInvoices();
  useClients();

  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const paid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const outstanding = invoices
    .filter((i) => i.status === 'sent')
    .reduce((s, i) => s + i.total, 0);
  const overdue = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((s, i) => s + i.total, 0);

  const recent = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    { label: 'Total Invoiced', value: totalInvoiced, icon: TrendingUp, color: '#AADB1E', delay: 0 },
    { label: 'Paid', value: paid, icon: DollarSign, color: '#22C55E', delay: 0.08 },
    { label: 'Outstanding', value: outstanding, icon: Clock, color: '#60A5FA', delay: 0.16 },
    { label: 'Overdue', value: overdue, icon: AlertCircle, color: '#EF4444', delay: 0.24 },
  ];

  return (
    <div className="flex-1">
      <TopBar
        title="Dashboard"
        subtitle="Welcome back, Lee"
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
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Recent invoices */}
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
            <h2 className="font-display font-bold text-brand-white">Recent Invoices</h2>
            <Link
              to="/invoices"
              className="flex items-center gap-1 text-sm text-brand-muted hover:text-lime transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-brand-muted text-sm">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-brand-muted text-sm mb-3">No invoices yet</p>
              <Link
                to="/invoices/new"
                className="text-sm text-lime hover:text-lime-dark transition-colors"
              >
                Create your first invoice →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-brand-border">
              {recent.map((invoice, i) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-brand-card2 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-brand-white text-sm">
                          {invoice.clientSnapshot.companyName}
                        </p>
                        <p className="text-brand-muted text-xs font-mono">{invoice.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-brand-muted text-xs hidden sm:block">
                        {formatDateShort(invoice.dueDate)}
                      </span>
                      <Badge status={invoice.status} />
                      <span className="font-mono text-sm font-bold text-brand-white">
                        {formatCurrency(invoice.total)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
