import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { useApp } from '@/context/AppContext'
import type { Role } from '@/types'

export function TopBar({ role }: { role: Role }) {
  const { logout } = useApp()
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3.5 backdrop-blur lg:hidden">
      <Link
        to={role === 'student' ? '/student/dashboard' : '/teacher/dashboard'}
        className="rounded-[var(--radius-sm)] transition-standard hover:opacity-80"
      >
        <Logo />
      </Link>
      <button
        onClick={logout}
        aria-label="Log out"
        className="rounded-full p-2 text-muted transition-standard hover:bg-brand-soft hover:text-ink"
      >
        <LogOut className="h-5 w-5" aria-hidden />
      </button>
    </header>
  )
}
