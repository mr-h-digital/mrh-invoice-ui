import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import logoGreen from '../../assets/mrhdigital-logo-green.png';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/clients', label: 'Clients', icon: Users },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    toast.success('Signed out');
  }

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-brand-charcoal border-r border-brand-border print:hidden">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <img src={logoGreen} alt="Mr. H Digital" className="w-9 h-9 object-contain shrink-0" />
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
      <div className="px-3 py-4 border-t border-brand-border space-y-1">
        <button
          disabled
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-muted w-full cursor-not-allowed opacity-50"
        >
          <Settings size={18} />
          Settings
        </button>

        {/* User info + logout */}
        <div className="mt-2 mx-0">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-brand-card group transition-colors">
            <div className="min-w-0">
              <p className="text-brand-text text-xs font-medium truncate">
                {user?.email ?? 'Lee Hildebrandt'}
              </p>
              <p className="text-brand-muted text-xs opacity-70 capitalize">{user?.role ?? 'admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-md text-brand-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
