'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingStatusTimelineProps {
  currentStatus: string
}

const STEPS = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED']
const LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked In',
  COMPLETED: 'Completed',
}

export function BookingStatusTimeline({ currentStatus }: BookingStatusTimelineProps) {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
          <X className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-red-700">Booking Cancelled</span>
      </div>
    )
  }

  const currentIndex = STEPS.indexOf(currentStatus)

  return (
    <div className="flex items-center justify-between py-4">
      {STEPS.map((step, i) => {
        const isPast = i < currentIndex
        const isCurrent = i === currentIndex
        const isFuture = i > currentIndex

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  isPast && 'bg-green-500 text-white',
                  isCurrent && 'bg-brand text-white ring-4 ring-blue-100',
                  isFuture && 'bg-gray-200 text-gray-400'
                )}
              >
                {isPast ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <span className={cn('text-[10px] mt-1.5 font-medium', isCurrent ? 'text-brand' : isPast ? 'text-green-600' : 'text-gray-400')}>
                {LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-2', isPast ? 'bg-green-500' : 'bg-gray-200')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
