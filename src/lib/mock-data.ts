export interface Customer {
  name: string
  email: string
  phone: string
  avatar: string
}

export interface Booking {
  id: string
  reference: string
  customer: Customer
  service: string
  resource: string
  staff: string
  startAt: string
  endAt: string
  status: string
  amount: number
  paymentMethod: string
  mpesaRef: string | null
  createdAt: string
}

export interface Transaction {
  id: string
  reference: string
  cashier: string
  customer: string
  items: { name: string; qty: number; price: number }[]
  subtotal: number
  discount: number
  total: number
  method: string
  mpesaRef: string | null
  status: string
  createdAt: string
}

export interface CustomerRecord {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  loyaltyTier: string
  loyaltyPoints: number
  totalBookings: number
  totalSpent: number
  lastVisit: string
  joinDate: string
  isBlocked: boolean
}

export interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: string
  departments: string[]
  isOnDuty: boolean
  joinDate: string
  /** Matches `Booking.staff` in mock data for filtering a staff member's sessions. */
  bookingAttribution: string
}

/** Demo portal logins aligned with staff records (password: demo1234). */
export const DEMO_STAFF_CREDENTIALS: { name: string; email: string; role: string; departments: string }[] = [
  { name: 'James Kariuki', email: 'james.k@ezraannex.com', role: 'Super Admin (demo)', departments: 'Boardrooms, Ballroom, Banquet' },
  { name: 'Grace Mwangi', email: 'grace.m@ezraannex.com', role: 'Staff', departments: 'Salon & Spa' },
  { name: 'Tony Baraka', email: 'tony.b@ezraannex.com', role: 'Staff', departments: 'Barbershop' },
  { name: 'Mike Tanui', email: 'mike.t@ezraannex.com', role: 'Staff', departments: 'Fitness Centre' },
  { name: 'Sarah Wanjiru', email: 'sarah.w@ezraannex.com', role: 'Manager', departments: 'Ballroom, Banquet Hall' },
  { name: 'Coach Ali Hassan', email: 'ali.h@ezraannex.com', role: 'Staff', departments: 'Swimming Pool' },
  { name: 'Rose Adhiambo', email: 'rose.a@ezraannex.com', role: 'Staff', departments: 'Banquet Hall, Ballroom' },
  { name: 'Finance Desk', email: 'finance@ezraannex.com', role: 'Finance', departments: 'Accounts' },
  { name: 'Mary Akinyi', email: 'secretary@ezraannex.com', role: 'Front desk', departments: 'Reception' },
]

export interface OccupancyItem {
  resource: string
  current: string | null
  status: string
  until: string | null
}

export interface QueueItem {
  id: string
  customerName: string
  phone: string
  service: string
  estimatedWait: number
  assignedStaff: string | null
  status: string
  addedAt: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
}

