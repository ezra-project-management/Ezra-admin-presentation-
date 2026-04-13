'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { CalendarDays, DollarSign, Star, ImageIcon, X, ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useBookings } from '@/context/bookings-context'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { bookingServiceForSlug, serviceTitle } from '@/lib/service-slugs'

type DeptSettings = { acceptingBookings: boolean; staffNote: string; leadTimeHours: number }

function ServiceDeptSettings({ slug }: { slug: string }) {
  const storageKey = `ezra-dept-settings-${slug}`
  const [acceptingBookings, setAcceptingBookings] = useState(true)
  const [staffNote, setStaffNote] = useState('')
  const [leadTimeHours, setLeadTimeHours] = useState(2)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return
      const p = JSON.parse(raw) as DeptSettings
      if (typeof p.acceptingBookings === 'boolean') setAcceptingBookings(p.acceptingBookings)
      if (typeof p.staffNote === 'string') setStaffNote(p.staffNote)
      if (typeof p.leadTimeHours === 'number') setLeadTimeHours(p.leadTimeHours)
    } catch {
      /* ignore */
    }
  }, [storageKey])

  const save = () => {
    const payload: DeptSettings = { acceptingBookings, staffNote, leadTimeHours }
    localStorage.setItem(storageKey, JSON.stringify(payload))
    toast.success('Department settings saved (this browser only)')
  }

  return (
    <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] p-5 mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Super admin · Department controls</h3>
          <p className="text-xs text-gray-500 mt-1">
            Demo: stored in your browser per department. Use the same controls under Salon, Barbershop, Fitness, Boardrooms, etc.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-1.5 shrink-0 text-xs font-medium bg-navy text-white px-3 py-2 rounded-[7px] hover:opacity-90"
        >
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptingBookings}
          onChange={e => setAcceptingBookings(e.target.checked)}
          className="rounded border-gray-300 text-brand focus:ring-brand"
        />
        Accepting new bookings online
      </label>
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-600 block mb-1">Minimum lead time (hours)</label>
        <input
          type="number"
          min={0}
          max={168}
          value={leadTimeHours}
          onChange={e => setLeadTimeHours(Number(e.target.value) || 0)}
          className="w-full max-w-[120px] text-sm border border-gray-200 rounded-[7px] px-3 py-2"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-1">Internal note (staff-facing)</label>
        <textarea
          value={staffNote}
          onChange={e => setStaffNote(e.target.value)}
          rows={2}
          placeholder="e.g. Extra stylist on Saturday"
          className="w-full text-sm border border-gray-200 rounded-[7px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  )
}

const SERVICE_IMAGES: Record<string, { src: string; alt: string }[]> = {
  'salon-spa': [
    { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80', alt: 'Salon interior' },
    { src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80', alt: 'Hair styling station' },
    { src: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=80', alt: 'Spa treatment room' },
    { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80', alt: 'Nail salon' },
  ],
  barbershop: [
    { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80', alt: 'Barbershop chair' },
    { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', alt: 'Barber tools' },
    { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80', alt: 'Barbershop interior' },
  ],
  gym: [
    { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', alt: 'Gym equipment' },
    { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80', alt: 'Weight training area' },
    { src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80', alt: 'Cardio section' },
    { src: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80', alt: 'Personal training' },
  ],
  boardroom: [
    { src: '/images/image-resizing-6.avif', alt: 'Executive boardroom' },
    { src: '/images/image-resizing-5.avif', alt: 'Conference setup' },
    { src: '/images/image-resizing-7.avif', alt: 'Meeting room' },
  ],
  ballroom: [
    { src: '/images/hero-banquet.jpeg', alt: 'Grand ballroom' },
    { src: '/images/image-resizing-3.avif', alt: 'Ballroom event setup' },
    { src: '/images/image-resizing-4.avif', alt: 'Ballroom reception' },
  ],
  'banquet-hall': [
    { src: '/images/hero-banquet.jpeg', alt: 'Banquet hall dining' },
    { src: '/images/hero-table.jpeg', alt: 'Banquet table setting' },
    { src: '/images/image-resizing-3.avif', alt: 'Banquet event' },
  ],
  'swimming-pool': [
    { src: '/images/image-resizing-10.avif', alt: 'Swimming pool' },
    { src: '/images/image-resizing-11.avif', alt: 'Pool area' },
    { src: '/images/image-resizing.avif', alt: 'Pool lounge' },
  ],
}

function ServiceGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-gray-900">Gallery</h3>
          <span className="text-xs text-gray-400 ml-auto">{images.length} images</span>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-100 hover:border-gold/40 transition-all duration-300 hover:shadow-lg"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[10px] text-white truncate">{img.alt}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center" onClick={() => setLightboxIndex(null)}>
          <div className="relative w-[90vw] max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <Image src={images[lightboxIndex].src} alt={images[lightboxIndex].alt} fill className="object-cover" sizes="90vw" />
            <button onClick={() => setLightboxIndex(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors">
              <X className="w-4 h-4" />
            </button>
            {images.length > 1 && (
              <>
                <button onClick={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setLightboxIndex((lightboxIndex + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-sm text-white/80">{lightboxIndex + 1} / {images.length} &mdash; {images[lightboxIndex].alt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function ServicePage() {
  const { bookings: allBookings } = useBookings()
  const params = useParams()
  const slug = params.service as string
  const displayName = serviceTitle(slug)
  const bookingServiceName = bookingServiceForSlug(slug)
  const images = SERVICE_IMAGES[slug] || []

  const tabs = [
    { label: 'Overview', href: `/services/${slug}` },
    { label: 'Resources', href: `/services/${slug}/resources` },
    { label: 'Pricing', href: `/services/${slug}/pricing` },
    { label: 'Schedule', href: `/services/${slug}/schedule` },
  ]

  const bookings = allBookings.filter((b) => b.service === bookingServiceName).slice(0, 5)

  return (
    <div>
      <PageHeader title={displayName} subtitle="Service management" />
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab, i) => (
          <Link key={tab.href} href={tab.href} className={cn('px-4 py-3 text-sm font-medium', i === 0 ? 'border-b-2 border-brand text-brand' : 'text-gray-500 hover:text-gray-700')}>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Gallery Section */}
      {images.length > 0 && (
        <div className="mb-6">
          <ServiceGallery images={images} />
        </div>
      )}

      <ServiceDeptSettings slug={slug} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Today's Bookings" value={String(bookings.length)} icon={CalendarDays} iconColor="text-blue-600" iconBg="bg-blue-50" accentColor="bg-blue-500" />
        <StatCard title="Revenue This Month" value={formatCurrency(bookings.reduce((s, b) => s + b.amount, 0) * 4)} icon={DollarSign} iconColor="text-green-600" iconBg="bg-green-50" accentColor="bg-green-500" />
        <StatCard title="Avg Rating" value="4.7 / 5.0" icon={Star} iconColor="text-amber-600" iconBg="bg-amber-50" accentColor="bg-amber-500" />
      </div>
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-4 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-900">Recent Bookings</h3></div>
        <table className="w-full">
          <thead><tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No bookings for this service</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{b.customer.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{formatDate(b.startAt)}</td>
                <td className="px-4 py-2"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-2 text-sm font-medium text-right">{formatCurrency(b.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 border-t border-gray-100 text-center">
          <Link href="/bookings" className="text-xs text-brand font-medium hover:underline">View all bookings &rarr;</Link>
        </div>
      </div>
    </div>
  )
}
