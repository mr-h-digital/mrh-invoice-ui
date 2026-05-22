interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-brand-border bg-brand-dark/50 backdrop-blur-sm sticky top-0 z-10 print:hidden">
      <div>
        <h1 className="font-display font-bold text-brand-white text-xl">{title}</h1>
        {subtitle && <p className="text-brand-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
