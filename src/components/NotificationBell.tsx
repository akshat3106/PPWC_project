import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { formatDateLabel, formatPercentage } from '@/lib/attendance'
import { StatusBadge } from '@/components/ui/Badge'

export function NotificationBell({ studentId }: { studentId: string }) {
  const { notifications, subjects } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const mine = notifications.filter((n) => n.studentId === studentId).slice(0, 6)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-ink transition-standard hover:bg-brand-soft"
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden />
        {mine.length > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" aria-hidden />
        )}
      </button>

      {open && (
        <div className="animate-fade-slide absolute right-0 z-20 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-border bg-surface p-2 shadow-lift">
          <p className="px-3 py-2 text-sm font-semibold text-ink">Notifications</p>
          {mine.length === 0 ? (
            <p className="px-3 pb-3 text-sm text-muted">No attendance updates yet.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {mine.map((n) => {
                const subject = subjects.find((s) => s.id === n.subjectId)
                return (
                  <li key={n.id} className="rounded-[var(--radius-sm)] px-3 py-2.5 hover:bg-brand-soft">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{subject?.name}</span>
                      <span className="text-xs text-muted">{formatDateLabel(n.date)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={n.status} />
                      <span className="text-xs text-muted">Now {formatPercentage(n.subjectPercentage)}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
