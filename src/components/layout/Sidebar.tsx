import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/clients', label: 'Clients', icon: Users },
];

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-brand-charcoal border-r border-brand-border print:hidden">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-lime flex items-center justify-center shrink-0">
            <span className="font-display font-black text-brand-dark text-sm">MH</span>
          </div>
          <div>
            <p className="font-display font-bold text-brand-white text-sm leading-tight">
              Mr. H Digital
            </p>
            <p className="text-brand-muted text-xs leading-tight">Invoice Generator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-lime text-brand-dark font-medium'
                  : 'text-brand-text hover:bg-brand-card hover:text-brand-white'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-brand-border">
        <button
          disabled
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-muted w-full cursor-not-allowed opacity-50"
        >
          <Settings size={18} />
          Settings
        </button>
        <div className="mt-4 px-3">
          <p className="text-brand-muted text-xs">Lee Hildebrandt</p>
          <p className="text-brand-muted text-xs opacity-60">info@mrhdigital.co.za</p>
        </div>
      </div>
    </aside>
  );
}
