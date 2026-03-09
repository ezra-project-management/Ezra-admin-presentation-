'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface BookingFiltersProps {
  onFilterChange?: (filters: Record<string, string>) => void
}

export function BookingFilters({ onFilterChange }: BookingFiltersProps) {
  const [search, setSearch] = useState('')
  const [service, setService] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const clearFilters = () => {
    setSearch(''); setService(''); setStatus(''); setDateFrom(''); setDateTo('')
    onFilterChange?.({})
  }

  return (
    <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by reference or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
        <select
          value={service}
          onChange={e => setService(e.target.value)}
          className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="">All Services</option>
          <option>Salon & Spa</option>
          <option>Boardroom</option>
          <option>Ballroom</option>
          <option>Gym</option>
          <option>Barbershop</option>
          <option>Swimming Pool</option>
          <option>Accommodation</option>
          <option>Banquet Hall</option>
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="">All Statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600" />
        {(search || service || status || dateFrom || dateTo) && (
          <button onClick={clearFilters} className="text-sm text-brand hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
    </div>
  )
}
