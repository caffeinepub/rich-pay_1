import { useState } from 'react';
import Logo from '../components/Logo';
import AdminLoginModal from '../components/AdminLoginModal';
import EmployeeLoginModal from '../components/EmployeeLoginModal';

export default function LandingPage() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showEmployee, setShowEmployee] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-richpay-darkest via-richpay-dark to-richpay-darker flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-richpay-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-richpay-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-richpay-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 w-full max-w-md">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-richpay-primary/20 blur-xl scale-150" />
            <Logo size="lg" className="relative drop-shadow-2xl" />
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg">
              Rich <span className="text-richpay-accent">Pay</span>
            </h1>
            <p className="text-richpay-muted text-sm mt-1 tracking-widest uppercase font-medium">
              Business Banking Management
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-richpay-border to-transparent" />
          <span className="text-richpay-muted text-xs uppercase tracking-widest">Sign In</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-richpay-border to-transparent" />
        </div>

        {/* Login Buttons */}
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={() => setShowAdmin(true)}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold text-lg tracking-wide shadow-lg shadow-richpay-primary/30 hover:shadow-richpay-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-richpay-accent/30"
          >
            🔐 Admin Login
          </button>
          <button
            onClick={() => setShowEmployee(true)}
            className="w-full py-4 px-6 rounded-xl bg-richpay-card text-white font-bold text-lg tracking-wide shadow-lg border border-richpay-border hover:border-richpay-accent/50 hover:bg-richpay-card-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            👤 Employee Login
          </button>
        </div>

        {/* Footer note */}
        <p className="text-richpay-muted text-xs text-center">
          New employee? Contact your admin for a registration link.
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-richpay-muted text-xs">
        © {new Date().getFullYear()} Rich Pay &nbsp;·&nbsp;{' '}
        Built with <span className="text-richpay-accent">♥</span> using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'richpay')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-richpay-accent hover:underline"
        >
          caffeine.ai
        </a>
      </footer>

      {showAdmin && <AdminLoginModal onClose={() => setShowAdmin(false)} />}
      {showEmployee && <EmployeeLoginModal onClose={() => setShowEmployee(false)} />}
    </div>
  );
}
