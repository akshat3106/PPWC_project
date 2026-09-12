import type { ReactNode } from 'react'
import { Check, X, Circle } from 'lucide-react'
import type { AttendanceStatus, AttendanceHealth } from '@/types'

const statusConfig: Record<AttendanceStatus, { label: string; icon: ReactNode; classes: string }> = {
  present: {
    label: 'Present',
    icon: <Check className="h-3.5 w-3.5" aria-hidden />,
    classes: 'bg-success-soft text-success',
  },
  absent: {
    label: 'Absent',
    icon: <X className="h-3.5 w-3.5" aria-hidden />,
    classes: 'bg-danger-soft text-danger',
  },
  not_marked: {
    label: 'Not marked',
    icon: <Circle className="h-3 w-3" aria-hidden />,
    classes: 'bg-brand-soft text-muted',
  },
}

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  const cfg = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.classes}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

const healthConfig: Record<AttendanceHealth, { label: string; classes: string }> = {
  good: { label: 'Good', classes: 'bg-success-soft text-success' },
  attention: { label: 'Needs attention', classes: 'bg-warning-soft text-warning' },
  low: { label: 'Low', classes: 'bg-danger-soft text-danger' },
  none: { label: 'No data', classes: 'bg-brand-soft text-muted' },
}

export function HealthBadge({ health }: { health: AttendanceHealth }) {
  const cfg = healthConfig[health]
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}
