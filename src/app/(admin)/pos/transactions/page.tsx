'use client'

import { useLayoutEffect, useMemo, useState } from 'react'
import { Eye, AlertOctagon, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_TRANSACTIONS, type Transaction } from '@/lib/mock-data'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { buildStringSlotRegistry, getMaskedCounterpartyLabel, shouldMaskCustomerPii } from '@/lib/customer-privacy'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [portalRole, setPortalRole] = useState<PortalRole | null>(null)

  useLayoutEffect(() => {
    setPortalRole(getSessionRole())
  }, [])

  const maskCustomerPii = shouldMaskCustomerPii(portalRole)
  const counterpartyRegistry = useMemo(
    () => buildStringSlotRegistry(transactions.map((t) => t.customer)),
    [transactions]
  )
  const [voidDialog, setVoidDialog] = useState<string | null>(null)
  const [voidReason, setVoidReason] = useState('')
  const [voidPin, setVoidPin] = useState(['', '', '', ''])

  const mpesaTotal = transactions.filter(t => t.method === 'MPESA' && t.status === 'COMPLETE').reduce((s, t) => s + t.total, 0)
  const cashTotal = transactions.filter(t => t.method === 'CASH' && t.status === 'COMPLETE').reduce((s, t) => s + t.total, 0)
  const grandTotal = transactions.filter(t => t.status === 'COMPLETE').reduce((s, t) => s + t.total, 0)

  const handleVoid = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'VOIDED' } : t))
    setVoidDialog(null)
    setVoidReason('')
    setVoidPin(['', '', '', ''])
    toast.success('Transaction voided')
  }

  return (
    <div>
      <PageHeader title="Transactions" subtitle="Point of sale transaction history" />

      {/* Summary bar */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-4 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div><div className="text-xs text-gray-500">Total Transactions</div><div className="text-lg font-bold">{transactions.length}</div></div>
          <div><div className="text-xs text-gray-500">M-Pesa Total</div><div className="text-lg font-bold text-green-700">{formatCurrency(mpesaTotal)}</div></div>
          <div><div className="text-xs text-gray-500">Cash Total</div><div className="text-lg font-bold">{formatCurrency(cashTotal)}</div></div>
          <div><div className="text-xs text-gray-500">Grand Total</div><div className="text-lg font-bold text-brand">{formatCurrency(grandTotal)}</div></div>
          <div className="flex items-end"><button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-[var(--btn-radius)] px-3 py-1.5 hover:bg-gray-50"><FileText className="w-3.5 h-3.5" />Export Z-Report</button></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ref#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date/Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cashier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                {maskCustomerPii ? 'Guest' : 'Customer'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map(txn => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{txn.reference}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(txn.createdAt)}</td>
                  <td className="px-4 py-3 text-sm">{txn.cashier}</td>
                  <td className="px-4 py-3 text-sm">
                    {getMaskedCounterpartyLabel(txn.customer, counterpartyRegistry, maskCustomerPii)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{txn.items[0]?.name}{txn.items.length > 1 ? ` +${txn.items.length - 1} more` : ''}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${txn.method === 'MPESA' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{txn.method}</span></td>
                  <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(txn.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={txn.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-brand rounded" aria-label="View"><Eye className="w-4 h-4" /></button>
                      {txn.status === 'COMPLETE' && (
                        <button onClick={() => setVoidDialog(txn.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded" aria-label="Void"><AlertOctagon className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Void dialog */}
      {voidDialog && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-[var(--shadow-modal)] p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Void Transaction?</h3>
            <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
            <textarea value={voidReason} onChange={e => setVoidReason(e.target.value)} placeholder="Reason for voiding (required)" rows={3} className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-200" />
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-2 block">Manager PIN</label>
              <div className="flex gap-2 justify-center">
                {voidPin.map((d, i) => (
                  <input key={i} type="password" maxLength={1} value={d} onChange={e => { const p = [...voidPin]; p[i] = e.target.value; setVoidPin(p); if (e.target.value && i < 3) (e.target.nextElementSibling as HTMLInputElement)?.focus() }} className="w-10 h-12 text-center border border-gray-200 rounded font-mono text-lg focus:outline-none focus:ring-2 focus:ring-red-200" />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setVoidDialog(null); setVoidReason(''); setVoidPin(['','','','']) }} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-[var(--btn-radius)] hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleVoid(voidDialog)} disabled={!voidReason.trim()} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-[var(--btn-radius)] hover:bg-red-700 disabled:opacity-50">Void Transaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
