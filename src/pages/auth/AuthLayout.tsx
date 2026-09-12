import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'

export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(79,70,229,0.10),transparent_70%)]"
      />
      <div className="relative w-full max-w-[400px]">
        <Link to="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>

        <div className="mb-7 text-center">
          <p className="text-xs font-medium text-muted">{eyebrow}</p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-soft sm:p-7">
          {children}
        </div>

        <div className="mt-5 text-center text-sm text-muted">{footer}</div>
      </div>
    </div>
  )
}
