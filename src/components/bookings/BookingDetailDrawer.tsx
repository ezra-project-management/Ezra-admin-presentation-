'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { type Booking } from '@/lib/mock-data'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { BookingStatusTimeline } from './BookingStatusTimeline'
import type { PortalRole } from '@/lib/roles'
import {
  guestAvatarSeed,
  guestDisplayEmail,
  guestDisplayName,
  guestDisplayPhone,
} from '@/lib/client-privacy'

interface BookingDetailDrawerProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (bookingId: string, newStatus: string) => void
  portalRole?: PortalRole | null
  ordinalMap?: Map<string, number>
}

export function BookingDetailDrawer({
  booking,
  open,
  onOpenChange,
  onStatusChange,
  portalRole = null,
  ordinalMap = new Map(),
}: BookingDetailDrawerProps) {
  if (!booking) return null

  const displayName = guestDisplayName(booking, portalRole, ordinalMap)
  const displayEmail = guestDisplayEmail(booking, portalRole)
  const displayPhone = guestDisplayPhone(booking, portalRole)
  const avatarSeed = guestAvatarSeed(booking, portalRole, ordinalMap)

  const handleCheckIn = () => {
    onStatusChange?.(booking.id, 'CHECKED_IN')
    toast.success(`${displayName} checked in`)
  }

  const handleComplete = () => {
    onStatusChange?.(booking.id, 'COMPLETED')
    toast.success('Booking marked as complete')
  }

  const handleCancel = () => {
    onStatusChange?.(booking.id, 'CANCELLED')
    toast.error('Booking cancelled')
  }

  const startDate = new Date(booking.startAt)
  const endDate = new Date(booking.endAt)
  const durationMs = endDate.getTime() - startDate.getTime()
  const durationHrs = Math.round(durationMs / (1000 * 60 * 60) * 10) / 10

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 z-50" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
          <Dialog.Title className="sr-only">Booking Details</Dialog.Title>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-gray-500">{booking.reference}</span>
              <StatusBadge status={booking.status} />
            </div>
            <Dialog.Close className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <BookingStatusTimeline currentStatus={booking.status} />

            <div className="border-t border-gray-100 pt-4 mt-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Guest</h4>
              <div className="flex items-center gap-3">
                <Avatar name={avatarSeed} size="lg" />
                <div>
                  <div className="font-semibold text-gray-900">{displayName}</div>
                  <div className="text-xs text-gray-500">{displayEmail}</div>
                  <div className="text-xs text-gray-500">{displayPhone}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Service Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400 text-xs">Service</span>
                  <p className="font-medium text-gray-900">{booking.service}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Resource</span>
                  <p className="font-medium text-gray-900">{booking.resource}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Staff</span>
                  <p className="font-medium text-gray-900">{booking.staff}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Duration</span>
                  <p className="font-medium text-gray-900">{durationHrs}hrs</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Date</span>
                  <p className="font-medium text-gray-900">{formatDate(booking.startAt)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-xs">Time</span>
                  <p className="font-medium text-gray-900">{formatTime(booking.startAt)} – {formatTime(booking.endAt)}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-900">{formatCurrency(booking.amount)}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${booking.paymentMethod === 'MPESA' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {booking.paymentMethod}
                </span>
              </div>
              {booking.mpesaRef && (
                <div className="text-xs text-gray-500">
                  M-Pesa Ref: <span className="font-mono text-gray-700">{booking.mpesaRef}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
            {booking.status === 'CONFIRMED' && (
              <button onClick={handleCheckIn} className="w-full py-2.5 bg-brand text-white font-medium rounded-[var(--btn-radius)] hover:bg-brand-light transition-colors">
                Check in guest
              </button>
            )}
            {booking.status === 'CHECKED_IN' && (
              <button onClick={handleComplete} className="w-full py-2.5 bg-green-600 text-white font-medium rounded-[var(--btn-radius)] hover:bg-green-700 transition-colors">
                Mark Complete
              </button>
            )}
            {!['CANCELLED', 'COMPLETED'].includes(booking.status) && (
              <button onClick={handleCancel} className="w-full py-2 border border-red-200 text-red-600 font-medium rounded-[var(--btn-radius)] hover:bg-red-50 transition-colors">
                Cancel Booking
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
