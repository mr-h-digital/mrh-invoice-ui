import navBg from '../../assets/nav-bg.jpg';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div
      className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-brand-border/60 sticky top-0 z-30 print:hidden"
      style={{ backgroundImage: `url(${navBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 min-w-0">
        <h1 className="font-display font-bold text-brand-white text-lg sm:text-xl truncate">{title}</h1>
        {subtitle && <p className="text-brand-muted text-xs sm:text-sm mt-0.5 truncate">{subtitle}</p>}
      </div>

      {actions && (
        <div className="relative z-10 flex items-center gap-2 sm:gap-3 ml-3 shrink-0">{actions}</div>
      )}
    </div>
  );
}
