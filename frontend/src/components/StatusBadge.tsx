import { cn } from '../lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
        status === 'pending' && 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        status === 'approved' && 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        status === 'rejected' && 'bg-red-500/20 text-red-400 border border-red-500/30',
        className
      )}
    >
      {status}
    </span>
  );
}
