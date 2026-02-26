import { useState } from 'react';
import { useGetEmployees } from '../../hooks/useQueries';
import { getEmployees as getLocalEmployees } from '../../lib/auth';
import { formatDate } from '../../lib/utils';
import { Edit2, Loader2, UserPlus, Search } from 'lucide-react';
import EmployeeEditModal from '../../components/EmployeeEditModal';
import GenerateInviteLinkButton from '../../components/GenerateInviteLinkButton';
import { type Employee } from '../../backend';

export default function EmployeesPage() {
  const { isLoading } = useGetEmployees();
  const localEmployees = getLocalEmployees();
  const [editEmployee, setEditEmployee] = useState<{ id: string; fullName: string; username: string; createdAt: string } | null>(null);
  const [search, setSearch] = useState('');

  const filtered = localEmployees.filter(e => {
    const q = search.toLowerCase();
    return e.fullName.toLowerCase().includes(q) || e.username.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-richpay-muted text-sm mt-0.5">{localEmployees.length} registered employee{localEmployees.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-richpay-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="bg-richpay-input border border-richpay-border rounded-lg pl-9 pr-4 py-2 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent text-sm w-52"
            />
          </div>
          <GenerateInviteLinkButton />
        </div>
      </div>

      {/* Table */}
      <div className="bg-richpay-card border border-richpay-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-richpay-accent" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-richpay-muted">
            <UserPlus size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No employees yet</p>
            <p className="text-sm mt-1">Generate an invite link to add employees</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-richpay-border bg-richpay-darker">
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">#</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Full Name</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Username</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Registered</th>
                  <th className="text-left px-4 py-3 text-richpay-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, idx) => (
                  <tr key={emp.id} className="border-b border-richpay-border/50 hover:bg-richpay-darker/50 transition-colors">
                    <td className="px-4 py-3 text-richpay-muted">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-richpay-primary to-richpay-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {emp.fullName[0]?.toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{emp.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-richpay-muted">@{emp.username}</td>
                    <td className="px-4 py-3 text-richpay-muted text-xs">
                      {new Date(emp.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditEmployee(emp)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-richpay-primary/10 text-richpay-accent border border-richpay-primary/20 hover:bg-richpay-primary/20 transition-colors text-xs font-medium"
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editEmployee && (
        <EmployeeEditModal employee={editEmployee} onClose={() => setEditEmployee(null)} />
      )}
    </div>
  );
}
