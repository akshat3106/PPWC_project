import type { ReactNode } from 'react'
import { Inbox, AlertCircle } from 'lucide-react'
import { Button } from './Button'

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-muted">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <p className="text-base font-semibold text-ink">{title}</p>
      <p className="max-w-xs text-sm text-muted">{description}</p>
    </div>
  )
}

export function ErrorState({ description, onRetry }: { description: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-border bg-danger-soft px-6 py-10 text-center">
      <AlertCircle className="h-6 w-6 text-danger" aria-hidden />
      <p className="text-base font-semibold text-ink">Something went wrong</p>
      <p className="max-w-xs text-sm text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      )}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-shimmer rounded-[var(--radius-sm)] ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-soft">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-4 h-8 w-32" />
      <Skeleton className="h-2.5 w-full" />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div>
          <Skeleton className="mb-1.5 h-3.5 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-40 rounded-full" />
    </div>
  )
}
