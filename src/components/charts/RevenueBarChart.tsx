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
          {entry.name}: KES {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export function RevenueBarChart() {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={REVENUE_DAILY} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
          <YAxis fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="revenue" name="Revenue" fill="#1565C0" radius={[4, 4, 0, 0]} barSize={32} />
          <Line dataKey="target" name="Daily Target" stroke="#C9A84C" strokeDasharray="6 3" dot={false} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
