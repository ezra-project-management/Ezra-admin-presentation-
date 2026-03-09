'use client'

import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  showStatus?: boolean
  isOnline?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function Avatar({ name, size = 'md', showStatus, isOnline, className }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex', className)}>
      <div
        className={cn(
          'rounded-full bg-navy text-white font-medium flex items-center justify-center shrink-0',
          sizeClasses[size]
        )}
      >
        {getInitials(name)}
      </div>
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white',
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  )
}
