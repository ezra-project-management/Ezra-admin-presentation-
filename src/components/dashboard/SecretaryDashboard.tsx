'use client'

import Link from 'next/link'
import {
  CalendarDays,
  ClipboardCheck,
  ListOrdered,
  PlusCircle,
  LogIn,
  CheckCircle2,
  Users,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { LiveBookingFeed } from '@/components/dashboard/LiveBookingFeed'
import { StatCard } from '@/components/ui/StatCard'
import { WALK_IN_QUEUE } from '@/lib/mock-data'
import { useBookings } from '@/context/bookings-context'
import { formatTime } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'

/** Demo dataset anchor — matches mock bookings “today” in the presentation. */
const DEMO_TODAY = '2026-03-10'

const QUICK_LINKS = [
  { href: '/pos/new', label: 'New sale', icon: ShoppingCart, hint: 'POS' },
  { href: '/customers', label: 'Guest lookup', icon: Users, hint: 'CRM' },
  { href: '/communications/sms', label: 'Send SMS', icon: MessageSquare, hint: 'Outreach' },
  { href: '/analytics/occupancy', label: 'How busy?', icon: BarChart3, hint: 'Stats' },
] as const

export function SecretaryDashboard() {
  const { bookings } = useBookings()
  const waiting = WALK_IN_QUEUE.filter((q) => q.status === 'waiting').length
  const todayCount = bookings.filter((b) => b.startAt.startsWith(DEMO_TODAY)).length

  const arrivals = bookings
    .filter((b) => b.startAt.startsWith(DEMO_TODAY))
    .filter((b) => ['CONFIRMED', 'PENDING', 'CHECKED_IN'].includes(b.status))
    .sort((a, b) => a.startAt.localeCompare(b.startAt))

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-white to-violet-50/80 px-6 py-7 shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600/90">
              <Sparkles className="h-3.5 w-3.5" />
              Front desk
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-[1.65rem]">
              Everything you need in one place
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              Book visits, move walk-ins, check people in, and take payment — without hunting through the full console. Use the{' '}
              <span className="font-medium text-gray-800">three tiles</span> below for your most common tasks.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 lg:pt-1">
            {QUICK_LINKS.map(({ href, label, icon: Icon, hint }) => (
              <Link
                key={href}
                href={href}
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-3.5 py-2.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-sm transition hover:border-indigo-200 hover:bg-white hover:shadow-md"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span>{label}</span>
                  <span className="text-[10px] font-normal text-gray-400">{hint}</span>
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageHeader
        title="Run the floor"
        subtitle="Pick an action — the rest of the app stays out of your way in the sidebar."
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/bookings?new=1"
          className="group relative flex flex-col rounded-2xl border border-gray-200/90 bg-white p-5 shadow-[var(--shadow-card)] transition hover:border-[var(--color-brand)]/40 hover:shadow-lg"
        >
          <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-muted)] text-[var(--color-brand)]">
            <PlusCircle className="h-5 w-5" />
          </span>
          <h2 className="text-base font-semibold text-gray-900">Reserve a slot</h2>
          <p className="mt-1 flex-1 text-sm text-gray-500">Phone or walk-up — capture the guest, time, and service in one form.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand)]">
            Start booking
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link
          href="/bookings/queue"
          className="group relative flex flex-col rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/90 to-white p-5 shadow-sm transition hover:shadow-md"
        >
          <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <ListOrdered className="h-5 w-5" />
          </span>
          <h2 className="text-base font-semibold text-gray-900">Walk-in line</h2>
          <p className="mt-1 flex-1 text-sm text-gray-600">Barber queue: add names, assign chairs, mark done when finished.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-800">
            Open queue
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
        <Link
          href="/bookings"
          className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 shadow-sm transition hover:border-slate-300 hover:bg-white hover:shadow-md"
        >
          <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200/80 text-slate-800">
            <ClipboardCheck className="h-5 w-5" />
          </span>
          <h2 className="text-base font-semibold text-gray-900">Today&apos;s list</h2>
          <p className="mt-1 flex-1 text-sm text-gray-600">Search by reference or name — check in when they arrive, complete when they leave.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-800">
            View bookings
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/40 px-5 py-4">
        <h2 className="text-sm font-semibold text-emerald-950 flex items-center gap-2">
          <LogIn className="h-4 w-4 text-emerald-700" />
          Check-in in three taps
        </h2>
        <p className="mt-2 text-sm text-emerald-950/85">
          <strong className="font-semibold">All bookings</strong> → open the row →{' '}
          <strong className="font-semibold">Check in guest</strong> when they arrive →{' '}
          <strong className="font-semibold">Mark complete</strong> when the service ends.
        </p>
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
            <p className="text-xs text-gray-500 mt-0.5">Preview only — open the full list to take action.</p>
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
