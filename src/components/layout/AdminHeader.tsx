'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import * as Popover from '@radix-ui/react-popover'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { PanelLeftClose, Search, Bell, ChevronDown, User, Lock, LogOut, CalendarDays, CreditCard, AlertTriangle, Monitor } from 'lucide-react'
import { NOTIFICATIONS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface AdminHeaderProps {
  onMenuClick: () => void
}

const notificationIcons: Record<string, React.ElementType> = {
  booking: CalendarDays,
  payment: CreditCard,
  alert: AlertTriangle,
  system: Monitor,
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const unreadCount = notifications.filter(n => !n.read).length

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map(segment => segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-30 shrink-0">
      <button onClick={onMenuClick} className="text-gray-500 hover:text-gray-700 mr-4" aria-label="Toggle sidebar">
        <PanelLeftClose className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300">&gt;</span>}
            <span className={cn(i === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : 'text-gray-500')}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-400 hover:border-gray-300 mr-4">
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="hidden sm:inline text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>

      {/* Notifications */}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="relative p-2 text-gray-500 hover:text-gray-700" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="bg-white rounded-xl shadow-[var(--shadow-modal)] border border-gray-200 w-80 z-50"
            align="end"
            sideOffset={8}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-brand hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {notifications.map(n => {
                const Icon = notificationIcons[n.type] || Bell
                return (
                  <div key={n.id} className={cn('flex gap-3 px-4 py-3', !n.read && 'bg-blue-50/50')}>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 truncate">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-brand rounded-full mt-2 shrink-0" />}
                  </div>
                )
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-gray-100">
              <button className="text-xs text-brand font-medium hover:underline w-full text-center">
                View all notifications
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-200 mx-3" />

      {/* User dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-medium flex items-center justify-center">
              JK
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">James K.</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white rounded-lg shadow-[var(--shadow-elevated)] border border-gray-200 w-48 py-1 z-50"
            align="end"
            sideOffset={8}
          >
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none">
              <User className="w-4 h-4" /> Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer outline-none">
              <Lock className="w-4 h-4" /> Change Password
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer outline-none">
              <LogOut className="w-4 h-4" /> Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
