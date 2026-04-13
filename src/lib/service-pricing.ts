/**
 * Canonical menu pricing (KES). Mirrors ezra-web `src/lib/service-pricing.ts` starting prices.
 * Admin service pricing UI imports rows from here — do not duplicate tables elsewhere.
 */

export type PriceRow = { item: string; duration: string; price: number }

export const PRICING_BY_SERVICE: Record<string, PriceRow[]> = {
  'salon-spa': [
    { item: 'Hair Styling', duration: '1 hr', price: 2500 },
    { item: 'Facial Treatment', duration: '45 min', price: 2500 },
    { item: 'Head Massage', duration: '30 min', price: 1000 },
    { item: 'Manicure', duration: '30 min', price: 1500 },
    { item: 'Pedicure', duration: '45 min', price: 1800 },
  ],
  barbershop: [
    { item: 'Haircut', duration: '30 min', price: 800 },
    { item: 'Beard Trim', duration: '15 min', price: 500 },
    { item: 'Haircut + Beard', duration: '45 min', price: 1200 },
    { item: 'Hot Towel Shave', duration: '20 min', price: 600 },
  ],
  gym: [
    { item: 'Day Pass', duration: 'Full day', price: 1200 },
    { item: 'Monthly Membership', duration: '30 days', price: 8000 },
    { item: 'Personal Training', duration: '1 hr', price: 3000 },
  ],
  boardroom: [
    { item: 'Half Day', duration: '4 hrs', price: 12000 },
    { item: 'Full Day', duration: '8 hrs', price: 20000 },
  ],
  ballroom: [{ item: 'Ballroom Hire', duration: 'Full day', price: 120000 }],
  'banquet-hall': [
    { item: 'Banquet Suite', duration: 'Full day', price: 65000 },
    { item: 'Garden Area', duration: 'Full day', price: 40000 },
  ],
  'swimming-pool': [
    { item: 'Lane Booking', duration: '1 hr', price: 2500 },
    { item: 'Coaching Session', duration: '1 hr', price: 3500 },
  ],
}

/** Minimum list price per service slug — same numbers as ezra-web SERVICE_STARTING_PRICE_KES */
export const SERVICE_STARTING_PRICE_KES: Record<string, number> = Object.fromEntries(
  Object.entries(PRICING_BY_SERVICE).map(([slug, rows]) => [
    slug,
    Math.min(...rows.map((r) => r.price)),
  ]),
)
