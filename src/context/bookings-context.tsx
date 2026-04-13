'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { MOCK_BOOKINGS, type Booking, type Customer } from '@/lib/mock-data'

function bookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `EZR-${s}`
}

function avatarFromName(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean)
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || 'G'
}

export type CreateBookingInput = {
  customer: Omit<Customer, 'avatar'>
  service: string
  resource: string
  staff: string
  startAt: string
  endAt: string
  status: string
  amount: number
  paymentMethod: string
  mpesaRef: string | null
}

type BookingsContextValue = {
  bookings: Booking[]
  addBooking: (input: CreateBookingInput) => Booking
  updateBookingStatus: (id: string, status: string) => void
}

const BookingsContext = createContext<BookingsContextValue | null>(null)

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(() => [...MOCK_BOOKINGS])

  const addBooking = useCallback((input: CreateBookingInput) => {
    const id = `bk-${Date.now()}`
    const reference = bookingReference()
    const createdAt = new Date().toISOString()
    const customer: Customer = {
      ...input.customer,
      avatar: avatarFromName(input.customer.name),
    }
    const row: Booking = {
      id,
      reference,
      customer,
      service: input.service,
      resource: input.resource,
      staff: input.staff,
      startAt: input.startAt,
      endAt: input.endAt,
      status: input.status,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      mpesaRef: input.mpesaRef,
      createdAt,
    }
    setBookings((prev) => [row, ...prev])
    return row
  }, [])

  const updateBookingStatus = useCallback((id: string, status: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }, [])

  const value = useMemo(
    () => ({ bookings, addBooking, updateBookingStatus }),
    [bookings, addBooking, updateBookingStatus]
  )

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
}

export function useBookings(): BookingsContextValue {
  const ctx = useContext(BookingsContext)
  if (!ctx) {
    throw new Error('useBookings must be used within BookingsProvider')
  }
  return ctx
}
