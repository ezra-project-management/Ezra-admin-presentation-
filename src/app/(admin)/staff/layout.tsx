'use client'

import { useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSessionEmail, getSessionRole } from '@/lib/admin-session'
import { canAccessPath, defaultHomeForRole } from '@/lib/roles'

export default function StaffSectionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useLayoutEffect(() => {
    const role = getSessionRole()
    const email = getSessionEmail()
    if (!role) {
      setAllowed(false)
      router.replace('/auth/login')
      return
    }
    const ok = canAccessPath(role, '/staff', email)
    setAllowed(ok)
    if (!ok) {
      router.replace(defaultHomeForRole(role))
    }
  }, [router])

  if (allowed === false) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-sm text-gray-500">
        Redirecting…
      </div>
    )
  }

  if (allowed === null) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-sm text-gray-500">
        Loading…
      </div>
    )
  }

  return <>{children}</>
}
