'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { RouteGuard } from '@/components/auth/RouteGuard'
import { hasSession } from '@/lib/admin-session'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [gate, setGate] = useState<'checking' | 'ok' | 'redirect'>('checking')

  useEffect(() => {
    if (!hasSession()) {
      router.replace('/auth/login')
      setGate('redirect')
      return
    }
    setGate('ok')
  }, [router])

  if (gate !== 'ok') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-sm text-gray-500">
        {gate === 'checking' ? 'Loading…' : 'Redirecting to sign in…'}
      </div>
    )
  }

  return (
    <RouteGuard>
      <div className="flex h-screen overflow-hidden bg-[#f4f5f7]">
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <div
          className="flex-1 flex flex-col overflow-hidden transition-[margin] duration-300 ease-in-out"
          style={{ marginLeft: collapsed ? 56 : 240 }}
        >
          <AdminHeader onMenuClick={() => setCollapsed(!collapsed)} />
          <main className="flex-1 overflow-auto p-6">
            <div className="page-content">{children}</div>
          </main>
        </div>
      </div>
    </RouteGuard>
  )
}
