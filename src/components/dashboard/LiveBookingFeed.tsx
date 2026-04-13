'use client'

import Link from 'next/link'
import { useLayoutEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useBookings } from '@/context/bookings-context'
import { formatTime, cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { buildClientPrivacyRegistry, getCustomerPresentation, shouldMaskCustomerPii } from '@/lib/customer-privacy'

const SERVICE_COLORS: Record<string, string> = {
  'Salon & Spa': 'bg-teal-500',
  Boardroom: 'bg-blue-500',
  Ballroom: 'bg-amber-500',
  Gym: 'bg-green-500',
  Barbershop: 'bg-gray-700',
  'Swimming Pool': 'bg-cyan-500',
  'Banquet Hall': 'bg-orange-500',
}

export function LiveBookingFeed() {
  const { bookings, updateBookingStatus } = useBookings()
  const [portalRole, setPortalRole] = useState<PortalRole | null>(null)

  useLayoutEffect(() => {
    setPortalRole(getSessionRole())
  }, [])

  const maskCustomerPii = shouldMaskCustomerPii(portalRole)
  const privacyRegistry = useMemo(() => buildClientPrivacyRegistry(bookings), [bookings])

  const cancelBooking = (id: string, ref: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm(`Cancel booking ${ref}? Guest will be notified in production.`)) return
    updateBookingStatus(id, 'CANCELLED')
    toast.success('Booking cancelled')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/30 to-[#eff6ff]/50 p-6 shadow-[0_4px_24px_-4px_rgba(15,44,74,0.1)] card-hover">
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-500/5 blur-2xl" />
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight text-slate-900">Live Bookings</h3>
          <span className="flex items-center gap-1.5 text-xs text-green-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Real-time
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Front desk can cancel a reservation using the stop control — same list as All Bookings.
      </p>
      <div className="space-y-0 divide-y divide-gray-100">
        {bookings.map((booking, i) => {
          const pres = getCustomerPresentation(booking, privacyRegistry, maskCustomerPii)
          return (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
            className="flex items-center gap-3 py-3 group"
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-150',
                SERVICE_COLORS[booking.service] || 'bg-gray-400'
              )}
            />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 text-xs font-medium flex items-center justify-center shrink-0 group-hover:shadow-md transition-shadow">
              {maskCustomerPii ? pres.avatarLabel.slice(0, 3) : booking.customer.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-900 group-hover:text-brand transition-colors">
                {pres.displayName}
              </span>
              {maskCustomerPii && (
                <span className="text-xs text-gray-500 ml-2 tabular-nums">{pres.detailLine}</span>
              )}
              <span className="text-xs text-gray-400 ml-2">{booking.service}</span>
            </div>
            <span className="text-xs text-gray-400 shrink-0">{formatTime(booking.startAt)}</span>
            <StatusBadge status={booking.status} />
            {!['CANCELLED', 'COMPLETED'].includes(booking.status) && (
              <button
                type="button"
                onClick={(e) => cancelBooking(booking.id, booking.reference, e)}
                className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Cancel booking"
                aria-label={`Cancel booking ${booking.reference}`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
          )
        })}
      </div>
      <Link
        href="/bookings"
        className="block text-center text-sm font-medium text-brand hover:text-brand-light hover:underline mt-4 pt-3 border-t border-gray-100 transition-colors"
      >
        View All Bookings →
      </Link>
    </div>
  )
}
