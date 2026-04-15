import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingCart,
  Scissors,
  Dumbbell,
  Monitor,
  Music,
  UtensilsCrossed,
  Waves,
  Users,
  UserCheck,
  TrendingUp,
  CreditCard,
  BarChart3,
  LineChart,
  MessageSquare,
  Settings,
  Shield,
  ScrollText,
  Landmark,
  LifeBuoy,
  Wallet,
  ConciergeBell,
} from 'lucide-react'
import type { PortalRole } from '@/lib/roles'
import { canAccessPath, getStaffProfileByEmail } from '@/lib/roles'

export interface NavChild {
  label: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  children?: NavChild[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const SERVICE_BUBBLES = [
  { label: 'Salon', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=120&h=120&fit=crop&q=80', count: 5, href: '/services/salon-spa', slug: 'salon-spa' as const },
  { label: 'Gym', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=120&h=120&fit=crop&q=80', count: 3, href: '/services/gym', slug: 'gym' as const },
  { label: 'Pool', image: '/images/image-resizing-10.avif', count: 1, href: '/services/swimming-pool', slug: 'swimming-pool' as const },
  { label: 'Events', image: '/images/hero-banquet.jpeg', count: 2, href: '/services/ballroom', slug: 'ballroom' as const },
  { label: 'Board', image: '/images/image-resizing-6.avif', count: 4, href: '/services/boardroom', slug: 'boardroom' as const },
]

/** Slim sidebar for front desk: fewer sections, plain labels, no staff or system tools. */
const SECRETARY_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Start',
    items: [{ label: 'Front desk home', href: '/secretary', icon: ConciergeBell }],
  },
  {
    label: 'Bookings',
    items: [
      {
        label: 'Bookings',
        href: '/bookings',
        icon: CalendarDays,
        children: [
          { label: 'All bookings', href: '/bookings' },
          { label: 'Calendar', href: '/bookings/calendar' },
          { label: 'Walk-in queue', href: '/bookings/queue' },
        ],
      },
    ],
  },
  {
    label: 'Sales',
    items: [
      {
        label: 'Point of sale',
        href: '/pos/new',
        icon: ShoppingCart,
        children: [
          { label: 'New sale', href: '/pos/new' },
          { label: 'Transactions', href: '/pos/transactions' },
        ],
      },
    ],
  },
  {
    label: 'Guests',
    items: [{ label: 'Customers', href: '/customers', icon: Users }],
  },
  {
    label: 'Outreach',
    items: [
      {
        label: 'Communications',
        href: '/communications/sms',
        icon: MessageSquare,
        children: [
          { label: 'SMS centre', href: '/communications/sms' },
          { label: 'Templates', href: '/communications/templates' },
        ],
      },
    ],
  },
  {
    label: 'At a glance',
    items: [
      { label: 'Occupancy', href: '/analytics/occupancy', icon: BarChart3 },
      { label: 'Booking trends', href: '/analytics/bookings', icon: LineChart },
    ],
  },
  {
    label: 'Help',
    items: [{ label: 'Support', href: '/support', icon: LifeBuoy }],
  },
]

const NAV_GROUPS_FULL: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'OPERATIONS',
    items: [
      {
        label: 'Bookings',
        href: '/bookings',
        icon: CalendarDays,
        children: [
          { label: 'All Bookings', href: '/bookings' },
          { label: 'Calendar View', href: '/bookings/calendar' },
          { label: 'Walk-in Queue', href: '/bookings/queue' },
        ],
      },
      {
        label: 'Point of Sale',
        href: '/pos/new',
        icon: ShoppingCart,
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
        label: 'Staff',
        href: '/staff',
        icon: UserCheck,
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
      { label: 'Finance desk', href: '/finance', icon: Landmark },
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
        label: 'Communications',
        href: '/communications/sms',
        icon: MessageSquare,
        children: [
          { label: 'SMS Centre', href: '/communications/sms' },
          { label: 'Templates', href: '/communications/templates' },
        ],
      },
      { label: 'Settings', href: '/system/settings', icon: Settings },
      { label: 'Users & Roles', href: '/system/users', icon: Shield },
      { label: 'Audit Log', href: '/system/audit-log', icon: ScrollText },
      { label: 'Support', href: '/support', icon: LifeBuoy },
    ],
  },
]

function filterChildren(
  role: PortalRole,
  email: string,
  parentLabel: string,
  children: NavChild[] | undefined
): NavChild[] | undefined {
  if (!children?.length) return undefined
  const profile = getStaffProfileByEmail(email)
  const isBarber = profile?.departments.includes('barbershop')

  return children.filter(ch => {
    if (ch.href === '/bookings/queue' && role === 'STAFF' && !isBarber) return false
    return canAccessPath(role, ch.href, email)
  })
}

function filterNavItem(role: PortalRole, email: string, item: NavItem): NavItem | null {
  if (item.children?.length) {
    const kids = filterChildren(role, email, item.label, item.children)
    if (!kids?.length) return null
    const href = canAccessPath(role, item.href, email) ? item.href : kids[0].href
    return { ...item, href, children: kids }
  }
  return canAccessPath(role, item.href, email) ? item : null
}

export function filterNavGroups(role: PortalRole, email: string): NavGroup[] {
  if (role === 'SECRETARY') {
    return SECRETARY_NAV_GROUPS
  }

  if (role === 'FINANCE') {
    return [
      {
        label: 'FINANCE',
        items: [
          { label: 'Overview', href: '/finance', icon: Landmark },
          { label: 'Revenue', href: '/finance/revenue', icon: TrendingUp },
          { label: 'Payments', href: '/finance/payments', icon: CreditCard },
        ],
      },
      {
        label: 'RECORDS',
        items: [{ label: 'Transactions', href: '/pos/transactions', icon: ShoppingCart }],
      },
      {
        label: 'HELP',
        items: [{ label: 'Support', href: '/support', icon: LifeBuoy }],
      },
    ]
  }

  return NAV_GROUPS_FULL.map(group => {
    const items = group.items.map(i => filterNavItem(role, email, i)).filter(Boolean) as NavItem[]
    return { ...group, items }
  }).filter(g => g.items.length > 0)
}

export function filterServiceBubbles(role: PortalRole, email: string) {
  if (role === 'FINANCE') return []
  if (role !== 'STAFF') return SERVICE_BUBBLES
  const allowed = getStaffProfileByEmail(email)?.departments ?? []
  return SERVICE_BUBBLES.filter(b => allowed.includes(b.slug))
}
