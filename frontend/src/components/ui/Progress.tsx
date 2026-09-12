import type { AttendanceHealth } from '@/types'

const trackColor: Record<AttendanceHealth, string> = {
  good: 'bg-success',
  attention: 'bg-warning',
  low: 'bg-danger',
  none: 'bg-border',
}

export function ProgressBar({
  percentage,
  health,
  className = '',
}: {
  percentage: number | null
  health: AttendanceHealth
  className?: string
}) {
  const width = percentage ?? 0
  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-brand-soft ${className}`}
      role="progressbar"
      aria-valuenow={percentage ?? 0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-standard ${trackColor[health]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}
