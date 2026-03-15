'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, CalendarDays, ShoppingCart, Scissors, Dumbbell, Monitor, Music,
  UtensilsCrossed, Waves, Users, UserCheck, TrendingUp, CreditCard, BarChart3,
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
  { label: 'Salon', icon: Scissors, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&h=120&fit=crop&q=80', count: 5, href: '/services/salon-spa' },
  { label: 'Gym', icon: Dumbbell, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=120&fit=crop&q=80', count: 3, href: '/services/gym' },
{ label: 'Pool', icon: Waves, image: '/images/image-resizing-10.avif', count: 1, href: '/services/swimming-pool' },
  { label: 'Events', icon: Music, image: '/images/hero-banquet.jpeg', count: 2, href: '/services/ballroom' },
  { label: 'Board', icon: Monitor, image: '/images/image-resizing-6.avif', count: 4, href: '/services/boardroom' },
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
      className="fixed left-0 top-0 h-full sidebar-gradient z-40 flex flex-col transition-all duration-300 overflow-hidden"
      style={{ width: collapsed ? 56 : 240 }}
    >
      {/* Logo */}
      <div className="relative h-16 flex items-center px-4 border-b border-gold/12 shrink-0 z-10">
        {collapsed ? (
          <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-br from-gold via-amber-400 to-gold flex items-center justify-center shadow-lg shadow-gold/20 animate-glow-amber">
            <span className="font-mono font-bold text-navy text-sm tracking-tight">EA</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold via-amber-400 to-gold flex items-center justify-center shadow-lg shadow-gold/20 animate-glow-amber ring-1 ring-gold/30">
              <span className="font-mono font-bold text-navy text-sm">EA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-white leading-tight tracking-wide">Ezra Annex</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">Management</span>
            </div>
          </div>
        )}
      </div>

      {/* Service Bubbles — Image Grid */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-3 border-b border-gold/10">
          <div className="grid grid-cols-3 gap-2">
            {SERVICE_BUBBLES.map((svc, i) => (
              <Link
                key={svc.label}
                href={svc.href}
                className="service-bubble group flex flex-col items-center"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="relative w-[58px] h-[58px] rounded-[16px] overflow-hidden ring-1 ring-gold/20 group-hover:ring-gold/50 transition-all duration-300 shadow-lg group-hover:shadow-gold/20">
                  <Image
                    src={svc.image}
                    alt={svc.label}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="58px"
                  />
                  {/* Gold overlay sheen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-gold/10 group-hover:from-black/30 transition-all duration-300" />
                  {/* Count badge */}
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-gradient-to-br from-gold to-amber-400 text-[9px] font-bold text-navy flex items-center justify-center shadow-md px-1 z-10">
                    {svc.count}
                  </span>
                </div>
                <span className="text-[10px] text-gold/70 mt-1.5 font-medium group-hover:text-gold transition-colors tracking-wide">
                  {svc.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed bubbles - image thumbnails */}
      {collapsed && (
        <div className="flex flex-col items-center gap-2 py-3 border-b border-gold/10">
          {SERVICE_BUBBLES.slice(0, 4).map(svc => (
            <Link
              key={svc.label}
              href={svc.href}
              className="relative w-9 h-9 rounded-xl overflow-hidden service-bubble ring-1 ring-gold/20 hover:ring-gold/50 transition-all shadow-sm hover:shadow-gold/15"
              title={svc.label}
            >
              <Image src={svc.image} alt={svc.label} fill className="object-cover" sizes="36px" />
              <div className="absolute inset-0 bg-black/20" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-gold to-amber-400 text-[7px] font-bold text-navy flex items-center justify-center shadow-sm z-10">
                {svc.count}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-0.5">
            {!collapsed && (
              <div className="text-[9px] font-bold text-gold/35 uppercase tracking-[0.2em] px-4 mb-1 mt-5 first:mt-2">
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
                          : 'text-white/70 hover:text-white hover:bg-white/8',
                        collapsed && 'justify-center px-0'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn('w-4 h-4 shrink-0 transition-colors', active ? 'text-gold' : '')} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                    {hasChildren && !collapsed && (
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className="p-1 mr-2 text-gold/40 hover:text-white transition-colors"
                        aria-label={`Toggle ${item.label}`}
                      >
                        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  {hasChildren && isExpanded && !collapsed && (
                    <div className="ml-6 border-l border-gold/10 mt-0.5 mb-1">
                      {item.children!.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'block pl-4 pr-3 py-1.5 text-xs rounded-r-md mx-2 transition-all',
                            pathname === child.href
                              ? 'text-gold font-medium bg-white/10'
                              : 'text-amber-200/60 hover:text-white hover:bg-white/5'
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
      <div className="relative border-t border-gold/12 p-3 shrink-0 z-10">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-amber-500 text-navy text-xs font-bold flex items-center justify-center shadow-lg shadow-gold/15 ring-2 ring-gold/20">
              JK
            </div>
            <button className="text-gold/40 hover:text-red-400 transition-colors" aria-label="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-gradient-to-r from-gold/8 to-transparent rounded-xl p-2.5 border border-gold/8 hover:border-gold/15 transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold via-amber-400 to-gold text-navy text-xs font-bold flex items-center justify-center shrink-0 shadow-lg shadow-gold/15 ring-2 ring-gold/20">
              JK
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-white truncate">James Kariuki</div>
              <div className="text-[10px] font-medium bg-gradient-to-r from-gold to-amber-300 bg-clip-text text-transparent">Manager</div>
            </div>
            <button className="text-gold/30 hover:text-red-400 transition-colors" aria-label="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
