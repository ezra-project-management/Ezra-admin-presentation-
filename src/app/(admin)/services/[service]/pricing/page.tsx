'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatCurrency } from '@/lib/utils'

const SERVICE_NAMES: Record<string, string> = {
  'salon-spa': 'Salon & Spa', barbershop: 'Barbershop', gym: 'Fitness Centre',
  boardroom: 'Boardrooms', ballroom: 'Ballroom', 'banquet-hall': 'Banquet Hall',
  'swimming-pool': 'Swimming Pool',
}

const PRICING: Record<string, { item: string; duration: string; price: number }[]> = {
  'salon-spa': [{ item: 'Hair Styling', duration: '1 hr', price: 2500 }, { item: 'Facial Treatment', duration: '45 min', price: 2500 }, { item: 'Head Massage', duration: '30 min', price: 1000 }, { item: 'Manicure', duration: '30 min', price: 1500 }, { item: 'Pedicure', duration: '45 min', price: 1800 }],
  barbershop: [{ item: 'Haircut', duration: '30 min', price: 800 }, { item: 'Beard Trim', duration: '15 min', price: 500 }, { item: 'Haircut + Beard', duration: '45 min', price: 1200 }, { item: 'Hot Towel Shave', duration: '20 min', price: 600 }],
  gym: [{ item: 'Day Pass', duration: 'Full day', price: 1200 }, { item: 'Monthly Membership', duration: '30 days', price: 8000 }, { item: 'Personal Training', duration: '1 hr', price: 3000 }],
  boardroom: [{ item: 'Half Day', duration: '4 hrs', price: 12000 }, { item: 'Full Day', duration: '8 hrs', price: 20000 }],
  ballroom: [{ item: 'Ballroom Hire', duration: 'Full day', price: 120000 }],
  'banquet-hall': [{ item: 'Banquet Suite', duration: 'Full day', price: 65000 }, { item: 'Garden Area', duration: 'Full day', price: 40000 }],
  'swimming-pool': [{ item: 'Lane Booking', duration: '1 hr', price: 2500 }, { item: 'Coaching Session', duration: '1 hr', price: 3500 }],
}

export default function PricingPage() {
  const params = useParams()
  const slug = params.service as string
  const name = SERVICE_NAMES[slug] || slug
  const items = PRICING[slug] || []

  return (
    <div>
      <PageHeader title={`Pricing — ${name}`} subtitle={`${items.length} pricing items`} />
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service Item</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.item} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.item}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.duration}</td>
                <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(item.price)}</td>
                <td className="px-4 py-3 text-center"><span className="bg-green-50 text-green-700 text-[10px] font-medium px-2 py-0.5 rounded-full">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
