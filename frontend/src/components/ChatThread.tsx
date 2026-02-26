import { useState, useRef, useEffect } from 'react';
import { useGetConversation, useSendMessage } from '../hooks/useQueries';
import { formatDateTime } from '../lib/utils';
import { Send, Loader2 } from 'lucide-react';

interface Props {
  partyA: string;
  partyB: string;
  currentUserId: string;
  currentUserLabel: string;
  otherUserLabel: string;
}

export default function ChatThread({ partyA, partyB, currentUserId, currentUserLabel, otherUserLabel }: Props) {
  const { data: messages = [], isLoading } = useGetConversation(partyA, partyB);
  const sendMessage = useSendMessage();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = text.trim();
    setText('');
    await sendMessage.mutateAsync({
      sender: currentUserId,
      recipient: currentUserId === partyA ? partyB : partyA,
      message: msg,
    });
  };

  return (
    <div className="h-full bg-richpay-card border border-richpay-border rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/10 to-transparent flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-richpay-primary to-richpay-accent flex items-center justify-center text-white text-xs font-bold">
          {otherUserLabel[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{otherUserLabel}</p>
          <p className="text-richpay-muted text-xs">Private conversation</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-richpay-accent" size={24} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-richpay-muted text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={idx} className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-richpay-muted text-xs px-1">
                  {isMe ? currentUserLabel : otherUserLabel}
                </span>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-gradient-to-r from-richpay-primary to-richpay-accent text-white rounded-br-sm'
                    : 'bg-richpay-darker border border-richpay-border text-white rounded-bl-sm'
                }`}>
                  {msg.message}
                </div>
                <span className="text-richpay-muted text-xs px-1">
                  {formatDateTime(msg.timestamp)}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-richpay-border flex gap-3">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-richpay-input border border-richpay-border rounded-xl px-4 py-2.5 text-white placeholder-richpay-muted focus:outline-none focus:border-richpay-accent transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim() || sendMessage.isPending}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-richpay-primary to-richpay-accent text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {sendMessage.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
}
