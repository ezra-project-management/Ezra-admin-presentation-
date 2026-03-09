'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'

const TABS = ['General', 'Integrations', 'Booking Policies', 'Loyalty Programme', 'Danger Zone']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General')

  return (
    <div>
      <PageHeader title="Settings" subtitle="System configuration" />
      <div className="flex border-b border-gray-200 gap-0 mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-4 py-3 text-sm font-medium transition-colors', activeTab === tab ? 'border-b-2 border-brand text-brand' : 'text-gray-500 hover:text-gray-700')}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'General' && (
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Business Name</label><input defaultValue="Ezra Annex" className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Timezone</label><input defaultValue="Africa/Nairobi (EAT, UTC+3)" disabled className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2 bg-gray-50 text-gray-500" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Currency</label><input defaultValue="KES — Kenyan Shilling" disabled className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2 bg-gray-50 text-gray-500" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Business Phone</label><input defaultValue="+254 700 000 000" className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Email</label><input defaultValue="info@ezraannex.com" className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Address</label><textarea defaultValue="Nairobi, Kenya" rows={2} className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2 resize-none" /></div>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Operating Hours</h4>
          <table className="w-full mb-6"><tbody className="divide-y divide-gray-100">
            {DAYS.map((day, i) => (
              <tr key={day}><td className="py-2 text-sm text-gray-700 w-32">{day}</td>
                <td className="py-2"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked={i < 6} className="w-4 h-4 text-brand rounded" /><span className="text-xs text-gray-500">{i < 6 ? 'Open' : 'Closed'}</span></label></td>
                <td className="py-2"><input type="time" defaultValue="06:00" className="text-xs border border-gray-200 rounded px-2 py-1" /></td>
                <td className="py-2 text-xs text-gray-400 px-2">to</td>
                <td className="py-2"><input type="time" defaultValue="22:00" className="text-xs border border-gray-200 rounded px-2 py-1" /></td>
              </tr>
            ))}
          </tbody></table>
          <button onClick={() => toast.success('Settings saved')} className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-[7px] hover:bg-brand-light">Save Changes</button>
        </div>
      )}

      {activeTab === 'Integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'M-Pesa Daraja API', status: 'Connected', fields: ['Consumer Key', 'Consumer Secret', 'Shortcode', 'Passkey'] },
            { name: 'SMS Gateway', status: 'Connected', fields: ['API Key', 'Sender ID'] },
            { name: 'Claude AI', status: 'Not Connected', fields: ['API Key'] },
            { name: 'Google OAuth', status: 'Not Connected', fields: ['Client ID', 'Client Secret'] },
          ].map(int => (
            <div key={int.name} className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900">{int.name}</h4>
                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', int.status === 'Connected' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500')}>{int.status}</span>
              </div>
              <div className="space-y-3 mb-4">{int.fields.map(f => (
                <div key={f}><label className="text-xs text-gray-500 mb-0.5 block">{f}</label><input type={f.includes('Key') || f.includes('Secret') ? 'password' : 'text'} defaultValue={int.status === 'Connected' ? '••••••••' : ''} placeholder={f} className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2" /></div>
              ))}</div>
              <div className="flex gap-2">
                <button onClick={() => toast.success(`${int.name} saved`)} className="text-xs font-medium text-white bg-brand px-3 py-1.5 rounded-[7px]">Save</button>
                <button onClick={() => toast.success('Connection test passed')} className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-[7px] hover:bg-gray-50">Test Connection</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Booking Policies' && (
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 space-y-6">
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">Cancellation Policy</label><select className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2"><option>Free cancellation up to 24hrs before</option><option>Free cancellation up to 48hrs before</option><option>No refund on cancellation</option></select></div>
          <div><h4 className="text-xs font-medium text-gray-600 mb-2">Minimum Notice Period</h4>
            <table className="w-full text-sm"><tbody className="divide-y divide-gray-50">
              {['Salon & Spa', 'Boardroom', 'Ballroom', 'Gym', 'Accommodation'].map(s => (
                <tr key={s}><td className="py-2 text-gray-700">{s}</td><td className="py-2"><select className="text-xs border border-gray-200 rounded px-2 py-1"><option>1hr</option><option>2hrs</option><option>4hrs</option><option>24hrs</option><option>48hrs</option></select></td></tr>
              ))}
            </tbody></table>
          </div>
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">No-Show Policy</label><select className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2"><option>Charge full amount</option><option>Charge 50%</option><option>No charge</option></select></div>
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">Max Advance Booking (days)</label><input type="range" min={1} max={180} defaultValue={90} className="w-full" /><div className="text-xs text-gray-400 text-right">90 days</div></div>
          <div className="flex items-center gap-2"><input type="checkbox" defaultChecked className="w-4 h-4 text-brand rounded" /><label className="text-sm text-gray-700">Auto-confirm bookings</label></div>
          <button onClick={() => toast.success('Policies saved')} className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-[7px]">Save Changes</button>
        </div>
      )}

      {activeTab === 'Loyalty Programme' && (
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6 space-y-6">
          <div className="flex items-center gap-2"><input type="checkbox" defaultChecked className="w-4 h-4 text-brand rounded" /><label className="text-sm font-medium text-gray-700">Enable Loyalty Programme</label></div>
          <div><h4 className="text-xs font-medium text-gray-600 mb-3">Tier Thresholds (KES spent)</h4>
            <div className="grid grid-cols-2 gap-4">
              {[{ tier: 'Bronze', val: '0' }, { tier: 'Silver', val: '10000' }, { tier: 'Gold', val: '50000' }, { tier: 'Platinum', val: '200000' }].map(t => (
                <div key={t.tier}><label className="text-xs text-gray-500 mb-0.5 block">{t.tier}</label><input defaultValue={t.val} className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2" /></div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2"><span className="text-sm text-gray-700">1 point per KES</span><input defaultValue="100" className="w-16 text-sm border border-gray-200 rounded-[7px] px-2 py-1 text-center" /><span className="text-sm text-gray-700">spent</span></div>
          <div className="flex items-center gap-2"><input type="checkbox" defaultChecked className="w-4 h-4 text-brand rounded" /><span className="text-sm text-gray-700">Points expire after</span><input defaultValue="365" className="w-16 text-sm border border-gray-200 rounded-[7px] px-2 py-1 text-center" /><span className="text-sm text-gray-700">days</span></div>
          <button onClick={() => toast.success('Loyalty settings saved')} className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-[7px]">Save Changes</button>
        </div>
      )}

      {activeTab === 'Danger Zone' && (
        <div className="bg-white rounded-[10px] border-2 border-red-200 shadow-[var(--shadow-card)] p-6">
          <p className="text-sm text-red-600 mb-6">These actions are irreversible.</p>
          <div className="space-y-4">
            <button onClick={() => { if (confirm('Are you sure you want to clear all test data?')) toast.success('Test data cleared') }} className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-[7px] hover:bg-red-50">Clear All Test Data</button>
            <button onClick={() => toast.success('Export started')} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-[7px] hover:bg-gray-50 ml-3">Export All Data</button>
          </div>
        </div>
      )}
    </div>
  )
}
