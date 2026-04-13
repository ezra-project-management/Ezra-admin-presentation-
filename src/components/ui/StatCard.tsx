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
        'relative bg-white rounded-lg shadow-[var(--shadow-card)] border border-slate-200/80 p-4 card-hover group',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className={cn('absolute top-0 left-0 right-0 h-px rounded-t-lg', accentColor)} aria-hidden />

      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide leading-tight">{title}</span>
        <div
          className={cn(
            'w-9 h-9 rounded-md flex items-center justify-center shrink-0 border border-slate-100',
            iconBg
          )}
        >
          <Icon className={cn('w-4 h-4', iconColor)} />
        </div>
      </div>
      <div className="text-xl font-semibold tabular-nums text-slate-900 tracking-tight">{value}</div>
      {(delta || subtitle) && (
        <div className="flex items-center gap-1.5 mt-2">
          {delta && deltaType === 'positive' && (
            <>
              <ArrowUp className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium text-emerald-700">{delta}</span>
            </>
          )}
          {delta && deltaType === 'negative' && (
            <>
              <ArrowDown className="w-3 h-3 text-red-600 shrink-0" />
              <span className="text-xs font-medium text-red-700">{delta}</span>
            </>
          )}
          {delta && deltaType === 'neutral' && <span className="text-xs text-slate-500">{delta}</span>}
          {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  )
}