export interface SmsTemplate {
  id: string
  name: string
  event: string
  message: string
  enabled: boolean
}

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'bk-001', reference: 'EZR-A1B2C3', customer: { name: 'Amara Kimani', email: 'amara@example.com', phone: '+254712345678', avatar: 'AK' }, service: 'Salon & Spa', resource: 'Suite 1', staff: 'Grace M.', startAt: '2026-03-10T09:00:00Z', endAt: '2026-03-10T10:30:00Z', status: 'CONFIRMED', amount: 3500, paymentMethod: 'MPESA', mpesaRef: 'QJK123ABC', createdAt: '2026-03-08T14:23:00Z' },
  { id: 'bk-002', reference: 'EZR-D4E5F6', customer: { name: 'David Omondi', email: 'david@example.com', phone: '+254723456789', avatar: 'DO' }, service: 'Boardroom', resource: 'Board Room A', staff: 'James K.', startAt: '2026-03-10T10:00:00Z', endAt: '2026-03-10T14:00:00Z', status: 'CHECKED_IN', amount: 20000, paymentMethod: 'MPESA', mpesaRef: 'QJK456DEF', createdAt: '2026-03-09T09:15:00Z' },
  { id: 'bk-003', reference: 'EZR-G7H8I9', customer: { name: 'Priya Mehta', email: 'priya@example.com', phone: '+254734567890', avatar: 'PM' }, service: 'Ballroom', resource: 'Grand Ballroom', staff: 'Sarah W.', startAt: '2026-03-15T16:00:00Z', endAt: '2026-03-15T23:00:00Z', status: 'CONFIRMED', amount: 120000, paymentMethod: 'MPESA', mpesaRef: 'QJK789GHI', createdAt: '2026-03-01T11:45:00Z' },
  { id: 'bk-004', reference: 'EZR-J1K2L3', customer: { name: 'James Waweru', email: 'james@example.com', phone: '+254745678901', avatar: 'JW' }, service: 'Gym', resource: 'Main Gym Floor', staff: 'Mike T.', startAt: '2026-03-10T06:00:00Z', endAt: '2026-03-10T07:30:00Z', status: 'COMPLETED', amount: 1200, paymentMethod: 'CASH', mpesaRef: null, createdAt: '2026-03-09T20:00:00Z' },
  { id: 'bk-006', reference: 'EZR-P7Q8R9', customer: { name: 'Brian Mutua', email: 'brian@example.com', phone: '+254767890123', avatar: 'BM' }, service: 'Barbershop', resource: 'Chair 2', staff: 'Tony B.', startAt: '2026-03-10T11:00:00Z', endAt: '2026-03-10T11:45:00Z', status: 'PENDING', amount: 800, paymentMethod: 'MPESA', mpesaRef: null, createdAt: '2026-03-10T08:00:00Z' },
  { id: 'bk-007', reference: 'EZR-S1T2U3', customer: { name: 'Fatima Hassan', email: 'fatima@example.com', phone: '+254778901234', avatar: 'FH' }, service: 'Swimming Pool', resource: 'Lane 3', staff: 'Coach Ali', startAt: '2026-03-10T07:00:00Z', endAt: '2026-03-10T08:00:00Z', status: 'CANCELLED', amount: 2500, paymentMethod: 'MPESA', mpesaRef: 'QJK345STU', createdAt: '2026-03-07T10:00:00Z' },
  { id: 'bk-008', reference: 'EZR-V4W5X6', customer: { name: 'Samuel Njoroge', email: 'samuel@example.com', phone: '+254789012345', avatar: 'SN' }, service: 'Banquet Hall', resource: 'Banquet Suite', staff: 'Rose A.', startAt: '2026-03-20T18:00:00Z', endAt: '2026-03-20T23:00:00Z', status: 'CONFIRMED', amount: 65000, paymentMethod: 'MPESA', mpesaRef: 'QJK678VWX', createdAt: '2026-03-05T14:00:00Z' },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'txn-001', reference: 'POS-00042', cashier: 'James K.', customer: 'David Omondi', items: [{ name: 'Boardroom - 4hrs', qty: 1, price: 20000 }, { name: 'Catering Package', qty: 1, price: 5000 }], subtotal: 25000, discount: 0, total: 25000, method: 'MPESA', mpesaRef: 'QJK456DEF', status: 'COMPLETE', createdAt: '2026-03-10T14:15:00Z' },
  { id: 'txn-002', reference: 'POS-00041', cashier: 'Grace M.', customer: 'Amara Kimani', items: [{ name: 'Facial Treatment', qty: 1, price: 2500 }, { name: 'Head Massage', qty: 1, price: 1000 }], subtotal: 3500, discount: 350, total: 3150, method: 'CASH', mpesaRef: null, status: 'COMPLETE', createdAt: '2026-03-10T10:45:00Z' },
  { id: 'txn-003', reference: 'POS-00040', cashier: 'Mike T.', customer: 'James Waweru', items: [{ name: 'Day Pass - Gym', qty: 1, price: 1200 }], subtotal: 1200, discount: 0, total: 1200, method: 'CASH', mpesaRef: null, status: 'COMPLETE', createdAt: '2026-03-10T07:35:00Z' },
  { id: 'txn-004', reference: 'POS-00039', cashier: 'Tony B.', customer: 'Guest Sale', items: [{ name: 'Haircut + Beard Trim', qty: 1, price: 1200 }], subtotal: 1200, discount: 0, total: 1200, method: 'MPESA', mpesaRef: 'QJK901YZA', status: 'COMPLETE', createdAt: '2026-03-09T16:20:00Z' },
  { id: 'txn-005', reference: 'POS-00038', cashier: 'Peter O.', customer: 'Grace Achieng', items: [{ name: 'Room Service - Dinner', qty: 2, price: 1500 }], subtotal: 3000, discount: 0, total: 3000, method: 'MPESA', mpesaRef: 'QJK234BCD', status: 'VOIDED', createdAt: '2026-03-09T20:00:00Z' },
]

