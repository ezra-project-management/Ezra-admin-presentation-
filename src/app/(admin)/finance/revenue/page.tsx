'use client'

import { useState } from 'react'
import { TrendingUp, Smartphone, Banknote, Clock, FileText, Download } from 'lucide-react'
import { REVENUE_BY_SERVICE } from '@/lib/mock-data'
import { formatCurrency, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { RevenueBarChart } from '@/components/charts/RevenueBarChart'
import { ServicePieChart } from '@/components/charts/ServicePieChart'

const DATE_TABS = ['Today', 'This Week', 'This Month', 'Custom']

export default function RevenuePage() {
  const [activeTab, setActiveTab] = useState('This Week')
  const total = REVENUE_BY_SERVICE.reduce((s, item) => s + item.value, 0)

  return (
    <div>
      <PageHeader title="Revenue" subtitle="Financial overview" />

      <div className="flex gap-2 mb-6">
        {DATE_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', activeTab === tab ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value="KES 910,500" icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-50" accentColor="bg-green-500" delta="+18.2%" deltaType="positive" />
        <StatCard title="M-Pesa Revenue" value="KES 834,000" icon={Smartphone} iconColor="text-blue-600" iconBg="bg-blue-50" accentColor="bg-blue-500" delta="91.6% of total" deltaType="neutral" />
        <StatCard title="Cash Revenue" value="KES 76,500" icon={Banknote} iconColor="text-gray-600" iconBg="bg-gray-100" accentColor="bg-gray-500" delta="8.4% of total" deltaType="neutral" />
        <StatCard title="Pending" value="KES 24,000" icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" accentColor="bg-amber-500" delta="3 invoices" deltaType="negative" />
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Revenue This Week</h3>
            <p className="text-xs text-gray-400 mt-0.5">Mar 4 – Mar 10, 2026</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-[7px] px-3 py-1.5 hover:bg-gray-50">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
        <RevenueBarChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue by Service</h3>
          <ServicePieChart />
        </div>
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Top Services</h3>
          <div className="space-y-4">
            {[...REVENUE_BY_SERVICE].sort((a, b) => b.value - a.value).map(item => {
              const pct = (item.value / total * 100)
              return (
                <div key={item.service}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{item.service}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                      <span className="text-xs text-gray-400 w-10 text-right">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: item.fill }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-[7px] px-4 py-2 hover:bg-gray-50">
          <FileText className="w-4 h-4" /> Export Revenue Report (PDF)
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-[7px] px-4 py-2 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export Raw Data (CSV)
        </button>
      </div>
    </div>
  )
}
