import { useGetMyBankAccounts } from '../../hooks/useQueries';
import StatusBadge from '../../components/StatusBadge';
import { CreditCard, Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';
import type { LocalBankAccount } from '../../lib/auth';

export default function MyBankAccountsPage() {
  const { data: accounts = [], isLoading } = useGetMyBankAccounts();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Bank Accounts</h1>
          <p className="text-richpay-muted text-sm mt-0.5">View and track your submitted bank accounts</p>
        </div>
        <button
          onClick={() => router.navigate({ to: '/employee/add-account' })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-semibold text-sm hover:opacity-90 transition-all"
        >
          <PlusCircle size={16} />
          Add Account
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-richpay-accent" size={32} />
        </div>
      ) : accounts.length === 0 ? (
        <div className="bg-richpay-card border border-richpay-border rounded-xl p-12 text-center">
          <CreditCard size={48} className="mx-auto mb-4 text-richpay-muted opacity-40" />
          <p className="text-white font-semibold text-lg">No bank accounts yet</p>
          <p className="text-richpay-muted text-sm mt-1 mb-6">Submit your first bank account for approval</p>
          <button
            onClick={() => router.navigate({ to: '/employee/add-account' })}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all"
          >
            Add Bank Account
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account: LocalBankAccount) => (
            <div key={account.id} className="bg-richpay-card border border-richpay-border rounded-xl p-5 flex flex-col gap-3 hover:border-richpay-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-white font-bold text-base">{account.bankName}</p>
                  <p className="text-richpay-muted text-xs mt-0.5">{account.accountType} Account</p>
                </div>
                <StatusBadge status={account.status} />
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-richpay-muted text-xs">Account Holder</span>
                  <span className="text-white text-xs font-medium">{account.accountHolderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-richpay-muted text-xs">Account No.</span>
                  <span className="text-white text-xs font-mono">{account.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-richpay-muted text-xs">IFSC Code</span>
                  <span className="text-white text-xs font-mono">{account.ifscCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-richpay-muted text-xs">Submitted</span>
                  <span className="text-richpay-muted text-xs">
                    {new Date(account.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              {account.status === 'pending' && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-amber-400 text-xs">
                  ⏳ Awaiting admin approval
                </div>
              )}
              {account.status === 'approved' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-emerald-400 text-xs">
                  ✅ Approved by admin
                </div>
              )}
              {account.status === 'rejected' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-xs">
                  ❌ Rejected by admin
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
