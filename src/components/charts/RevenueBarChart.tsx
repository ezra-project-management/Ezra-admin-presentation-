'use client'

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { REVENUE_DAILY } from '@/lib/mock-data'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: KSh {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export function RevenueBarChart() {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={REVENUE_DAILY} margin={{ top: 8, right: 20, bottom: 5, left: 12 }}>
          <defs>
            <linearGradient id="revenueBarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1976D2" stopOpacity={1} />
              <stop offset="100%" stopColor="#0F2C4A" stopOpacity={0.95} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" vertical={false} />
          <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
          <YAxis fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="revenue" name="Revenue" fill="url(#revenueBarFill)" radius={[6, 6, 0, 0]} barSize={34} />
          <Line dataKey="target" name="Daily target" stroke="#C9A84C" strokeDasharray="5 4" dot={{ r: 3, fill: '#C9A84C', strokeWidth: 0 }} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
