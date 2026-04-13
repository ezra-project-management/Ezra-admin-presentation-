'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/utils'

const SERVICE_NAMES: Record<string, string> = {
  'salon-spa': 'Salon & Spa', barbershop: 'Barbershop', gym: 'Fitness Centre',
  boardroom: 'Boardrooms', ballroom: 'Ballroom', 'banquet-hall': 'Banquet Hall',
  'swimming-pool': 'Swimming Pool',
}

const RESOURCES: Record<string, { name: string; capacity: number; status: string }[]> = {
  'salon-spa': [{ name: 'Suite 1', capacity: 2, status: 'available' }, { name: 'Suite 2', capacity: 2, status: 'in-use' }, { name: 'VIP Room', capacity: 4, status: 'available' }],
  barbershop: [{ name: 'Chair 1', capacity: 1, status: 'in-use' }, { name: 'Chair 2', capacity: 1, status: 'available' }, { name: 'Chair 3', capacity: 1, status: 'available' }],
  gym: [{ name: 'Main Floor', capacity: 50, status: 'available' }, { name: 'Studio A', capacity: 20, status: 'available' }, { name: 'Studio B', capacity: 15, status: 'maintenance' }],
  boardroom: [{ name: 'Board Room A', capacity: 12, status: 'in-use' }, { name: 'Board Room B', capacity: 8, status: 'available' }],
  ballroom: [{ name: 'Grand Ballroom', capacity: 200, status: 'maintenance' }],
  'banquet-hall': [{ name: 'Banquet Suite', capacity: 150, status: 'available' }, { name: 'Garden Area', capacity: 80, status: 'available' }],
  'swimming-pool': [{ name: 'Lane 1', capacity: 2, status: 'available' }, { name: 'Lane 2', capacity: 2, status: 'in-use' }, { name: 'Lane 3', capacity: 2, status: 'available' }, { name: 'Lane 4', capacity: 2, status: 'available' }],
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  available: { bg: 'bg-green-50', text: 'text-green-700', label: 'Available' },
  'in-use': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'In Use' },
  maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Maintenance' },
}

export default function ResourcesPage() {
  const params = useParams()
  const slug = params.service as string
  const name = SERVICE_NAMES[slug] || slug
  const resources = RESOURCES[slug] || []

  return (
    <div>
      <PageHeader title={`Resources — ${name}`} subtitle={`${resources.length} resources`} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(r => {
          const style = STATUS_STYLES[r.status] || STATUS_STYLES.available
          return (
            <div key={r.name} className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{r.name}</h4>
                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', style.bg, style.text)}>{style.label}</span>
              </div>
              <div className="text-xs text-gray-500">Capacity: {r.capacity}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
