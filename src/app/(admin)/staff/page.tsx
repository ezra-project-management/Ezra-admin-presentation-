'use client'

import { useState } from 'react'
import { LayoutGrid, List, Pencil, MessageSquare, Calendar, X } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_STAFF } from '@/lib/mock-data'
import { formatDate, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { Avatar } from '@/components/ui/Avatar'

const DEPT_COLORS: Record<string, string> = {
  'salon-spa': 'bg-teal-50 text-teal-700',
  'barbershop': 'bg-gray-100 text-gray-700',
  'gym': 'bg-green-50 text-green-700',
  'boardroom': 'bg-blue-50 text-blue-700',
  'ballroom': 'bg-amber-50 text-amber-700',
  'banquet-hall': 'bg-orange-50 text-orange-700',
  'swimming-pool': 'bg-cyan-50 text-cyan-700',
}

export default function StaffPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle={`${MOCK_STAFF.length} team members`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 rounded-[var(--btn-radius)] overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={cn('p-2', viewMode === 'grid' ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-50')} aria-label="Grid view"><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={cn('p-2', viewMode === 'list' ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-50')} aria-label="List view"><List className="w-4 h-4" /></button>
            </div>
            <button onClick={() => setShowAddModal(true)} className="bg-brand text-white px-4 py-2 rounded-[var(--btn-radius)] text-sm font-medium hover:bg-brand-light">+ Add Staff</button>
          </div>
        }
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_STAFF.map(staff => (
            <div key={staff.id} className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-navy text-white text-lg font-semibold flex items-center justify-center mx-auto">
                {staff.avatar}
              </div>
              <div className="font-semibold text-gray-900 mt-3">{staff.name}</div>
              <span className={cn('inline-block text-xs px-2 py-0.5 rounded-full mt-1', staff.role === 'MANAGER' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600')}>
                {staff.role}
              </span>
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {staff.departments.map(dept => (
                  <span key={dept} className={cn('text-[11px] px-2 py-0.5 rounded-full', DEPT_COLORS[dept] || 'bg-gray-50 text-gray-600')}>
                    {dept.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs">
                <span className={cn('w-2 h-2 rounded-full', staff.isOnDuty ? 'bg-green-500' : 'bg-gray-400')} />
                <span className={staff.isOnDuty ? 'text-green-600' : 'text-gray-400'}>{staff.isOnDuty ? 'On Duty' : 'Off Duty'}</span>
              </div>
              <div className="flex gap-2 justify-center mt-4">
                <button className="p-1.5 border border-gray-200 rounded-[var(--btn-radius)] text-gray-500 hover:bg-gray-50" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 border border-gray-200 rounded-[var(--btn-radius)] text-gray-500 hover:bg-gray-50" aria-label="Message"><MessageSquare className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 border border-gray-200 rounded-[var(--btn-radius)] text-gray-500 hover:bg-gray-50" aria-label="Schedule"><Calendar className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Staff</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Departments</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_STAFF.map(staff => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar name={staff.name} size="sm" /><span className="text-sm font-medium">{staff.name}</span></div></td>
                  <td className="px-4 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', staff.role === 'MANAGER' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600')}>{staff.role}</span></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{staff.departments.map(d => <span key={d} className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded">{d.replace(/-/g, ' ')}</span>)}</div></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{staff.phone}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-xs"><span className={cn('w-2 h-2 rounded-full', staff.isOnDuty ? 'bg-green-500' : 'bg-gray-400')} />{staff.isOnDuty ? 'On Duty' : 'Off Duty'}</div></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(staff.joinDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-[var(--shadow-modal)] p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Staff Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Full Name" className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2" />
              <input placeholder="Email" type="email" className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2" />
              <input placeholder="Phone" className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2" />
              <select className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600"><option>STAFF</option><option>MANAGER</option></select>
              <input placeholder="Temporary Password" type="password" className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2" />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-[var(--btn-radius)]">Cancel</button>
              <button onClick={() => { setShowAddModal(false); toast.success('Staff member added') }} className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-[var(--btn-radius)]">Add Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
