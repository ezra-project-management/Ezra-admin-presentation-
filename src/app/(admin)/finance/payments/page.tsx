'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { MOCK_TRANSACTIONS } from '@/lib/mock-data'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/utils'

export default function PaymentsPage() {
  const [methodFilter, setMethodFilter] = useState('')
  const [search, setSearch] = useState('')

  const filtered = MOCK_TRANSACTIONS.filter(t => {
    const matchMethod = !methodFilter || t.method === methodFilter
    const matchSearch = !search || t.reference.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase())
    return matchMethod && matchSearch
  })

  return (
    <div>
      <PageHeader title="Payments" subtitle="Payment audit trail" />
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-brand/20" />
          </div>
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="text-sm border border-gray-200 rounded-[7px] px-3 py-2 text-gray-600">
            <option value="">All Methods</option>
            <option value="MPESA">M-Pesa</option>
            <option value="CASH">Cash</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date/Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">M-Pesa Ref</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cashier</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(txn => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(txn.createdAt)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{txn.reference}</td>
                  <td className="px-4 py-3 text-sm">{txn.customer}</td>
                  <td className="px-4 py-3"><span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', txn.method === 'MPESA' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600')}>{txn.method}</span></td>
                  <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(txn.total)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{txn.mpesaRef || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={txn.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{txn.cashier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
