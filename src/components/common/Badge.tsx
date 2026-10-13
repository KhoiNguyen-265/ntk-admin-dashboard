import React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
  children: React.ReactNode
}

export function Badge({
  variant = 'slate',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
    slate: {
      bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      dot: 'bg-slate-400',
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
      dot: 'bg-indigo-500',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
      dot: 'bg-emerald-500',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
      dot: 'bg-rose-500',
    },
    sky: {
      bg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
      dot: 'bg-sky-500',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
      dot: 'bg-purple-500',
    },
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors',
        variantStyles[variant].bg,
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', variantStyles[variant].dot)} />}
      <span>{children}</span>
    </span>
  )
}
