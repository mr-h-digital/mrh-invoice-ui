import { clsx } from 'clsx';
import type { InvoiceStatus } from '../../types/invoice';

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  DRAFT:   { label: 'Draft',   className: 'bg-brand-border text-brand-text' },
  SENT:    { label: 'Sent',    className: 'bg-blue-500/20 text-blue-400' },
  PAID:    { label: 'Paid',    className: 'bg-lime-dim text-lime' },
  OVERDUE: { label: 'Overdue', className: 'bg-red-500/20 text-red-400' },
};

interface BadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status] ?? statusConfig.DRAFT;
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
