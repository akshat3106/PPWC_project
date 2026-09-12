import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  AttendanceRecord,
  AttendanceStatus,
  AuthedUser,
  NotificationItem,
  Student,
  Subject,
  Teacher,
} from '@/types'
import {
  DEMO_ATTENDANCE_RECORDS,
  DEMO_CREDENTIALS,
  DEMO_STUDENTS,
  DEMO_SUBJECTS,
  DEMO_TEACHER,
} from '@/data/mockData'
import { computeOverallStats, computeSubjectStats } from '@/lib/attendance'

const STORAGE_KEY = 'attendly:v1'

interface PersistedState {
  students: Student[]
  teachers: Teacher[]
  subjects: Subject[]
  records: AttendanceRecord[]
  notifications: NotificationItem[]
  currentUser: AuthedUser | null
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PersistedState
  } catch {
    // fall through to defaults
  }
  return {
    students: DEMO_STUDENTS,
    teachers: [DEMO_TEACHER],
    subjects: DEMO_SUBJECTS,
    records: DEMO_ATTENDANCE_RECORDS,
    notifications: [],
    currentUser: null,
  }
}

export interface StudentSignupInput {
  name: string
  studentId: string
  email: string
  password: string
  course?: string
}

export interface TeacherSignupInput {
  name: string
  teacherId: string
  email: string
  password: string
  department?: string
}

interface AppContextValue extends PersistedState {
  loginStudent: (email: string, password: string) => { ok: true } | { ok: false; message: string }
  loginTeacher: (email: string, password: string) => { ok: true } | { ok: false; message: string }
  signupStudent: (input: StudentSignupInput) => { ok: true } | { ok: false; message: string }
  signupTeacher: (input: TeacherSignupInput) => { ok: true } | { ok: false; message: string }
  logout: () => void
  currentStudent: Student | null
  currentTeacher: Teacher | null
  saveAttendanceForSession: (
    subjectId: string,
    date: string,
    statuses: Record<string, AttendanceStatus>,
  ) => NotificationItem[]
  getRecord: (subjectId: string, date: string, studentId: string) => AttendanceRecord | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const loginStudent = useCallback(
    (email: string, password: string) => {
      const normalized = email.trim().toLowerCase()
      const match = state.students.find((s) => s.email.toLowerCase() === normalized)
      const isDemo =
        normalized === DEMO_CREDENTIALS.student.email.toLowerCase() &&
        password === DEMO_CREDENTIALS.student.password
      const isMockAccount = match && password.length >= 4 && !isDemo

      if (isDemo && match) {
        setState((s) => ({ ...s, currentUser: { role: 'student', id: match.id, name: match.name } }))
        return { ok: true as const }
      }
      if (isMockAccount) {
        setState((s) => ({ ...s, currentUser: { role: 'student', id: match.id, name: match.name } }))
        return { ok: true as const }
      }
      return { ok: false as const, message: 'Invalid email/ID or password.' }
    },
    [state.students],
  )

  const loginTeacher = useCallback(
    (email: string, password: string) => {
      const normalized = email.trim().toLowerCase()
      const match = state.teachers.find((t) => t.email.toLowerCase() === normalized)
      const isDemo =
        normalized === DEMO_CREDENTIALS.teacher.email.toLowerCase() &&
        password === DEMO_CREDENTIALS.teacher.password
      const isMockAccount = match && password.length >= 4 && !isDemo

      if (isDemo && match) {
        setState((s) => ({ ...s, currentUser: { role: 'teacher', id: match.id, name: match.name } }))
        return { ok: true as const }
      }
      if (isMockAccount) {
        setState((s) => ({ ...s, currentUser: { role: 'teacher', id: match.id, name: match.name } }))
        return { ok: true as const }
      }
      return { ok: false as const, message: 'Invalid email/ID or password.' }
    },
    [state.teachers],
  )

