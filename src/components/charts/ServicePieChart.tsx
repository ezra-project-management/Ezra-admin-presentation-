'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { REVENUE_BY_SERVICE } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const total = REVENUE_BY_SERVICE.reduce((sum, item) => sum + item.value, 0)
const totalLabel =
  total >= 1_000_000 ? `KSh ${(total / 1_000_000).toFixed(2)}M` : `KSh ${(total / 1_000).toFixed(0)}K`

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: { service: string; value: number } }>
}) {
  if (!active || !payload?.[0]) return null
  const data = payload[0].payload
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-md">
      <p className="text-sm font-semibold text-slate-900">{data.service}</p>
      <p className="text-xs font-medium text-slate-600 tabular-nums">{formatCurrency(data.value)}</p>
      <p className="text-[11px] text-slate-400">{((data.value / total) * 100).toFixed(1)}% of mix</p>
    </div>
  )
}

export function ServicePieChart() {
  return (
    <div className="w-full min-h-[240px] min-w-0">
      <div className="relative h-[240px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {REVENUE_BY_SERVICE.map((entry, i) => (
                <linearGradient key={i} id={`pieSlice${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={entry.fill} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.fill} stopOpacity={0.72} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={REVENUE_BY_SERVICE}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={92}
              dataKey="value"
              paddingAngle={2.5}
              stroke="#fff"
              strokeWidth={2}
            >
              {REVENUE_BY_SERVICE.map((entry, index) => (
                <Cell key={index} fill={`url(#pieSlice${index})`} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Total</span>
          <span className="text-lg font-bold tracking-tight text-slate-900">{totalLabel}</span>
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        {REVENUE_BY_SERVICE.map((item) => (
          <div key={item.service} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: item.fill }} />
              <span className="truncate text-slate-700">{item.service}</span>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="font-semibold tabular-nums text-slate-900">{formatCurrency(item.value)}</span>
              <span className="w-9 text-right text-xs text-slate-400">{((item.value / total) * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
