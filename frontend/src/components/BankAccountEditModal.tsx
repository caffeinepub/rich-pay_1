import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { type BankAccount } from '../backend';
import { X, Loader2 } from 'lucide-react';

interface Props {
  account: BankAccount;
  onClose: () => void;
}

export default function BankAccountEditModal({ account, onClose }: Props) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [bankName, setBankName] = useState(account.bankName);
  const [accountHolderName, setAccountHolderName] = useState(account.accountHolderName);
  const [accountNumber, setAccountNumber] = useState(account.accountNumber);
  const [ifscCode, setIfscCode] = useState(account.ifscCode);
  const [accountType, setAccountType] = useState(account.accountType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!actor) throw new Error('Actor not available');
      // Delete old and re-add with updated info
      await actor.deleteBankAccount(account.employeeId);
      await actor.addBankAccount(account.employeeId, {
        bankName,
        accountHolderName,
        accountNumber,
        ifscCode,
        accountType,
      });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-richpay-card border border-richpay-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
          <h2 className="text-white font-bold text-lg">Edit Bank Account</h2>
          <button onClick={onClose} className="text-richpay-muted hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          {[
            { label: 'Bank Name', value: bankName, setter: setBankName, placeholder: 'e.g. State Bank of India' },
            { label: 'Account Holder Name', value: accountHolderName, setter: setAccountHolderName, placeholder: 'Full name on account' },
            { label: 'Account Number', value: accountNumber, setter: setAccountNumber, placeholder: 'Account number' },
            { label: 'IFSC Code', value: ifscCode, setter: setIfscCode, placeholder: 'e.g. SBIN0001234' },
          ].map(field => (
            <div key={field.label} className="flex flex-col gap-1.5">
              <label className="text-richpay-muted text-xs font-medium uppercase tracking-wide">{field.label}</label>
              <input
                type="text"
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                placeholder={field.placeholder}
                required
                className="w-full bg-richpay-input border border-richpay-border rounded-lg px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
              />
            </div>
          ))}
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
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-400 text-sm">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-richpay-border text-richpay-muted hover:text-white hover:border-richpay-accent transition-colors text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
