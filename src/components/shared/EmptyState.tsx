import { clsx } from 'clsx';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-card2 border border-brand-border flex items-center justify-center mb-4 text-brand-muted">
          {icon}
        </div>
      )}
      <h3 className="font-display font-bold text-brand-white text-lg mb-2">{title}</h3>
      {description && <p className="text-brand-muted text-sm max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  );
}
