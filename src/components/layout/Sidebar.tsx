import { Link, NavLink } from 'react-router-dom'
import { LayoutGrid, BookOpen, Clock, ClipboardCheck, LogOut } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { useApp } from '@/context/AppContext'
import type { Role } from '@/types'

const studentNav = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/student/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/student/history', label: 'History', icon: Clock },
]

const teacherNav = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/teacher/attendance', label: 'Take attendance', icon: ClipboardCheck },
  { to: '/teacher/history', label: 'History', icon: Clock },
]

export function Sidebar({ role }: { role: Role }) {
  const { logout, currentStudent, currentTeacher } = useApp()
  const items = role === 'student' ? studentNav : teacherNav
  const displayName = role === 'student' ? currentStudent?.name : currentTeacher?.name
  const subLabel = role === 'student' ? currentStudent?.studentId : currentTeacher?.department

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-border bg-surface px-5 py-6 lg:flex">
      <div>
        <Link
          to={role === 'student' ? '/student/dashboard' : '/teacher/dashboard'}
          className="block rounded-[var(--radius-sm)] px-2 py-1 transition-standard hover:opacity-80"
        >
          <Logo />
        </Link>
        <nav className="mt-9 flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-standard ${
                  isActive
                    ? 'bg-accent text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.5)]'
                    : 'text-muted hover:bg-brand-soft hover:text-ink'
                }`
              }
            >
              <item.icon className="h-[18px] w-[18px]" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-[var(--color-accent-ink)]">
            {displayName?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{displayName}</p>
            <p className="truncate text-xs text-muted">{subLabel}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium text-muted transition-standard hover:bg-brand-soft hover:text-ink"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden />
          Log out
        </button>
      </div>
    </aside>
  )
}
