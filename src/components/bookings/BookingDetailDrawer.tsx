'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { type Booking } from '@/lib/mock-data'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Avatar } from '@/components/ui/Avatar'
import { BookingStatusTimeline } from './BookingStatusTimeline'
import {
  buildClientPrivacyRegistry,
  getCustomerPresentation,
  type ClientPrivacyRegistry,
} from '@/lib/customer-privacy'

interface BookingDetailDrawerProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (bookingId: string, newStatus: string) => void
  /** When true, guest legal name and contact fields are hidden (staff role). */
  maskCustomerPii?: boolean
  /** Required for consistent Client N / CLI labels when masking. */
  privacyRegistry?: ClientPrivacyRegistry | null
}

export function BookingDetailDrawer({
  booking,
  open,
  onOpenChange,
  onStatusChange,
  maskCustomerPii = false,
  privacyRegistry = null,
}: BookingDetailDrawerProps) {
  if (!booking) return null

  const registry = privacyRegistry ?? buildClientPrivacyRegistry([booking])
  const pres = getCustomerPresentation(booking, registry, Boolean(maskCustomerPii))

  const handleCheckIn = () => {
    onStatusChange?.(booking.id, 'CHECKED_IN')
    toast.success(`${pres.toastLabel} checked in successfully`)
  }

  const handleComplete = () => {
    onStatusChange?.(booking.id, 'COMPLETED')
    toast.success('Booking marked as complete')
  }

  const handleCancel = () => {
    onStatusChange?.(booking.id, 'CANCELLED')
    toast.success('Cancellation recorded')
    onOpenChange(false)
  }

  const startDate = new Date(booking.startAt)
  const endDate = new Date(booking.endAt)
  const durationMs = endDate.getTime() - startDate.getTime()
  const durationHrs = Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10

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

            {maskCustomerPii && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50/90 px-3 py-2.5 text-[13px] text-emerald-950 mb-4">
                <Shield className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" aria-hidden />
                <p>
                  <span className="font-semibold">Confidentiality mode.</span> Guest contact details are restricted on
                  staff accounts. Use reference and internal ID only.
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 mt-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {maskCustomerPii ? 'Guest' : 'Customer'}
              </h4>
              <div className="flex items-center gap-3">
                <Avatar name={pres.avatarLabel} size="lg" />
                <div>
                  <div className="font-semibold text-gray-900">{pres.displayName}</div>
                  <div className="text-xs text-gray-500 font-mono">{pres.detailLine}</div>
                  {pres.secondaryLine && (
                    <div className="text-xs text-gray-500">{pres.secondaryLine}</div>
                  )}
                  {maskCustomerPii && pres.userId && (
                    <div className="text-[11px] text-gray-400 mt-1">Booking ref · {booking.reference}</div>
                  )}
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
                  <p className="font-medium text-gray-900">
                    {formatTime(booking.startAt)} – {formatTime(booking.endAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-900">{formatCurrency(booking.amount)}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    booking.paymentMethod === 'MPESA' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
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
              <button
                onClick={handleCheckIn}
                className="w-full py-2.5 bg-brand text-white font-medium rounded-[var(--btn-radius)] hover:bg-brand-light transition-colors"
              >
                Check In Guest
              </button>
            )}
            {booking.status === 'CHECKED_IN' && (
              <button
                onClick={handleComplete}
                className="w-full py-2.5 bg-green-600 text-white font-medium rounded-[var(--btn-radius)] hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
            )}
            {!['CANCELLED', 'COMPLETED'].includes(booking.status) && (
              <button
                onClick={handleCancel}
                className="w-full py-2 border border-red-200 text-red-600 font-medium rounded-[var(--btn-radius)] hover:bg-red-50 transition-colors"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
