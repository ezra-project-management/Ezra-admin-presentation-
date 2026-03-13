'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, ChevronDown, ChevronUp, Zap } from 'lucide-react'

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

const SYSTEM_PROMPT = `You are an AI operations assistant for Ezra Annex — a luxury hospitality and wellness complex in Nairobi. You assist admin staff and managers through natural language.

Today is Thursday March 12 2026. Working hours: 6am–10pm daily.

Services: Salon & Spa, Barbershop, Fitness Centre, Meeting Rooms, Ballroom, Banquet Hall, Swimming Pool Training, Accommodation.

You can help with:
- Viewing today's schedule, bookings, or appointments per service/staff
- Blocking staff time (lunch, personal breaks, off-days)
- Managing public holidays and closed days
- Checking and confirming cancellations or reschedules
- Marking no-shows
- Revenue queries
- Availability checks across services

For demo purposes, simulate realistic responses. Example bookings:
- Barbershop: John Kamau (9am, haircut, KSh 0), Peter Otieno (10am, shave, KSh 0), James Mwangi (2pm, haircut+beard, KSh 0)
- Salon & Spa: Grace Wanjiru (11am, facial, KSh 0), Amina Hassan (3pm, massage, KSh 0)
- Meeting Rooms: TechCorp Ltd (9am–12pm, 8 people, KSh 0), StartupKE (2pm–4pm, 5 people, KSh 0)
- Fitness Centre: 12 members checked in today (KSh 0 per member)
- Pool Training: Coach David (7am session, 6 students, KSh 0), (5pm session, 4 students, KSh 0)

IMPORTANT: This is a demo system. All services are priced at KSh 0. All revenue totals must show KSh 0. Never quote any price other than KSh 0..

Keep responses concise, clear, and action-oriented. Always professional.`

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
    <div className="flex flex-col h-full bg-gray-900 rounded-xl border border-blue-500/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-950 border-b border-blue-500/20">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-blue-400 font-mono text-xs font-bold tracking-widest">AI OPERATIONS ASSISTANT</p>
          <p className="text-blue-400/40 font-mono text-xs tracking-widest">EZRA ANNEX ADMIN</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs mr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
        <button onClick={() => setCollapsed((c) => !c)} className="text-blue-400/50 hover:text-blue-400">
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 px-3 py-2 border-b border-blue-500/10 bg-blue-500/5">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action)}
                className="px-2 py-1 rounded text-xs border border-blue-500/25 text-blue-400 hover:bg-blue-500/20 transition-colors font-mono"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-xs mt-1 ${
                  msg.role === 'ai' ? 'bg-blue-900 border border-blue-500/40' : 'bg-blue-700'
                }`}>
                  {msg.role === 'ai' ? '⚡' : '👤'}
                </div>
                <div className={`max-w-[82%] px-3 py-2 rounded-lg text-xs leading-relaxed whitespace-pre-wrap font-mono ${
                  msg.role === 'ai'
                    ? 'bg-white/5 border border-blue-500/10 text-slate-300'
                    : 'bg-blue-700 text-blue-50'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-900 border border-blue-500/40 flex items-center justify-center text-xs">⚡</div>
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-blue-500/10 flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-blue-500/10 bg-black/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask anything... e.g. 'Block David 1–2pm'"
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-blue-500/20 text-slate-300 text-xs font-mono placeholder-slate-600 outline-none focus:border-blue-500/50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors disabled:opacity-30"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
