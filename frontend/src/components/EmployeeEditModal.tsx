import { useState } from 'react';
import { updateEmployee, getEmployeeById } from '../lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';

interface Props {
  employee: { id: string; fullName: string; username: string; createdAt: string };
  onClose: () => void;
}

export default function EmployeeEditModal({ employee, onClose }: Props) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState(employee.fullName);
  const [username, setUsername] = useState(employee.username);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !username.trim()) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      // Look up the full record (including password) before updating
      const existing = getEmployeeById(employee.id);
      if (!existing) {
        setError('Employee record not found.');
        setLoading(false);
        return;
      }
      updateEmployee({ ...existing, fullName: fullName.trim(), username: username.trim() });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-richpay-card border border-richpay-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
          <h2 className="text-white font-bold text-lg">Edit Employee</h2>
          <button onClick={onClose} className="text-richpay-muted hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
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
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-richpay-border text-richpay-muted hover:text-white hover:border-richpay-accent transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
