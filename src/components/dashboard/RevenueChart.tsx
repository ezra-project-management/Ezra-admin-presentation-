'use client'

import { RevenueBarChart } from '@/components/charts/RevenueBarChart'
import { Download } from 'lucide-react'

export function RevenueChart() {
  return (
    <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Revenue This Week</h3>
          <p className="text-xs text-gray-400 mt-0.5">Mar 4 – Mar 10, 2026</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-[var(--btn-radius)] px-3 py-1.5 hover:bg-gray-50">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
      <RevenueBarChart />
    </div>
  )
}
