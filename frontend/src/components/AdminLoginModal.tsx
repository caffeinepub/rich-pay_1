import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { authenticateAdmin, setSession } from '../lib/auth';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function AdminLoginModal({ onClose }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (authenticateAdmin(username, password)) {
      setSession({ role: 'admin', userId: 'admin', username, fullName: 'Administrator' });
      router.navigate({ to: '/admin/accounts' });
    } else {
      setError('Invalid username or password.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-richpay-card border border-richpay-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
          <div>
            <h2 className="text-white font-bold text-lg">Admin Login</h2>
            <p className="text-richpay-muted text-xs">Secure administrator access</p>
          </div>
          <button onClick={onClose} className="text-richpay-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 pr-10 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-richpay-muted hover:text-white transition-colors">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Sign In as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
