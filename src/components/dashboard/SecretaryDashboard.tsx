'use client'

import Link from 'next/link'
import { CalendarDays, ClipboardCheck, ListOrdered, PlusCircle, LogIn, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { LiveBookingFeed } from '@/components/dashboard/LiveBookingFeed'
import { StatCard } from '@/components/ui/StatCard'
import { WALK_IN_QUEUE } from '@/lib/mock-data'
import { useBookings } from '@/context/bookings-context'
import { formatTime } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'

/** Demo dataset anchor — matches mock bookings “today” in the presentation. */
const DEMO_TODAY = '2026-03-10'

export function SecretaryDashboard() {
  const { bookings } = useBookings()
  const waiting = WALK_IN_QUEUE.filter((q) => q.status === 'waiting').length
  const todayCount = bookings.filter((b) => b.startAt.startsWith(DEMO_TODAY)).length

  const arrivals = bookings
    .filter((b) => b.startAt.startsWith(DEMO_TODAY))
    .filter((b) => ['CONFIRMED', 'PENDING', 'CHECKED_IN'].includes(b.status))
    .sort((a, b) => a.startAt.localeCompare(b.startAt))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Front desk"
        subtitle="Check guests in when they arrive, mark complete when the service ends — same booking list as operations."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/bookings?new=1"
              className="inline-flex items-center gap-1.5 rounded-[var(--btn-radius)] bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-light"
            >
              <PlusCircle className="h-4 w-4" />
              New booking
            </Link>
            <Link
              href="/bookings/queue"
              className="inline-flex items-center gap-1.5 rounded-[var(--btn-radius)] border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            >
              <ListOrdered className="h-4 w-4" />
              Walk-in queue
            </Link>
            <Link
              href="/bookings"
              className="inline-flex items-center gap-1.5 rounded-[var(--btn-radius)] border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            >
              <ClipboardCheck className="h-4 w-4" />
              All bookings
            </Link>
          </div>
        }
      />

      <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-emerald-950 flex items-center gap-2">
          <LogIn className="h-4 w-4 text-emerald-700" />
          How check-in &amp; check-out work
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-emerald-950/90 list-decimal pl-5">
          <li>Open <strong>All bookings</strong> and find the guest (reference, name, or time).</li>
          <li>When they arrive: open the row → <strong>Check In Guest</strong> (they are on site).</li>
          <li>When the service finishes: <strong>Mark Complete</strong> (releases the slot in your workflow).</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Waiting in queue"
          value={waiting}
          icon={ListOrdered}
          iconColor="text-amber-700"
          iconBg="bg-amber-50"
          accentColor="bg-amber-400"
          delta="demo data"
          deltaType="neutral"
        />
        <StatCard
          title="Bookings (demo day)"
          value={todayCount}
          icon={CalendarDays}
          iconColor="text-[var(--color-brand)]"
          iconBg="bg-[var(--color-brand-muted)]"
          accentColor="bg-[var(--color-brand)]"
          delta="Mar 10 snapshot"
          deltaType="neutral"
        />
      </div>

      <div className="rounded-2xl border border-gray-200/90 bg-white shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Today&apos;s arrivals · {DEMO_TODAY}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Tap a booking in All Bookings to check in or complete.</p>
          </div>
          <Link href="/bookings" className="text-xs font-medium text-brand hover:underline">
            Open list →
          </Link>
        </div>
        {arrivals.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-500">No active arrivals for this demo date.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {arrivals.map((b) => (
              <li key={b.id} className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-gray-50/80">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-gray-500">{b.reference}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{b.customer.name}</p>
                  <p className="text-xs text-gray-500">
                    {b.service} · {formatTime(b.startAt)} · {b.staff}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={b.status} />
                  {b.status === 'CHECKED_IN' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      On floor
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <LiveBookingFeed />
    </div>
  )
}
