'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { LiveBookingFeed } from '@/components/dashboard/LiveBookingFeed'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { CalendarDays, TrendingUp, Users, AlertCircle } from 'lucide-react'

export function ManagerDashboard() {
  return (
    <div>
      <PageHeader
        title="Manager overview"
        subtitle="Run shifts, bookings, and teams — user administration stays with Super Admin"
        actions={
          <Link
            href="/finance"
            className="text-sm font-medium text-slate-700 border border-slate-200 rounded-md px-3 py-2 hover:bg-slate-50 transition-colors"
          >
            Finance desk
          </Link>
        }
      />

      <div className="rounded-md border border-slate-200 bg-slate-50 text-slate-700 text-[13px] px-4 py-3 mb-6 leading-relaxed">
        <span className="font-medium text-slate-900">Access scope · Manager</span>
        <span className="text-slate-600">
          {' '}
          — Operations, customers, staff, finance reports, and audit log. User provisioning is limited to{' '}
          <span className="font-medium text-slate-800">Super Admin</span> (System → Users & Roles).
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Bookings"
          value="24"
          icon={CalendarDays}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          accentColor="bg-blue-500"
          delta="+3 vs yesterday"
          deltaType="positive"
        />
        <StatCard
          title="Today's Revenue"
          value="KES 187,500"
          icon={TrendingUp}
          iconColor="text-green-600"
          iconBg="bg-green-50"
          accentColor="bg-green-500"
          delta="+12.4%"
          deltaType="positive"
        />
        <StatCard
          title="Customers in venue"
          value="18"
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          accentColor="bg-purple-500"
          delta="approx."
          deltaType="neutral"
        />
        <StatCard
          title="Follow-ups"
          value="3"
          icon={AlertCircle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          accentColor="bg-amber-500"
          delta="payments / no-shows"
          deltaType="negative"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <LiveBookingFeed />
        </div>
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-[var(--shadow-card)] p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Shift priorities</h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
            <li>Confirm ballroom setup for weekend holds</li>
            <li>Review barber queue at peak hours</li>
            <li>Reconcile M-Pesa exceptions from POS</li>
          </ul>
        </div>
      </div>

      <QuickActions />
    </div>
  )
}
