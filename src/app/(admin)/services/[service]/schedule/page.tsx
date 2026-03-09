'use client'

import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { PageHeader } from '@/components/ui/PageHeader'

const SERVICE_NAMES: Record<string, string> = {
  'salon-spa': 'Salon & Spa', barbershop: 'Barbershop', gym: 'Fitness Centre',
  boardroom: 'Boardrooms', ballroom: 'Ballroom', 'banquet-hall': 'Banquet Hall',
  'swimming-pool': 'Swimming Pool', rooms: 'Accommodation',
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function SchedulePage() {
  const params = useParams()
  const slug = params.service as string
  const name = SERVICE_NAMES[slug] || slug

  return (
    <div>
      <PageHeader title={`Schedule — ${name}`} subtitle={`Operating schedule for ${name}`} />
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Day</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hours</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {DAYS.map((day, i) => (
              <tr key={day} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{day}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${i < 6 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{i < 6 ? 'Open' : 'Closed'}</span></td>
                <td className="px-4 py-3 text-sm text-gray-600">{i < 6 ? '6:00 AM – 10:00 PM' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => toast('Schedule editor coming soon')} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-brand rounded-[7px] hover:bg-brand-light">
        Edit Schedule
      </button>
    </div>
  )
}
