import type { Booking, StaffMember } from '@/lib/mock-data'

/** Sessions shown to a staff login; demo profile may see all bookings. */
export function filterBookingsForStaffMember(bookings: Booking[], profile: StaffMember): Booking[] {
  if (profile.bookingAttribution === '__ALL__') return bookings
  return bookings.filter((b) => b.staff === profile.bookingAttribution)
}
