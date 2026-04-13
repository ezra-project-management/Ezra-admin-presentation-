import type { Booking, StaffMember } from '@/lib/mock-data'

export function filterBookingsForStaffMember(bookings: Booking[], profile: StaffMember | null): Booking[] {
  if (!profile) return []
  if (profile.bookingAttribution === '__ALL__') return bookings
  return bookings.filter(b => b.staff === profile.bookingAttribution)
}
