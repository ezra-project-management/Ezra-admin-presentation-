'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MOCK_BOOKINGS, type Booking, type StaffMember } from '@/lib/mock-data'
import { filterBookingsForStaffMember } from '@/lib/staff-bookings'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { CalendarDays, Clock, XCircle, ArrowRight, Banknote, Sparkles } from 'lucide-react'

/** Demo: service credit attributed to provider after paid / completed session. */
const SERVICE_CREDIT_RATE = 0.12

type StaffDashboardProps = {
  profile: StaffMember
}

function guestLabelForStaff(b: Booking): string {
  return `Guest · ${b.reference}`
}

export function StaffDashboard({ profile }: StaffDashboardProps) {
  const mine = useMemo(() => filterBookingsForStaffMember(MOCK_BOOKINGS, profile), [profile])
  const upcoming = useMemo(
    () =>
      mine
        .filter((b) => !['CANCELLED', 'COMPLETED'].includes(b.status))
        .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
    [mine]
  )
  const paidCompleted = useMemo(
    () =>
      mine.filter(
        (b) =>
          b.status === 'COMPLETED' &&
          (b.paymentMethod === 'MPESA' || b.paymentMethod === 'CASH') &&
          b.amount > 0
      ),
    [mine]
  )

  const creditTotal = useMemo(
    () => paidCompleted.reduce((s, b) => s + Math.round(b.amount * SERVICE_CREDIT_RATE), 0),
    [paidCompleted]
  )

  const todayCount = upcoming.filter((b) => b.startAt.startsWith('2026-03-10')).length

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hi, ${profile.name.split(' ')[0]}`}
        subtitle="Your lane only — names are masked on this screen until guests check in at the desk."
        actions={
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            Session list
            <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/80 text-emerald-950 text-[13px] px-4 py-3 leading-relaxed">
        <span className="font-medium">Privacy:</span> you see service, time, and reference. Guest legal names are
        hidden here by design — same standard as premium hotel back-of-house tools.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Sessions today"
          value={String(todayCount)}
          icon={CalendarDays}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          accentColor="bg-blue-500"
          delta="demo date"
          deltaType="neutral"
        />
        <StatCard
          title="Open / active"
          value={String(upcoming.length)}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          accentColor="bg-amber-500"
          delta="needs action"
          deltaType="neutral"
        />
        <StatCard
          title="Cancelled (mine)"
          value={String(mine.filter((b) => b.status === 'CANCELLED').length)}
          icon={XCircle}
          iconColor="text-gray-600"
          iconBg="bg-gray-100"
          accentColor="bg-gray-500"
          delta="historical"
          deltaType="neutral"
        />
      </div>

      {/* Paid work — service credit preview */}
      <div className="rounded-xl border border-gold/25 bg-gradient-to-br from-amber-50/90 to-white shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-gold/15 flex items-center justify-between gap-2 flex-wrap bg-white/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-gray-900">Paid & completed — your service line</h3>
          </div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full">
            Demo credit {Math.round(SERVICE_CREDIT_RATE * 100)}% of bill
          </span>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Credit from completed services</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(creditTotal)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Shown after payment clears — ties to the service name below.</p>
            </div>
            <Banknote className="w-10 h-10 text-gold/80 opacity-90 hidden sm:block" />
          </div>
          {paidCompleted.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No completed paid sessions in the demo window yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
              {paidCompleted.slice(0, 6).map((b) => (
                <li key={b.id} className="px-3 py-3 flex flex-wrap items-center justify-between gap-2 bg-white/90 hover:bg-gray-50/90">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{b.service}</div>
                    <div className="text-xs text-gray-500">{b.resource}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(b.startAt)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">{formatCurrency(b.amount)} paid</div>
                    <div className="text-xs font-semibold text-emerald-700">
                      Your line: {formatCurrency(Math.round(b.amount * SERVICE_CREDIT_RATE))}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{guestLabelForStaff(b)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200/90 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Upcoming for you</h3>
          <Link href="/bookings/calendar" className="text-xs text-brand font-medium hover:underline">
            Calendar
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">No upcoming sessions assigned to you.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {upcoming.slice(0, 8).map((b) => (
              <li key={b.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 hover:bg-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-900">{guestLabelForStaff(b)}</div>
                  <div className="text-xs text-gray-500">
                    {b.service} · {b.resource}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(b.startAt)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">{formatCurrency(b.amount)}</span>
                  <StatusBadge status={b.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
