'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className="flex-1 flex flex-col overflow-hidden transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? 56 : 240 }}
      >
        <AdminHeader onMenuClick={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-auto p-6">
          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
