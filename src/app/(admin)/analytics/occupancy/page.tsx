'use client'

import { BarChart3, Clock, Star } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { OccupancyHeatmap } from '@/components/charts/OccupancyHeatmap'
import { OCCUPANCY_DATA } from '@/lib/mock-data'

export default function OccupancyPage() {
  const occupied = OCCUPANCY_DATA.filter(o => o.status === 'occupied').length
  const total = OCCUPANCY_DATA.length
  const occupancyPct = Math.round((occupied / total) * 100)

  return (
    <div>
      <PageHeader title="Occupancy Analytics" subtitle="Resource utilization insights" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Average Occupancy" value={`${occupancyPct}%`} icon={BarChart3} iconColor="text-blue-600" iconBg="bg-blue-50" accentColor="bg-blue-500" delta="This week" deltaType="neutral" />
        <StatCard title="Peak Hours" value="10am – 2pm" icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" accentColor="bg-amber-500" delta="Weekdays" deltaType="neutral" />
        <StatCard title="Most Used" value="Boardroom A" icon={Star} iconColor="text-purple-600" iconBg="bg-purple-50" accentColor="bg-purple-500" delta="42 bookings this month" deltaType="positive" />
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Weekly Occupancy Heatmap</h3>
        <OccupancyHeatmap />
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Occupancy by Resource</h3>
        <div className="space-y-3">
          {OCCUPANCY_DATA.map(resource => {
            const occ = resource.status === 'occupied' ? 75 + Math.floor(Math.random() * 25) : resource.status === 'available' ? Math.floor(Math.random() * 40) : 0
            return (
              <div key={resource.resource}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{resource.resource}</span>
                  <span className="text-xs text-gray-500">{occ}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${occ}%`, opacity: 0.5 + occ / 200 }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
