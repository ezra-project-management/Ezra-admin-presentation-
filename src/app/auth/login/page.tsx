'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { setSession, hasSession, getSessionRole } from '@/lib/admin-session'
import { DEMO_STAFF_CREDENTIALS } from '@/lib/mock-data'
import { defaultHomeForRole, resolveRoleFromEmail, type PortalRole } from '@/lib/roles'

const QUICK_ROLES: { label: string; email: string; role: PortalRole }[] = [
  { label: 'STAFF', email: 'staff@ezraannex.com', role: 'STAFF' },
  { label: 'MANAGER', email: 'manager@ezraannex.com', role: 'MANAGER' },
  { label: 'DESK', email: 'secretary@ezraannex.com', role: 'SECRETARY' },
  { label: 'ADMIN', email: 'admin@ezraannex.com', role: 'SUPER_ADMIN' },
  { label: 'FINANCE', email: 'finance@ezraannex.com', role: 'FINANCE' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    if (hasSession()) {
      const r = getSessionRole()
      if (r) router.replace(defaultHomeForRole(r))
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    setSession(trimmed, resolveRoleFromEmail(trimmed))
    router.push(defaultHomeForRole(resolveRoleFromEmail(trimmed)))
  }

  const selectQuickRole = (label: string, roleEmail: string, role: PortalRole) => {
    setSelectedRole(label)
    setEmail(roleEmail)
    setPassword('demo1234')
    setSession(roleEmail, role)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-[var(--shadow-card)] px-8 py-9">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-md bg-slate-900 flex items-center justify-center shrink-0">
                <span className="font-mono text-sm font-semibold text-white tracking-tight">EA</span>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Ezra Annex</p>
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight leading-tight">Operations sign-in</h1>
              </div>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              Use your work email. Each role opens a different slice of the building — floor, desk, back office, or full control.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@ezraannex.com"
                autoComplete="email"
                className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-md bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand focus:bg-white transition-shadow"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 text-[13px] border border-slate-200 rounded-md bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand focus:bg-white pr-10 transition-shadow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mb-2">Demo role presets</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_ROLES.map(r => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => selectQuickRole(r.label, r.email, r.role)}
                    className={cn(
                      'py-2 px-2 text-xs font-medium rounded-md border transition-colors',
                      selectedRole === r.label
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 border-slate-300 rounded text-brand focus:ring-brand"
              />
              <label htmlFor="remember" className="text-xs text-slate-600">
                Keep me signed in on this device
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand text-white text-sm font-semibold rounded-md hover:bg-brand-light transition-colors shadow-sm"
            >
              Continue
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3 text-center">
          <p className="text-[11px] font-medium text-slate-600">Demo environment · password for all accounts: demo1234</p>
          <p className="text-[11px] text-slate-500 mt-1">Finance: finance@ezraannex.com</p>
        </div>

        <details className="mt-4 text-center">
          <summary className="text-[11px] text-slate-500 cursor-pointer hover:text-slate-700 list-none">
            <span className="underline underline-offset-2">Named staff accounts</span>
          </summary>
          <div className="mt-3 text-left text-[11px] text-slate-500 space-y-1 max-h-40 overflow-y-auto border-t border-slate-200 pt-3">
            {DEMO_STAFF_CREDENTIALS.map(row => (
              <p key={row.email}>
                <span className="font-mono text-slate-700">{row.email}</span>
                <span className="text-slate-400"> — {row.role}</span>
              </p>
            ))}
          </div>
        </details>
      </div>
    </div>
  )
}
