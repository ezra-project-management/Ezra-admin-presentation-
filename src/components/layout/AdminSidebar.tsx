'use client'

import { useLayoutEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { clearSession, getSessionEmail, getSessionRole } from '@/lib/admin-session'
import { filterNavGroups, filterServiceBubbles, type NavGroup } from '@/lib/nav-config'
import { getStaffProfileByEmail, ROLE_LABELS, type PortalRole } from '@/lib/roles'
import { cn } from '@/lib/utils'
import { ChevronDown, LogOut } from 'lucide-react'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

function initialsFromName(name: string): string {
  const p = name.trim().split(/\s+/)
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase() || 'EA'
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [role, setRole] = useState<PortalRole | null>(null)
  const [email, setEmail] = useState('')

  useLayoutEffect(() => {
    setEmail(getSessionEmail())
    setRole(getSessionRole())
  }, [pathname])

  const navGroups = useMemo(() => {
    const r = role ?? 'STAFF'
    return filterNavGroups(r, email)
  }, [role, email])

  const bubbles = useMemo(() => {
    const r = role ?? 'STAFF'
    return filterServiceBubbles(r, email)
  }, [role, email])

  const displayName = useMemo(() => {
    const p = getStaffProfileByEmail(email)
    return p?.name ?? (email.split('@')[0] || 'User')
  }, [email])

  const roleLabel = role ? ROLE_LABELS[role] : '…'

  const avatarLetters = useMemo(() => {
    const p = getStaffProfileByEmail(email)
    return initialsFromName(p?.name ?? email)
  }, [email])

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/finance' && pathname.startsWith(href + '/'))

  const handleLogout = () => {
    clearSession()
    router.push('/auth/login')
  }

  return (
    <aside
      className="fixed left-0 top-0 h-full sidebar-gradient z-40 flex flex-col transition-all duration-300 overflow-hidden"
      style={{ width: collapsed ? 56 : 240 }}
    >
      <div className="relative h-14 flex items-center px-3 border-b border-slate-700/80 shrink-0 z-10">
        {collapsed ? (
          <div className="w-8 h-8 mx-auto rounded-md bg-slate-800 border border-slate-600/80 flex items-center justify-center">
            <span className="font-mono text-[11px] font-semibold text-slate-200 tracking-tight">EA</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-600/80 flex items-center justify-center shrink-0">
              <span className="font-mono text-[11px] font-semibold text-slate-200">EA</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-slate-100 leading-tight truncate">Ezra Center</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                {role === 'FINANCE' ? 'Finance' : role === 'SECRETARY' ? 'Front desk' : 'Console'}
              </span>
            </div>
          </div>
        )}
      </div>

      {!collapsed && bubbles.length > 0 && (
        <div className="px-3 pt-3 pb-3 border-b border-slate-700/80">
          <div className="grid grid-cols-3 gap-2">
            {bubbles.map(svc => (
              <Link key={svc.label} href={svc.href} className="service-bubble group flex flex-col items-center">
                <div className="relative w-[52px] h-[52px] rounded-lg overflow-hidden ring-1 ring-slate-600/80 group-hover:ring-slate-500 transition-all">
                  <Image
                    src={svc.image}
                    alt={svc.label}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    sizes="52px"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded bg-slate-900/85 text-[9px] font-semibold text-slate-200 flex items-center justify-center z-10 border border-slate-600/50">
                    {svc.count}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 font-medium group-hover:text-slate-300 transition-colors">
                  {svc.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {collapsed && bubbles.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-3 border-b border-slate-700/80">
          {bubbles.slice(0, 4).map(svc => (
            <Link
              key={svc.label}
              href={svc.href}
              className="relative w-9 h-9 rounded-lg overflow-hidden service-bubble ring-1 ring-slate-600/80 hover:ring-slate-500 transition-all"
              title={svc.label}
            >
              <Image src={svc.image} alt={svc.label} fill className="object-cover" sizes="36px" />
              <div className="absolute inset-0 bg-black/20" />
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded text-[6px] font-bold bg-slate-900/90 text-slate-200 flex items-center justify-center z-10 border border-slate-600/60">
                {svc.count}
              </span>
            </Link>
          ))}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        {navGroups.map((group: NavGroup) => (
          <div key={group.label} className="mb-0.5">
            {!collapsed && (
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 mb-1 mt-4 first:mt-2">
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const Icon = item.icon
              const active = isActive(item.href)
              const hasChildren = item.children && item.children.length > 0
              const isExpanded = expandedItems[item.label] ?? active

              return (
                <div key={item.label}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        'sidebar-nav-item flex items-center gap-3 px-3 py-2 text-[13px] rounded-md mx-2 flex-1',
                        active
                          ? 'active text-slate-50 font-medium'
                          : 'text-slate-400 hover:text-slate-100',
                        collapsed && 'justify-center px-0'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-slate-200' : 'text-slate-500')} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                    {hasChildren && !collapsed && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.label)}
                        className="p-1 mr-2 text-slate-500 hover:text-slate-300 transition-colors"
                        aria-label={`Toggle ${item.label}`}
                      >
                        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  {hasChildren && isExpanded && !collapsed && (
                    <div className="ml-6 border-l border-slate-700 mt-0.5 mb-1">
                      {item.children!.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block pl-4 pr-3 py-1.5 text-[12px] rounded-r-md mx-2 transition-colors',
                            pathname === child.href
                              ? 'text-slate-100 font-medium bg-white/5'
                              : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="relative border-t border-slate-700/80 p-3 shrink-0 z-10">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-md bg-slate-800 border border-slate-600/80 text-slate-200 text-[10px] font-semibold flex items-center justify-center">
              {avatarLetters}
            </div>
            <button type="button" onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" aria-label="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg p-2 border border-slate-700/80 bg-slate-800/40">
            <div className="w-9 h-9 rounded-md bg-slate-800 border border-slate-600/80 text-slate-200 text-[10px] font-semibold flex items-center justify-center shrink-0">
              {avatarLetters}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-slate-100 truncate">{displayName}</div>
              <div className="text-[10px] font-medium text-slate-500 truncate">{roleLabel}</div>
            </div>
            <button type="button" onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors p-1" aria-label="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
