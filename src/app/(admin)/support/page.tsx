'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import {
  LifeBuoy,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  BookOpen,
  Send,
  Headphones,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/utils'

const CHANNELS = [
  {
    title: 'Operations hotline',
    detail: '+254 700 000 000',
    hint: 'Bookings, walk-ins, and day-of issues',
    icon: Phone,
  },
  {
    title: 'IT & portal help',
    detail: 'support@ezraannex.com',
    hint: 'Login, permissions, and console bugs',
    icon: Mail,
  },
  {
    title: 'WhatsApp (priority)',
    detail: '+254 711 000 000',
    hint: 'Fastest for short questions during business hours',
    icon: MessageCircle,
  },
] as const

const HOURS = [
  { label: 'Front desk & phone', value: 'Mon–Sun · 6:00 – 22:00 EAT' },
  { label: 'IT / technical', value: 'Mon–Fri · 8:00 – 18:00 EAT · emergency line after hours' },
]

const RESOURCES = [
  { title: 'Staff quick guide', description: 'Roles, bookings flow, and POS basics (PDF).' },
  { title: 'M-Pesa & reconciliation', description: 'Finance checklist for settlements and refunds.' },
  { title: 'Privacy & guest identity', description: 'How guest references work on staff screens.' },
]

export default function SupportPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Please add a subject and a short description.')
      return
    }
    toast.success('Request logged. Reference: EZR-SUP-' + String(Math.floor(1000 + Math.random() * 9000)))
    setSubject('')
    setMessage('')
    setPriority('normal')
  }

  return (
    <div>
      <PageHeader
        title="Support"
        subtitle="Help for Ezra Annex staff — operations, finance, and technical assistance."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0f2c4a] to-[#1a3f63] rounded-[10px] border border-slate-700/50 shadow-[var(--shadow-card)] p-6 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-white/90" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">We are here for your shift</h2>
              <p className="text-sm text-white/75 mt-1 leading-relaxed">
                Use the channels on the right for live help. For anything that affects guests at the desk, call the
                operations line first. For portal access, exports, or integrations, email IT with your work email so we
                can verify your account.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm mb-3">
            <Clock className="w-4 h-4 text-brand" />
            Response times (demo)
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between gap-2">
              <span>Urgent (guest on site)</span>
              <span className="text-gray-900 font-medium">&lt; 15 min</span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Standard</span>
              <span className="text-gray-900 font-medium">Same business day</span>
            </li>
            <li className="flex justify-between gap-2">
              <span>IT / integrations</span>
              <span className="text-gray-900 font-medium">1–2 business days</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {CHANNELS.map(ch => (
          <div
            key={ch.title}
            className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-5 flex flex-col"
          >
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm mb-2">
              <ch.icon className="w-4 h-4 text-brand" />
              {ch.title}
            </div>
            <p className="text-sm font-mono text-gray-900 break-all">{ch.detail}</p>
            <p className="text-xs text-gray-500 mt-2 flex-1">{ch.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-brand" />
            Log a support ticket
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Subject</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Cannot access ballroom calendar"
                className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Priority</label>
              <div className="flex gap-2">
                {(['normal', 'urgent'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      'flex-1 text-xs font-medium py-2 rounded-[7px] border transition-colors',
                      priority === p
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {p === 'urgent' ? 'Urgent' : 'Normal'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">What happened?</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Steps to reproduce, screen name, approximate time…"
                className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2 resize-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-[7px] hover:bg-brand-light w-full sm:w-auto"
            >
              <Send className="w-4 h-4" />
              Submit ticket
            </button>
            <p className="text-[11px] text-gray-400">
              Demo only: tickets are not sent to a live system. In production this would create a case in your help desk.
            </p>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" />
              Hours
            </h3>
            <ul className="space-y-3">
              {HOURS.map(row => (
                <li key={row.label} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="text-gray-900 font-medium text-right">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand" />
              Internal resources
            </h3>
            <ul className="space-y-3">
              {RESOURCES.map(r => (
                <li key={r.title}>
                  <button
                    type="button"
                    onClick={() => toast.message('Demo: document would open from your intranet.')}
                    className="text-left w-full group"
                  >
                    <span className="text-sm font-medium text-brand group-hover:underline">{r.title}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
