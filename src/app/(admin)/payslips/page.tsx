'use client'

import { useLayoutEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Printer } from 'lucide-react'
import { getSessionEmail, getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { getPayslipsForEmail, type PayslipDetail } from '@/lib/payroll-data'
import { formatCurrency } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'

function PayslipCard({ slip, defaultOpen }: { slip: PayslipDetail; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-[var(--shadow-card)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50/80 transition-colors"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{slip.period}</p>
          <p className="text-lg font-semibold text-gray-900 mt-0.5">Net {formatCurrency(slip.net)}</p>
          <p className="text-xs text-gray-500 mt-1">Paid {slip.payDate}</p>
        </div>
        <span className="text-sm font-medium text-[var(--color-brand)]">{open ? 'Hide detail' : 'View payslip'}</span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-2 space-y-4 print:block">
          <div className="flex flex-wrap justify-between gap-4 border-b border-dashed border-gray-200 pb-4">
            <div>
              <p className="text-xs text-gray-500">Employee</p>
              <p className="font-semibold text-gray-900">{slip.employeeName}</p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{slip.employeeEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Title</p>
              <p className="font-medium text-gray-800">{slip.jobTitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 mb-2">Earnings</p>
              <ul className="space-y-1.5">
                {slip.earnings.map((line) => (
                  <li key={line.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{line.label}</span>
                    <span className="tabular-nums font-medium text-gray-900">{formatCurrency(line.amount)}</span>
                  </li>
                ))}
                <li className="flex justify-between text-sm pt-2 border-t border-gray-100 font-semibold">
                  <span>Gross</span>
                  <span className="tabular-nums">{formatCurrency(slip.gross)}</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-900 mb-2">Deductions</p>
              <ul className="space-y-1.5">
                {slip.deductions.map((line) => (
                  <li key={line.label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{line.label}</span>
                    <span className="tabular-nums font-medium text-amber-900">{formatCurrency(line.amount)}</span>
                  </li>
                ))}
                <li className="flex justify-between text-sm pt-2 border-t border-gray-100 font-semibold text-amber-950">
                  <span>Total deductions</span>
                  <span className="tabular-nums">{formatCurrency(slip.totalDeductions)}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-navy/[0.04] border border-navy/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-navy">Net pay</span>
            <span className="text-xl font-bold text-navy tabular-nums">{formatCurrency(slip.net)}</span>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Ezra Center · Demo payslip · Questions? Contact Finance. This is not a legal tax document.
          </p>
        </div>
      )}
    </div>
  )
}

export default function PayslipsPage() {
  const router = useRouter()
  const [role, setRole] = useState<PortalRole | null>(null)
  const [email, setEmail] = useState('')

  useLayoutEffect(() => {
    const r = getSessionRole()
    const e = getSessionEmail()
    setRole(r)
    setEmail(e)
    if (r && !['STAFF', 'MANAGER', 'FINANCE', 'SUPER_ADMIN'].includes(r)) {
      router.replace('/dashboard')
    }
  }, [router])

  const slips = useMemo(() => (email ? getPayslipsForEmail(email) : []), [email])

  if (role && !['STAFF', 'MANAGER', 'FINANCE', 'SUPER_ADMIN'].includes(role)) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-sm text-gray-500">
        Redirecting…
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="My payslips"
        subtitle="Your earnings, statutory deductions, and net pay — same structure Finance uses for the full roster."
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-[var(--btn-radius)] border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 print:hidden"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        }
      />

      {slips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-10 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">No payslip on file for this login</p>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Use a named staff or leadership email (e.g. grace.m@ezracenter.com or admin@ezracenter.com) to see demo payslips.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {slips.map((slip, i) => (
            <PayslipCard key={slip.id} slip={slip} defaultOpen={i === 0} />
          ))}
        </div>
      )}
    </div>
  )
}
