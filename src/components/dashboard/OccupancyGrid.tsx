'use client'

import { useLayoutEffect, useState } from 'react'
import { OCCUPANCY_DATA } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { maskOccupancyCurrentLabel, shouldMaskCustomerPii } from '@/lib/customer-privacy'

const statusStyles: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  occupied: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Occupied', dot: 'bg-blue-500' },
  available: { bg: 'bg-green-50', text: 'text-green-700', label: 'Available', dot: 'bg-green-500' },
  maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Maintenance', dot: 'bg-amber-500' },
  open: { bg: 'bg-teal-50', text: 'text-teal-700', label: 'Open', dot: 'bg-teal-500' },
}

export function OccupancyGrid() {
  const [portalRole, setPortalRole] = useState<PortalRole | null>(null)

  useLayoutEffect(() => {
    setPortalRole(getSessionRole())
  }, [])

  const mask = shouldMaskCustomerPii(portalRole)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/40 to-[#eff6ff]/60 p-6 shadow-[0_4px_24px_-4px_rgba(15,44,74,0.1)]">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#1565C0]/8 blur-2xl" />
      <h3 className="relative text-base font-semibold tracking-tight text-slate-900 mb-4">Resource Status</h3>
      <div className="grid grid-cols-2 gap-2">
        {OCCUPANCY_DATA.map((item, i) => {
          const style = statusStyles[item.status] || statusStyles.available
          const currentLabel = maskOccupancyCurrentLabel(item.current, mask)
          return (
            <div
              key={item.resource}
              className="rounded-xl p-3 border border-slate-100/90 bg-white/70 backdrop-blur-sm hover:border-slate-200 card-hover animate-scale-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
                <span className="text-xs font-medium text-gray-900">{item.resource}</span>
              </div>
              <span className={cn('inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full', style.bg, style.text)}>
                {style.label}
              </span>
              {currentLabel && (
                <div className="text-[10px] text-gray-500 mt-1">
                  {currentLabel} {item.until && `· until ${item.until}`}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
