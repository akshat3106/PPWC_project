import type { HTMLAttributes } from 'react'

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-border bg-surface shadow-soft ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
