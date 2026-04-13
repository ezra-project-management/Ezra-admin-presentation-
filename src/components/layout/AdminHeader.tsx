'use client'

import { useLayoutEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import * as Popover from '@radix-ui/react-popover'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  PanelLeftClose,
  Search,
  Bell,
  ChevronDown,
  User,
  Lock,
  LogOut,
  CalendarDays,
  CreditCard,
  AlertTriangle,
  Monitor,
  ChevronRight,
} from 'lucide-react'
import { NOTIFICATIONS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { clearSession, getSessionEmail, getSessionRole } from '@/lib/admin-session'
import { getStaffProfileByEmail, ROLE_LABELS } from '@/lib/roles'

interface AdminHeaderProps {
  onMenuClick: () => void
}

const notificationIcons: Record<string, React.ElementType> = {
  booking: CalendarDays,
  payment: CreditCard,
  alert: AlertTriangle,
  system: Monitor,
}

function initials(name: string): string {
  const p = name.trim().split(/\s+/)
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || '—'
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [email, setEmail] = useState('')
  const unreadCount = notifications.filter(n => !n.read).length

  useLayoutEffect(() => {
    setEmail(getSessionEmail())
  }, [pathname])

  const profile = getStaffProfileByEmail(email)
  const displayName = profile?.name ?? (email.split('@')[0] || 'User')
  const headerInitials = initials(profile?.name ?? (email || 'U'))
  const roleLabel = getSessionRole() ? ROLE_LABELS[getSessionRole()!] : ''

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map(segment => segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const doLogout = () => {
    clearSession()
    router.push('/auth/login')
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 flex items-center px-4 sm:px-6 sticky top-0 z-30 shrink-0">
      <button
        type="button"
        onClick={onMenuClick}
        className="text-slate-500 hover:text-slate-800 mr-3 p-1 rounded-md hover:bg-slate-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        <PanelLeftClose className="w-5 h-5" />
      </button>

      <nav className="flex items-center gap-1 text-[13px] text-slate-500 min-w-0" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
            <span
              className={cn(
                'truncate',
                i === breadcrumbs.length - 1 ? 'font-medium text-slate-900' : 'text-slate-500'
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex-1 min-w-4" />

      <button
        type="button"
        className="hidden md:flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 text-[13px] text-slate-400 hover:border-slate-300 hover:bg-slate-50/80 transition-colors mr-3"
      >
        <Search className="w-4 h-4 text-slate-400" />
        <span>Search</span>
        <kbd className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono border border-slate-200/80">
          ⌘K
        </kbd>
      </button>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="relative p-2 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="bg-white rounded-lg shadow-[var(--shadow-modal)] border border-slate-200 w-[min(100vw-2rem,20rem)] z-50"
            align="end"
            sideOffset={8}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} className="text-xs font-medium text-brand hover:underline">
                  Mark read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
              {notifications.map(n => {
                const Icon = notificationIcons[n.type] || Bell
                return (
                  <div key={n.id} className={cn('flex gap-3 px-4 py-3', !n.read && 'bg-slate-50/80')}>
                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100">
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 truncate">{n.message}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 bg-brand rounded-full mt-2 shrink-0" />}
                  </div>
                )
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100">
              <button
                type="button"
                className="text-xs font-medium text-brand hover:underline w-full text-center text-slate-600"
              >
                View all
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <div className="h-6 w-px bg-slate-200 mx-2 sm:mx-3" />

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 hover:bg-slate-100 rounded-md px-2 py-1.5 transition-colors max-w-[200px]"
          >
            <div className="w-8 h-8 rounded-md bg-slate-800 text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
              {headerInitials}
            </div>
            <div className="hidden sm:flex flex-col items-start min-w-0 text-left">
              <span className="text-[13px] font-medium text-slate-800 truncate w-full">{displayName}</span>
              {roleLabel && <span className="text-[11px] text-slate-500 truncate w-full">{roleLabel}</span>}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white rounded-lg shadow-[var(--shadow-elevated)] border border-slate-200 w-48 py-1 z-50"
            align="end"
            sideOffset={8}
          >
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer outline-none">
              <User className="w-4 h-4" /> Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer outline-none">
              <Lock className="w-4 h-4" /> Password
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer outline-none"
              onSelect={doLogout}
            >
              <LogOut className="w-4 h-4" /> Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
