import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useApp } from '@/context/AppContext'
import type { Role } from '@/types'

export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const { currentUser } = useApp()

  if (!currentUser) {
    return <Navigate to={role === 'student' ? '/student/login' : '/teacher/login'} replace />
  }
  if (currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'student' ? '/student/dashboard' : '/teacher/dashboard'} replace />
  }
  return <>{children}</>
}
