'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, CalendarDays, ShoppingCart, Scissors, Dumbbell, Monitor, Music,
  UtensilsCrossed, Waves, Bed, Users, UserCheck, TrendingUp, CreditCard, BarChart3,
  LineChart, MessageSquare, Settings, Shield, ScrollText, ChevronDown, LogOut,
} from 'lucide-react'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: { label: string; href: string }[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

/* ─── Service Bubbles ─── */
const SERVICE_BUBBLES = [
  { label: 'Salon', icon: Scissors, bg: 'bg-teal-400/90', glow: 'animate-glow-teal', count: 5, href: '/services/salon-spa' },
  { label: 'Gym', icon: Dumbbell, bg: 'bg-emerald-400/90', glow: 'animate-glow-teal', count: 3, href: '/services/gym' },
  { label: 'Rooms', icon: Bed, bg: 'bg-violet-400/90', glow: 'animate-glow-purple', count: 12, href: '/services/rooms' },
  { label: 'Pool', icon: Waves, bg: 'bg-cyan-400/90', glow: 'animate-glow-cyan', count: 1, href: '/services/swimming-pool' },
  { label: 'Events', icon: Music, bg: 'bg-amber-400/90', glow: 'animate-glow-amber', count: 2, href: '/services/ballroom' },
  { label: 'Board', icon: Monitor, bg: 'bg-blue-400/90', glow: 'animate-glow-pulse', count: 4, href: '/services/boardroom' },
]

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      {
        label: 'Bookings', href: '/bookings', icon: CalendarDays,
        children: [
          { label: 'All Bookings', href: '/bookings' },
          { label: 'Calendar View', href: '/bookings/calendar' },
          { label: 'Walk-in Queue', href: '/bookings/queue' },
        ],
      },
      {
        label: 'Point of Sale', href: '/pos/new', icon: ShoppingCart,
        children: [
          { label: 'New Transaction', href: '/pos/new' },
          { label: 'Transactions', href: '/pos/transactions' },
        ],
      },
    ],
  },
  {
    label: 'SERVICES',
    items: [
      { label: 'Salon & Spa', href: '/services/salon-spa', icon: Scissors },
      { label: 'Barbershop', href: '/services/barbershop', icon: Scissors },
      { label: 'Fitness Centre', href: '/services/gym', icon: Dumbbell },
      { label: 'Boardrooms', href: '/services/boardroom', icon: Monitor },
      { label: 'Ballroom', href: '/services/ballroom', icon: Music },
      { label: 'Banquet Hall', href: '/services/banquet-hall', icon: UtensilsCrossed },
      { label: 'Swimming Pool', href: '/services/swimming-pool', icon: Waves },
      { label: 'Accommodation', href: '/services/rooms', icon: Bed },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { label: 'Customers', href: '/customers', icon: Users },
      {
        label: 'Staff', href: '/staff', icon: UserCheck,
        children: [
          { label: 'Staff List', href: '/staff' },
          { label: 'Schedule', href: '/staff/schedule' },
        ],
      },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { label: 'Revenue', href: '/finance/revenue', icon: TrendingUp },
      { label: 'Payments', href: '/finance/payments', icon: CreditCard },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { label: 'Occupancy', href: '/analytics/occupancy', icon: BarChart3 },
      { label: 'Booking Trends', href: '/analytics/bookings', icon: LineChart },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        label: 'Communications', href: '/communications/sms', icon: MessageSquare,
        children: [
          { label: 'SMS Centre', href: '/communications/sms' },
          { label: 'Templates', href: '/communications/templates' },
        ],
      },
      { label: 'Settings', href: '/system/settings', icon: Settings },
      { label: 'Users & Roles', href: '/system/users', icon: Shield },
      { label: 'Audit Log', href: '/system/audit-log', icon: ScrollText },
    ],
  },
]

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <aside
      className="fixed left-0 top-0 h-full sidebar-gradient z-40 flex flex-col transition-all duration-300"
      style={{ width: collapsed ? 56 : 240 }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0">
        {collapsed ? (
          <span className="font-mono font-bold text-white text-lg mx-auto tracking-tight">EA</span>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center animate-glow-pulse">
              <span className="font-mono font-bold text-navy text-sm">EA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white leading-tight">Ezra Annex</span>
              <span className="text-[10px] font-medium bg-gradient-to-r from-cyan-400 to-blue-400 text-navy px-1.5 rounded w-fit">Admin</span>
            </div>
          </div>
        )}
      </div>

      {/* Service Bubbles — Colorful Oval Grid */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2 border-b border-white/10">
          <div className="grid grid-cols-3 gap-2">
            {SERVICE_BUBBLES.map((svc, i) => {
              const Icon = svc.icon
              return (
                <Link
                  key={svc.label}
                  href={svc.href}
                  className="service-bubble group flex flex-col items-center"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={cn(
                    'relative w-12 h-12 rounded-[18px] flex items-center justify-center',
                    svc.bg, svc.glow
                  )}>
                    <Icon className="w-5 h-5 text-white drop-shadow-sm" />
                    {/* Vertical count oval */}
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[22px] rounded-full bg-white text-[10px] font-bold text-navy flex items-center justify-center shadow-md border border-white/50 px-1">
                      {svc.count}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-200/80 mt-1 font-medium group-hover:text-white transition-colors">
                    {svc.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Collapsed bubbles - just icons */}
      {collapsed && (
        <div className="flex flex-col items-center gap-1.5 py-3 border-b border-white/10">
          {SERVICE_BUBBLES.slice(0, 4).map(svc => {
            const Icon = svc.icon
            return (
              <Link
                key={svc.label}
                href={svc.href}
                className={cn('relative w-9 h-9 rounded-xl flex items-center justify-center service-bubble', svc.bg)}
                title={svc.label}
              >
                <Icon className="w-4 h-4 text-white" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[8px] font-bold text-navy flex items-center justify-center shadow-sm">
                  {svc.count}
                </span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-0.5">
            {!collapsed && (
              <div className="text-[10px] font-semibold text-blue-300/50 uppercase tracking-widest px-4 mb-1 mt-4 first:mt-2">
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
                        'sidebar-nav-item flex items-center gap-3 px-3 py-2 text-sm rounded-lg mx-2 transition-all flex-1',
                        active
                          ? 'active text-white bg-white/12 font-medium backdrop-blur-sm'
                          : 'text-blue-100/70 hover:text-white hover:bg-white/8',
                        collapsed && 'justify-center px-0'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0 transition-colors', active ? 'text-cyan-300' : '')} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                    {hasChildren && !collapsed && (
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className="p-1 mr-2 text-blue-300/40 hover:text-white transition-colors"
                        aria-label={`Toggle ${item.label}`}
                      >
                        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  {hasChildren && isExpanded && !collapsed && (
                    <div className="ml-6 border-l border-white/10 mt-0.5 mb-1">
                      {item.children!.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block pl-4 pr-3 py-1.5 text-xs rounded-r-md mx-2 transition-all',
                            pathname === child.href
                              ? 'text-cyan-300 font-medium bg-white/10'
                              : 'text-blue-200/50 hover:text-white hover:bg-white/5'
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

      {/* User section */}
      <div className="border-t border-white/10 p-3 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-xs font-medium flex items-center justify-center shadow-lg">
              JK
            </div>
            <button className="text-blue-300/50 hover:text-red-400 transition-colors" aria-label="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-xs font-semibold flex items-center justify-center shrink-0 shadow-lg">
              JK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">James Kariuki</div>
              <div className="text-[10px] text-cyan-300/60">Manager</div>
            </div>
            <button className="text-blue-300/40 hover:text-red-400 transition-colors" aria-label="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
