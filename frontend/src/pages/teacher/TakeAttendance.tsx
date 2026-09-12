import { useEffect, useMemo, useState } from 'react'
import { Check, X, Save, AlertCircle, Mail } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Input'
import { SelectField } from '@/components/ui/Select'
import { EmailPreviewModal } from '@/components/EmailPreviewModal'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/context/ToastContext'
import { sendMail } from '@/lib/api'
import { formatDateFull } from '@/lib/attendance'
import type { AttendanceStatus, NotificationItem } from '@/types'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function TeacherTakeAttendance() {
  const { subjects, students, getRecord, saveAttendanceForSession } = useApp()
  const { showToast } = useToast()

  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? '')
  const [date, setDate] = useState(todayIso())
  const [draft, setDraft] = useState<Record<string, AttendanceStatus>>({})
  const [original, setOriginal] = useState<Record<string, AttendanceStatus>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [previewNotification, setPreviewNotification] = useState<NotificationItem | null>(null)
  const [sendingMail, setSendingMail] = useState(false)
  const [sendingTestMail, setSendingTestMail] = useState(false)

  // Testing-only: single-recipient send so real classmates aren't emailed while trying this out.
  const TEST_RECIPIENT_EMAIL = 'akshatjha3125@gmail.com'

  const subject = subjects.find((s) => s.id === subjectId) ?? null
  const roster = useMemo(
    () =>
      (subject?.studentIds ?? [])
        .map((id) => students.find((s) => s.id === id))
        .filter((s): s is NonNullable<typeof s> => !!s)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [subject, students],
  )

  // Load existing statuses whenever subject/date changes
  useEffect(() => {
    if (!subject) return
    const initial: Record<string, AttendanceStatus> = {}
    for (const studentId of subject.studentIds) {
      const rec = getRecord(subject.id, date, studentId)
      initial[studentId] = rec?.status ?? 'not_marked'
    }
    setDraft(initial)
    setOriginal(initial)
    setSaveError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, date])

  const dirty = JSON.stringify(draft) !== JSON.stringify(original)
  const markedCount = Object.values(draft).filter((s) => s !== 'not_marked').length

  function requestSubjectChange(nextId: string) {
    if (dirty && !window.confirm('You have unsaved attendance changes. Discard them?')) return
    setSubjectId(nextId)
  }

  function requestDateChange(nextDate: string) {
    if (dirty && !window.confirm('You have unsaved attendance changes. Discard them?')) return
    setDate(nextDate)
  }

  function setStatus(studentId: string, status: AttendanceStatus) {
    setDraft((d) => ({ ...d, [studentId]: status }))
  }

  function markAll(status: AttendanceStatus) {
    if (!subject) return
    const next: Record<string, AttendanceStatus> = {}
    for (const studentId of subject.studentIds) next[studentId] = status
    setDraft(next)
  }

  function handleSave() {
    if (!subject) return
    setSaving(true)
    setSaveError(null)

    // Simulated network round-trip with an occasional mock failure so the
    // error state is reachable in this frontend-only prototype.
    window.setTimeout(() => {
      const shouldFail = Math.random() < 0.08
      if (shouldFail) {
        setSaving(false)
        setSaveError('Unable to update attendance. Please try again.')
        return
      }

      const payload: Record<string, AttendanceStatus> = {}
      for (const [studentId, status] of Object.entries(draft)) {
        if (status !== 'not_marked') payload[studentId] = status
      }

      const newNotifications = saveAttendanceForSession(subject.id, date, payload)
      setSaving(false)
      setOriginal(draft)
      showToast('Attendance updated successfully')

      if (newNotifications.length > 0) {
        showToast(`Attendance notification prepared for ${newNotifications.length} student${newNotifications.length === 1 ? '' : 's'}.`, 'info')
        setPreviewNotification(newNotifications[0])
      }
    }, 700)
  }

  async function handleSendMail() {
    if (!subject) return
    setSendingMail(true)
    try {
      const result = await sendMail({
        subject: `Attendance Update – ${subject.name} – ${formatDateFull(date)}`,
        message: `Your attendance for ${subject.name} on ${formatDateFull(date)} has been recorded.`,
        students: roster.map((student) => {
          const status = draft[student.id]
          return {
            name: student.name,
            email: student.email,
            attendance:
              status === 'present' || status === 'absent'
                ? { subjectName: subject.name, date, status }
                : undefined,
          }
        }),
      })

      if (result.failed === 0) {
        showToast(`Email sent to all ${result.sent} student${result.sent === 1 ? '' : 's'}.`)
      } else {
        showToast(`Sent to ${result.sent}, failed for ${result.failed}. Check the backend is running.`, 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to send emails. Is the backend running?', 'error')
    } finally {
      setSendingMail(false)
    }
  }

  async function handleSendTestMail(student: (typeof roster)[number]) {
    if (!subject) return
    setSendingTestMail(true)
    try {
      const status = draft[student.id]
      const result = await sendMail({
        subject: `[Test] Attendance Update – ${subject.name} – ${formatDateFull(date)}`,
        message: `This is a test email. Your attendance for ${subject.name} on ${formatDateFull(date)} has been recorded.`,
        students: [
          {
            name: student.name,
            email: student.email,
            attendance:
              status === 'present' || status === 'absent'
                ? { subjectName: subject.name, date, status }
                : undefined,
          },
        ],
      })

      if (result.failed === 0) {
        showToast(`Test email sent to ${student.name}.`)
      } else {
        showToast(result.results[0]?.error || 'Failed to send test email.', 'error')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to send test email. Is the backend running?', 'error')
    } finally {
      setSendingTestMail(false)
    }
  }

  if (!subject) {
    return (
      <AppShell role="teacher">
        <PageHeader title="Take attendance" />
        <p className="text-sm text-muted">No subjects assigned yet.</p>
      </AppShell>
    )
  }

  const previewStudent = previewNotification
    ? (students.find((s) => s.id === previewNotification.studentId) ?? null)
    : null

  return (
    <AppShell role="teacher">
      <PageHeader title="Take attendance" subtitle="Mark each student, then save to update everyone's percentages." />

      <Card className="mb-5 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField label="Subject" value={subjectId} onChange={(e) => requestSubjectChange(e.target.value)}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.code}
              </option>
            ))}
          </SelectField>
          <Field
            label="Date"
            type="date"
            value={date}
            max={todayIso()}
            onChange={(e) => requestDateChange(e.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted">
            {roster.length} students · {markedCount} marked
            {dirty && <span className="ml-2 font-medium text-warning">Unsaved changes</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => markAll('present')}>
              Mark all present
            </Button>
            <Button variant="secondary" size="sm" onClick={() => markAll('absent')}>
              Mark all absent
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Mail className="h-3.5 w-3.5" aria-hidden />}
              loading={sendingMail}
              onClick={handleSendMail}
            >
              Send mail to all students
            </Button>
          </div>
        </div>
      </Card>

      {saveError && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-danger/30 bg-danger-soft px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            {saveError}
          </div>
          <Button variant="destructive" size="sm" onClick={handleSave}>
            Try again
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2.5 pb-24 lg:pb-4">
        {roster.map((student) => (
          <Card
            key={student.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 transition-standard hover:shadow-lift sm:px-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-ink">
                {student.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{student.name}</p>
                <p className="text-xs text-muted">{student.studentId}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {student.email === TEST_RECIPIENT_EMAIL && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Mail className="h-3.5 w-3.5" aria-hidden />}
                  loading={sendingTestMail}
                  onClick={() => handleSendTestMail(student)}
                >
                  Send test mail
                </Button>
              )}
              <div className="flex overflow-hidden rounded-full border border-border" role="group" aria-label={`Attendance for ${student.name}`}>
              <button
                type="button"
                onClick={() => setStatus(student.id, 'present')}
                aria-pressed={draft[student.id] === 'present'}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-standard ${
                  draft[student.id] === 'present' ? 'bg-success text-white' : 'bg-surface text-muted hover:bg-success-soft'
                }`}
              >
                <Check className="h-3.5 w-3.5" aria-hidden />
                Present
              </button>
              <button
                type="button"
                onClick={() => setStatus(student.id, 'absent')}
                aria-pressed={draft[student.id] === 'absent'}
                className={`flex items-center gap-1.5 border-l border-border px-3.5 py-2 text-xs font-semibold transition-standard ${
                  draft[student.id] === 'absent' ? 'bg-danger text-white' : 'bg-surface text-muted hover:bg-danger-soft'
                }`}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Absent
              </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sticky save action */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur lg:sticky lg:bottom-0 lg:mt-2 lg:border-none lg:bg-transparent lg:px-0 lg:pb-0">
        <div className="mx-auto flex max-w-5xl justify-end">
          <Button
            size="lg"
            className="w-full lg:w-auto"
            icon={<Save className="h-4 w-4" aria-hidden />}
            loading={saving}
            disabled={!dirty}
            onClick={handleSave}
          >
            Save attendance
          </Button>
        </div>
      </div>

      <EmailPreviewModal
        open={!!previewNotification}
        onClose={() => setPreviewNotification(null)}
        notification={previewNotification}
        student={previewStudent}
        subject={subject}
      />
    </AppShell>
  )
}
