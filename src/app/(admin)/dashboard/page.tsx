'use client'

import { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionEmail, getSessionRole } from '@/lib/admin-session'
import type { PortalRole } from '@/lib/roles'
import { getStaffProfileByEmail } from '@/lib/roles'
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard'
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard'
import { StaffDashboard } from '@/components/dashboard/StaffDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<PortalRole | null>(null)
  const [email, setEmail] = useState('')

  useLayoutEffect(() => {
    const r = getSessionRole()
    const e = getSessionEmail()
    if (r === 'FINANCE') {
      router.replace('/finance')
    }
    if (r === 'SECRETARY') {
      router.replace('/secretary')
    }
    setEmail(e)
    setRole(r)
  }, [router])

  if (role === null) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-500">
        Loading dashboard…
      </div>
    )
  }

  if (role === 'FINANCE') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-500">
        Opening finance desk…
      </div>
    )
  }

  if (role === 'SECRETARY') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-500">
        Opening front desk…
      </div>
    )
  }

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />
  }

  if (role === 'MANAGER') {
    return <ManagerDashboard />
  }

  const profile = getStaffProfileByEmail(email)
  if (role === 'STAFF' && profile) {
    return <StaffDashboard profile={profile} />
  }

  return (
    <div className="text-sm text-gray-600">
      Your account is not linked to a staff profile. Sign in with a named staff email or contact Super Admin.
    </div>
  )
}
