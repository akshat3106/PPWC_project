import type {
  AttendanceHealth,
  AttendanceRecord,
  OverallStats,
  Subject,
  SubjectStats,
} from '@/types'

export function computeSubjectStats(
  subject: Subject,
  studentId: string,
  records: AttendanceRecord[],
): SubjectStats {
  const relevant = records.filter((r) => r.subjectId === subject.id && r.studentId === studentId)
  const present = relevant.filter((r) => r.status === 'present').length
  const absent = relevant.filter((r) => r.status === 'absent').length
  const total = present + absent
  const percentage = total === 0 ? null : Math.round((present / total) * 1000) / 10

  return { subject, present, absent, total, percentage }
}

export function computeOverallStats(
  subjects: Subject[],
  studentId: string,
  records: AttendanceRecord[],
): OverallStats {
  const perSubject = subjects.map((s) => computeSubjectStats(s, studentId, records))
  const present = perSubject.reduce((sum, s) => sum + s.present, 0)
  const absent = perSubject.reduce((sum, s) => sum + s.absent, 0)
  const total = present + absent
  const percentage = total === 0 ? null : Math.round((present / total) * 1000) / 10

  return { present, absent, total, percentage }
}

export function attendanceHealth(percentage: number | null): AttendanceHealth {
  if (percentage === null) return 'none'
  if (percentage >= 85) return 'good'
  if (percentage >= 75) return 'attention'
  return 'low'
}

export function healthLabel(health: AttendanceHealth): string {
  switch (health) {
    case 'good':
      return "You're doing well"
    case 'attention':
      return 'Needs attention'
    case 'low':
      return 'Attendance is low'
    case 'none':
      return 'No attendance data yet'
  }
}

export function formatPercentage(percentage: number | null): string {
  if (percentage === null) return 'No attendance data'
  return `${percentage.toFixed(1)}%`
}

export function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

export function formatDateFull(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })
}
