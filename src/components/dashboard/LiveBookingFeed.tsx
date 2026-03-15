'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MOCK_BOOKINGS } from '@/lib/mock-data'
import { formatTime, cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'

const SERVICE_COLORS: Record<string, string> = {
  'Salon & Spa': 'bg-teal-500',
  'Boardroom': 'bg-blue-500',
  'Ballroom': 'bg-amber-500',
  'Gym': 'bg-green-500',
  'Barbershop': 'bg-gray-700',
  'Swimming Pool': 'bg-cyan-500',
  'Banquet Hall': 'bg-orange-500',
}

export function LiveBookingFeed() {
  return (
    <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">Live Bookings</h3>
          <span className="flex items-center gap-1.5 text-xs text-green-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Real-time
          </span>
        </div>
      </div>
      <div className="space-y-0 divide-y divide-gray-100">
        {MOCK_BOOKINGS.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 py-3 cursor-pointer group"
          >
            <span className={cn(
              'w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-150',
              SERVICE_COLORS[booking.service] || 'bg-gray-400'
            )} />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 text-xs font-medium flex items-center justify-center shrink-0 group-hover:shadow-md transition-shadow">
              {booking.customer.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 group-hover:text-brand transition-colors">{booking.customer.name}</span>
              <span className="text-xs text-gray-400 ml-2">{booking.service}</span>
            </div>
            <span className="text-xs text-gray-400 shrink-0">{formatTime(booking.startAt)}</span>
            <StatusBadge status={booking.status} />
          </motion.div>
        ))}
      </div>
      <Link href="/bookings" className="block text-center text-sm font-medium text-brand hover:text-brand-light hover:underline mt-4 pt-3 border-t border-gray-100 transition-colors">
        View All Bookings →
      </Link>
    </div>
  )
}
