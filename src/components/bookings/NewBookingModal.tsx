'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_STAFF } from '@/lib/mock-data'
import {
  BOOKING_SERVICE_OPTIONS,
  defaultAmountForSlug,
  optionForSlug,
  type BookingServiceSlug,
} from '@/lib/booking-service-options'
import { useBookings } from '@/context/bookings-context'
import { formatCurrency } from '@/lib/utils'

const STAFF_LIST = MOCK_STAFF.filter((s) => s.bookingAttribution !== '__ALL__')

function staffOptionsForSlug(slug: BookingServiceSlug) {
  const match = STAFF_LIST.filter((s) => s.departments.includes(slug))
  return match.length ? match : STAFF_LIST
}

function toIsoFromLocal(datetimeLocal: string): string {
  const d = new Date(datetimeLocal)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function addHoursIso(iso: string, hours: number): string {
  const d = new Date(iso)
  d.setMinutes(d.getMinutes() + Math.round(hours * 60))
  return d.toISOString()
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewBookingModal({ open, onOpenChange }: Props) {
  const { addBooking } = useBookings()

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [slug, setSlug] = useState<BookingServiceSlug>('salon-spa')
  const [resource, setResource] = useState<string>(optionForSlug('salon-spa').defaultResource)
  const [staffName, setStaffName] = useState(() => staffOptionsForSlug('salon-spa')[0]?.bookingAttribution ?? '')
  const [startLocal, setStartLocal] = useState('')
  const [amount, setAmount] = useState(defaultAmountForSlug('salon-spa'))
  const [payment, setPayment] = useState<'MPESA' | 'CASH' | 'PENDING'>('MPESA')
  const [mpesaRef, setMpesaRef] = useState('')

  const opt = optionForSlug(slug)
  const staffChoices = useMemo(() => staffOptionsForSlug(slug), [slug])

  useEffect(() => {
    if (!open) return
    const o = optionForSlug(slug)
    setResource(o.defaultResource)
    setAmount(defaultAmountForSlug(slug))
    const first = staffOptionsForSlug(slug)[0]
    if (first) setStaffName(first.bookingAttribution)
  }, [slug, open])

  useEffect(() => {
    if (!open) return
    const now = new Date()
    now.setMinutes(now.getMinutes() - (now.getTimezoneOffset()))
    const local = new Date(now.getTime() + 60 * 60 * 1000)
    const pad = (n: number) => String(n).padStart(2, '0')
    const v = `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}`
    setStartLocal(v)
  }, [open])

  useEffect(() => {
    const first = staffChoices[0]
    if (first && !staffChoices.some((s) => s.bookingAttribution === staffName)) {
      setStaffName(first.bookingAttribution)
    }
  }, [staffChoices, staffName])

  const reset = () => {
    setCustomerName('')
    setPhone('')
    setEmail('')
    setSlug('salon-spa')
    setResource(optionForSlug('salon-spa').defaultResource)
    setStaffName(staffOptionsForSlug('salon-spa')[0]?.bookingAttribution ?? '')
    setAmount(defaultAmountForSlug('salon-spa'))
    setPayment('MPESA')
    setMpesaRef('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = customerName.trim()
    if (name.length < 2) {
      toast.error('Enter the guest name.')
      return
    }
    if (!phone.trim()) {
      toast.error('Enter a phone number.')
      return
    }
    if (!startLocal) {
      toast.error('Choose date and time.')
      return
    }
    const startAt = toIsoFromLocal(startLocal)
    const endAt = addHoursIso(startAt, opt.durationHrs)
    const status = payment === 'PENDING' ? 'PENDING' : 'CONFIRMED'

    const created = addBooking({
      customer: { name, email: email.trim() || `${phone.trim()}@guest.local`, phone: phone.trim() },
      service: opt.label,
      resource: resource.trim() || opt.defaultResource,
      staff: staffName,
      startAt,
      endAt,
      status,
      amount: Math.max(0, Math.round(Number(amount)) || 0),
      paymentMethod: payment,
      mpesaRef: payment === 'MPESA' && mpesaRef.trim() ? mpesaRef.trim() : null,
    })
    toast.success(`Booking ${created.reference} created`)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] w-[min(100%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">New booking</Dialog.Title>
              <p className="text-sm text-gray-500 mt-0.5">
                Creates a reservation with today&apos;s starting price for that line. Payment can be marked pending for
                pay-at-desk guests.
              </p>
            </div>
            <Dialog.Close className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[min(70vh,560px)] overflow-y-auto pr-1">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600">Guest name *</label>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
                  placeholder="e.g. Jane Muthoni"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Phone *</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
                  placeholder="+254…"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Service line *</label>
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value as BookingServiceSlug)}
                className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
              >
                {BOOKING_SERVICE_OPTIONS.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.label} · from {formatCurrency(defaultAmountForSlug(o.slug))}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-400 mt-1">
                Duration preset: {opt.durationHrs}h — adjust times below if needed via amount.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Resource / room</label>
                <input
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                  className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Assigned staff *</label>
                <select
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
                >
                  {staffChoices.map((s) => (
                    <option key={s.id} value={s.bookingAttribution}>
                      {s.name} ({s.bookingAttribution})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">Start *</label>
              <input
                type="datetime-local"
                required
                value={startLocal}
                onChange={(e) => setStartLocal(e.target.value)}
                className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Amount (KSh) *</label>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Payment *</label>
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value as typeof payment)}
                  className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="MPESA">M-Pesa (paid)</option>
                  <option value="CASH">Cash (paid)</option>
                  <option value="PENDING">Pending / pay at desk</option>
                </select>
              </div>
            </div>

            {payment === 'MPESA' && (
              <div>
                <label className="text-xs font-medium text-gray-600">M-Pesa ref (optional)</label>
                <input
                  value={mpesaRef}
                  onChange={(e) => setMpesaRef(e.target.value)}
                  className="mt-1 w-full rounded-[var(--input-radius)] border border-gray-200 px-3 py-2 text-sm font-mono"
                  placeholder="QJK…"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-[var(--btn-radius)] hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-[var(--btn-radius)] hover:bg-brand-light"
              >
                Create booking
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
