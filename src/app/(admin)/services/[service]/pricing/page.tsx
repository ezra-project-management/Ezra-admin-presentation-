'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Pencil, Check } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatCurrency } from '@/lib/utils'
import { serviceTitle } from '@/lib/service-slugs'
import { PRICING_BY_SERVICE, type PriceRow } from '@/lib/service-pricing'

const PRICING = PRICING_BY_SERVICE

export default function PricingPage() {
  const params = useParams()
  const slug = params.service as string
  const name = serviceTitle(slug)
  const storageKey = `ezra-pricing-${slug}`

  const [items, setItems] = useState<PriceRow[]>(() => PRICING[slug] || [])
  const [editing, setEditing] = useState<number | null>(null)
  const [draftPrice, setDraftPrice] = useState('')

  useEffect(() => {
    const base = PRICING[slug] || []
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as PriceRow[]
        if (Array.isArray(parsed) && parsed.length === base.length) {
          setItems(parsed)
          return
        }
      }
    } catch {
      /* base */
    }
    setItems(base)
  }, [slug, storageKey])

  const saveAll = (next: PriceRow[]) => {
    setItems(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
    toast.success('Pricing saved (this browser only)')
  }

  const startEdit = (i: number) => {
    setEditing(i)
    setDraftPrice(String(items[i]?.price ?? ''))
  }

  const commitEdit = (i: number) => {
    const n = Number(draftPrice)
    if (Number.isNaN(n) || n < 0) {
      toast.error('Enter a valid price')
      return
    }
    const next = items.map((row, j) => (j === i ? { ...row, price: n } : row))
    saveAll(next)
    setEditing(null)
  }

  return (
    <div>
      <PageHeader title={`Pricing — ${name}`} subtitle={`${items.length} items · super admin can adjust rates (demo)`} />
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Service Item</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, i) => (
              <tr key={item.item} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.item}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.duration}</td>
                <td className="px-4 py-3 text-right">
                  {editing === i ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        value={draftPrice}
                        onChange={e => setDraftPrice(e.target.value)}
                        className="w-28 text-sm border border-gray-200 rounded-[7px] px-2 py-1 text-right"
                      />
                      <button
                        type="button"
                        onClick={() => commitEdit(i)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        aria-label="Save price"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => startEdit(i)} className="group inline-flex items-center gap-1 text-sm font-medium tabular-nums">
                      {formatCurrency(item.price)}
                      <Pencil className="w-3 h-3 text-gray-300 group-hover:text-brand opacity-0 group-hover:opacity-100" />
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-green-50 text-green-700 text-[10px] font-medium px-2 py-0.5 rounded-full">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