export const MOCK_CUSTOMERS: CustomerRecord[] = [
  { id: 'cust-001', name: 'Amara Kimani', email: 'amara@example.com', phone: '+254712345678', avatar: 'AK', loyaltyTier: 'GOLD', loyaltyPoints: 4250, totalBookings: 18, totalSpent: 87500, lastVisit: '2026-03-10', joinDate: '2024-06-15', isBlocked: false },
  { id: 'cust-002', name: 'David Omondi', email: 'david@example.com', phone: '+254723456789', avatar: 'DO', loyaltyTier: 'PLATINUM', loyaltyPoints: 12800, totalBookings: 42, totalSpent: 345000, lastVisit: '2026-03-10', joinDate: '2023-11-20', isBlocked: false },
  { id: 'cust-003', name: 'Priya Mehta', email: 'priya@example.com', phone: '+254734567890', avatar: 'PM', loyaltyTier: 'SILVER', loyaltyPoints: 1980, totalBookings: 7, totalSpent: 198000, lastVisit: '2026-02-28', joinDate: '2025-01-10', isBlocked: false },
  { id: 'cust-004', name: 'James Waweru', email: 'james@example.com', phone: '+254745678901', avatar: 'JW', loyaltyTier: 'GOLD', loyaltyPoints: 3600, totalBookings: 31, totalSpent: 62400, lastVisit: '2026-03-10', joinDate: '2024-02-08', isBlocked: false },
  { id: 'cust-005', name: 'Grace Achieng', email: 'grace@example.com', phone: '+254756789012', avatar: 'GA', loyaltyTier: 'SILVER', loyaltyPoints: 890, totalBookings: 5, totalSpent: 34000, lastVisit: '2026-03-08', joinDate: '2025-07-22', isBlocked: false },
  { id: 'cust-006', name: 'Brian Mutua', email: 'brian@example.com', phone: '+254767890123', avatar: 'BM', loyaltyTier: 'BRONZE', loyaltyPoints: 240, totalBookings: 3, totalSpent: 7200, lastVisit: '2026-03-10', joinDate: '2025-12-01', isBlocked: false },
  { id: 'cust-007', name: 'Fatima Hassan', email: 'fatima@example.com', phone: '+254778901234', avatar: 'FH', loyaltyTier: 'BRONZE', loyaltyPoints: 120, totalBookings: 2, totalSpent: 5000, lastVisit: '2026-02-15', joinDate: '2026-01-05', isBlocked: false },
  { id: 'cust-008', name: 'Samuel Njoroge', email: 'samuel@example.com', phone: '+254789012345', avatar: 'SN', loyaltyTier: 'PLATINUM', loyaltyPoints: 9800, totalBookings: 28, totalSpent: 520000, lastVisit: '2026-03-05', joinDate: '2023-08-14', isBlocked: false },
]

export const MOCK_STAFF: StaffMember[] = [
  { id: 'st-001', name: 'Grace Mwangi', email: 'grace.m@ezraannex.com', phone: '+254711000001', avatar: 'GM', role: 'STAFF', departments: ['salon-spa'], isOnDuty: true, joinDate: '2023-04-01', bookingAttribution: 'Grace M.' },
  { id: 'st-002', name: 'James Kariuki', email: 'james.k@ezraannex.com', phone: '+254711000002', avatar: 'JK', role: 'MANAGER', departments: ['boardroom', 'banquet-hall', 'ballroom'], isOnDuty: true, joinDate: '2022-11-15', bookingAttribution: 'James K.' },
  { id: 'st-003', name: 'Tony Baraka', email: 'tony.b@ezraannex.com', phone: '+254711000003', avatar: 'TB', role: 'STAFF', departments: ['barbershop'], isOnDuty: true, joinDate: '2024-01-20', bookingAttribution: 'Tony B.' },
  { id: 'st-004', name: 'Mike Tanui', email: 'mike.t@ezraannex.com', phone: '+254711000004', avatar: 'MT', role: 'STAFF', departments: ['gym'], isOnDuty: false, joinDate: '2023-09-05', bookingAttribution: 'Mike T.' },
  { id: 'st-006', name: 'Sarah Wanjiru', email: 'sarah.w@ezraannex.com', phone: '+254711000006', avatar: 'SW', role: 'MANAGER', departments: ['ballroom', 'banquet-hall'], isOnDuty: false, joinDate: '2022-08-30', bookingAttribution: 'Sarah W.' },
  { id: 'st-007', name: 'Coach Ali Hassan', email: 'ali.h@ezraannex.com', phone: '+254711000007', avatar: 'AH', role: 'STAFF', departments: ['swimming-pool'], isOnDuty: true, joinDate: '2024-03-01', bookingAttribution: 'Coach Ali' },
  { id: 'st-008', name: 'Rose Adhiambo', email: 'rose.a@ezraannex.com', phone: '+254711000008', avatar: 'RA', role: 'STAFF', departments: ['banquet-hall', 'ballroom'], isOnDuty: true, joinDate: '2023-12-10', bookingAttribution: 'Rose A.' },
  {
    id: 'st-099',
    name: 'Team Staff (demo)',
    email: 'staff@ezraannex.com',
    phone: '+254711000099',
    avatar: 'TS',
    role: 'STAFF',
    departments: ['salon-spa', 'barbershop', 'gym', 'boardroom', 'ballroom', 'banquet-hall', 'swimming-pool'],
    isOnDuty: true,
    joinDate: '2025-01-01',
    bookingAttribution: '__ALL__',
  },
]

