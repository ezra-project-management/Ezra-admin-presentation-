'use client'

import { BarChart3, Clock, Star } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { OccupancyHeatmap } from '@/components/charts/OccupancyHeatmap'
import { BookingTrendsWeek } from '@/components/charts/BookingTrendsWeek'
import { OCCUPANCY_DATA, OCCUPANCY_UTILIZATION } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function utilizationFor(resource: string, status: string): number {
  if (status === 'maintenance') return 0
  if (status === 'open') return OCCUPANCY_UTILIZATION[resource] ?? 50
  if (OCCUPANCY_UTILIZATION[resource] != null) return OCCUPANCY_UTILIZATION[resource]
  if (status === 'occupied') return 72
  if (status === 'available') return 28
  return 20
}

export default function OccupancyPage() {
  const occupied = OCCUPANCY_DATA.filter(o => o.status === 'occupied').length
  const total = OCCUPANCY_DATA.length
  const occupancyPct = Math.round((occupied / total) * 100)

  return (
    <div>
      <PageHeader title="Occupancy" subtitle="How full resources are right now · booking rhythm this week" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Slots in use now"
          value={`${occupied} / ${total}`}
          icon={BarChart3}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          accentColor="bg-blue-500"
          delta={`~${occupancyPct}% marked busy`}
          deltaType="neutral"
        />
        <StatCard
          title="Typical peak"
          value="10am – 2pm"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          accentColor="bg-amber-500"
          delta="Weekdays"
          deltaType="neutral"
        />
        <StatCard
          title="Most booked"
          value="Boardroom A"
          icon={Star}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          accentColor="bg-purple-500"
          delta="Demo data"
          deltaType="positive"
        />
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Booking volume this week</h3>
        <p className="text-xs text-gray-500 mb-0">Start here for trends; use the grid below for per-resource patterns.</p>
        <div className="mt-4">
          <BookingTrendsWeek />
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Weekly load grid</h3>
        <p className="text-xs text-gray-500 mb-4">Optional detail — compare rooms and stations across the week.</p>
        <OccupancyHeatmap />
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Utilization by resource</h3>
        <p className="text-sm text-gray-600 mb-4">Approximate utilization (demo). Matches live status where relevant.</p>
        <div className="space-y-3">
          {OCCUPANCY_DATA.map(resource => {
            const occ = utilizationFor(resource.resource, resource.status)
            return (
              <div key={resource.resource}>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-sm text-gray-700 truncate">{resource.resource}</span>
                  <span className="text-xs text-gray-500 shrink-0 tabular-nums">{occ}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={cn('h-2 rounded-full bg-brand transition-all')}
                    style={{ width: `${occ}%`, opacity: 0.65 + occ / 400 }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span className="capitalize">{resource.status.replace('-', ' ')}</span>
                  <span>{resource.current ?? '—'}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
