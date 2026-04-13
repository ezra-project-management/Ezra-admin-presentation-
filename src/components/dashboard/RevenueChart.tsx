'use client'

import { RevenueBarChart } from '@/components/charts/RevenueBarChart'
import { Download } from 'lucide-react'

export function RevenueChart() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-[#eff6ff]/80 p-6 shadow-[0_4px_24px_-4px_rgba(15,44,74,0.12),0_0_0_1px_rgba(255,255,255,0.8)_inset] card-hover">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#1565C0]/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-6 left-1/4 h-24 w-48 rounded-full bg-[#C9A84C]/15 blur-2xl" />
      <div className="relative flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900">Revenue This Week</h3>
          <p className="text-xs text-slate-500 mt-1">Mar 4 to Mar 10, 2026 · live demo series</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-[#1565C0]/30 hover:text-[#1565C0]"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
      <div className="relative min-h-[280px] w-full min-w-0">
        <RevenueBarChart />
      </div>
    </div>
  )
}
