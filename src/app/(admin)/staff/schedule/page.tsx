'use client'

import { ChevronLeft, ChevronRight, Copy, Download } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_STAFF } from '@/lib/mock-data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const DAYS = [
  { label: 'Mon 10', isToday: true },
  { label: 'Tue 11', isToday: false },
  { label: 'Wed 12', isToday: false },
  { label: 'Thu 13', isToday: false },
  { label: 'Fri 14', isToday: false },
  { label: 'Sat 15', isToday: false },
  { label: 'Sun 16', isToday: false },
]

const SHIFTS: Record<string, (string | null)[]> = {
  'st-001': ['8am-5pm', '8am-5pm', null, '8am-5pm', '8am-5pm', '9am-3pm', null],
  'st-002': ['9am-5pm', '9am-5pm', '9am-5pm', '9am-5pm', '9am-5pm', null, null],
  'st-003': [null, '9am-6pm', '9am-6pm', '9am-6pm', '9am-6pm', '9am-6pm', '10am-4pm'],
  'st-004': ['6am-2pm', '6am-2pm', '6am-2pm', null, '6am-2pm', '6am-2pm', null],
  'st-005': ['7am-3pm', '7am-3pm', null, '7am-3pm', '7am-3pm', '7am-3pm', '7am-3pm'],
  'st-006': [null, null, '10am-6pm', '10am-6pm', '10am-6pm', '10am-6pm', null],
  'st-007': ['6am-12pm', '6am-12pm', '6am-12pm', null, '6am-12pm', '6am-12pm', '8am-12pm'],
  'st-008': ['2pm-10pm', null, '2pm-10pm', '2pm-10pm', '2pm-10pm', '2pm-10pm', null],
}

const DEPT_COLORS: Record<string, string> = {
  'salon-spa': 'bg-teal-50 text-teal-700',
  'barbershop': 'bg-gray-100 text-gray-700',
  'gym': 'bg-green-50 text-green-700',
  'boardroom': 'bg-blue-50 text-blue-700',
  'ballroom': 'bg-amber-50 text-amber-700',
  'banquet-hall': 'bg-orange-50 text-orange-700',
  'swimming-pool': 'bg-cyan-50 text-cyan-700',
  'rooms': 'bg-purple-50 text-purple-700',
}

export default function StaffSchedulePage() {
  return (
    <div>
      <PageHeader title="Staff Schedule" subtitle="Weekly shift planning" />

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button className="p-1.5 border border-gray-200 rounded-[var(--btn-radius)] text-gray-600 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-medium text-gray-900">Week of Mar 10 – 16, 2026</span>
            <button className="p-1.5 border border-gray-200 rounded-[var(--btn-radius)] text-gray-600 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toast.success('Shifts copied from last week')} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-[var(--btn-radius)] px-3 py-1.5 hover:bg-gray-50"><Copy className="w-3.5 h-3.5" />Copy Last Week</button>
            <button onClick={() => toast.success('PDF export started')} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-[var(--btn-radius)] px-3 py-1.5 hover:bg-gray-50"><Download className="w-3.5 h-3.5" />Export PDF</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="sticky left-0 bg-white z-10 w-48 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase border-r border-gray-100">Staff</th>
                {DAYS.map(day => (
                  <th key={day.label} className={cn('px-2 py-3 text-center text-xs font-medium text-gray-500 min-w-[100px]', day.isToday && 'bg-blue-50/50')}>
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_STAFF.map(staff => {
                const shifts = SHIFTS[staff.id] || Array(7).fill(null)
                const deptColor = DEPT_COLORS[staff.departments[0]] || 'bg-gray-50 text-gray-600'
                return (
                  <tr key={staff.id}>
                    <td className="sticky left-0 bg-white z-10 px-4 py-3 border-r border-gray-100">
                      <div className="flex items-center gap-2">
                        <Avatar name={staff.name} size="sm" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          <div className="text-xs text-gray-400">{staff.role}</div>
                        </div>
                      </div>
                    </td>
                    {shifts.map((shift, i) => (
                      <td key={i} className={cn('px-2 py-3 text-center', DAYS[i].isToday && 'bg-blue-50/50')}>
                        {shift ? (
                          <button
                            onClick={() => toast('Edit shift coming soon')}
                            className={cn('inline-block py-2 px-3 rounded-md text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity', deptColor)}
                          >
                            {shift}
                          </button>
                        ) : (
                          <button
                            onClick={() => toast('Add shift coming soon')}
                            className="text-[10px] text-gray-300 hover:text-gray-500 cursor-pointer"
                          >
                            OFF
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
