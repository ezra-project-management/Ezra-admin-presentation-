'use client'

import { useCallback, useEffect, useState } from 'react'
import { Type, Minus, Plus, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export const EZRA_TEXT_SCALE_KEY = 'ezra-text-scale'

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

export function TextScaleControl({ className }: { className?: string }) {
  const [scale, setScale] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const initial = readScale()
    setScale(initial)
    applyScale(initial)
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

  if (!mounted) return null

  return (
    <div
      role="region"
      aria-label="Text size"
      className={cn(
        'fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur-md sm:bottom-6',
        className
      )}
    >
      <span className="hidden pl-2 sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
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
