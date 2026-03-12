'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { LiveBookingFeed } from '@/components/dashboard/LiveBookingFeed'
import { OccupancyGrid } from '@/components/dashboard/OccupancyGrid'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { AdminAIPanel } from '@/components/ai/AdminAIPanel'
import { CalendarDays, TrendingUp, BarChart3, Users, AlertCircle, UserCheck } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <PageHeader
          title="Good morning, James"
          subtitle="Here's what's happening at Ezra Annex today"
          actions={<div className="text-sm text-gray-500">Monday, 10 March 2026 · 09:15 AM</div>}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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
            title="Occupancy Rate"
            value="68%"
            icon={BarChart3}
            iconColor="text-teal-600"
            iconBg="bg-teal-50"
            accentColor="bg-teal-500"
            delta="12 of 18 resources"
            deltaType="neutral"
          />
          <StatCard
            title="Active Customers"
            value="18"
            icon={Users}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
            accentColor="bg-purple-500"
            delta="on-site now"
            deltaType="neutral"
          />
          <StatCard
            title="Pending Payments"
            value="3"
            icon={AlertCircle}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
            accentColor="bg-amber-500"
            delta="requires attention"
            deltaType="negative"
          />
          <StatCard
            title="Staff On Duty"
            value="6"
            icon={UserCheck}
            iconColor="text-navy"
            iconBg="bg-gray-100"
            accentColor="bg-navy"
            delta="of 8 scheduled"
            deltaType="neutral"
          />
        </div>

        {/* Revenue Chart */}
        <div className="mb-6">
          <RevenueChart />
        </div>

        {/* Two Column: Live Feed + Occupancy */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3">
            <LiveBookingFeed />
          </div>
          <div className="lg:col-span-2">
            <OccupancyGrid />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* AI Panel Sidebar */}
      <div className="w-96 flex-shrink-0 h-[calc(100vh-2rem)] sticky top-4">
        <AdminAIPanel />
      </div>
    </div>
  )
}
