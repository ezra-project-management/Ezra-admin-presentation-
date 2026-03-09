'use client'

import { useState } from 'react'
import { ItemCataloguePanel } from '@/components/pos/ItemCataloguePanel'
import { OrderSummaryPanel, type OrderItem } from '@/components/pos/OrderSummaryPanel'

export default function POSPage() {
  const [items, setItems] = useState<OrderItem[]>([])

  const handleAddItem = (item: { name: string; category: string; price: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.name === item.name)
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`, name: item.name, category: item.category, price: item.price, qty: 1 }]
    })
  }

  const handleUpdateQty = (id: string, qty: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleClear = () => {
    setItems([])
  }

  return (
    <div className="-m-6 flex" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex-[3] overflow-hidden flex flex-col bg-gray-50">
        <ItemCataloguePanel onAddItem={handleAddItem} />
      </div>
      <div className="flex-[2] overflow-hidden">
        <OrderSummaryPanel items={items} onUpdateQty={handleUpdateQty} onRemoveItem={handleRemoveItem} onClear={handleClear} />
      </div>
    </div>
  )
}
