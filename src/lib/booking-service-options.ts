import { SERVICE_STARTING_PRICE_KES } from '@/lib/service-pricing'

/** Admin “new booking” form — aligns labels with `Booking.service` in mock data. */
export const BOOKING_SERVICE_OPTIONS = [
  { slug: 'salon-spa', label: 'Salon & Spa', defaultResource: 'Suite 1', durationHrs: 1.5 },
  { slug: 'barbershop', label: 'Barbershop', defaultResource: 'Chair 1', durationHrs: 0.75 },
  { slug: 'gym', label: 'Gym', defaultResource: 'Main Gym Floor', durationHrs: 1.5 },
  { slug: 'boardroom', label: 'Boardroom', defaultResource: 'Board Room A', durationHrs: 4 },
  { slug: 'ballroom', label: 'Ballroom', defaultResource: 'Grand Ballroom', durationHrs: 7 },
  { slug: 'banquet-hall', label: 'Banquet Hall', defaultResource: 'Banquet Suite', durationHrs: 5 },
  { slug: 'swimming-pool', label: 'Swimming Pool', defaultResource: 'Lane 1', durationHrs: 1 },
] as const

export type BookingServiceSlug = (typeof BOOKING_SERVICE_OPTIONS)[number]['slug']

/** Meeting & event spaces — headcount and run-of-show matter for ops. */
export const VENUE_SERVICE_SLUGS: BookingServiceSlug[] = ['boardroom', 'ballroom', 'banquet-hall']

export function isVenueServiceSlug(slug: string): boolean {
  return (VENUE_SERVICE_SLUGS as readonly string[]).includes(slug)
}

export function defaultExpectedGuestsForVenue(slug: BookingServiceSlug): number {
  if (slug === 'boardroom') return 12
  if (slug === 'ballroom') return 120
  if (slug === 'banquet-hall') return 80
  return 1
}

export function maxGuestsForVenue(slug: BookingServiceSlug): number {
  if (slug === 'boardroom') return 40
  if (slug === 'ballroom') return 500
  if (slug === 'banquet-hall') return 150
  return 999
}

export function defaultAmountForSlug(slug: BookingServiceSlug): number {
  return SERVICE_STARTING_PRICE_KES[slug] ?? 0
}

export function optionForSlug(slug: string) {
  return BOOKING_SERVICE_OPTIONS.find((o) => o.slug === slug) ?? BOOKING_SERVICE_OPTIONS[0]
}
