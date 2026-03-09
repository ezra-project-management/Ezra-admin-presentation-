'use client'

import Link from 'next/link'
import { Plus, ShoppingCart, MessageSquare, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const actions = [
  { label: 'New Walk-in', icon: Plus, href: '/bookings/queue', color: 'text-teal-600', bg: 'bg-teal-50', glowColor: 'group-hover:shadow-teal-200/50' },
  { label: 'New Transaction', icon: ShoppingCart, href: '/pos/new', color: 'text-blue-600', bg: 'bg-blue-50', glowColor: 'group-hover:shadow-blue-200/50' },
  { label: 'Send SMS', icon: MessageSquare, href: '/communications/sms', color: 'text-amber-600', bg: 'bg-amber-50', glowColor: 'group-hover:shadow-amber-200/50' },
  { label: "Today's Schedule", icon: CalendarDays, href: '/bookings/calendar', color: 'text-navy', bg: 'bg-gray-100', glowColor: 'group-hover:shadow-gray-300/50' },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <Link
            key={action.label}
            href={action.href}
            className={cn(
              'group bg-white rounded-[10px] border border-gray-200 p-4 flex flex-col items-center gap-2 card-hover cursor-pointer animate-scale-in',
              action.glowColor,
              'hover:border-brand hover:bg-brand-muted hover:shadow-lg'
            )}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
              action.bg
            )}>
              <Icon className={cn('w-5 h-5', action.color)} />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-brand transition-colors">{action.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
