import { useState } from 'react';
import { useGetConversation, useSendMessage } from '../../hooks/useQueries';
import { getEmployees } from '../../lib/auth';
import ChatThread from '../../components/ChatThread';
import { MessageSquare } from 'lucide-react';

export default function ChatsPage() {
  const localEmployees = getEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    localEmployees.length > 0 ? localEmployees[0].id : null
  );

  const selectedEmployee = localEmployees.find(e => e.id === selectedEmployeeId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Chats</h1>
        <p className="text-richpay-muted text-sm mt-0.5">Private conversations with employees</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[400px]">
        {/* Employee List */}
        <div className="w-64 flex-shrink-0 bg-richpay-card border border-richpay-border rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-richpay-border">
            <p className="text-richpay-muted text-xs font-medium uppercase tracking-wide">Employees</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {localEmployees.length === 0 ? (
              <div className="text-center py-8 text-richpay-muted text-sm px-4">
                No employees registered yet
              </div>
            ) : (
              localEmployees.map(emp => (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmployeeId(emp.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-richpay-border/30 ${
                    selectedEmployeeId === emp.id
                      ? 'bg-richpay-primary/20 border-l-2 border-l-richpay-accent'
                      : 'hover:bg-richpay-darker'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-richpay-primary to-richpay-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {emp.fullName[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{emp.fullName}</p>
                    <p className="text-richpay-muted text-xs truncate">@{emp.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-w-0">
          {selectedEmployee ? (
            <ChatThread
              partyA="admin"
              partyB={selectedEmployee.id}
              currentUserId="admin"
              currentUserLabel="You (Admin)"
              otherUserLabel={selectedEmployee.fullName}
            />
          ) : (
            <div className="h-full bg-richpay-card border border-richpay-border rounded-xl flex items-center justify-center">
              <div className="text-center text-richpay-muted">
                <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">Select an employee to chat</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
