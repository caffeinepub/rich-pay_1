import { useState } from 'react';
import { getSession, setSession, getEmployeeById, updateEmployee, authenticateEmployee } from '../../lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, CheckCircle2, Loader2, User } from 'lucide-react';

export default function MyProfilePage() {
  const queryClient = useQueryClient();
  const session = getSession();
  const employee = session ? getEmployeeById(session.userId) : null;

  // Profile edit state
  const [fullName, setFullName] = useState(employee?.fullName || '');
  const [username, setUsername] = useState(employee?.username || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);
    if (!fullName.trim() || !username.trim()) {
      setProfileError('All fields are required.');
      return;
    }
    if (!employee) {
      setProfileError('Employee record not found.');
      return;
    }
    setProfileLoading(true);
    await new Promise(r => setTimeout(r, 300));
    try {
      updateEmployee({ ...employee, fullName: fullName.trim(), username: username.trim() });
      if (session) {
        setSession({ ...session, fullName: fullName.trim(), username: username.trim() });
      }
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile');
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    if (!employee || !session) {
      setPasswordError('Employee record not found.');
      return;
    }
    const verified = authenticateEmployee(employee.username, currentPassword);
    if (!verified) {
      setPasswordError('Current password is incorrect.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    setPasswordLoading(true);
    await new Promise(r => setTimeout(r, 300));
    try {
      updateEmployee({ ...employee, password: newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to update password');
    }
    setPasswordLoading(false);
  };

  if (!employee || !session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-richpay-muted">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-richpay-muted text-sm mt-0.5">View and update your profile information</p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-richpay-card border border-richpay-border rounded-xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-richpay-primary to-richpay-accent flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
          {employee.fullName[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-white font-bold text-lg">{employee.fullName}</p>
          <p className="text-richpay-muted text-sm">@{employee.username}</p>
          <p className="text-richpay-muted text-xs mt-1">
            Member since{' '}
            {new Date(employee.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <User size={18} />
            Edit Profile
          </h2>
        </div>
        <form onSubmit={handleProfileSave} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
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
              required
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            />
          </div>
          {profileError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2.5 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              Profile updated successfully!
            </div>
          )}
          <button
            type="submit"
            disabled={profileLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {profileLoading ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
          <h2 className="text-white font-bold text-lg">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 pr-10 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-richpay-muted hover:text-white transition-colors"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                required
                className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 pr-10 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-richpay-muted hover:text-white transition-colors"
              >
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
              required
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            />
          </div>
          {passwordError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2.5 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              Password changed successfully!
            </div>
          )}
          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {passwordLoading ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
