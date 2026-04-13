'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { MOCK_TRANSACTIONS } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, CreditCard, FileSpreadsheet, Receipt, ArrowRight } from 'lucide-react'

export function FinanceHomeDashboard() {
  const complete = MOCK_TRANSACTIONS.filter(t => t.status === 'COMPLETE')
  const total = complete.reduce((s, t) => s + t.total, 0)

  return (
    <div>
      <PageHeader
        title="Finance desk"
        subtitle="Collections, reconciliation, and ledger view — no operational or HR admin tools"
        actions={<span className="text-[13px] text-slate-500">Read & export</span>}
      />

      <div className="rounded-md border border-slate-200 bg-slate-50 text-slate-700 text-[13px] px-4 py-3 mb-6 leading-relaxed">
        <span className="font-medium text-slate-900">Access scope · Finance</span>
        <span className="text-slate-600">
          {' '}
          — Revenue, payments, and transaction history. Operational booking tools and HR admin are not in this role; request detail from Operations when
          required.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Posted (demo sample)"
          value={formatCurrency(total)}
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          accentColor="bg-green-500"
          delta={`${complete.length} settled txs`}
          deltaType="positive"
        />
        <StatCard
          title="M-Pesa share"
          value="~92%"
          icon={CreditCard}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          accentColor="bg-blue-500"
          delta="of sample batch"
          deltaType="neutral"
        />
        <StatCard
          title="Exceptions"
          value="1"
          icon={Receipt}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          accentColor="bg-amber-500"
          delta="void / dispute"
          deltaType="negative"
        />
        <StatCard
          title="Exports"
          value="Ready"
          icon={FileSpreadsheet}
          iconColor="text-navy"
          iconBg="bg-gray-100"
          accentColor="bg-navy"
          delta="CSV / PDF"
          deltaType="neutral"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/finance/revenue"
          className="group bg-white rounded-lg border border-slate-200/90 shadow-[var(--shadow-card)] p-5 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Revenue</h3>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand" />
          </div>
          <p className="text-sm text-gray-500">Department breakdown, week vs month, charts.</p>
        </Link>
        <Link
          href="/finance/payments"
          className="group bg-white rounded-lg border border-slate-200/90 shadow-[var(--shadow-card)] p-5 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Payments</h3>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand" />
          </div>
          <p className="text-sm text-gray-500">Inbound, pending, and allocation status.</p>
        </Link>
        <Link
          href="/pos/transactions"
          className="group bg-white rounded-lg border border-slate-200/90 shadow-[var(--shadow-card)] p-5 hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">POS transactions</h3>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand" />
          </div>
          <p className="text-sm text-gray-500">Line-level sales for reconciliation.</p>
        </Link>
      </div>
    </div>
  )
}
