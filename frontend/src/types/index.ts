export type Role = 'student' | 'teacher'

export type AttendanceStatus = 'present' | 'absent' | 'not_marked'

export interface Student {
  id: string
  name: string
  email: string
  studentId: string
  course: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  teacherId: string
  department: string
}

export interface Subject {
  id: string
  name: string
  code: string
  teacherId: string
  studentIds: string[]
}

export interface AttendanceRecord {
  id: string
  studentId: string
  subjectId: string
  date: string // ISO date, e.g. 2026-09-12
  status: AttendanceStatus
  updatedAt: string // ISO datetime
}

export interface NotificationItem {
  id: string
  studentId: string
  attendanceRecordId: string
  subjectId: string
  date: string
  status: AttendanceStatus
  overallPercentage: number | null
  subjectPercentage: number | null
  createdAt: string
}

export interface AuthedUser {
  role: Role
  id: string
  name: string
}

export interface SubjectStats {
  subject: Subject
  present: number
  absent: number
  total: number
  percentage: number | null // null = no attendance data yet
}

export interface OverallStats {
  present: number
  absent: number
  total: number
  percentage: number | null
}

export type AttendanceHealth = 'good' | 'attention' | 'low' | 'none'
