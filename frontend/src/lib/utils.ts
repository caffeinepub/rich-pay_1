import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: bigint | number | string): string {
  const ms = typeof timestamp === 'bigint' ? Number(timestamp / BigInt(1_000_000)) : Number(timestamp);
  return new Date(ms).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(timestamp: bigint | number | string): string {
  const ms = typeof timestamp === 'bigint' ? Number(timestamp / BigInt(1_000_000)) : Number(timestamp);
  return new Date(ms).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
