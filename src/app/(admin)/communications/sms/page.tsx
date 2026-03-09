'use client'

import { useState } from 'react'
import { Search, Zap, Send } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_CUSTOMERS, SMS_TEMPLATES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'

const SMS_HISTORY = [
  { id: 'sms-1', date: '10 Mar 2026', type: 'Individual', recipient: 'Amara Kimani', template: 'Booking Confirmed', status: 'delivered', deliveryPct: 100 },
  { id: 'sms-2', date: '10 Mar 2026', type: 'Individual', recipient: 'David Omondi', template: 'Payment Received', status: 'delivered', deliveryPct: 100 },
  { id: 'sms-3', date: '09 Mar 2026', type: 'Bulk', recipient: 'Gold Tier (12)', template: 'Reminder 24hrs', status: 'sent', deliveryPct: 92 },
  { id: 'sms-4', date: '08 Mar 2026', type: 'Individual', recipient: 'Fatima Hassan', template: 'Cancellation', status: 'failed', deliveryPct: 0 },
  { id: 'sms-5', date: '07 Mar 2026', type: 'Bulk', recipient: 'All Customers (8)', template: 'Reminder 2hrs', status: 'delivered', deliveryPct: 87 },
  { id: 'sms-6', date: '06 Mar 2026', type: 'Individual', recipient: 'Samuel Njoroge', template: 'Booking Confirmed', status: 'delivered', deliveryPct: 100 },
]

export default function SMSPage() {
  const [tab, setTab] = useState<'individual' | 'bulk'>('individual')
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [template, setTemplate] = useState('')
  const [message, setMessage] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [audience, setAudience] = useState('all')

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).slice(0, 5)

  const selectTemplate = (tplId: string) => {
    setTemplate(tplId)
    const tpl = SMS_TEMPLATES.find(t => t.id === tplId)
    if (tpl) setMessage(tpl.message)
  }

  const getRecipientCount = () => {
    if (audience === 'all') return MOCK_CUSTOMERS.length
    return MOCK_CUSTOMERS.filter(c => c.loyaltyTier === audience.toUpperCase()).length
  }

  return (
    <div>
      <PageHeader title="SMS Centre" subtitle="Send and manage SMS communications" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
          <div className="flex gap-1 mb-4">
            <button onClick={() => setTab('individual')} className={cn('flex-1 py-2 text-sm font-medium rounded-[var(--btn-radius)]', tab === 'individual' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600')}>Individual</button>
            <button onClick={() => setTab('bulk')} className={cn('flex-1 py-2 text-sm font-medium rounded-[var(--btn-radius)]', tab === 'bulk' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600')}>Bulk</button>
          </div>

          {tab === 'individual' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={selectedCustomer || customerSearch}
                  onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); setShowDropdown(true) }}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
                {showDropdown && customerSearch && !selectedCustomer && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                    {filteredCustomers.map(c => (
                      <button key={c.id} onClick={() => { setSelectedCustomer(c.name); setPhone(c.phone); setShowDropdown(false); setCustomerSearch('') }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                        {c.name} · {c.phone}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254712345678" className="w-full py-2 px-3 text-sm border border-gray-200 rounded-[var(--input-radius)]" />
              <select value={template} onChange={e => selectTemplate(e.target.value)} className="w-full py-2 px-3 text-sm border border-gray-200 rounded-[var(--input-radius)] text-gray-600">
                <option value="">Select template...</option>
                {SMS_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Type your message..." className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand/20" />
                <div className={cn('text-xs text-right mt-0.5', message.length > 160 ? 'text-red-500' : 'text-gray-400')}>{message.length}/160 characters</div>
              </div>
              <button onClick={() => { toast.success('SMS sent successfully'); setMessage(''); setPhone(''); setSelectedCustomer(null) }} className="w-full py-2.5 bg-brand text-white font-medium rounded-[var(--btn-radius)] hover:bg-brand-light flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send SMS
              </button>
            </div>
          )}

          {tab === 'bulk' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Audience</label>
                <div className="space-y-1">
                  {['all', 'GOLD', 'PLATINUM', 'SILVER', 'BRONZE'].map(a => (
                    <label key={a} className="flex items-center gap-2 text-sm">
                      <input type="radio" name="audience" value={a} checked={audience === a} onChange={e => setAudience(e.target.value)} className="text-brand" />
                      {a === 'all' ? 'All Customers' : `${a.charAt(0) + a.slice(1).toLowerCase()} Tier`}
                    </label>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-2">Sending to ~{getRecipientCount()} customers</div>
              </div>
              <select value={template} onChange={e => selectTemplate(e.target.value)} className="w-full py-2 px-3 text-sm border border-gray-200 rounded-[var(--input-radius)] text-gray-600">
                <option value="">Select template...</option>
                {SMS_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div>
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] p-3 resize-none" />
                <div className={cn('text-xs text-right mt-0.5', message.length > 160 ? 'text-red-500' : 'text-gray-400')}>{message.length}/160</div>
              </div>
              <button onClick={() => { toast.success(`SMS sent to ${getRecipientCount()} recipients`); setMessage('') }} className="w-full py-2.5 bg-brand text-white font-medium rounded-[var(--btn-radius)] hover:bg-brand-light">
                Send to {getRecipientCount()} recipients
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3 mt-4">
            <Zap className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs text-blue-700">2,847 credits remaining (KES 0.70/SMS)</span>
            <button className="text-xs text-brand font-medium hover:underline ml-auto">Top Up</button>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)]">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">SMS History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Recipient</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Template</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Delivery</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {SMS_HISTORY.map(sms => (
                  <tr key={sms.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-xs text-gray-600">{sms.date}</td>
                    <td className="px-4 py-2.5"><span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', sms.type === 'Bulk' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700')}>{sms.type}</span></td>
                    <td className="px-4 py-2.5 text-xs text-gray-700">{sms.recipient}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{sms.template}</td>
                    <td className="px-4 py-2.5"><div className="flex items-center gap-1.5"><span className={cn('w-1.5 h-1.5 rounded-full', sms.status === 'delivered' ? 'bg-green-500' : sms.status === 'sent' ? 'bg-blue-500' : 'bg-red-500')} /><span className="text-xs text-gray-600 capitalize">{sms.status}</span></div></td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 rounded-full h-1.5" style={{ width: `${sms.deliveryPct}%` }} /></div>
                        <span className="text-[10px] text-gray-400">{sms.deliveryPct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
