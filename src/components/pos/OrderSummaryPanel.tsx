'use client'

import { useState } from 'react'
import { Minus, Plus, X, Loader2, Check, AlertCircle, Search } from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_CUSTOMERS } from '@/lib/mock-data'
import { cn, formatCurrency } from '@/lib/utils'

export interface OrderItem {
  id: string
  name: string
  category: string
  price: number
  qty: number
}

interface OrderSummaryPanelProps {
  items: OrderItem[]
  onUpdateQty: (id: string, qty: number) => void
  onRemoveItem: (id: string) => void
  onClear: () => void
}

type PaymentMethod = 'mpesa' | 'cash' | 'card'
type MpesaState = 'idle' | 'pending' | 'success' | 'failed'

export function OrderSummaryPanel({ items, onUpdateQty, onRemoveItem, onClear }: OrderSummaryPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa')
  const [mpesaState, setMpesaState] = useState<MpesaState>('idle')
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [cashTendered, setCashTendered] = useState('')
  const [cardRef, setCardRef] = useState('')
  const [showDiscount, setShowDiscount] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent')
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discountValue = discountType === 'percent' ? Math.round(subtotal * discountAmount / 100) : discountAmount
  const total = subtotal - discountValue

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).slice(0, 5)

  const canComplete = () => {
    if (items.length === 0) return false
    if (paymentMethod === 'mpesa') return mpesaState === 'success'
    if (paymentMethod === 'cash') return Number(cashTendered) >= total
    if (paymentMethod === 'card') return cardRef.trim().length > 0
    return false
  }

  const sendStkPush = () => {
    if (!mpesaPhone) return
    setMpesaState('pending')
    setCountdown(60)
    const interval = setInterval(() => setCountdown(c => c - 1), 1000)
    setTimeout(() => {
      clearInterval(interval)
      setMpesaState('success')
    }, 3000)
  }

  const completeSale = () => {
    toast.success('Sale completed successfully!')
    onClear()
    setMpesaState('idle')
    setMpesaPhone('')
    setCashTendered('')
    setCardRef('')
    setSelectedCustomer(null)
    setShowDiscount(false)
    setDiscountAmount(0)
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Order Summary</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customer..."
            value={selectedCustomer || customerSearch}
            onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); setShowCustomerDropdown(true) }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {showCustomerDropdown && customerSearch && !selectedCustomer && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
              {filteredCustomers.map(c => (
                <button key={c.id} onClick={() => { setSelectedCustomer(c.name); setShowCustomerDropdown(false); setCustomerSearch('') }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-navy text-white text-[10px] flex items-center justify-center">{c.avatar}</div>
                  {c.name}
                </button>
              ))}
              <button onClick={() => { setSelectedCustomer('Guest Sale'); setShowCustomerDropdown(false) }} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 border-t">Guest Sale</button>
            </div>
          )}
        </div>
      </div>

      {/* Order lines */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-12">No items added. Select items from the catalogue.</div>
        ) : (
          <div className="space-y-0 divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.id} className="flex items-start justify-between py-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-[var(--btn-radius)]">
                    <button onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                    <span className="w-7 h-7 flex items-center justify-center text-sm font-medium">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right">{formatCurrency(item.price * item.qty)}</span>
                  <button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price summary */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {!showDiscount ? (
          <button onClick={() => setShowDiscount(true)} className="text-xs text-brand hover:underline">+ Add Discount</button>
        ) : (
          <div className="mt-2 p-2 bg-white rounded border border-gray-200">
            <div className="flex gap-2 mb-2">
              <button onClick={() => setDiscountType('percent')} className={cn('text-xs px-2 py-1 rounded', discountType === 'percent' ? 'bg-navy text-white' : 'bg-gray-100')}>%</button>
              <button onClick={() => setDiscountType('flat')} className={cn('text-xs px-2 py-1 rounded', discountType === 'flat' ? 'bg-navy text-white' : 'bg-gray-100')}>KES</button>
              <input type="number" value={discountAmount || ''} onChange={e => setDiscountAmount(Number(e.target.value))} className="flex-1 text-sm border rounded px-2 py-1" placeholder="Amount" />
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discountValue)}</span>
            </div>
          </div>
        )}
        <div className="h-px bg-gray-300 my-2" />
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-1 mb-3">
          {(['mpesa', 'cash', 'card'] as PaymentMethod[]).map(m => (
            <button key={m} onClick={() => setPaymentMethod(m)} className={cn('flex-1 py-2 text-xs font-medium rounded-[var(--btn-radius)]', paymentMethod === m ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600')}>
              {m === 'mpesa' ? 'M-Pesa' : m === 'cash' ? 'Cash' : 'Card'}
            </button>
          ))}
        </div>

        {paymentMethod === 'mpesa' && (
          <div>
            {mpesaState === 'idle' && (
              <>
                <div className="flex">
                  <span className="bg-gray-100 px-3 py-2 text-sm rounded-l-[var(--input-radius)] border border-r-0 border-gray-200 text-gray-500">+254</span>
                  <input value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} placeholder="712345678" className="flex-1 py-2 px-3 text-sm border border-gray-200 rounded-r-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20" />
                </div>
                <button onClick={sendStkPush} disabled={!mpesaPhone} className="w-full mt-2 py-2 bg-green-600 text-white text-sm font-medium rounded-[var(--btn-radius)] hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">Send STK Push</button>
              </>
            )}
            {mpesaState === 'pending' && (
              <div className="text-center py-4">
                <Loader2 className="w-6 h-6 text-brand animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Waiting for customer PIN...</p>
                <p className="text-xs text-gray-400 mt-1">{countdown}s remaining</p>
                <button onClick={() => setMpesaState('idle')} className="text-xs text-red-500 mt-2 hover:underline">Cancel</button>
              </div>
            )}
            {mpesaState === 'success' && (
              <div className="text-center py-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2"><Check className="w-5 h-5 text-green-600" /></div>
                <p className="text-sm font-medium text-green-700">Payment confirmed!</p>
                <p className="text-xs text-gray-500 mt-1">{formatCurrency(total)}</p>
                <p className="text-xs font-mono text-gray-400 mt-0.5">Ref: QJK{Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
              </div>
            )}
            {mpesaState === 'failed' && (
              <div className="text-center py-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2"><AlertCircle className="w-5 h-5 text-red-600" /></div>
                <p className="text-sm font-medium text-red-700">Payment failed</p>
                <button onClick={() => setMpesaState('idle')} className="text-xs text-brand mt-2 hover:underline">Retry</button>
              </div>
            )}
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div>
            <label className="text-xs text-gray-500">Amount Tendered</label>
            <input type="number" value={cashTendered} onChange={e => setCashTendered(e.target.value)} className="w-full mt-1 py-2 px-3 text-lg border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20" />
            {Number(cashTendered) >= total && Number(cashTendered) > 0 && (
              <div className="mt-2 text-center">
                <span className="text-xs text-gray-500">Change Due:</span>
                <span className="text-xl font-bold text-green-600 ml-2">{formatCurrency(Number(cashTendered) - total)}</span>
              </div>
            )}
          </div>
        )}

        {paymentMethod === 'card' && (
          <div>
            <p className="text-xs text-gray-400 mb-2">Process payment on external card terminal</p>
            <input value={cardRef} onChange={e => setCardRef(e.target.value)} placeholder="Card Reference" className="w-full py-2 px-3 text-sm border border-gray-200 rounded-[var(--input-radius)] focus:outline-none focus:ring-2 focus:ring-brand/20" />
          </div>
        )}
      </div>

      {/* Complete button */}
      <div className="p-4">
        <button
          onClick={completeSale}
          disabled={!canComplete()}
          className={cn('w-full py-3 rounded-[var(--btn-radius)] font-bold text-base transition-colors', canComplete() ? 'bg-gold text-white hover:bg-[#B8973F]' : 'bg-gray-200 text-gray-400 cursor-not-allowed')}
        >
          Complete Sale
        </button>
      </div>
    </div>
  )
}
