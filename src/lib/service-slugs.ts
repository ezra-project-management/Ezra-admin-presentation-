/** Maps URL slug → exact `Booking.service` string in mock/API data. */
export const BOOKING_SERVICE_BY_SLUG: Record<string, string> = {
  'salon-spa': 'Salon & Spa',
  barbershop: 'Barbershop',
  gym: 'Gym',
  boardroom: 'Boardroom',
  ballroom: 'Ballroom',
  'banquet-hall': 'Banquet Hall',
  'swimming-pool': 'Swimming Pool',
}

/** Display title in headers (can differ from booking label, e.g. Fitness Centre vs Gym in data). */
export const SERVICE_DISPLAY_TITLE: Record<string, string> = {
  'salon-spa': 'Salon & Spa',
  barbershop: 'Barbershop',
  gym: 'Fitness Centre',
  boardroom: 'Boardrooms',
  ballroom: 'Ballroom',
  'banquet-hall': 'Banquet Hall',
  'swimming-pool': 'Swimming Pool',
}

export function serviceTitle(slug: string): string {
  return SERVICE_DISPLAY_TITLE[slug] || slug.replace(/-/g, ' ')
}

export function bookingServiceForSlug(slug: string): string {
  return BOOKING_SERVICE_BY_SLUG[slug] || serviceTitle(slug)
}
