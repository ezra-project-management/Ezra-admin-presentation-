'use client'

import { useState } from 'react'
import { Search, Eye, MessageSquare, Ban, X } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_CUSTOMERS, MOCK_TRANSACTIONS, type CustomerRecord } from '@/lib/mock-data'
import { useBookings } from '@/context/bookings-context'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function CustomersPage() {
  const { bookings } = useBookings()
  const [customers, setCustomers] = useState<CustomerRecord[]>(MOCK_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null)
  const [activeTab, setActiveTab] = useState('bookings')

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = !tierFilter || c.loyaltyTier === tierFilter
    return matchSearch && matchTier
  })

  const customerBookings = selectedCustomer ? bookings.filter((b) => b.customer.name === selectedCustomer.name) : []
  const customerTransactions = selectedCustomer ? MOCK_TRANSACTIONS.filter(t => t.customer === selectedCustomer.name) : []

  const tabs = ['bookings', 'transactions', 'loyalty', 'notes', 'preferences', 'communications']

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} registered customers`}
        actions={<button className="bg-brand text-white px-4 py-2 rounded-[var(--btn-radius)] text-sm font-medium hover:bg-brand-light">+ Add Customer</button>}
      />

      {/* Filters */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
          </div>
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="text-sm border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-600">
            <option value="">All Tiers</option>
            <option value="BRONZE">Bronze</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
            <option value="PLATINUM">Platinum</option>
          </select>
          {(search || tierFilter) && <button onClick={() => { setSearch(''); setTierFilter('') }} className="text-sm text-brand hover:underline flex items-center gap-1"><X className="w-3 h-3" /> Clear</button>}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tier</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Bookings</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Last Visit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-400">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3"><TierBadge tier={c.loyaltyTier} /></td>
                  <td className="px-4 py-3 text-sm text-center">{c.totalBookings}</td>
                  <td className="px-4 py-3 text-sm font-medium text-right">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(c.lastVisit)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedCustomer(c)} className="p-1.5 text-gray-400 hover:text-brand rounded" aria-label="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => toast.success(`SMS panel opened for ${c.name}`)} className="p-1.5 text-gray-400 hover:text-brand rounded" aria-label="SMS"><MessageSquare className="w-4 h-4" /></button>
                      <button onClick={() => { setCustomers(prev => prev.map(x => x.id === c.id ? { ...x, isBlocked: !x.isBlocked } : x)); toast(c.isBlocked ? 'Customer unblocked' : 'Customer blocked') }} className="p-1.5 text-gray-400 hover:text-red-600 rounded" aria-label="Block"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <>
          <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setSelectedCustomer(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              <div className="flex items-center gap-4">
                <Avatar name={selectedCustomer.name} size="lg" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                  <div className="text-xs text-gray-500">{selectedCustomer.email} · {selectedCustomer.phone}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <TierBadge tier={selectedCustomer.loyaltyTier} />
                    <span className="text-xs text-gray-400">Joined {formatDate(selectedCustomer.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-4">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-3 py-2.5 text-xs font-medium capitalize', activeTab === tab ? 'border-b-2 border-brand text-brand' : 'text-gray-500 hover:text-gray-700')}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'bookings' && (
                <div className="space-y-0 divide-y divide-gray-100">
                  {customerBookings.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No bookings found</p>}
                  {customerBookings.map(b => (
                    <div key={b.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="text-sm font-medium">{b.service}</div>
                        <div className="text-xs text-gray-400">{formatDate(b.startAt)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{formatCurrency(b.amount)}</span>
                        <StatusBadge status={b.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'transactions' && (
                <div className="space-y-0 divide-y divide-gray-100">
                  {customerTransactions.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No transactions found</p>}
                  {customerTransactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="text-sm font-medium font-mono">{t.reference}</div>
                        <div className="text-xs text-gray-400">{t.items.length} items</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{formatCurrency(t.total)}</span>
                        <StatusBadge status={t.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'loyalty' && (
                <div>
                  <div className="bg-gold-light rounded-xl p-6 text-center mb-4">
                    <div className="text-3xl font-bold text-gold">{selectedCustomer.loyaltyPoints.toLocaleString()}</div>
                    <div className="text-sm text-gold-text">Loyalty Points</div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{selectedCustomer.loyaltyTier}</span><span>Next Tier</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-gold rounded-full h-2" style={{ width: '65%' }} /></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50"><span className="text-gray-600">Earned 250 pts — Salon booking</span><span className="text-green-600">+250</span></div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50"><span className="text-gray-600">Redeemed 500 pts — Discount</span><span className="text-red-600">-500</span></div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50"><span className="text-gray-600">Earned 180 pts — Gym pass</span><span className="text-green-600">+180</span></div>
                  </div>
                </div>
              )}
              {activeTab === 'notes' && (
                <div>
                  <div className="space-y-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-400 mb-1">Grace M. · 08 Mar 2026</div><div className="text-sm">Prefers Suite 1 for spa appointments. Allergic to lavender.</div></div>
                    <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-400 mb-1">James K. · 01 Mar 2026</div><div className="text-sm">VIP customer — always offer complimentary welcome drink.</div></div>
                  </div>
                  <textarea placeholder="Add a note..." rows={3} className="w-full text-sm border border-gray-200 rounded-[var(--input-radius)] p-3 focus:outline-none focus:ring-2 focus:ring-brand/20 mb-2" />
                  <button onClick={() => toast.success('Note added')} className="text-xs bg-brand text-white px-3 py-1.5 rounded-[var(--btn-radius)]">Add Note</button>
                </div>
              )}
              {activeTab === 'preferences' && (
                <div className="space-y-4">
                  <div><div className="text-xs font-medium text-gray-500 mb-2">Dietary Needs</div><div className="flex flex-wrap gap-1.5"><span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">Vegetarian</span><span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">No Nuts</span><button className="text-xs text-brand hover:underline">+ Add</button></div></div>
                  <div><div className="text-xs font-medium text-gray-500 mb-2">Favourite Staff</div><div className="flex flex-wrap gap-1.5"><span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">Grace M.</span><button className="text-xs text-brand hover:underline">+ Add</button></div></div>
                  <div><div className="text-xs font-medium text-gray-500 mb-2">Accessibility</div><div className="flex flex-wrap gap-1.5"><span className="text-xs text-gray-400">None specified</span><button className="text-xs text-brand hover:underline">+ Add</button></div></div>
                </div>
              )}
              {activeTab === 'communications' && (
                <div className="space-y-2">
                  <div className="flex items-start gap-3 py-2 border-b border-gray-50"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" /><div><div className="text-xs text-gray-400">10 Mar 2026</div><div className="text-sm text-gray-700 truncate">Hi Amara, your Salon & Spa booking EZR-A1B2C3 is confirmed...</div></div></div>
                  <div className="flex items-start gap-3 py-2 border-b border-gray-50"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" /><div><div className="text-xs text-gray-400">08 Mar 2026</div><div className="text-sm text-gray-700 truncate">Payment of KES 3,500 received for booking EZR-A1B2C3...</div></div></div>
                  <div className="flex items-start gap-3 py-2 border-b border-gray-50"><span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" /><div><div className="text-xs text-gray-400">01 Mar 2026</div><div className="text-sm text-gray-700 truncate">Reminder: Your appointment is tomorrow at 9:00 AM...</div><span className="text-[10px] text-red-500">Failed</span></div></div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <button onClick={() => toast.success('SMS panel opened')} className="bg-brand text-white px-4 py-2 rounded-[var(--btn-radius)] text-sm font-medium">Send SMS</button>
              <button onClick={() => toast.success('Points added')} className="bg-gold text-white px-4 py-2 rounded-[var(--btn-radius)] text-sm font-medium">Add Points</button>
              <button onClick={() => toast('Account blocked')} className="border border-red-300 text-red-600 px-4 py-2 rounded-[var(--btn-radius)] text-sm font-medium hover:bg-red-50">Block</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
