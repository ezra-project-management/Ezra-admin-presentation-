'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, DollarSign, Star } from 'lucide-react'
import { MOCK_BOOKINGS } from '@/lib/mock-data'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

const SERVICE_NAMES: Record<string, string> = {
  'salon-spa': 'Salon & Spa', barbershop: 'Barbershop', gym: 'Fitness Centre',
  boardroom: 'Boardrooms', ballroom: 'Ballroom', 'banquet-hall': 'Banquet Hall',
  'swimming-pool': 'Swimming Pool', rooms: 'Accommodation',
}

export default function ServicePage() {
  const params = useParams()
  const slug = params.service as string
  const name = SERVICE_NAMES[slug] || slug

  const tabs = [
    { label: 'Overview', href: `/services/${slug}` },
    { label: 'Resources', href: `/services/${slug}/resources` },
    { label: 'Pricing', href: `/services/${slug}/pricing` },
    { label: 'Schedule', href: `/services/${slug}/schedule` },
  ]

  const bookings = MOCK_BOOKINGS.filter(b => b.service === name).slice(0, 5)

  return (
    <div>
      <PageHeader title={name} subtitle="Service management" />
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab, i) => (
          <Link key={tab.href} href={tab.href} className={cn('px-4 py-3 text-sm font-medium', i === 0 ? 'border-b-2 border-brand text-brand' : 'text-gray-500 hover:text-gray-700')}>
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Today's Bookings" value={String(bookings.length)} icon={CalendarDays} iconColor="text-blue-600" iconBg="bg-blue-50" accentColor="bg-blue-500" />
        <StatCard title="Revenue This Month" value={formatCurrency(bookings.reduce((s, b) => s + b.amount, 0) * 4)} icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-50" accentColor="bg-green-500" />
        <StatCard title="Avg Rating" value="4.7 / 5.0" icon={Star} iconColor="text-amber-600" iconBg="bg-amber-50" accentColor="bg-amber-500" />
      </div>
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-4 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-900">Recent Bookings</h3></div>
        <table className="w-full">
          <thead><tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No bookings for this service</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{b.customer.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{formatDate(b.startAt)}</td>
                <td className="px-4 py-2"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-2 text-sm font-medium text-right">{formatCurrency(b.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-gray-100 text-center">
          <Link href="/bookings" className="text-xs text-brand font-medium hover:underline">View all bookings →</Link>
        </div>
      </div>
    </div>
  )
}
