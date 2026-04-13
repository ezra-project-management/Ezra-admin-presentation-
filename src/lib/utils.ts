import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Kenyan Shilling — match public site (`KSh 1,800`). */
export function formatCurrency(amount: number): string {
  const n = Math.round(amount)
  return `KSh ${n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(dateStr: string): string {
  return `${formatDate(dateStr)} · ${formatTime(dateStr)}`
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  CONFIRMED:       { label: 'Confirmed',      bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'  },
  PENDING:         { label: 'Pending',         bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  CHECKED_IN:      { label: 'Checked In',      bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  COMPLETED:       { label: 'Completed',       bg: 'bg-gray-100',  text: 'text-gray-600',   border: 'border-gray-200'  },
  CANCELLED:       { label: 'Cancelled',       bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'   },
  PENDING_PAYMENT: { label: 'Pending Payment', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200'},
  COMPLETE:        { label: 'Complete',        bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  VOIDED:          { label: 'Voided',          bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'   },
  REFUNDED:        { label: 'Refunded',        bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200'},
}

export const TIER_CONFIG: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  BRONZE:   { label: 'Bronze',   bg: 'bg-amber-100',  text: 'text-amber-800',  icon: '🥉' },
  SILVER:   { label: 'Silver',   bg: 'bg-gray-100',   text: 'text-gray-700',   icon: '🥈' },
  GOLD:     { label: 'Gold',     bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🥇' },
  PLATINUM: { label: 'Platinum', bg: 'bg-blue-100',   text: 'text-blue-800',   icon: '💎' },
}
