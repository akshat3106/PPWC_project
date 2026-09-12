import { BookX } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/Progress'
import { HealthBadge } from '@/components/ui/Badge'
import { CardSkeleton, EmptyState } from '@/components/ui/States'
import { useApp } from '@/context/AppContext'
import { attendanceHealth, computeSubjectStats, formatPercentage } from '@/lib/attendance'
import { useSimulatedLoading } from '@/lib/useSimulatedLoading'

export function StudentSubjects() {
  const { currentStudent, subjects, records } = useApp()
  const loading = useSimulatedLoading()

  if (!currentStudent) return null

  const stats = subjects.map((s) => computeSubjectStats(s, currentStudent.id, records))

  return (
    <AppShell role="student">
      <PageHeader title="Your subjects" subtitle="Attendance broken down by subject." />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : stats.length === 0 ? (
        <EmptyState
          icon={<BookX className="h-5 w-5" aria-hidden />}
          title="No subjects assigned yet"
          description="Once you're enrolled in a subject, it will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const health = attendanceHealth(stat.percentage)
            return (
              <Card key={stat.subject.id} className="p-5 transition-standard hover:-translate-y-0.5 hover:shadow-lift">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{stat.subject.name}</p>
                    <p className="text-xs text-muted">{stat.subject.code}</p>
                  </div>
                  <HealthBadge health={health} />
                </div>

                <p className="mt-4 text-3xl font-semibold tracking-tight text-ink">
                  {formatPercentage(stat.percentage)}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {stat.present} / {stat.total} classes attended
                </p>
                <ProgressBar percentage={stat.percentage} health={health} className="mt-3" />

                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <span>Present {stat.present}</span>
                  <span>Absent {stat.absent}</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
