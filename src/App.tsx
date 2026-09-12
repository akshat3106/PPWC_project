import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { ToastProvider } from '@/context/ToastContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Landing } from '@/pages/Landing'
import { StudentLogin } from '@/pages/auth/StudentLogin'
import { StudentSignup } from '@/pages/auth/StudentSignup'
import { TeacherLogin } from '@/pages/auth/TeacherLogin'
import { TeacherSignup } from '@/pages/auth/TeacherSignup'
import { StudentDashboard } from '@/pages/student/Dashboard'
import { StudentSubjects } from '@/pages/student/Subjects'
import { StudentHistory } from '@/pages/student/History'
import { TeacherDashboard } from '@/pages/teacher/Dashboard'
import { TeacherTakeAttendance } from '@/pages/teacher/TakeAttendance'
import { TeacherHistory } from '@/pages/teacher/History'

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/signup" element={<StudentSignup />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher/signup" element={<TeacherSignup />} />

            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/subjects"
              element={
                <ProtectedRoute role="student">
                  <StudentSubjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/history"
              element={
                <ProtectedRoute role="student">
                  <StudentHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attendance"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherTakeAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/history"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherHistory />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}

export default App