export const REVENUE_DAILY = [
  { day: 'Mon', revenue: 87500, target: 80000 },
  { day: 'Tue', revenue: 125000, target: 80000 },
  { day: 'Wed', revenue: 64000, target: 80000 },
  { day: 'Thu', revenue: 148000, target: 80000 },
  { day: 'Fri', revenue: 210000, target: 80000 },
  { day: 'Sat', revenue: 295000, target: 80000 },
  { day: 'Sun', revenue: 180000, target: 80000 },
]

export const REVENUE_BY_SERVICE = [
  { service: 'Events', value: 420000, fill: '#0F2C4A' },
  { service: 'Wellness', value: 134500, fill: '#2E86AB' },
  { service: 'Business', value: 98000, fill: '#15803D' },
  { service: 'Fitness', value: 71000, fill: '#7C3AED' },
]

/** Revenue attributed to each department (matches booking `service` labels). */
export const REVENUE_BY_DEPARTMENT_WEEK: { department: string; amount: number; bookings: number; fill: string }[] = [
  { department: 'Salon & Spa', amount: 42800, bookings: 14, fill: '#0d9488' },
  { department: 'Barbershop', amount: 18600, bookings: 22, fill: '#374151' },
  { department: 'Gym', amount: 31200, bookings: 38, fill: '#15803d' },
  { department: 'Boardroom', amount: 94500, bookings: 6, fill: '#2563eb' },
  { department: 'Ballroom', amount: 198000, bookings: 2, fill: '#d97706' },
  { department: 'Banquet Hall', amount: 87200, bookings: 4, fill: '#ea580c' },
  { department: 'Swimming Pool', amount: 15400, bookings: 11, fill: '#0891b2' },
]

export const REVENUE_BY_DEPARTMENT_MONTH: { department: string; amount: number; bookings: number; fill: string }[] = [
  { department: 'Salon & Spa', amount: 168400, bookings: 56, fill: '#0d9488' },
  { department: 'Barbershop', amount: 72400, bookings: 91, fill: '#374151' },
  { department: 'Gym', amount: 118200, bookings: 142, fill: '#15803d' },
  { department: 'Boardroom', amount: 382000, bookings: 24, fill: '#2563eb' },
  { department: 'Ballroom', amount: 756000, bookings: 8, fill: '#d97706' },
  { department: 'Banquet Hall', amount: 341500, bookings: 18, fill: '#ea580c' },
  { department: 'Swimming Pool', amount: 58200, bookings: 44, fill: '#0891b2' },
]

/** Total confirmed + completed style bookings per weekday (for trends UI). */
export const BOOKING_TRENDS_WEEK: { day: string; label: string; count: number }[] = [
  { day: 'Mon', label: 'Monday', count: 28 },
  { day: 'Tue', label: 'Tuesday', count: 34 },
  { day: 'Wed', label: 'Wednesday', count: 22 },
  { day: 'Thu', label: 'Thursday', count: 41 },
  { day: 'Fri', label: 'Friday', count: 52 },
  { day: 'Sat', label: 'Saturday', count: 67 },
  { day: 'Sun', label: 'Sunday', count: 45 },
]

/** Stable utilization % per resource (avoids random UI jitter). */
export const OCCUPANCY_UTILIZATION: Record<string, number> = {
  'Salon Suite 1': 78,
  'Salon Suite 2': 34,
  'Boardroom A': 92,
  'Boardroom B': 41,
  'Grand Ballroom': 0,
  'Barber Chair 1': 65,
  'Barber Chair 2': 28,
  'Gym Floor': 55,
  'Pool Lane 1': 22,
  'Pool Lane 2': 71,
}