  const signupStudent = useCallback(
    (input: StudentSignupInput) => {
      const normalized = input.email.trim().toLowerCase()
      if (state.students.some((s) => s.email.toLowerCase() === normalized)) {
        return { ok: false as const, message: 'An account with this email already exists.' }
      }
      const id = `student-new-${Date.now()}`
      const newStudent: Student = {
        id,
        name: input.name,
        email: input.email.trim(),
        studentId: input.studentId,
        course: input.course?.trim() || 'Unassigned course',
      }
      setState((s) => ({
        ...s,
        students: [...s.students, newStudent],
        currentUser: { role: 'student', id, name: newStudent.name },
      }))
      return { ok: true as const }
    },
    [state.students],
  )

  const signupTeacher = useCallback(
    (input: TeacherSignupInput) => {
      const normalized = input.email.trim().toLowerCase()
      if (state.teachers.some((t) => t.email.toLowerCase() === normalized)) {
        return { ok: false as const, message: 'An account with this email already exists.' }
      }
      const id = `teacher-new-${Date.now()}`
      const newTeacher: Teacher = {
        id,
        name: input.name,
        email: input.email.trim(),
        teacherId: input.teacherId,
        department: input.department?.trim() || 'Unassigned department',
      }
      setState((s) => ({
        ...s,
        teachers: [...s.teachers, newTeacher],
        currentUser: { role: 'teacher', id, name: newTeacher.name },
      }))
      return { ok: true as const }
    },
    [state.teachers],
  )

  const logout = useCallback(() => {
    setState((s) => ({ ...s, currentUser: null }))
  }, [])

  const getRecord = useCallback(
    (subjectId: string, date: string, studentId: string) =>
      state.records.find((r) => r.subjectId === subjectId && r.date === date && r.studentId === studentId),
    [state.records],
  )

  const saveAttendanceForSession = useCallback(
    (subjectId: string, date: string, statuses: Record<string, AttendanceStatus>) => {
      const now = new Date().toISOString()
      const changedStudentIds: string[] = []
      let nextRecords: AttendanceRecord[] = []

      setState((s) => {
        const byKey = new Map<string, AttendanceRecord>(
          s.records.map((r) => [`${r.subjectId}|${r.date}|${r.studentId}`, r]),
        )

        for (const [studentId, status] of Object.entries(statuses)) {
          const key = `${subjectId}|${date}|${studentId}`
          const existing = byKey.get(key)
          if (existing) {
            if (existing.status !== status) {
              changedStudentIds.push(studentId)
              byKey.set(key, { ...existing, status, updatedAt: now })
            }
          } else {
            if (status !== 'not_marked') changedStudentIds.push(studentId)
            byKey.set(key, {
              id: `att-new-${Date.now()}-${studentId}`,
              studentId,
              subjectId,
              date,
              status,
              updatedAt: now,
            })
          }
        }

        nextRecords = Array.from(byKey.values())
        return { ...s, records: nextRecords }
      })

      const subject = state.subjects.find((sub) => sub.id === subjectId)
      if (!subject || changedStudentIds.length === 0) return []

      const newNotifications: NotificationItem[] = changedStudentIds.map((studentId, idx) => {
        const subjectStats = computeSubjectStats(subject, studentId, nextRecords)
        const overallStats = computeOverallStats(state.subjects, studentId, nextRecords)
        return {
          id: `notif-${Date.now()}-${idx}`,
          studentId,
          attendanceRecordId: `att-${subjectId}-${date}-${studentId}`,
          subjectId,
          date,
          status: statuses[studentId],
          overallPercentage: overallStats.percentage,
          subjectPercentage: subjectStats.percentage,
          createdAt: now,
        }
      })

      setState((s) => ({ ...s, notifications: [...newNotifications, ...s.notifications] }))
      return newNotifications
    },
    [state.subjects],
  )

  const currentStudent = useMemo(
    () =>
      state.currentUser?.role === 'student'
        ? state.students.find((s) => s.id === state.currentUser!.id) ?? null
        : null,
    [state.currentUser, state.students],
  )

  const currentTeacher = useMemo(
    () =>
      state.currentUser?.role === 'teacher'
        ? state.teachers.find((t) => t.id === state.currentUser!.id) ?? null
        : null,
    [state.currentUser, state.teachers],
  )

  const value: AppContextValue = {
    ...state,
    loginStudent,
    loginTeacher,
    signupStudent,
    signupTeacher,
    logout,
    currentStudent,
    currentTeacher,
    saveAttendanceForSession,
    getRecord,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
