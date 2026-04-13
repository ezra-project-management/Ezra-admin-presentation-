'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, ChevronDown, ChevronUp } from 'lucide-react'
import { PRICING_BY_SERVICE, SERVICE_STARTING_PRICE_KES } from '@/lib/service-pricing'

function pricingLinesForPrompt(): string {
  const starts = Object.entries(SERVICE_STARTING_PRICE_KES)
    .map(([slug, n]) => `• ${slug.replace(/-/g, ' ')}: from KES ${n.toLocaleString()}`)
    .join('\n')
  const menus = Object.entries(PRICING_BY_SERVICE)
    .map(([slug, rows]) => {
      const bits = rows.map((r) => `${r.item} ${r.duration} KES ${r.price.toLocaleString()}`).join('; ')
      return `• ${slug}: ${bits}`
    })
    .join('\n')
  return `Starting-from (lowest menu item per venue):\n${starts}\n\nFull menu (KES):\n${menus}`
}

interface Message {
  id: string
  role: 'ai' | 'user'
  text: string
}

const QUICK_ACTIONS = [
  "Show today's full schedule",
  "Block John's schedule 1–2pm",
  "Any cancellations today?",
  "How many bookings this week?",
  "Is the boardroom free at 3pm?",
  "Mark a client as no-show",
]

const initialMessage: Message = {
  id: '1',
  role: 'ai',
  text: "Good day! I'm your Ezra Annex operations assistant. I can help you manage schedules, block staff time, check bookings, handle cancellations, and pull reports. What do you need?",
}

const SYSTEM_PROMPT = `You are the Ezra Annex operations assistant (demo admin). Today is Thursday March 12 2026. Working hours: 6am–10pm daily.

Services: Salon & Spa, Barbershop, Fitness Centre, Meeting Rooms, Ballroom, Banquet Hall, Swimming Pool Training.

Use ONLY the following Kenyan Shilling (KES) pricing from our canonical menu — do not invent other amounts:
${pricingLinesForPrompt()}

You can help with:
- Schedules, bookings, staff blocks, holidays, cancellations, reschedules, no-shows
- Availability checks and rough quotes using the menu above
- Revenue questions: use plausible totals consistent with demo bookings and these price points (not zero unless nothing was sold)

Example booking amounts for tone: barbershop haircut+beard KES 1,200; salon facial KES 2,500; gym day pass KES 1,200; boardroom half-day KES 12,000; pool lane KES 2,500.

Keep responses concise, clear, and professional.`

export function AdminAIPanel() {
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text: string) => {
    const msg = text.trim()
    if (!msg) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: msg,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [...messages, userMessage]
  .filter((m) => m.id !== '1')
  .map((m) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.text,
  })),
        }),
      })
      const data = await response.json()
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.content?.[0]?.text || 'Sorry, I could not process that.',
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: 'Connection issue. Please try again.',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-950 border-b border-slate-700/80">
        <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center border border-slate-600/80">
          <Bot className="w-4 h-4 text-slate-200" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Assistant</p>
          <p className="text-[11px] text-slate-500 truncate">Operations queries · demo</p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="text-slate-500 hover:text-slate-300 p-1 rounded"
          aria-label={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-slate-700/80 bg-slate-900/50">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action}
                type="button"
                onClick={() => sendMessage(action)}
                className="px-2 py-1 rounded-md text-[11px] border border-slate-600/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors text-left max-w-full"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                  className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5 border ${
                    msg.role === 'ai' ? 'bg-slate-800 border-slate-600' : 'bg-brand border-brand'
                  }`}
                >
                  {msg.role === 'ai' ? <Bot className="w-3 h-3 text-slate-300" /> : <span className="text-[10px] text-white font-medium">You</span>}
                </div>
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-md text-[12px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'ai' ? 'bg-slate-800/80 border border-slate-700 text-slate-300' : 'bg-brand text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-600 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-slate-400" />
                </div>
                <div className="px-3 py-2 rounded-md bg-slate-800/80 border border-slate-700 flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 p-3 border-t border-slate-700/80 bg-slate-950">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask a question…"
              className="flex-1 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-200 text-[12px] placeholder-slate-500 outline-none focus:border-slate-500"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-md bg-brand flex items-center justify-center text-white hover:bg-brand-light transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
