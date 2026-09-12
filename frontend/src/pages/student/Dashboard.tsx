import { Link } from 'react-router-dom'
import { ArrowRight, CalendarX2 } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/PageHeader'
import { NotificationBell } from '@/components/NotificationBell'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/Progress'
import { HealthBadge, StatusBadge } from '@/components/ui/Badge'
import { CardSkeleton, EmptyState } from '@/components/ui/States'
import { useApp } from '@/context/AppContext'
import { attendanceHealth, computeOverallStats, computeSubjectStats, formatDateLabel, formatPercentage, healthLabel } from '@/lib/attendance'
import { useSimulatedLoading } from '@/lib/useSimulatedLoading'

export function StudentDashboard() {
  const { currentStudent, subjects, records } = useApp()
  const loading = useSimulatedLoading()

  if (!currentStudent) return null

  const overall = computeOverallStats(subjects, currentStudent.id, records)
  const health = attendanceHealth(overall.percentage)
  const subjectStats = subjects.map((s) => computeSubjectStats(s, currentStudent.id, records))

  const recent = records
    .filter((r) => r.studentId === currentStudent.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5)

  return (
    <AppShell role="student">
      <PageHeader
        title={`Good morning, ${currentStudent.name.split(' ')[0]}`}
        subtitle="Here's how your attendance is looking."
        action={<NotificationBell studentId={currentStudent.id} />}
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-muted">Overall attendance</p>
              <HealthBadge health={health} />
            </div>
            <p className="mt-2 text-[52px] font-semibold leading-none tracking-tight text-ink sm:text-[64px]">
              {overall.percentage === null ? '—' : `${overall.percentage.toFixed(1)}%`}
            </p>
            <p className="mt-1 text-sm text-muted">{healthLabel(health)}</p>
            <ProgressBar percentage={overall.percentage} health={health} className="mt-5" />
            <div className="mt-5 flex flex-wrap gap-6 text-sm">
              <Stat label="Present" value={overall.present} />
              <Stat label="Absent" value={overall.absent} />
              <Stat label="Total classes" value={overall.total} />
            </div>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted">Subjects enrolled</p>
              <p className="mt-2 text-[40px] font-semibold leading-none tracking-tight text-ink">
                {subjects.length}
              </p>
            </div>
            <Link
              to="/student/subjects"
              className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-standard hover:text-[var(--color-accent-hover)]"
            >
              View subject breakdown
              <ArrowRight className="h-4 w-4 transition-standard group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </Card>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Subject-wise attendance</h2>
        <Link to="/student/subjects" className="text-sm font-medium text-muted hover:text-ink">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectStats.slice(0, 3).map((stat) => {
            const h = attendanceHealth(stat.percentage)
            return (
              <Card key={stat.subject.id} className="p-5">
                <p className="text-[15px] font-semibold text-ink">{stat.subject.name}</p>
                <p className="text-xs text-muted">{stat.subject.code}</p>
                <p className="mt-3 text-2xl font-semibold text-ink">{formatPercentage(stat.percentage)}</p>
                <ProgressBar percentage={stat.percentage} health={h} className="mt-3" />
                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>
                    {stat.present} / {stat.total} classes
                  </span>
                  <HealthBadge health={h} />
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-ink">Recent attendance</h2>
        {recent.length === 0 ? (
          <EmptyState
            icon={<CalendarX2 className="h-5 w-5" aria-hidden />}
            title="No attendance yet"
            description="Your attendance will appear here once your first class is recorded."
          />
        ) : (
          <Card className="divide-y divide-border">
            {recent.map((r) => {
              const subject = subjects.find((s) => s.id === r.subjectId)
              return (
                <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{subject?.name}</p>
                    <p className="text-xs text-muted">{formatDateLabel(r.date)}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              )
            })}
          </Card>
        )}
      </div>
    </AppShell>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-lg font-semibold text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}
