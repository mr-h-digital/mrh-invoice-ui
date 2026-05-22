import { clsx } from 'clsx';
import type { InvoiceStatus } from '../../types/invoice';

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-brand-border text-brand-text' },
  sent: { label: 'Sent', className: 'bg-blue-500/20 text-blue-400' },
  paid: { label: 'Paid', className: 'bg-lime-dim text-lime' },
  overdue: { label: 'Overdue', className: 'bg-red-500/20 text-red-400' },
};

interface BadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];
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
