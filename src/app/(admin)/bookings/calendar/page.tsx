'use client'

import { useState, useMemo, useLayoutEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { OCCUPANCY_DATA } from '@/lib/mock-data'
import { useBookings } from '@/context/bookings-context'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn, formatTime } from '@/lib/utils'
import { getSessionEmail, getSessionRole } from '@/lib/admin-session'
import { getStaffProfileByEmail } from '@/lib/roles'
import { filterBookingsForStaffMember } from '@/lib/staff-bookings'
import { buildClientPrivacyRegistry, getCustomerPresentation, shouldMaskCustomerPii } from '@/lib/customer-privacy'
import type { PortalRole } from '@/lib/roles'

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7am to 8pm

const SERVICE_COLORS: Record<string, { bg: string; border: string }> = {
  'Salon & Spa': { bg: 'bg-teal-100', border: 'border-teal-500' },
  'Boardroom': { bg: 'bg-blue-100', border: 'border-blue-500' },
  'Ballroom': { bg: 'bg-amber-100', border: 'border-amber-500' },
  'Gym': { bg: 'bg-green-100', border: 'border-green-500' },
  'Barbershop': { bg: 'bg-gray-200', border: 'border-gray-600' },
  'Swimming Pool': { bg: 'bg-cyan-100', border: 'border-cyan-500' },
  'Banquet Hall': { bg: 'bg-orange-100', border: 'border-orange-500' },
}

// Map bookings to resources
const RESOURCE_NAMES = OCCUPANCY_DATA.map(o => o.resource)

export default function CalendarPage() {
  const { bookings } = useBookings()
  const [view, setView] = useState<'day' | 'week'>('day')
  const [portalRole, setPortalRole] = useState<PortalRole | null>(null)
  const [staffEmail, setStaffEmail] = useState('')

  useLayoutEffect(() => {
    setPortalRole(getSessionRole())
    setStaffEmail(getSessionEmail())
  }, [])

  const visibleBookings = useMemo(() => {
    const role = portalRole
    if (role === 'STAFF') {
      const profile = getStaffProfileByEmail(staffEmail)
      if (profile) return filterBookingsForStaffMember(bookings, profile)
    }
    return bookings
  }, [bookings, portalRole, staffEmail])

  const privacyRegistry = useMemo(() => buildClientPrivacyRegistry(visibleBookings), [visibleBookings])
  const maskCustomerPii = shouldMaskCustomerPii(portalRole)

  const getBookingsForResource = (resource: string) => visibleBookings.filter((b) => b.resource === resource)

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Resource schedule view" />

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-gray-200 rounded-[var(--btn-radius)] text-gray-600 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-[var(--btn-radius)] text-sm font-medium text-gray-700 hover:bg-gray-50">
              Today
            </button>
            <button className="p-1.5 border border-gray-200 rounded-[var(--btn-radius)] text-gray-600 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-900 ml-2">Tuesday, 10 March 2026</span>
          </div>
          <div className="flex border border-gray-200 rounded-[var(--btn-radius)] overflow-hidden">
            <button onClick={() => setView('day')} className={cn('px-3 py-1.5 text-xs font-medium', view === 'day' ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-50')}>Day</button>
            <button onClick={() => setView('week')} className={cn('px-3 py-1.5 text-xs font-medium', view === 'week' ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-50')}>Week</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header row */}
            <div className="flex border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10">
              <div className="w-44 shrink-0 px-4 py-3 text-xs font-semibold text-gray-500 uppercase border-r border-gray-200">
                Resource
              </div>
              {HOURS.map(hour => (
                <div key={hour} className="flex-1 px-2 py-3 text-xs text-gray-500 text-center border-r border-gray-100 min-w-[60px]">
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>
              ))}
            </div>

            {/* Resource rows */}
            {RESOURCE_NAMES.map(resource => {
              const resourceBookings = getBookingsForResource(resource)
              return (
                <div key={resource} className="flex border-b border-gray-100 relative" style={{ minHeight: 64 }}>
                  <div className="w-44 shrink-0 px-4 py-3 text-xs font-medium text-gray-700 border-r border-gray-200 bg-white sticky left-0 z-[5] flex items-center">
                    {resource}
                  </div>
                  <div className="flex-1 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {HOURS.map(hour => (
                        <div key={hour} className="flex-1 border-r border-gray-50 min-w-[60px]" />
                      ))}
                    </div>
                    {/* Booking blocks */}
                    {resourceBookings.map(booking => {
                      const start = new Date(booking.startAt)
                      const end = new Date(booking.endAt)
                      const startHour = start.getUTCHours() + start.getUTCMinutes() / 60
                      const endHour = end.getUTCHours() + end.getUTCMinutes() / 60
                      const left = ((startHour - 7) / 14) * 100
                      const width = ((endHour - startHour) / 14) * 100
                      const colors = SERVICE_COLORS[booking.service] || { bg: 'bg-gray-100', border: 'border-gray-400' }
                      const pres = getCustomerPresentation(booking, privacyRegistry, maskCustomerPii)

                      if (left < 0 || left > 100) return null

                      return (
                        <div
                          key={booking.id}
                          className={cn('absolute top-1 bottom-1 rounded-md px-2 py-1 border-l-2 cursor-pointer hover:opacity-80 overflow-hidden', colors.bg, colors.border)}
                          style={{ left: `${Math.max(0, left)}%`, width: `${Math.min(width, 100 - left)}%` }}
                          title={`${pres.displayName} · ${booking.service}\n${formatTime(booking.startAt)} - ${formatTime(booking.endAt)}`}
                        >
                          <div className="text-[10px] font-medium text-gray-900 truncate">{pres.displayName}</div>
                          <div className="text-[9px] text-gray-500 truncate">{formatTime(booking.startAt)} - {formatTime(booking.endAt)}</div>
                        </div>
                      )
                    })}
                    {resourceBookings.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] text-gray-300">Available</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