export const OCCUPANCY_DATA: OccupancyItem[] = [
  { resource: 'Salon Suite 1', current: 'Amara K.', status: 'occupied', until: '10:30 AM' },
  { resource: 'Salon Suite 2', current: null, status: 'available', until: null },
  { resource: 'Boardroom A', current: 'David O.', status: 'occupied', until: '2:00 PM' },
  { resource: 'Boardroom B', current: null, status: 'available', until: null },
  { resource: 'Grand Ballroom', current: null, status: 'maintenance', until: 'Tomorrow' },
  { resource: 'Barber Chair 1', current: 'Walk-in', status: 'occupied', until: '11:30 AM' },
  { resource: 'Barber Chair 2', current: null, status: 'available', until: null },
  { resource: 'Gym Floor', current: 'Open', status: 'open', until: '9:00 PM' },
  { resource: 'Pool Lane 1', current: null, status: 'available', until: null },
  { resource: 'Pool Lane 2', current: 'Coach session', status: 'occupied', until: '8:00 AM' },
]

export const WALK_IN_QUEUE: QueueItem[] = [
  { id: 'q-001', customerName: 'Kevin Maina', phone: '+254700111222', service: 'Haircut', estimatedWait: 15, assignedStaff: null, status: 'waiting', addedAt: '2026-03-10T10:45:00Z' },
  { id: 'q-002', customerName: 'Lilian Amos', phone: '+254700333444', service: 'Beard Trim', estimatedWait: 30, assignedStaff: 'Tony B.', status: 'in_service', addedAt: '2026-03-10T10:20:00Z' },
  { id: 'q-003', customerName: 'Mark Ochieng', phone: '+254700555666', service: 'Haircut + Shave', estimatedWait: 45, assignedStaff: null, status: 'waiting', addedAt: '2026-03-10T11:00:00Z' },
  { id: 'q-004', customerName: 'Diana Wekesa', phone: '+254700777888', service: 'Hair Wash', estimatedWait: 0, assignedStaff: 'Tony B.', status: 'done', addedAt: '2026-03-10T09:30:00Z' },
]

export const NOTIFICATIONS: Notification[] = [
  { id: 'n-001', type: 'booking', title: 'New Booking', message: 'Priya Mehta booked the Ballroom for March 15', time: '2 min ago', read: false },
  { id: 'n-002', type: 'payment', title: 'Payment Received', message: 'KES 20,000 received from David Omondi — EZR-D4E5F6', time: '14 min ago', read: false },
  { id: 'n-003', type: 'alert', title: 'SMS Balance Low', message: 'SMS credit balance is below KES 500. Top up required.', time: '1 hr ago', read: false },
  { id: 'n-004', type: 'booking', title: 'Booking Cancelled', message: 'Fatima Hassan cancelled booking EZR-S1T2U3', time: '3 hrs ago', read: true },
  { id: 'n-005', type: 'system', title: 'Staff Check-In', message: 'Grace Mwangi, Peter Otieno, Tony Baraka checked in for duty', time: '4 hrs ago', read: true },
]

export const SMS_TEMPLATES: SmsTemplate[] = [
  { id: 'tpl-001', name: 'Booking Confirmed', event: 'booking_confirmed', message: 'Hi {{name}}, your {{service}} booking EZR-{{ref}} is confirmed for {{date}} at {{time}}. See you soon! - Ezra Annex', enabled: true },
  { id: 'tpl-002', name: 'Payment Received', event: 'payment_received', message: 'Payment of KES {{amount}} received for booking EZR-{{ref}}. Thank you! - Ezra Annex', enabled: true },
  { id: 'tpl-003', name: 'Reminder 24hrs', event: 'reminder_24hr', message: 'Reminder: Your {{service}} appointment is tomorrow at {{time}}. Ref: EZR-{{ref}} - Ezra Annex', enabled: true },
  { id: 'tpl-004', name: 'Reminder 2hrs', event: 'reminder_2hr', message: 'Your {{service}} starts in 2 hours at {{time}}. We look forward to seeing you. - Ezra Annex', enabled: true },
  { id: 'tpl-005', name: 'Cancellation', event: 'booking_cancelled', message: 'Your booking EZR-{{ref}} has been cancelled. Refund of KES {{amount}} within 3-5 days. - Ezra Annex', enabled: false },
]
