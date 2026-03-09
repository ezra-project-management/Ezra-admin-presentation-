'use client'

import { useState, useEffect } from 'react'
import { Plus, Clock, ArrowRight, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { WALK_IN_QUEUE, type QueueItem } from '@/lib/mock-data'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/utils'

function getWaitTime(addedAt: string): string {
  const diff = Date.now() - new Date(addedAt).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>(WALK_IN_QUEUE)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newService, setNewService] = useState('Haircut')
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const waiting = queue.filter(q => q.status === 'waiting')
  const inService = queue.filter(q => q.status === 'in_service')
  const done = queue.filter(q => q.status === 'done')

  const moveToService = (id: string) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'in_service', assignedStaff: 'Tony B.' } : q))
    toast.success('Customer moved to service')
  }

  const markDone = (id: string) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'done' } : q))
    toast.success('Service completed')
  }

  const removeItem = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id))
    toast('Removed from queue')
  }

  const addToQueue = () => {
    if (!newName.trim()) return
    const item: QueueItem = {
      id: `q-${Date.now()}`,
      customerName: newName,
      phone: newPhone,
      service: newService,
      estimatedWait: waiting.length * 15 + 15,
      assignedStaff: null,
      status: 'waiting',
      addedAt: new Date().toISOString(),
    }
    setQueue(prev => [...prev, item])
    setNewName(''); setNewPhone(''); setNewService('Haircut'); setShowAdd(false)
    toast.success('Added to queue')
  }

  const renderCard = (item: QueueItem, position?: number) => (
    <div key={item.id} className={cn('bg-white rounded-lg shadow-sm border border-gray-200 p-4', item.status === 'done' && 'opacity-60')}>
      <div className="flex items-start justify-between mb-2">
        {position !== undefined && <span className="text-lg font-bold font-mono text-navy">#{position}</span>}
        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 ml-auto" aria-label="Remove">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="font-medium text-gray-900 text-sm">{item.customerName}</div>
      <div className="text-xs text-gray-400">{item.phone}</div>
      <span className="inline-block mt-2 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full">{item.service}</span>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        {getWaitTime(item.addedAt)}
      </div>
      {item.assignedStaff && (
        <span className="inline-block mt-1.5 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">{item.assignedStaff}</span>
      )}
      <div className="mt-3">
        {item.status === 'waiting' && (
          <button onClick={() => moveToService(item.id)} className="w-full flex items-center justify-center gap-1 text-xs bg-brand text-white px-3 py-1.5 rounded-[var(--btn-radius)] hover:bg-brand-light">
            <ArrowRight className="w-3 h-3" /> Start Service
          </button>
        )}
        {item.status === 'in_service' && (
          <button onClick={() => markDone(item.id)} className="w-full flex items-center justify-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-[var(--btn-radius)] hover:bg-green-700">
            <Check className="w-3 h-3" /> Complete
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="Walk-in Queue" subtitle="Manage walk-in customers" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waiting */}
        <div className="bg-gray-50 rounded-[10px] p-4 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-sm">Waiting</h3>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{waiting.length}</span>
            </div>
            <button onClick={() => setShowAdd(true)} className="p-1 bg-brand text-white rounded hover:bg-brand-light" aria-label="Add to queue">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {showAdd && (
            <div className="bg-white rounded-lg border border-brand-border p-3 mb-3 space-y-2">
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Customer Name" className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/20" />
              <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone" className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand/20" />
              <select value={newService} onChange={e => setNewService(e.target.value)} className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-1.5">
                <option>Haircut</option><option>Beard Trim</option><option>Hair Wash</option><option>Haircut + Shave</option><option>Other</option>
              </select>
              <div className="flex gap-2">
                <button onClick={addToQueue} className="flex-1 text-xs bg-brand text-white py-1.5 rounded-[var(--btn-radius)]">Add</button>
                <button onClick={() => setShowAdd(false)} className="text-xs text-gray-500 hover:underline">Cancel</button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {waiting.map((item, i) => renderCard(item, i + 1))}
          </div>
        </div>

        {/* In Service */}
        <div className="bg-gray-50 rounded-[10px] p-4 min-h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">In Service</h3>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{inService.length}</span>
          </div>
          <div className="space-y-3">
            {inService.map(item => renderCard(item))}
          </div>
        </div>

        {/* Done */}
        <div className="bg-gray-50 rounded-[10px] p-4 min-h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Done</h3>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{done.length}</span>
          </div>
          <div className="space-y-3">
            {done.map(item => renderCard(item))}
          </div>
        </div>
      </div>
    </div>
  )
}
