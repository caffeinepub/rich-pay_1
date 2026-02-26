import { useState } from 'react';
import { useGetAllBankAccounts, useAddBankAccount } from '../../hooks/useQueries';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../lib/utils';
import { PlusCircle, Loader2, CreditCard } from 'lucide-react';
import type { LocalBankAccount } from '../../lib/auth';

export default function MyAccountsPage() {
  const { data: allAccounts = [], isLoading } = useGetAllBankAccounts();
  const addAccount = useAddBankAccount();

  const adminAccounts = (allAccounts as LocalBankAccount[]).filter(a => a.employeeId === 'admin');

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
    setSuccess(false);
    try {
      await addAccount.mutateAsync({ employeeId: 'admin', bankName, accountHolderName, accountNumber, ifscCode, accountType });
      setBankName(''); setAccountHolderName(''); setAccountNumber(''); setIfscCode(''); setAccountType('Savings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add account');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Accounts</h1>
        <p className="text-richpay-muted text-sm mt-0.5">Manage your personal bank accounts</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Account Form */}
        <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
            <h2 className="text-white font-bold flex items-center gap-2"><PlusCircle size={18} /> Add Bank Account</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {[
              { label: 'Bank Name', value: bankName, setter: setBankName, placeholder: 'e.g. HDFC Bank' },
              { label: 'Account Holder Name', value: accountHolderName, setter: setAccountHolderName, placeholder: 'Full name on account' },
              { label: 'Account Number', value: accountNumber, setter: setAccountNumber, placeholder: 'Account number' },
              { label: 'IFSC Code', value: ifscCode, setter: setIfscCode, placeholder: 'e.g. HDFC0001234' },
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
            {success && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2.5 text-emerald-400 text-sm">Account added successfully!</div>}
            <button type="submit" disabled={addAccount.isPending} className="w-full py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {addAccount.isPending ? <><Loader2 size={16} className="animate-spin" /> Adding...</> : 'Add Account'}
            </button>
          </form>
        </div>

        {/* Accounts List */}
        <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
            <h2 className="text-white font-bold flex items-center gap-2"><CreditCard size={18} /> My Bank Accounts ({adminAccounts.length})</h2>
          </div>
          <div className="p-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-richpay-accent" size={24} /></div>
            ) : adminAccounts.length === 0 ? (
              <div className="text-center py-8 text-richpay-muted text-sm">No accounts added yet</div>
            ) : (
              adminAccounts.map((account: LocalBankAccount) => (
                <div key={account.id} className="bg-richpay-darker border border-richpay-border/50 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">{account.bankName}</span>
                    <StatusBadge status={account.status} />
                  </div>
                  <p className="text-richpay-muted text-xs">{account.accountHolderName}</p>
                  <p className="text-richpay-muted font-mono text-xs">{account.accountNumber}</p>
                  <div className="flex items-center justify-between text-xs text-richpay-muted">
                    <span>IFSC: {account.ifscCode}</span>
                    <span>{account.accountType}</span>
                  </div>
                  <p className="text-richpay-muted text-xs">
                    {new Date(account.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
