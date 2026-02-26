import { useState } from 'react';
import { useRouter, useSearch } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import { addEmployee, generateId } from '../lib/auth';
import Logo from '../components/Logo';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const REGISTRATION_PASSWORD = 'Moneytime123';

export default function EmployeeRegistrationPage() {
  const router = useRouter();
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search?.token || '';
  const { actor } = useActor();

  const [regPassword, setRegPassword] = useState('');
  const [regPasswordError, setRegPasswordError] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-richpay-darkest flex items-center justify-center p-4">
        <div className="bg-richpay-card border border-richpay-border rounded-2xl p-8 max-w-sm w-full text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h2 className="text-white font-bold text-xl mb-2">Invalid Registration Link</h2>
          <p className="text-richpay-muted text-sm mb-6">This registration link is invalid or missing a token. Please contact your admin for a valid invite link.</p>
          <button onClick={() => router.navigate({ to: '/' })} className="w-full py-2.5 rounded-lg bg-richpay-primary text-white font-semibold hover:bg-richpay-accent transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword === REGISTRATION_PASSWORD) {
      setUnlocked(true);
      setRegPasswordError('');
    } else {
      setRegPasswordError('Incorrect registration password. Please contact your admin.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const id = generateId();
      // Save to localStorage
      addEmployee({ id, fullName: fullName.trim(), username: username.trim(), password, createdAt: new Date().toISOString() });
      // Also register in backend
      if (actor) {
        try {
          await actor.createEmployee(id, fullName.trim(), username.trim());
        } catch {
          // Backend registration may fail if anonymous; local storage is the source of truth
        }
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-richpay-darkest flex items-center justify-center p-4">
        <div className="bg-richpay-card border border-richpay-border rounded-2xl p-8 max-w-sm w-full text-center">
          <CheckCircle2 className="mx-auto mb-4 text-emerald-400" size={48} />
          <h2 className="text-white font-bold text-xl mb-2">Account Created!</h2>
          <p className="text-richpay-muted text-sm mb-6">Your employee account has been created successfully. You can now log in with your credentials.</p>
          <button onClick={() => router.navigate({ to: '/' })} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-richpay-darkest via-richpay-dark to-richpay-darker flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Logo size="md" />
          <h1 className="text-3xl font-black text-white">Rich <span className="text-richpay-accent">Pay</span></h1>
          <p className="text-richpay-muted text-sm">Employee Registration</p>
        </div>

        <div className="bg-richpay-card border border-richpay-border rounded-2xl overflow-hidden shadow-2xl">
          {!unlocked ? (
            <>
              <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
                <h2 className="text-white font-bold text-lg">Registration Password</h2>
                <p className="text-richpay-muted text-xs">Enter the password provided by your admin</p>
              </div>
              <form onSubmit={handleUnlock} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Registration Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Enter registration password"
                    required
                    className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
                  />
                </div>
                {regPasswordError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">
                    {regPasswordError}
                  </div>
                )}
                <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all">
                  Continue
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
                <h2 className="text-white font-bold text-lg">Create Employee Account</h2>
                <p className="text-richpay-muted text-xs">Fill in your details to register</p>
              </div>
              <form onSubmit={handleRegister} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Choose a username"
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
                      placeholder="Create a password (min 6 chars)"
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
                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : 'Create Account'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-richpay-muted text-xs mt-4">
          Already have an account?{' '}
          <button onClick={() => router.navigate({ to: '/' })} className="text-richpay-accent hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
