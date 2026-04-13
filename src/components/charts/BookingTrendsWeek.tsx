'use client'

import { BOOKING_TRENDS_WEEK } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function BookingTrendsWeek() {
  const max = Math.max(...BOOKING_TRENDS_WEEK.map(d => d.count), 1)

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Total bookings started per day this week. Taller bars mean more check-ins and reservations combined — use it to spot busy days at a glance.
      </p>
      <div className="flex items-end gap-2 sm:gap-3 h-44 border-b border-gray-200 pb-1">
        {BOOKING_TRENDS_WEEK.map(day => {
          const h = Math.round((day.count / max) * 100)
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div className="w-full flex flex-col justify-end flex-1 min-h-[120px]">
                <div
                  className={cn('w-full max-w-[48px] mx-auto rounded-t-md bg-brand/85 hover:bg-brand transition-colors')}
                  style={{ height: `${Math.max(h, 8)}%` }}
                  title={`${day.label}: ${day.count} bookings`}
                />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-gray-600">{day.day}</span>
              <span className="text-[10px] text-gray-400 tabular-nums">{day.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
