import { Outlet, useRouter, useRouterState } from '@tanstack/react-router';
import { clearSession, getSession } from '../lib/auth';
import Logo from '../components/Logo';
import { LayoutDashboard, Users, MessageSquare, Settings, CreditCard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/admin/accounts', label: 'All Bank Accounts', icon: LayoutDashboard },
  { path: '/admin/employees', label: 'Employees', icon: Users },
  { path: '/admin/chats', label: 'Chats', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/admin/my-accounts', label: 'My Accounts', icon: CreditCard },
];

export default function AdminDashboard() {
  const router = useRouter();
  const routerState = useRouterState();
  const session = getSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.navigate({ to: '/' });
  };

  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen bg-richpay-darkest flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-richpay-sidebar border-r border-richpay-border flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-richpay-border">
          <Logo size="sm" />
          <div>
            <span className="text-white font-black text-lg leading-none">Rich <span className="text-richpay-accent">Pay</span></span>
            <p className="text-richpay-muted text-xs">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPath === item.path || currentPath.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                onClick={() => { router.navigate({ to: item.path as '/' }); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                  active
                    ? 'bg-gradient-to-r from-richpay-primary to-richpay-accent text-white shadow-lg shadow-richpay-primary/20'
                    : 'text-richpay-muted hover:text-white hover:bg-richpay-card'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="px-3 py-4 border-t border-richpay-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-richpay-card mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-richpay-primary to-richpay-accent flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session?.fullName || 'Administrator'}</p>
              <p className="text-richpay-muted text-xs truncate">{session?.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-richpay-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-richpay-sidebar border-b border-richpay-border sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-white font-black">Rich <span className="text-richpay-accent">Pay</span></span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-richpay-muted hover:text-white transition-colors">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
