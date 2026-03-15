'use client'

import { useState } from 'react'
import { Eye, LogIn, X } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_BOOKINGS, type Booking } from '@/lib/mock-data'
import { formatCurrency, formatDateTime, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { BookingFilters } from '@/components/bookings/BookingFilters'
import { BookingDetailDrawer } from '@/components/bookings/BookingDetailDrawer'

const SERVICE_COLORS: Record<string, string> = {
  'Salon & Spa': 'bg-teal-500',
  'Boardroom': 'bg-blue-500',
  'Ballroom': 'bg-amber-500',
  'Gym': 'bg-green-500',
  'Barbershop': 'bg-gray-700',
  'Swimming Pool': 'bg-cyan-500',
  'Banquet Hall': 'bg-orange-500',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    setSelectedBooking(prev => prev && prev.id === bookingId ? { ...prev, status: newStatus } : prev)
  }

  const openDrawer = (booking: Booking) => {
    setSelectedBooking(booking)
    setDrawerOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle={`${bookings.length} total bookings`}
        actions={
          <button className="bg-brand text-white px-4 py-2 rounded-[var(--btn-radius)] text-sm font-medium hover:bg-brand-light">
            + New Booking
          </button>
        }
      />
      <BookingFilters />

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openDrawer(booking)}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{booking.reference}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={booking.customer.name} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                        <div className="text-xs text-gray-400">{booking.customer.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', SERVICE_COLORS[booking.service] || 'bg-gray-400')} />
                      <span className="text-sm text-gray-700">{booking.service}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(booking.startAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(booking.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', booking.paymentMethod === 'MPESA' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600')}>
                      {booking.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openDrawer(booking)} className="p-1.5 text-gray-400 hover:text-brand rounded" aria-label="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {booking.status === 'CONFIRMED' && (
                        <button onClick={() => { handleStatusChange(booking.id, 'CHECKED_IN'); toast.success(`${booking.customer.name} checked in`) }} className="p-1.5 text-gray-400 hover:text-green-600 rounded" aria-label="Check in">
                          <LogIn className="w-4 h-4" />
                        </button>
                      )}
                      {!['CANCELLED', 'COMPLETED'].includes(booking.status) && (
                        <button onClick={() => { handleStatusChange(booking.id, 'CANCELLED'); toast.error('Booking cancelled') }} className="p-1.5 text-gray-400 hover:text-red-600 rounded" aria-label="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Showing 1–{bookings.length} of {bookings.length} results</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 rounded-[var(--btn-radius)] cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 rounded-[var(--btn-radius)] cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>

      <BookingDetailDrawer
        booking={selectedBooking}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
