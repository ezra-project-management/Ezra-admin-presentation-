'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { SMS_TEMPLATES, type SmsTemplate } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'

const VARIABLES = ['{{name}}', '{{service}}', '{{ref}}', '{{date}}', '{{time}}', '{{amount}}']
const SAMPLE: Record<string, string> = { '{{name}}': 'Amara Kimani', '{{service}}': 'Salon & Spa', '{{ref}}': 'A1B2C3', '{{date}}': '10 Mar 2026', '{{time}}': '09:00 AM', '{{amount}}': '3,500' }

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<SmsTemplate[]>(SMS_TEMPLATES)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editMessage, setEditMessage] = useState('')
  const [editEnabled, setEditEnabled] = useState(true)

  const selected = templates.find(t => t.id === selectedId)

  const startEdit = (tpl: SmsTemplate) => {
    setSelectedId(tpl.id)
    setEditName(tpl.name)
    setEditMessage(tpl.message)
    setEditEnabled(tpl.enabled)
  }

  const save = () => {
    setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, name: editName, message: editMessage, enabled: editEnabled } : t))
    toast.success('Template saved')
  }

  const renderPreview = (msg: string) => {
    let result = msg
    for (const [key, val] of Object.entries(SAMPLE)) {
      result = result.replaceAll(key, val)
    }
    return result
  }

  const insertVariable = (v: string) => {
    setEditMessage(prev => prev + v)
  }

  return (
    <div>
      <PageHeader title="SMS Templates" subtitle="Manage automated message templates" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Template list */}
        <div className="lg:col-span-2 bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
          <div className="divide-y divide-gray-100">
            {templates.map(tpl => (
              <div
                key={tpl.id}
                className={cn('p-4 cursor-pointer hover:bg-gray-50 transition-colors', selectedId === tpl.id && 'bg-blue-50 border-l-2 border-brand')}
                onClick={() => startEdit(tpl)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{tpl.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{tpl.event}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={tpl.enabled}
                        onChange={() => setTemplates(prev => prev.map(t => t.id === tpl.id ? { ...t, enabled: !t.enabled } : t))}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-200 peer-checked:bg-brand rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                    <button className="p-1 text-gray-400 hover:text-brand" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-6">
          {!selected ? (
            <div className="text-center text-sm text-gray-400 py-16">Select a template to edit</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Template Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full text-base font-medium border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Event Trigger</label>
                <div className="text-sm bg-gray-50 border border-gray-200 rounded-[var(--input-radius)] px-3 py-2 text-gray-500">{selected.event}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Message</label>
                <textarea value={editMessage} onChange={e => setEditMessage(e.target.value)} rows={5} className="w-full font-mono text-sm border border-gray-200 rounded-[var(--input-radius)] p-4 resize-none focus:outline-none focus:ring-2 focus:ring-brand/20" />
                <div className={cn('text-xs text-right mt-0.5', editMessage.length > 160 ? 'text-red-500 font-medium' : 'text-gray-400')}>{editMessage.length}/160</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Insert Variable</label>
                <div className="flex flex-wrap gap-2">
                  {VARIABLES.map(v => (
                    <button key={v} onClick={() => insertVariable(v)} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors">{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Preview</label>
                <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-200">
                  <div className="text-xs text-gray-400 mb-2">Preview</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{renderPreview(editMessage)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">Enabled</label>
                <input type="checkbox" checked={editEnabled} onChange={e => setEditEnabled(e.target.checked)} className="w-4 h-4 text-brand rounded" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={save} className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-[var(--btn-radius)] hover:bg-brand-light">Save Changes</button>
                <button onClick={() => setSelectedId(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-[var(--btn-radius)] hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
