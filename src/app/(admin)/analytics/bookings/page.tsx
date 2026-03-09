'use client'

import { CalendarDays, XCircle, DollarSign, Users } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { REVENUE_BY_SERVICE } from '@/lib/mock-data'

const DAILY_BOOKINGS = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  bookings: Math.floor(Math.random() * 10) + 3,
}))

export default function BookingTrendsPage() {
  return (
    <div>
      <PageHeader title="Booking Trends" subtitle="Booking analytics and insights" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total This Month" value="42" icon={CalendarDays} iconColor="text-blue-600" iconBg="bg-blue-50" accentColor="bg-blue-500" delta="+8 vs last month" deltaType="positive" />
        <StatCard title="Cancellation Rate" value="4.2%" icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50" accentColor="bg-red-500" delta="-1.3% improvement" deltaType="positive" />
        <StatCard title="Avg Booking Value" value="KES 12,500" icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-50" accentColor="bg-green-500" delta="+5.2%" deltaType="positive" />
        <StatCard title="Repeat Customers" value="68%" icon={Users} iconColor="text-purple-600" iconBg="bg-purple-50" accentColor="bg-purple-500" delta="of total bookings" deltaType="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Daily Bookings (March 2026)</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY_BOOKINGS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="day" fontSize={11} tickLine={false} />
                <YAxis fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Line type="monotone" dataKey="bookings" stroke="#1565C0" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Bookings by Service</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_BY_SERVICE} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis type="number" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="service" fontSize={11} tickLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {REVENUE_BY_SERVICE.map((entry, i) => (
                    <Bar key={i} dataKey="value" fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
