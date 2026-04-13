'use client'

import { useState, useEffect, useMemo, useLayoutEffect } from 'react'
import { Plus, Clock, Check, X, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { WALK_IN_QUEUE, MOCK_STAFF, type QueueItem } from '@/lib/mock-data'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/utils'
import { getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { canViewGuestIdentity } from '@/lib/client-privacy'

function getWaitTime(addedAt: string): string {
  const diff = Date.now() - new Date(addedAt).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>(WALK_IN_QUEUE)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newService, setNewService] = useState('Haircut')
  const [, setTick] = useState(0)
  const [staffPick, setStaffPick] = useState<Record<string, string>>({})
  const [portalRole, setPortalRole] = useState<PortalRole | null>(null)

  useLayoutEffect(() => {
    setPortalRole(getSessionRole())
  }, [])

  const showGuestIdentity = canViewGuestIdentity(portalRole)

  const barberStaff = useMemo(
    () => MOCK_STAFF.filter(s => s.departments.includes('barbershop')),
    []
  )
  const defaultBarber = barberStaff[0]?.bookingAttribution ?? 'Tony B.'

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const waiting = queue.filter(q => q.status === 'waiting')
  const inService = queue.filter(q => q.status === 'in_service')
  const done = queue.filter(q => q.status === 'done').slice(-5)

  const pickFor = (id: string) => staffPick[id] ?? defaultBarber

  const moveToService = (id: string) => {
    const name = pickFor(id)
    setQueue(prev => prev.map(q => (q.id === id ? { ...q, status: 'in_service', assignedStaff: name } : q)))
    toast.success(`Now serving — ${name}`)
  }

  const markDone = (id: string) => {
    setQueue(prev => prev.map(q => (q.id === id ? { ...q, status: 'done' } : q)))
    toast.success('Completed')
  }

  const removeItem = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id))
    setStaffPick(p => {
      const n = { ...p }
      delete n[id]
      return n
    })
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
    setNewName('')
    setNewPhone('')
    setNewService('Haircut')
    setShowAdd(false)
    toast.success('Added to queue')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Walk-in queue"
        subtitle={
          showGuestIdentity
            ? 'Barbershop · names and phones stay at the desk'
            : 'Barbershop · you see line order only — guest details stay with front desk'
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
          <div className="text-2xl font-semibold text-navy">{waiting.length}</div>
          <div className="text-xs text-gray-500 font-medium">Waiting</div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-center">
          <div className="text-2xl font-semibold text-blue-800">{inService.length}</div>
          <div className="text-xs text-blue-700 font-medium">In service</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
          <div className="text-2xl font-semibold text-gray-700">{done.length}</div>
          <div className="text-xs text-gray-500 font-medium">Last completed (5)</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900">Line ({waiting.length})</h2>
        {showGuestIdentity && (
          <button
            type="button"
            onClick={() => setShowAdd(s => !s)}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-brand text-white px-3 py-2 rounded-[var(--btn-radius)] hover:bg-brand-light"
          >
            <Plus className="w-4 h-4" />
            Add walk-in
          </button>
        )}
      </div>

      {showAdd && showGuestIdentity && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3 shadow-sm">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Name"
              className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <input
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <select
            value={newService}
            onChange={e => setNewService(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2"
          >
            <option>Haircut</option>
            <option>Beard Trim</option>
            <option>Hair Wash</option>
            <option>Haircut + Shave</option>
            <option>Other</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addToQueue}
              className="flex-1 text-sm bg-brand text-white py-2 rounded-[var(--btn-radius)] font-medium"
            >
              Add to line
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-gray-500 px-3 hover:underline">
              Cancel
            </button>
          </div>
        </div>
      )}

      {inService.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Now serving</h2>
          <div className="space-y-3">
            {inService.map(item => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">
                    {showGuestIdentity ? item.customerName : `Walk-in ${inService.indexOf(item) + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">{item.service}</div>
                  {item.assignedStaff && (
                    <div className="text-xs text-blue-800 font-medium mt-1">With {item.assignedStaff}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => markDone(item.id)}
                  className="inline-flex items-center justify-center gap-1.5 shrink-0 bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-[var(--btn-radius)] hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Mark done
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {waiting.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">No one waiting. Add a walk-in when someone arrives.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {waiting.map((item, i) => (
              <li key={item.id} className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-xl font-bold font-mono text-navy w-8 shrink-0">#{i + 1}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900">
                      {showGuestIdentity ? item.customerName : `Walk-in ${i + 1}`}
                    </div>
                    <div className="text-xs text-gray-400">
                      {showGuestIdentity ? item.phone || '—' : '—'}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">{item.service}</span>
                      <span className="text-[11px] text-gray-500 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getWaitTime(item.addedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center shrink-0">
                  <select
                    value={pickFor(item.id)}
                    onChange={e => setStaffPick(p => ({ ...p, [item.id]: e.target.value }))}
                    className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-2 py-2 bg-white"
                  >
                    {barberStaff.map(s => (
                      <option key={s.id} value={s.bookingAttribution}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveToService(item.id)}
                      className="inline-flex items-center justify-center gap-1 flex-1 sm:flex-initial text-sm font-medium bg-navy text-white px-4 py-2 rounded-[var(--btn-radius)] hover:opacity-90"
                    >
                      Start
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 border border-gray-200 rounded-[var(--btn-radius)]"
                      aria-label="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {done.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Recently completed</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {done.map((item, di) => (
              <li key={item.id} className={cn('flex justify-between gap-2', 'opacity-75')}>
                <span>{showGuestIdentity ? item.customerName : `Walk-in (done ${di + 1})`}</span>
                <span className="text-gray-400 text-xs">{item.assignedStaff ?? '—'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
