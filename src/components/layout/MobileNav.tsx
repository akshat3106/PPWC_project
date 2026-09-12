import { NavLink } from 'react-router-dom'
import { LayoutGrid, BookOpen, Clock, ClipboardCheck } from 'lucide-react'
import type { Role } from '@/types'

const studentNav = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/student/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/student/history', label: 'History', icon: Clock },
]

const teacherNav = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/teacher/history', label: 'History', icon: Clock },
]

export function MobileNav({ role }: { role: Role }) {
  const items = role === 'student' ? studentNav : teacherNav
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-standard ${
              isActive ? 'text-accent' : 'text-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} aria-hidden />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
