import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAddBankAccount } from '../../hooks/useQueries';
import { getSession } from '../../lib/auth';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function AddBankAccountPage() {
  const router = useRouter();
  const session = getSession();
  const addAccount = useAddBankAccount();

  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountType, setAccountType] = useState('Savings');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!session) {
      setError('Not authenticated. Please log in again.');
      return;
    }
    if (!bankName.trim() || !accountHolderName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
      setError('All fields are required.');
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode.trim())) {
      setError('Invalid IFSC code format (e.g. SBIN0001234).');
      return;
    }
    try {
      await addAccount.mutateAsync({
        employeeId: session.userId,
        bankName: bankName.trim(),
        accountHolderName: accountHolderName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.toUpperCase().trim(),
        accountType,
      });
      setSuccess(true);
      setTimeout(() => router.navigate({ to: '/employee/my-accounts' }), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit account. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-richpay-card border border-richpay-border rounded-2xl p-10 text-center max-w-sm">
          <CheckCircle2 className="mx-auto mb-4 text-emerald-400" size={48} />
          <h2 className="text-white font-bold text-xl mb-2">Account Submitted!</h2>
          <p className="text-richpay-muted text-sm">
            Your bank account has been submitted for admin approval. Redirecting to your accounts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-white">Add Bank Account</h1>
        <p className="text-richpay-muted text-sm mt-0.5">
          Submit a new bank account for admin approval
        </p>
      </div>

      <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
          <h2 className="text-white font-bold text-lg">Bank Account Details</h2>
          <p className="text-richpay-muted text-xs">
            Your account will show as <span className="text-amber-400 font-medium">Pending</span> until approved by admin
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              placeholder="e.g. State Bank of India"
              required
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Account Holder Name</label>
            <input
              type="text"
              value={accountHolderName}
              onChange={e => setAccountHolderName(e.target.value)}
              placeholder="Full name as on bank account"
              required
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              required
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">IFSC Code</label>
            <input
              type="text"
              value={ifscCode}
              onChange={e => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g. SBIN0001234"
              required
              maxLength={11}
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Account Type</label>
            <select
              value={accountType}
              onChange={e => setAccountType(e.target.value)}
              className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-richpay-accent transition-colors text-sm"
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.navigate({ to: '/employee/my-accounts' })}
              className="flex-1 py-3 rounded-lg border border-richpay-border text-richpay-muted hover:text-white hover:border-richpay-accent transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addAccount.isPending}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {addAccount.isPending ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting...</>
              ) : (
                'Submit for Approval'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
