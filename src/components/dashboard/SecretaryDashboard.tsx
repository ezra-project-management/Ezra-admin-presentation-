'use client'

import Link from 'next/link'
import { CalendarDays, ListOrdered } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { LiveBookingFeed } from '@/components/dashboard/LiveBookingFeed'
import { StatCard } from '@/components/ui/StatCard'
import { MOCK_BOOKINGS, WALK_IN_QUEUE } from '@/lib/mock-data'

export function SecretaryDashboard() {
  const waiting = WALK_IN_QUEUE.filter((q) => q.status === 'waiting').length
  const today = MOCK_BOOKINGS.filter((b) => b.startAt.startsWith('2026-03-10')).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Front desk"
        subtitle="Walk-ins, arrivals, and the live booking list for today."
        actions={
          <Link
            href="/bookings/queue"
            className="inline-flex items-center gap-1.5 rounded-[var(--btn-radius)] border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
          >
            <ListOrdered className="h-4 w-4" />
            Walk-in queue
          </Link>
        }
      />

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
          value={today}
          icon={CalendarDays}
          iconColor="text-[var(--color-brand)]"
          iconBg="bg-[var(--color-brand-muted)]"
          accentColor="bg-[var(--color-brand)]"
          delta="Mar 10 snapshot"
          deltaType="neutral"
        />
      </div>

      <LiveBookingFeed />
    </div>
  )
}
