'use client'

import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  iconBg: string
  accentColor: string
  delta?: string
  deltaType?: 'positive' | 'negative' | 'neutral'
  subtitle?: string
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  accentColor,
  delta,
  deltaType = 'neutral',
  subtitle,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative bg-white rounded-[10px] shadow-[var(--shadow-card)] border border-gray-100 p-4 overflow-hidden card-hover group',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Accent top bar with shimmer */}
      <div className={cn('absolute top-0 left-0 right-0 h-0.5', accentColor)}>
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110',
          iconBg
        )}>
          <Icon className={cn('w-4 h-4', iconColor)} />
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</span>
      </div>
      <div className="text-2xl font-extrabold text-gray-900 mb-1 animate-count-up">{value}</div>
      {(delta || subtitle) && (
        <div className="flex items-center gap-1.5">
          {delta && deltaType === 'positive' && (
            <>
              <ArrowUp className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">{delta}</span>
            </>
          )}
          {delta && deltaType === 'negative' && (
            <>
              <ArrowDown className="w-3 h-3 text-red-600" />
              <span className="text-xs font-medium text-red-600">{delta}</span>
            </>
          )}
          {delta && deltaType === 'neutral' && (
            <span className="text-xs text-gray-500">{delta}</span>
          )}
          {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
        </div>
      )}

      {/* Subtle corner glow on hover */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, currentColor, transparent)' }} />
    </div>
  )
}
