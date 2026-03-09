'use client'

import { cn } from '@/lib/utils'
import { OCCUPANCY_DATA } from '@/lib/mock-data'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getOccupancy(resourceIndex: number, dayIndex: number): number {
  const seed = (resourceIndex * 7 + dayIndex * 13 + 5) % 100
  return seed
}

function getHeatColor(value: number): string {
  if (value <= 20) return 'bg-blue-50'
  if (value <= 40) return 'bg-blue-100'
  if (value <= 60) return 'bg-blue-200'
  if (value <= 80) return 'bg-blue-300'
  return 'bg-blue-500'
}

export function OccupancyHeatmap() {
  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: '140px repeat(7, 1fr)' }}>
            <div />
            {DAYS.map(day => (
              <div key={day} className="text-xs text-center text-gray-500 font-medium py-1">{day}</div>
            ))}
            {OCCUPANCY_DATA.map((resource, ri) => (
              <>
                <div key={resource.resource} className="text-xs text-gray-700 truncate py-2 pr-2">{resource.resource}</div>
                {DAYS.map((day, di) => {
                  const occ = getOccupancy(ri, di)
                  return (
                    <div
                      key={`${ri}-${di}`}
                      className={cn('rounded-sm aspect-square flex items-center justify-center', getHeatColor(occ))}
                      title={`${resource.resource} - ${day}: ${occ}%`}
                    >
                      <span className="text-[10px] text-gray-600 font-mono">{occ}</span>
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Low</span>
        <div className="flex gap-0.5">
          {['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-500'].map(c => (
            <div key={c} className={cn('w-6 h-3 rounded-sm', c)} />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  )
}
