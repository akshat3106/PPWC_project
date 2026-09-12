import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ClipboardCheck, Inbox, BookOpen, Users, TrendingUp } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { CardSkeleton, EmptyState, RowSkeleton } from '@/components/ui/States'
import { useApp } from '@/context/AppContext'
import { formatDateLabel } from '@/lib/attendance'
import { useSimulatedLoading } from '@/lib/useSimulatedLoading'

export function TeacherDashboard() {
  const { currentTeacher, subjects, records, notifications, students } = useApp()
  const loading = useSimulatedLoading()

  if (!currentTeacher) return null

  const today = new Date().toISOString().slice(0, 10)
  const todaysRecords = records.filter((r) => r.date === today)
  const classesToday = new Set(todaysRecords.map((r) => r.subjectId)).size
  const todaysPresent = todaysRecords.filter((r) => r.status === 'present').length
  const todaysTotal = todaysRecords.length
  const todaysPct = todaysTotal === 0 ? null : Math.round((todaysPresent / todaysTotal) * 1000) / 10

  const uniqueStudents = new Set(subjects.flatMap((s) => s.studentIds)).size
  const studentMap = new Map(students.map((s) => [s.id, s]))
  const subjectMap = new Map(subjects.map((s) => [s.id, s]))
  const recentNotifications = notifications.slice(0, 6)

  return (
    <AppShell role="teacher">
      <PageHeader
        title={`Good morning, ${currentTeacher.name.split(' ')[0]}`}
        subtitle="Manage today's attendance in one place."
        action={
          <Link to="/teacher/attendance">
            <Button icon={<ClipboardCheck className="h-4 w-4" aria-hidden />}>Take attendance</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Kpi label="Classes today" value={classesToday} icon={<CalendarDays className="h-4 w-4" aria-hidden />} />
          <Kpi label="Subjects" value={subjects.length} icon={<BookOpen className="h-4 w-4" aria-hidden />} />
          <Kpi label="Students" value={uniqueStudents} icon={<Users className="h-4 w-4" aria-hidden />} />
          <Kpi
            label="Today's attendance"
            value={todaysPct === null ? '—' : `${todaysPct.toFixed(1)}%`}
            icon={<TrendingUp className="h-4 w-4" aria-hidden />}
          />
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-ink">Recent attendance updates</h2>
        {loading ? (
          <div className="flex flex-col gap-2.5">
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </div>
        ) : recentNotifications.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-5 w-5" aria-hidden />}
            title="No attendance recorded"
            description="Select a subject and date to begin taking attendance."
          />
        ) : (
          <Card className="divide-y divide-border">
            {recentNotifications.map((n) => {
              const student = studentMap.get(n.studentId)
              const subject = subjectMap.get(n.subjectId)
              return (
                <div key={n.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{student?.name}</p>
                    <p className="text-xs text-muted">
                      {subject?.name} · {formatDateLabel(n.date)}
                    </p>
                  </div>
                  <StatusBadge status={n.status} />
                </div>
              )
            })}
          </Card>
        )}
      </div>
    </AppShell>
  )
}

function Kpi({ label, value, icon }: { label: string; value: number | string; icon: ReactNode }) {
  return (
    <Card className="p-5 transition-standard hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-[var(--color-accent-ink)]">
        {icon}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </Card>
  )
}
