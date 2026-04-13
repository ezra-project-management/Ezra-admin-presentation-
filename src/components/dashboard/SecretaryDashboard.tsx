'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MOCK_BOOKINGS, WALK_IN_QUEUE } from '@/lib/mock-data'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { CalendarDays, ListOrdered, MessageSquare, Users, UserCheck } from 'lucide-react'

/** Demo “today” aligned with mock bookings and queue timestamps */
const DEMO_TODAY = '2026-03-10'

export function SecretaryDashboard() {
  const todayBookings = useMemo(
    () =>
      MOCK_BOOKINGS.filter(b => b.startAt.startsWith(DEMO_TODAY)).sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      ),
    []
  )
  const waitingWalkIns = useMemo(() => WALK_IN_QUEUE.filter(q => q.status === 'waiting').length, [])

  return (
    <div>
      <PageHeader
        title="Front desk"
        subtitle="Who is arriving, who is waiting, and where to tap next — names stay visible here on purpose"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/bookings/queue"
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
            >
              Walk-in queue
              <ListOrdered className="w-4 h-4" />
            </Link>
            <Link
              href="/bookings"
              className="inline-flex items-center gap-1.5 text-sm font-medium border border-slate-200 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              All bookings
            </Link>
          </div>
        }
      />

      <div className="rounded-md border border-slate-200 bg-slate-50 text-slate-700 text-[13px] px-4 py-3 mb-6 leading-relaxed">
        <span className="font-medium text-slate-900">What you can reach</span>
        <span className="text-slate-600">
          {' '}
          — Bookings, the line, customer records, the team list, and SMS tools. Tills, revenue analytics, and system admin stay with other roles.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="On the diary today"
          value={String(todayBookings.length)}
          icon={CalendarDays}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          accentColor="bg-blue-500"
          delta="demo date"
          deltaType="neutral"
        />
        <StatCard
          title="Walk-ins waiting"
          value={String(waitingWalkIns)}
          icon={ListOrdered}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          accentColor="bg-amber-500"
          delta="barbershop"
          deltaType="neutral"
        />
        <StatCard
          title="Customer records"
          value="Open"
          icon={Users}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          accentColor="bg-violet-500"
          delta="CRM"
          deltaType="neutral"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Link
          href="/customers"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] hover:border-slate-300 transition-colors"
        >
          <Users className="w-5 h-5 text-slate-500 mb-2" />
          <h3 className="text-sm font-semibold text-slate-900">Customers</h3>
          <p className="text-xs text-slate-600 mt-1">Look up contact history, loyalty, and last visit before you greet someone at the door.</p>
        </Link>
        <Link
          href="/communications/sms"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] hover:border-slate-300 transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-slate-500 mb-2" />
          <h3 className="text-sm font-semibold text-slate-900">SMS centre</h3>
          <p className="text-xs text-slate-600 mt-1">Send a quick confirmation or “we’re ready for you” without leaving this desk.</p>
        </Link>
        <Link
          href="/staff"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] hover:border-slate-300 transition-colors md:col-span-2"
        >
          <UserCheck className="w-5 h-5 text-slate-500 mb-2" />
          <h3 className="text-sm font-semibold text-slate-900">Team on duty</h3>
          <p className="text-xs text-slate-600 mt-1">See who is in which department before you route a guest or a walk-in.</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200/90 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Next on site (today)</h3>
          <Link href="/bookings/calendar" className="text-xs text-brand font-medium hover:underline">
            Calendar
          </Link>
        </div>
        {todayBookings.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">Nothing on the demo diary for this date.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {todayBookings.map(b => (
              <li key={b.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 hover:bg-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-900">{b.customer.name}</div>
                  <div className="text-xs text-gray-500">
                    {b.service} · {b.staff}
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
