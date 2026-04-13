'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { REVENUE_BY_SERVICE } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

const total = REVENUE_BY_SERVICE.reduce((sum, item) => sum + item.value, 0)
const totalLabel =
  total >= 1_000_000
    ? `KES ${(total / 1_000_000).toFixed(2)}M`
    : `KES ${(total / 1_000).toFixed(0)}K`

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { service: string; value: number } }> }) {
  if (!active || !payload?.[0]) return null
  const data = payload[0].payload
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <p className="text-sm font-medium text-gray-900">{data.service}</p>
      <p className="text-xs text-gray-600">{formatCurrency(data.value)}</p>
      <p className="text-xs text-gray-400">{((data.value / total) * 100).toFixed(1)}%</p>
    </div>
  )
}

export function ServicePieChart() {
  return (
    <div className="w-full min-h-[240px] min-w-0">
      <div className="relative h-[240px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={REVENUE_BY_SERVICE}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              paddingAngle={2}
            >
              {REVENUE_BY_SERVICE.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-gray-400">Total</span>
          <span className="text-lg font-bold text-gray-900">{totalLabel}</span>
        </div>
      </div>
      <div className="space-y-2 mt-4">
        {REVENUE_BY_SERVICE.map(item => (
          <div key={item.service} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-gray-700">{item.service}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">{formatCurrency(item.value)}</span>
              <span className="text-xs text-gray-400 w-10 text-right">{((item.value / total) * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
