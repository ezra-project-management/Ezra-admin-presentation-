'use client'

import { cn } from '@/lib/utils'
import { TIER_CONFIG } from '@/lib/utils'

interface TierBadgeProps {
  tier: string
  className?: string
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  const config = TIER_CONFIG[tier] ?? { label: tier, bg: 'bg-gray-100', text: 'text-gray-600', icon: '' }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', config.bg, config.text, className)}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}
