'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const ROLES = [
  { label: 'STAFF', email: 'staff@ezraannex.com' },
  { label: 'MANAGER', email: 'manager@ezraannex.com' },
  { label: 'ADMIN', email: 'admin@ezraannex.com' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  const selectRole = (role: string, roleEmail: string) => {
    setSelectedRole(role)
    setEmail(roleEmail)
    setPassword('demo1234')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-[var(--shadow-elevated)] p-8">
          {/* Logo */}
          <div className="text-center mb-2">
            <span className="font-mono font-bold text-2xl text-navy">EA</span>
            <div className="text-sm font-semibold tracking-wider text-gray-900 mt-1">EZRA ANNEX</div>
            <div className="text-xs text-gray-400 mt-0.5">Admin Dashboard</div>
          </div>

          <div className="h-px bg-gold my-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@ezraannex.com"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Quick Login</label>
              <div className="flex gap-2">
                {ROLES.map(role => (
                  <button
                    key={role.label}
                    type="button"
                    onClick={() => selectRole(role.label, role.email)}
                    className={cn(
                      'flex-1 py-2 text-xs font-medium rounded-[var(--btn-radius)] border transition-colors',
                      selectedRole === role.label
                        ? 'bg-navy text-white border-navy'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 border-gray-300 rounded text-brand focus:ring-brand"
              />
              <label htmlFor="remember" className="text-xs text-gray-500">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-navy text-white font-semibold rounded-[var(--btn-radius)] hover:bg-navy-light transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-4">
            This portal is for authorised Ezra Annex staff only.
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400 space-y-0.5">
          <p className="font-medium text-gray-500">Demo logins:</p>
          <p>Staff → staff@ezraannex.com</p>
          <p>Manager → manager@ezraannex.com</p>
          <p>Admin → admin@ezraannex.com</p>
        </div>
      </div>
    </div>
  )
}
