import navBg from '../../assets/nav-bg.jpg';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div
      className="relative flex items-center justify-between px-8 py-5 border-b border-brand-border/60 sticky top-0 z-10 print:hidden overflow-hidden"
      style={{
        backgroundImage: `url(${navBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="font-display font-bold text-brand-white text-xl">{title}</h1>
        {subtitle && <p className="text-brand-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
      {actions && (
        <div className="relative z-10 flex items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
