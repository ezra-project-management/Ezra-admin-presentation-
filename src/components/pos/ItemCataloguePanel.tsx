'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CatalogueItem {
  name: string
  category: string
  price: number
}

const CATALOGUE: CatalogueItem[] = [
  { name: 'Hair Styling', category: 'Salon', price: 2500 },
  { name: 'Facial Treatment', category: 'Salon', price: 2500 },
  { name: 'Head Massage', category: 'Salon', price: 1000 },
  { name: 'Manicure', category: 'Salon', price: 1500 },
  { name: 'Pedicure', category: 'Salon', price: 1800 },
  { name: 'Haircut', category: 'Barbershop', price: 800 },
  { name: 'Beard Trim', category: 'Barbershop', price: 500 },
  { name: 'Haircut + Beard', category: 'Barbershop', price: 1200 },
  { name: 'Hot Towel Shave', category: 'Barbershop', price: 600 },
  { name: 'Day Pass', category: 'Gym', price: 1200 },
  { name: 'Monthly Membership', category: 'Gym', price: 8000 },
  { name: 'Personal Training', category: 'Gym', price: 3000 },
  { name: 'Boardroom - Half Day', category: 'Events', price: 12000 },
  { name: 'Boardroom - Full Day', category: 'Events', price: 20000 },
  { name: 'Ballroom Hire', category: 'Events', price: 120000 },
  { name: 'Standard Room', category: 'Rooms', price: 8000 },
  { name: 'Deluxe Room', category: 'Rooms', price: 12000 },
  { name: 'Suite', category: 'Rooms', price: 17000 },
  { name: 'Catering Package', category: 'Add-ons', price: 5000 },
  { name: 'Photography', category: 'Add-ons', price: 15000 },
  { name: 'Parking Pass', category: 'Add-ons', price: 500 },
]

const CATEGORIES = ['All', 'Salon', 'Barbershop', 'Gym', 'Events', 'Rooms', 'Add-ons']

interface ItemCataloguePanelProps {
  onAddItem: (item: CatalogueItem) => void
}

export function ItemCataloguePanel({ onAddItem }: ItemCataloguePanelProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [flashId, setFlashId] = useState<string | null>(null)

  const filtered = CATALOGUE.filter(item => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const handleAdd = (item: CatalogueItem) => {
    onAddItem(item)
    setFlashId(item.name)
    setTimeout(() => setFlashId(null), 300)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 text-base bg-gray-50 border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
        <div className="flex gap-1.5 mt-3 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                activeCategory === cat ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(item => (
            <button
              key={item.name}
              onClick={() => handleAdd(item)}
              className={cn(
                'text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-brand hover:shadow-sm transition-all',
                flashId === item.name && 'bg-brand-muted border-brand'
              )}
            >
              <div className="text-[10px] uppercase text-gray-400 tracking-wider">{item.category}</div>
              <div className="text-sm font-medium text-gray-900 mt-0.5">{item.name}</div>
              <div className="text-base font-bold text-gray-900 mt-1">KES {item.price.toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
