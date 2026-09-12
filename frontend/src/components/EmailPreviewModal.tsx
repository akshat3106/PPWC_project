import { Mail } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { formatDateFull, formatPercentage } from '@/lib/attendance'
import type { NotificationItem, Student, Subject } from '@/types'

export function EmailPreviewModal({
  open,
  onClose,
  notification,
  student,
  subject,
}: {
  open: boolean
  onClose: () => void
  notification: NotificationItem | null
  student: Student | null
  subject: Subject | null
}) {
  if (!notification || !student || !subject) return null

  return (
    <Modal open={open} onClose={onClose} title="Attendance updated">
      <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-brand-soft px-3 py-2 text-xs font-medium text-muted">
        <Mail className="h-3.5 w-3.5" aria-hidden />
        Demo email / notification preview — no email is actually sent
      </div>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
        <div className="space-y-1 border-b border-border bg-brand-soft/60 px-4 py-3 text-sm">
          <p>
            <span className="text-muted">To: </span>
            <span className="font-medium text-ink">{student.email}</span>
          </p>
          <p>
            <span className="text-muted">Subject: </span>
            <span className="font-medium text-ink">
              Attendance Updated – {subject.name} – {formatDateFull(notification.date)}
            </span>
          </p>
        </div>

        <div className="space-y-4 px-4 py-5">
          <p className="text-sm text-ink">Hi {student.name.split(' ')[0]},</p>
          <p className="text-sm text-muted">
            Your attendance for {subject.name} on {formatDateFull(notification.date)} has been updated.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={notification.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--radius-sm)] bg-brand-soft px-3 py-2.5">
              <p className="text-xs text-muted">Subject attendance</p>
              <p className="text-sm font-semibold text-ink">{formatPercentage(notification.subjectPercentage)}</p>
            </div>
            <div className="rounded-[var(--radius-sm)] bg-brand-soft px-3 py-2.5">
              <p className="text-xs text-muted">Overall attendance</p>
              <p className="text-sm font-semibold text-ink">{formatPercentage(notification.overallPercentage)}</p>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>
            View attendance
          </Button>
        </div>
      </div>
    </Modal>
  )
}
