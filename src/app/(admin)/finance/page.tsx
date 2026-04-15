'use client'

import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'
import { Landmark, TrendingUp, CreditCard, ArrowRight } from 'lucide-react'
import { getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/utils'

const cards = [
  {
    href: '/finance/revenue',
    title: 'Revenue',
    desc: 'Trends, categories, and period views.',
    icon: TrendingUp,
    roles: ['FINANCE', 'SUPER_ADMIN', 'MANAGER'] as PortalRole[],
  },
  {
    href: '/finance/payments',
    title: 'Payments',
    desc: 'Incoming payments and reconciliation.',
    icon: CreditCard,
    roles: ['FINANCE', 'SUPER_ADMIN', 'MANAGER'] as PortalRole[],
  },
]

export default function FinanceOverviewPage() {
  const [role, setRole] = useState<PortalRole | null>(null)

  useLayoutEffect(() => {
    setRole(getSessionRole())
  }, [])

  const r = role ?? 'FINANCE'

  return (
    <div>
      <PageHeader
        title="Finance desk"
        subtitle="Revenue and payments — demo figures for Ezra Center."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards
          .filter((c) => c.roles.includes(r))
          .map((c) => {
            const Icon = c.icon
            return (
              <Link
                key={c.href}
                href={c.href}
                className={cn(
                  'group rounded-2xl border border-gray-200 bg-white p-6 shadow-[var(--shadow-card)] transition-all',
                  'hover:border-[var(--color-brand)]/35 hover:shadow-md'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-[var(--color-brand)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--color-brand)] transition-colors" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">{c.title}</h2>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </Link>
            )
          })}
      </div>

      <div className="mt-8 rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
        <span className="font-medium">Demo data.</span> Figures are illustrative for presentation — not legal advice or a live
        finance integration.
      </div>
    </div>
  )
}
