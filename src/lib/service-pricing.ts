/** Demo menu pricing for admin AI context. Amounts are illustrative. */

export type PriceRow = { item: string; duration: string; price: number }

/** Must match ezra-web `src/lib/service-prices.ts` for demo parity. */
export const SERVICE_STARTING_PRICE_KES: Record<string, number> = {
  'salon-spa': 1800,
  barbershop: 850,
  gym: 1200,
  boardroom: 4500,
  ballroom: 85000,
  'banquet-hall': 35000,
  'swimming-pool': 2200,
}

export const PRICING_BY_SERVICE: Record<string, PriceRow[]> = {
  'salon-spa': [
    { item: 'Hair cut and style', duration: '60 min', price: 3500 },
    { item: 'Express facial', duration: '45 min', price: 4500 },
  ],
  barbershop: [
    { item: 'Haircut', duration: '45 min', price: 800 },
    { item: 'Haircut and beard', duration: '60 min', price: 1200 },
  ],
  gym: [
    { item: 'Day pass', duration: '1 day', price: 1200 },
    { item: 'Personal training', duration: '60 min', price: 3500 },
  ],
  boardroom: [
    { item: 'Boardroom A', duration: 'per hour', price: 5000 },
    { item: 'Half day package', duration: '4 hrs', price: 18000 },
  ],
  ballroom: [
    { item: 'Wedding package', duration: 'full day', price: 450000 },
    { item: 'Corporate gala', duration: 'evening', price: 280000 },
  ],
  'banquet-hall': [
    { item: 'Dinner package', duration: 'per guest', price: 4500 },
    { item: 'Cocktail reception', duration: '4 hrs', price: 120000 },
  ],
  'swimming-pool': [
    { item: 'Group lesson', duration: '45 min', price: 2500 },
    { item: 'Private coaching', duration: '60 min', price: 4000 },
  ],
}
