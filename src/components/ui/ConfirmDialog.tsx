'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  variant?: 'danger' | 'warning'
  children?: React.ReactNode
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  variant = 'danger',
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-[var(--shadow-modal)] p-6 w-full max-w-md z-50">
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-sm text-gray-500 mb-6">{description}</Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Close className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-[var(--btn-radius)] hover:bg-gray-50">
              Cancel
            </Dialog.Close>
            <button
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              className={cn(
                'px-4 py-2 text-sm font-medium text-white rounded-[var(--btn-radius)]',
                variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
