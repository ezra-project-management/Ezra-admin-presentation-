'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, CreditCard, Users, ClipboardList } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { OccupancyGrid } from '@/components/dashboard/OccupancyGrid'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { LiveBookingFeed } from '@/components/dashboard/LiveBookingFeed'
import { ServicePieChart } from '@/components/charts/ServicePieChart'
import { MOCK_CUSTOMERS } from '@/lib/mock-data'
import { useBookings } from '@/context/bookings-context'
import { formatCurrency } from '@/lib/utils'

function AdminHomeDashboard({ variant }: { variant: 'super' | 'manager' }) {
  const { bookings } = useBookings()
  const demoDay = '2026-03-10'
  const bookingsToday = bookings.filter((b) => b.startAt.startsWith(demoDay)).length
  const weekRevenue = bookings.filter((b) => b.status !== 'CANCELLED').reduce((s, b) => s + b.amount, 0)
  const pending = bookings.filter((b) => b.status === 'PENDING').length

  const title = variant === 'super' ? 'Operations overview' : 'Venue overview'
  const subtitle =
    variant === 'super'
      ? 'Live signals for bookings, revenue, and resources across Ezra Center.'
      : 'Your shift at a glance: bookings, revenue, and floor status.'

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 rounded-[var(--btn-radius)] bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--color-brand-light)]"
          >
            All bookings
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Bookings today"
          value={bookingsToday}
          icon={CalendarDays}
          iconColor="text-[var(--color-brand)]"
          iconBg="bg-[var(--color-brand-muted)]"
          accentColor="bg-[var(--color-brand)]"
          delta="demo calendar date"
          deltaType="neutral"
        />
        <StatCard
          title="Pipeline value"
          value={formatCurrency(weekRevenue)}
          icon={CreditCard}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-50"
          accentColor="bg-emerald-500"
          delta="confirmed + open"
          deltaType="neutral"
        />
        <StatCard
          title="Members on file"
          value={MOCK_CUSTOMERS.length}
          icon={Users}
          iconColor="text-amber-700"
          iconBg="bg-amber-50"
          accentColor="bg-[var(--color-gold)]"
          delta="CRM"
          deltaType="neutral"
        />
        <StatCard
          title="Pending payment"
          value={pending}
          icon={ClipboardList}
          iconColor="text-orange-700"
          iconBg="bg-orange-50"
          accentColor="bg-orange-400"
          delta="needs follow-up"
          deltaType="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-6 shadow-[0_4px_24px_-4px_rgba(15,44,74,0.1)]">
          <div className="pointer-events-none absolute -left-4 bottom-0 h-28 w-28 rounded-full bg-[#C9A84C]/10 blur-2xl" />
          <h3 className="relative mb-1 text-base font-semibold tracking-tight text-slate-900">Revenue by category</h3>
          <p className="relative mb-4 text-xs text-slate-500">Share of billings in the demo period</p>
          <ServicePieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OccupancyGrid />
        <LiveBookingFeed />
      </div>
    </div>
  )
}

export function SuperAdminDashboard() {
  return <AdminHomeDashboard variant="super" />
}

export function ManagerDashboard() {
  return <AdminHomeDashboard variant="manager" />
}
