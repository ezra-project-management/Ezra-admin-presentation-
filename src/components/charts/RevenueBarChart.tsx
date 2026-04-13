'use client'

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { REVENUE_DAILY } from '@/lib/mock-data'

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload) return null
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-md">
      <p className="mb-1.5 text-sm font-semibold text-slate-900">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-medium tabular-nums" style={{ color: entry.color }}>
          {entry.name}: KSh {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export function RevenueBarChart() {
  return (
    <div className="h-[280px] w-full min-h-[200px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={REVENUE_DAILY} margin={{ top: 12, right: 12, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id="revenueBarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#42A5F5" stopOpacity={1} />
              <stop offset="55%" stopColor="#1976D2" stopOpacity={1} />
              <stop offset="100%" stopColor="#0F2C4A" stopOpacity={0.98} />
            </linearGradient>
            <linearGradient id="revenueLineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E2C87A" />
              <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="#E2E8F0" vertical={false} strokeOpacity={0.85} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#64748B', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(21, 101, 192, 0.06)' }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="revenue" name="Revenue" fill="url(#revenueBarFill)" radius={[8, 8, 0, 0]} barSize={36} maxBarSize={48} />
          <Line
            type="monotone"
            dataKey="target"
            name="Daily target"
            stroke="url(#revenueLineGlow)"
            strokeDasharray="6 4"
            dot={{ r: 3, fill: '#C9A84C', strokeWidth: 0 }}
            strokeWidth={2.5}
            activeDot={{ r: 5, fill: '#C9A84C', stroke: '#fff', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
