'use client'

import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { OCCUPANCY_DATA } from '@/lib/mock-data'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getOccupancy(resourceIndex: number, dayIndex: number): number {
  const seed = (resourceIndex * 7 + dayIndex * 13 + 5) % 100
  return seed
}

function getHeatColor(value: number): string {
  if (value <= 20) return 'bg-slate-100'
  if (value <= 40) return 'bg-sky-100'
  if (value <= 60) return 'bg-sky-300'
  if (value <= 80) return 'bg-sky-500'
  return 'bg-navy'
}

export function OccupancyHeatmap() {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        Each cell is how busy that resource tends to be that day (0–100, demo model). Darker means higher load relative to other slots.
      </p>
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid gap-1" style={{ gridTemplateColumns: 'minmax(120px,1fr) repeat(7, minmax(0,1fr))' }}>
            <div />
            {DAYS.map(day => (
              <div key={day} className="text-[10px] sm:text-xs text-center text-gray-500 font-medium py-1">
                {day}
              </div>
            ))}
            {OCCUPANCY_DATA.map((resource, ri) => (
              <Fragment key={resource.resource}>
                <div className="text-[10px] sm:text-xs text-gray-700 truncate py-2 pr-2" title={resource.resource}>
                  {resource.resource}
                </div>
                {DAYS.map((day, di) => {
                  const occ = getOccupancy(ri, di)
                  return (
                    <div
                      key={`${resource.resource}-${day}`}
                      className={cn(
                        'rounded-md aspect-square max-h-10 flex items-center justify-center',
                        getHeatColor(occ),
                        occ > 80 ? 'text-white' : 'text-gray-700'
                      )}
                      title={`${resource.resource} · ${day}: ${occ}%`}
                    >
                      <span className="text-[9px] sm:text-[10px] font-mono font-medium">{occ}</span>
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Quieter</span>
        <div className="flex gap-0.5">
          {['bg-slate-100', 'bg-sky-100', 'bg-sky-300', 'bg-sky-500', 'bg-navy'].map(c => (
            <div key={c} className={cn('w-6 h-3 rounded-sm', c)} />
          ))}
        </div>
        <span>Busier</span>
      </div>
    </div>
  )
}
