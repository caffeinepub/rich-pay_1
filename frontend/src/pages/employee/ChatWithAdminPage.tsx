import { getSession } from '../../lib/auth';
import ChatThread from '../../components/ChatThread';

export default function ChatWithAdminPage() {
  const session = getSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-richpay-muted">Not authenticated.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-160px)] min-h-[500px]">
      <div>
        <h1 className="text-2xl font-bold text-white">Chat with Admin</h1>
        <p className="text-richpay-muted text-sm mt-0.5">
          Private conversation with your administrator
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <ChatThread
          partyA={session.userId}
          partyB="admin"
          currentUserId={session.userId}
          currentUserLabel="You"
          otherUserLabel="Admin"
        />
      </div>
    </div>
  );
}
