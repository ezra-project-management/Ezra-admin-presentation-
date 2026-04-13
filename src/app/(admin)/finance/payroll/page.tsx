'use client'

import { useLayoutEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet } from 'lucide-react'
import { getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { getPayrollRoster, getPayrollTotals } from '@/lib/payroll-data'
import { formatCurrency } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'

export default function PayrollPage() {
  const router = useRouter()
  const [role, setRole] = useState<PortalRole | null>(null)

  useLayoutEffect(() => {
    const r = getSessionRole()
    setRole(r)
    if (r && r !== 'FINANCE' && r !== 'SUPER_ADMIN') {
      router.replace('/finance')
    }
  }, [router])

  const rows = useMemo(() => getPayrollRoster(), [])
  const totals = useMemo(() => getPayrollTotals(rows), [rows])

  if (role && role !== 'FINANCE' && role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-sm text-gray-500">
        Redirecting…
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Payroll roster"
        subtitle="March 2026 — gross salary, statutory deductions, and net pay for every team member, including managers and leadership."
      />

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total gross</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(totals.gross)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total deductions</p>
          <p className="mt-1 text-xl font-bold text-amber-800">{formatCurrency(totals.deductions)}</p>
        </div>
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Net payroll</p>
          <p className="mt-1 text-xl font-bold text-emerald-900">{formatCurrency(totals.net)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">All employees ({rows.length})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/90 border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Gross</th>
                <th className="px-4 py-3 text-right">Deductions</th>
                <th className="px-4 py-3 text-right">Net pay</th>
                <th className="px-4 py-3">Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{r.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {r.roleLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(r.grossSalary)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-amber-800">{formatCurrency(r.deductions)}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-900">
                    {formatCurrency(r.netPay)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.periodLabel}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-semibold">
                <td colSpan={3} className="px-4 py-3 text-gray-700">
                  Totals
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(totals.gross)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-amber-900">{formatCurrency(totals.deductions)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-900">{formatCurrency(totals.net)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
