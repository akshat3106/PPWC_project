import { useMemo, useState } from 'react'
import { History as HistoryIcon } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { SelectField } from '@/components/ui/Select'
import { StatusBadge } from '@/components/ui/Badge'
import { EmptyState, RowSkeleton } from '@/components/ui/States'
import { useApp } from '@/context/AppContext'
import { formatDateFull } from '@/lib/attendance'
import { useSimulatedLoading } from '@/lib/useSimulatedLoading'

export function StudentHistory() {
  const { currentStudent, subjects, records } = useApp()
  const loading = useSimulatedLoading()
  const [subjectFilter, setSubjectFilter] = useState<string>('all')

  const rows = useMemo(() => {
    if (!currentStudent) return []
    return records
      .filter((r) => r.studentId === currentStudent.id)
      .filter((r) => subjectFilter === 'all' || r.subjectId === subjectFilter)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [records, currentStudent, subjectFilter])

  if (!currentStudent) return null

  return (
    <AppShell role="student">
      <PageHeader title="Attendance history" subtitle="Every recorded class, most recent first." />

      <div className="mb-5 max-w-xs">
        <SelectField label="Subject" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </SelectField>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="h-5 w-5" aria-hidden />}
          title="No attendance records available"
          description="Records will show up here once a class has been marked."
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-brand-soft/50 text-xs font-medium uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => {
                  const subject = subjects.find((s) => s.id === r.subjectId)
                  return (
                    <tr key={r.id} className="transition-standard hover:bg-brand-soft/40">
                      <td className="px-5 py-3.5 text-ink">{formatDateFull(r.date)}</td>
                      <td className="px-5 py-3.5 text-ink">{subject?.name}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="flex flex-col gap-2.5 sm:hidden">
            {rows.map((r) => {
              const subject = subjects.find((s) => s.id === r.subjectId)
              return (
                <Card key={r.id} className="flex items-center justify-between px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{subject?.name}</p>
                    <p className="text-xs text-muted">{formatDateFull(r.date)}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </Card>
              )
            })}
          </div>
        </>
      )}
    </AppShell>
  )
}
