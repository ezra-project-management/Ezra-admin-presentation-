'use client'

import { Search, X } from 'lucide-react'

export type BookingsFilterValues = {
  search: string
  service: string
  status: string
  dateFrom: string
  dateTo: string
  customer: string
  staff: string
}

type BookingFiltersProps = {
  values: BookingsFilterValues
  onChange: (next: BookingsFilterValues) => void
  customerOptions: string[]
  staffOptions: string[]
  /** Staff role: hide provider filter (already scoped to you). */
  hideStaffFilter?: boolean
  /** Floor staff: hide guest picker (labels are Client 1, … — use search instead). */
  hideCustomerFilter?: boolean
  searchPlaceholder?: string
}

const SERVICES = ['Salon & Spa', 'Boardroom', 'Ballroom', 'Gym', 'Barbershop', 'Swimming Pool', 'Banquet Hall']

export function BookingFilters({
  values,
  onChange,
  customerOptions,
  staffOptions,
  hideStaffFilter,
  hideCustomerFilter,
  searchPlaceholder = 'Reference, customer, phone…',
}: BookingFiltersProps) {
  const patch = (partial: Partial<BookingsFilterValues>) => onChange({ ...values, ...partial })

  const clearFilters = () => {
    onChange({
      search: '',
      service: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      customer: '',
      staff: '',
    })
  }

  const hasActive =
    values.search ||
    values.service ||
    values.status ||
    values.dateFrom ||
    values.dateTo ||
    (!hideCustomerFilter && values.customer) ||
    values.staff

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-[var(--shadow-card)] p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={values.search}
            onChange={e => patch({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
        {!hideCustomerFilter && (
          <select
            value={values.customer}
            onChange={e => patch({ customer: e.target.value })}
            className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/20 min-w-[160px]"
          >
            <option value="">All guests</option>
            {customerOptions.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        {!hideStaffFilter && (
          <select
            value={values.staff}
            onChange={e => patch({ staff: e.target.value })}
            className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/20 min-w-[160px]"
          >
            <option value="">All staff</option>
            {staffOptions.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
        <select
          value={values.service}
          onChange={e => patch({ service: e.target.value })}
          className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="">All services</option>
          {SERVICES.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={values.status}
          onChange={e => patch({ status: e.target.value })}
          className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="">All statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input
          type="date"
          value={values.dateFrom}
          onChange={e => patch({ dateFrom: e.target.value })}
          className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600"
        />
        <input
          type="date"
          value={values.dateTo}
          onChange={e => patch({ dateTo: e.target.value })}
          className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600"
        />
        {hasActive && (
          <button type="button" onClick={clearFilters} className="text-sm text-brand hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
    </div>
  )
}

export const DEFAULT_BOOKING_FILTERS: BookingsFilterValues = {
  search: '',
  service: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  customer: '',
  staff: '',
}
