import { useState } from 'react';
import { getAdminCredentials, saveAdminCredentials, authenticateAdmin, setSession, getSession } from '../../lib/auth';
import { Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const creds = getAdminCredentials();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!authenticateAdmin(creds.username, currentPassword)) {
      setError('Current password is incorrect.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const updatedCreds = {
      username: newUsername.trim() || creds.username,
      password: newPassword || creds.password,
    };
    saveAdminCredentials(updatedCreds);

    // Update session
    const session = getSession();
    if (session) {
      setSession({ ...session, username: updatedCreds.username });
    }

    setCurrentPassword('');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-richpay-muted text-sm mt-0.5">Update your admin credentials</p>
      </div>

      {/* Current credentials display */}
      <div className="bg-richpay-card border border-richpay-border rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3">Current Credentials</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between py-2 border-b border-richpay-border/50">
            <span className="text-richpay-muted text-sm">Username</span>
            <span className="text-white text-sm font-mono">{creds.username}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-richpay-muted text-sm">Password</span>
            <span className="text-richpay-muted text-sm">••••••••</span>
          </div>
        </div>
      </div>

      {/* Change credentials form */}
      <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
          <h2 className="text-white font-bold text-lg">Change Credentials</h2>
          <p className="text-richpay-muted text-xs">Leave new username/password blank to keep current values</p>
        </div>
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Current Password *</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 pr-10 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-richpay-muted hover:text-white transition-colors">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">New Username (optional)</label>
            <input
              type="text"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder={`Current: ${creds.username}`}
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">New Password (optional)</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 pr-10 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-richpay-muted hover:text-white transition-colors">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            />
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">{error}</div>}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2.5 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              Credentials updated successfully!
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
