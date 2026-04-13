'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MOCK_BOOKINGS, type StaffMember } from '@/lib/mock-data'
import { filterBookingsForStaffMember } from '@/lib/staff-bookings'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { CalendarDays, Clock, XCircle, ArrowRight } from 'lucide-react'

type StaffDashboardProps = {
  profile: StaffMember
}

export function StaffDashboard({ profile }: StaffDashboardProps) {
  const mine = useMemo(() => filterBookingsForStaffMember(MOCK_BOOKINGS, profile), [profile])
  const upcoming = useMemo(
    () =>
      mine
        .filter(b => !['CANCELLED', 'COMPLETED'].includes(b.status))
        .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
    [mine]
  )
  const todayCount = upcoming.filter(b => b.startAt.startsWith('2026-03-10')).length

  return (
    <div>
      <PageHeader
        title={`Hi, ${profile.name.split(' ')[0]}`}
        subtitle="Your assigned sessions only — check guests in, complete, or cancel when needed"
        actions={
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            Manage my bookings
            <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      <div className="rounded-md border border-slate-200 bg-slate-50 text-slate-700 text-[13px] px-4 py-3 mb-6 leading-relaxed">
        <span className="font-medium text-slate-900">Access scope · Staff</span>
        <span className="text-slate-600">
          {' '}
          — Only sessions assigned to you (or the full demo sample if you use the generic staff login). Revenue totals, other providers&apos; calendars,
          and user administration are not shown.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="My sessions today"
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
          value={String(mine.filter(b => b.status === 'CANCELLED').length)}
          icon={XCircle}
          iconColor="text-gray-600"
          iconBg="bg-gray-100"
          accentColor="bg-gray-500"
          delta="historical"
          deltaType="neutral"
        />
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
            {upcoming.slice(0, 8).map(b => (
              <li key={b.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 hover:bg-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-900">{b.customer.name}</div>
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
