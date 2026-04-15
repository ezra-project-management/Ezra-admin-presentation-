'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GripVertical, Type, Minus, Plus, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export const EZRA_TEXT_SCALE_KEY = 'ezra-text-scale'
export const EZRA_TEXT_SCALE_POS_KEY = 'ezra-text-scale-pos'

export const TEXT_SCALE_LEVELS = [0.85, 0.925, 1, 1.1, 1.2] as const

function readScale(): number {
  if (typeof window === 'undefined') return 1
  try {
    const raw = localStorage.getItem(EZRA_TEXT_SCALE_KEY)
    if (!raw) return 1
    const n = parseFloat(raw)
    return (TEXT_SCALE_LEVELS as readonly number[]).includes(n) ? n : 1
  } catch {
    return 1
  }
}

function applyScale(n: number) {
  document.documentElement.style.setProperty('--ezra-text-scale', String(n))
}

type FloatingPos = { left: number; top: number }

function readPos(): FloatingPos | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(EZRA_TEXT_SCALE_POS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<FloatingPos>
    if (typeof parsed.left !== 'number' || typeof parsed.top !== 'number') return null
    if (!Number.isFinite(parsed.left) || !Number.isFinite(parsed.top)) return null
    return { left: parsed.left, top: parsed.top }
  } catch {
    return null
  }
}

function writePos(pos: FloatingPos) {
  try {
    localStorage.setItem(EZRA_TEXT_SCALE_POS_KEY, JSON.stringify(pos))
  } catch {
    /* ignore */
  }
}

export function TextScaleControl({ className }: { className?: string }) {
  const [scale, setScale] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<FloatingPos | null>(null)
  const dragRef = useRef<{
    pointerId: number
    offsetX: number
    offsetY: number
  } | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const initial = readScale()
    setScale(initial)
    applyScale(initial)
    setPos(readPos())
  }, [])

  const index = (TEXT_SCALE_LEVELS as readonly number[]).indexOf(scale)
  const safeIndex = index >= 0 ? index : 2

  const setAt = useCallback((n: (typeof TEXT_SCALE_LEVELS)[number]) => {
    setScale(n)
    applyScale(n)
    try {
      localStorage.setItem(EZRA_TEXT_SCALE_KEY, String(n))
    } catch {
      /* ignore */
    }
  }, [])

  const step = (dir: -1 | 1) => {
    const next = Math.min(TEXT_SCALE_LEVELS.length - 1, Math.max(0, safeIndex + dir))
    setAt(TEXT_SCALE_LEVELS[next])
  }

  const inlineStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!pos) return undefined
    return { left: `${pos.left}px`, top: `${pos.top}px`, transform: 'none' }
  }, [pos])

  const onDragHandlePointerDown = (e: React.PointerEvent) => {
    if (!rootRef.current) return
    const rect = rootRef.current.getBoundingClientRect()
    dragRef.current = {
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    e.preventDefault()
  }

  useEffect(() => {
    if (!mounted) return

    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current
      const el = rootRef.current
      if (!drag || !el) return
      if (e.pointerId !== drag.pointerId) return

      const w = el.offsetWidth || 1
      const h = el.offsetHeight || 1
      const margin = 8
      const maxLeft = Math.max(margin, window.innerWidth - w - margin)
      const maxTop = Math.max(margin, window.innerHeight - h - margin)

      const next: FloatingPos = {
        left: Math.min(maxLeft, Math.max(margin, Math.round(e.clientX - drag.offsetX))),
        top: Math.min(maxTop, Math.max(margin, Math.round(e.clientY - drag.offsetY))),
      }
      setPos(next)
    }

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return
      if (e.pointerId !== drag.pointerId) return
      dragRef.current = null
      setPos((current) => {
        if (current) writePos(current)
        return current
      })
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label="Text size"
      className={cn(
        'fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-md sm:bottom-6',
        className
      )}
      style={inlineStyle}
    >
      <button
        type="button"
        className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700 cursor-move touch-none"
        aria-label="Move text size control"
        title="Drag to move"
        onPointerDown={onDragHandlePointerDown}
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
      <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        <Type className="h-3.5 w-3.5 text-[#1565C0]" aria-hidden />
        Text
      </span>
      <div className="flex items-center gap-0.5 rounded-full bg-gray-100/90 p-0.5">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={safeIndex <= 0}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-white disabled:opacity-35"
          aria-label="Smaller text"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[2.75rem] text-center font-mono text-xs font-semibold tabular-nums text-gray-900">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={safeIndex >= TEXT_SCALE_LEVELS.length - 1}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-white disabled:opacity-35"
          aria-label="Larger text"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setAt(1)}
        className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-amber-50 hover:text-amber-900"
        aria-label="Reset text size to default"
        title="Reset"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
