import { useState } from 'react';
import { useGetAllBankAccounts, useUpdateBankAccountStatus } from '../../hooks/useQueries';
import { getEmployeeById } from '../../lib/auth';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../lib/utils';
import { CheckCircle, XCircle, Loader2, Search } from 'lucide-react';
import type { LocalBankAccount } from '../../lib/auth';

export default function AllBankAccountsPage() {
  const { data: accounts = [], isLoading } = useGetAllBankAccounts();
  const updateStatus = useUpdateBankAccountStatus();
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatus = async (accountId: string, status: 'pending' | 'approved' | 'rejected') => {
    setLoadingId(accountId + status);
    await updateStatus.mutateAsync({ employeeId: accountId, status });
    setLoadingId(null);
  };

  const filtered = accounts.filter((a: LocalBankAccount) => {
    const emp = getEmployeeById(a.employeeId);
    const empName = emp?.fullName || (a.employeeId === 'admin' ? 'Admin' : a.employeeId);
    const q = search.toLowerCase();
    return (
      empName.toLowerCase().includes(q) ||
      a.bankName.toLowerCase().includes(q) ||
      a.accountNumber.toLowerCase().includes(q) ||
      a.ifscCode.toLowerCase().includes(q)
    );
  });

  const pendingCount = accounts.filter((a: LocalBankAccount) => a.status === 'pending').length;
  const approvedCount = accounts.filter((a: LocalBankAccount) => a.status === 'approved').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Bank Accounts</h1>
          <p className="text-richpay-muted text-sm mt-0.5">Manage and review all submitted bank accounts</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-richpay-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search accounts..."
            className="bg-richpay-input border border-richpay-border rounded-lg pl-9 pr-4 py-2 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent text-sm w-64"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', count: accounts.length, color: 'text-white' },
          { label: 'Pending', count: pendingCount, color: 'text-amber-400' },
          { label: 'Approved', count: approvedCount, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-richpay-card border border-richpay-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-richpay-muted text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-richpay-accent" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-richpay-muted">
            <p className="text-lg font-medium">No bank accounts found</p>
            <p className="text-sm mt-1">Accounts submitted by employees will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-richpay-border bg-richpay-darker">
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Employee</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Bank Name</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Account Holder</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Account No.</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">IFSC Code</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Date</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((account: LocalBankAccount) => {
                  const emp = getEmployeeById(account.employeeId);
                  const empName = emp?.fullName || (account.employeeId === 'admin' ? 'Admin' : account.employeeId);
                  return (
                    <tr key={account.id} className="border-b border-richpay-border/50 hover:bg-richpay-darker/50 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{empName}</td>
                      <td className="px-4 py-3 text-richpay-muted">{account.bankName}</td>
                      <td className="px-4 py-3 text-richpay-muted">{account.accountHolderName}</td>
                      <td className="px-4 py-3 text-richpay-muted font-mono text-xs">{account.accountNumber}</td>
                      <td className="px-4 py-3 text-richpay-muted font-mono text-xs">{account.ifscCode}</td>
                      <td className="px-4 py-3 text-richpay-muted">{account.accountType}</td>
                      <td className="px-4 py-3 text-richpay-muted text-xs">
                        {new Date(account.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={account.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {account.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatus(account.id, 'approved')}
                                disabled={!!loadingId}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-xs font-medium disabled:opacity-50"
                              >
                                {loadingId === account.id + 'approved' ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatus(account.id, 'rejected')}
                                disabled={!!loadingId}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs font-medium disabled:opacity-50"
                              >
                                {loadingId === account.id + 'rejected' ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
