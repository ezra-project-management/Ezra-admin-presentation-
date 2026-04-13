/** Maps admin URL slug to display title and to `Booking.service` labels in mock data. */

const SLUG_TO_TITLE: Record<string, string> = {
  'salon-spa': 'Salon & Spa',
  barbershop: 'Barbershop',
  gym: 'Gym',
  boardroom: 'Boardroom',
  ballroom: 'Ballroom',
  'banquet-hall': 'Banquet Hall',
  'swimming-pool': 'Swimming Pool',
}

const SLUG_TO_BOOKING_NAME: Record<string, string> = {
  'salon-spa': 'Salon & Spa',
  barbershop: 'Barbershop',
  gym: 'Gym',
  boardroom: 'Boardroom',
  ballroom: 'Ballroom',
  'banquet-hall': 'Banquet Hall',
  'swimming-pool': 'Swimming Pool',
}

export function serviceTitle(slug: string): string {
  return SLUG_TO_TITLE[slug] ?? titleCaseSlug(slug)
}

export function bookingServiceForSlug(slug: string): string {
  return SLUG_TO_BOOKING_NAME[slug] ?? serviceTitle(slug)
}

function titleCaseSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
