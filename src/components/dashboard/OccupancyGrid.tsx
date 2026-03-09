'use client'

import { OCCUPANCY_DATA } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const statusStyles: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  occupied: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Occupied', dot: 'bg-blue-500' },
  available: { bg: 'bg-green-50', text: 'text-green-700', label: 'Available', dot: 'bg-green-500' },
  maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Maintenance', dot: 'bg-amber-500' },
  open: { bg: 'bg-teal-50', text: 'text-teal-700', label: 'Open', dot: 'bg-teal-500' },
}

export function OccupancyGrid() {
  return (
    <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Resource Status</h3>
      <div className="grid grid-cols-2 gap-2">
        {OCCUPANCY_DATA.map((item, i) => {
          const style = statusStyles[item.status] || statusStyles.available
          return (
            <div
              key={item.resource}
              className="rounded-lg p-3 border border-gray-100 hover:border-gray-200 card-hover animate-scale-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
                <span className="text-xs font-medium text-gray-900">{item.resource}</span>
              </div>
              <span className={cn('inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full', style.bg, style.text)}>
                {style.label}
              </span>
              {item.current && (
                <div className="text-[10px] text-gray-500 mt-1">
                  {item.current} {item.until && `· until ${item.until}`}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
