'use client'

import { cn } from '@/lib/utils'
import { STATUS_CONFIG } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', config.bg, config.text, config.border, className)}>
      {config.label}
    </span>
  )
}
