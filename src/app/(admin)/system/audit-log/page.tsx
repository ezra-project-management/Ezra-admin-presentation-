'use client'

import { useState } from 'react'
import { Shield, Download, Search } from 'lucide-react'
import { formatDateTime, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { toast } from 'sonner'

const AUDIT_ENTRIES = [
  { id: 'a-1', timestamp: '2026-03-10T09:15:00Z', admin: 'James Kariuki', action: 'LOGIN', entity: 'Session', entityId: 'sess-001', ip: '192.168.1.100', details: 'Admin login from Chrome/Mac' },
  { id: 'a-2', timestamp: '2026-03-10T09:20:00Z', admin: 'James Kariuki', action: 'UPDATE', entity: 'Booking', entityId: 'bk-002', ip: '192.168.1.100', details: 'Status changed: CONFIRMED → CHECKED_IN' },
  { id: 'a-3', timestamp: '2026-03-10T08:45:00Z', admin: 'Grace Mwangi', action: 'CREATE', entity: 'Booking', entityId: 'bk-006', ip: '192.168.1.101', details: 'New booking created for Brian Mutua' },
  { id: 'a-4', timestamp: '2026-03-09T16:30:00Z', admin: 'Tony Baraka', action: 'CREATE', entity: 'Transaction', entityId: 'txn-004', ip: '192.168.1.102', details: 'POS transaction POS-00039' },
  { id: 'a-5', timestamp: '2026-03-09T20:15:00Z', admin: 'James Kariuki', action: 'VOID', entity: 'Transaction', entityId: 'txn-005', ip: '192.168.1.100', details: 'Voided transaction POS-00038' },
  { id: 'a-6', timestamp: '2026-03-08T14:23:00Z', admin: 'Grace Mwangi', action: 'CREATE', entity: 'Booking', entityId: 'bk-001', ip: '192.168.1.101', details: 'Booking for Amara Kimani' },
  { id: 'a-7', timestamp: '2026-03-07T10:05:00Z', admin: 'System', action: 'DELETE', entity: 'Booking', entityId: 'bk-007', ip: '—', details: 'Auto-cancelled: no payment received' },
  { id: 'a-8', timestamp: '2026-03-06T09:00:00Z', admin: 'James Kariuki', action: 'UPDATE', entity: 'Settings', entityId: 'settings-001', ip: '192.168.1.100', details: 'Updated operating hours' },
]

const ACTION_STYLES: Record<string, string> = {
  CREATE: 'bg-green-50 text-green-700',
  UPDATE: 'bg-blue-50 text-blue-700',
  DELETE: 'bg-red-50 text-red-700',
  LOGIN: 'bg-gray-100 text-gray-600',
  VOID: 'bg-amber-50 text-amber-700',
}

export default function AuditLogPage() {
  const [actionFilter, setActionFilter] = useState('')
  const [search, setSearch] = useState('')

  const filtered = AUDIT_ENTRIES.filter(e => {
    const matchAction = !actionFilter || e.action === actionFilter
    const matchSearch = !search || e.admin.toLowerCase().includes(search.toLowerCase()) || e.details.toLowerCase().includes(search.toLowerCase())
    return matchAction && matchSearch
  })

  return (
    <div>
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm mb-6">
        <Shield className="w-4 h-4 shrink-0" />
        This log is read-only and cannot be modified.
      </div>

      <PageHeader title="Audit Log" subtitle="System activity trail" actions={<button onClick={() => toast.success('CSV export started')} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-[7px] px-3 py-2 hover:bg-gray-50"><Download className="w-4 h-4" />Export CSV</button>} />

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audit log..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-brand/20" />
          </div>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="text-sm border border-gray-200 rounded-[7px] px-3 py-2 text-gray-600">
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="VOID">Void</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Admin</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Entity ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">IP Address</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{formatDateTime(entry.timestamp)}</td>
                  <td className="px-4 py-3 text-sm">{entry.admin}</td>
                  <td className="px-4 py-3"><span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', ACTION_STYLES[entry.action])}>{entry.action}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.entity}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{entry.entityId}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{entry.ip}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[250px] truncate" title={entry.details}>{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
