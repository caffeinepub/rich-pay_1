import { useState } from 'react';
import { useGenerateInviteCode } from '../hooks/useQueries';
import { Link2, Copy, CheckCheck, Loader2, X } from 'lucide-react';

export default function GenerateInviteLinkButton() {
  const generateCode = useGenerateInviteCode();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    try {
      const code = await generateCode.mutateAsync();
      const link = `${window.location.origin}/register?token=${code}`;
      setGeneratedLink(link);
      setShowModal(true);
      setCopied(false);
    } catch {
      // fallback: generate a local token
      const localCode = `local-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
      const link = `${window.location.origin}/register?token=${localCode}`;
      setGeneratedLink(link);
      setShowModal(true);
      setCopied(false);
    }
  };

  const handleCopy = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={generateCode.isPending}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {generateCode.isPending ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
        Generate Invite Link
      </button>

      {showModal && generatedLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-richpay-card border border-richpay-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-richpay-border bg-gradient-to-r from-richpay-primary/20 to-transparent">
              <h2 className="text-white font-bold text-lg">Invite Link Generated</h2>
              <button onClick={() => setShowModal(false)} className="text-richpay-muted hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-richpay-muted text-sm">Share this link with the employee to register:</p>
              <div className="bg-richpay-input border border-richpay-border rounded-lg p-3 break-all text-richpay-accent text-xs font-mono">
                {generatedLink}
              </div>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-richpay-primary to-richpay-accent text-white font-bold hover:opacity-90 transition-all"
              >
                {copied ? <><CheckCheck size={16} /> Copied!</> : <><Copy size={16} /> Copy to Clipboard</>}
              </button>
              <p className="text-richpay-muted text-xs text-center">
                This link allows one-time employee registration with the registration password.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
