'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getSessionEmail, getSessionRole, syncRoleFromEmail } from '@/lib/admin-session'
import { canAccessPath, defaultHomeForRole } from '@/lib/roles'

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    syncRoleFromEmail()
  }, [pathname])

  useEffect(() => {
    const email = getSessionEmail()
    const role = getSessionRole()
    if (!email || !role) return
    if (!canAccessPath(role, pathname, email)) {
      router.replace(defaultHomeForRole(role))
    }
  }, [pathname, router])

  return <>{children}</>
}
