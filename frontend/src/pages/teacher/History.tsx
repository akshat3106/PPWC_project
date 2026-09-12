import { useMemo, useState } from 'react'
import { History as HistoryIcon } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { SelectField } from '@/components/ui/Select'
import { Field } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/Badge'
import { EmptyState, RowSkeleton } from '@/components/ui/States'
import { useApp } from '@/context/AppContext'
import { formatDateFull } from '@/lib/attendance'
import { useSimulatedLoading } from '@/lib/useSimulatedLoading'

export function TeacherHistory() {
  const { subjects, students, records } = useApp()
  const loading = useSimulatedLoading()

  const [subjectFilter, setSubjectFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [studentQuery, setStudentQuery] = useState('')

  const studentMap = new Map(students.map((s) => [s.id, s]))
  const subjectMap = new Map(subjects.map((s) => [s.id, s]))

  const rows = useMemo(() => {
    const query = studentQuery.trim().toLowerCase()
    return records
      .filter((r) => subjectFilter === 'all' || r.subjectId === subjectFilter)
      .filter((r) => !dateFilter || r.date === dateFilter)
      .filter((r) => {
        if (!query) return true
        const student = studentMap.get(r.studentId)
        return (
          student?.name.toLowerCase().includes(query) || student?.studentId.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, subjectFilter, dateFilter, studentQuery])

  return (
    <AppShell role="teacher">
      <PageHeader title="Attendance history" subtitle="Every recorded and updated session across your subjects." />

      <Card className="mb-5 grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
        <SelectField label="Subject" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </SelectField>
        <Field label="Date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        <Field
          label="Search student"
          placeholder="Name or ID"
          value={studentQuery}
          onChange={(e) => setStudentQuery(e.target.value)}
        />
      </Card>

      {loading ? (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon className="h-5 w-5" aria-hidden />}
          title="No attendance records available"
          description="Try a different subject, date, or student search."
        />
      ) : (
        <>
          <Card className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-brand-soft/50 text-xs font-medium uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => {
                  const student = studentMap.get(r.studentId)
                  const subject = subjectMap.get(r.subjectId)
                  return (
                    <tr key={r.id} className="transition-standard hover:bg-brand-soft/40">
                      <td className="px-5 py-3.5 text-ink">
                        {student?.name}
                        <span className="ml-1.5 text-xs text-muted">{student?.studentId}</span>
                      </td>
                      <td className="px-5 py-3.5 text-ink">{subject?.name}</td>
                      <td className="px-5 py-3.5 text-ink">{formatDateFull(r.date)}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted">
                        {new Date(r.updatedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>

          <div className="flex flex-col gap-2.5 sm:hidden">
            {rows.map((r) => {
              const student = studentMap.get(r.studentId)
              const subject = subjectMap.get(r.subjectId)
              return (
                <Card key={r.id} className="px-4 py-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{student?.name}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-muted">
                    {subject?.name} · {formatDateFull(r.date)}
                  </p>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </AppShell>
  )
}
