import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Users2, Zap, LineChart, BellRing } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <Link to="/" className="transition-standard hover:opacity-80">
          <Logo />
        </Link>
      </header>

      <section className="relative overflow-hidden px-6 pb-20 pt-10 sm:px-10 sm:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.12),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(46,125,91,0.08),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-semibold text-[var(--color-accent-ink)]">
            <Zap className="h-3 w-3" aria-hidden />
            Built for real classrooms
          </span>
          <h1 className="mt-5 text-[40px] font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Attendance, <span className="text-gradient-accent">made simple.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg">
            Give teachers a faster way to track classes, and students a clear, honest view of where their
            attendance stands.
          </p>

          <div className="mx-auto mt-9 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/student/login"
              className="group flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-border bg-surface px-6 py-7 shadow-soft transition-standard hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lift"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-[var(--color-accent-ink)] transition-standard group-hover:bg-accent group-hover:text-white">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </div>
              <span className="text-[15px] font-semibold text-ink">I'm a student</span>
              <span className="text-xs text-muted">Check your attendance</span>
            </Link>
            <Link
              to="/teacher/login"
              className="group flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-border bg-surface px-6 py-7 shadow-soft transition-standard hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lift"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-[var(--color-accent-ink)] transition-standard group-hover:bg-accent group-hover:text-white">
                <Users2 className="h-5 w-5" aria-hidden />
              </div>
              <span className="text-[15px] font-semibold text-ink">I'm a teacher</span>
              <span className="text-xs text-muted">Mark and manage classes</span>
            </Link>
          </div>

          <p className="mt-6 text-xs font-medium text-muted">Secure · Simple · Responsive</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<Zap className="h-5 w-5" aria-hidden />}
            title="Fast attendance"
            description="Mark an entire class present or absent in seconds, with bulk actions for busy days."
          />
          <FeatureCard
            icon={<LineChart className="h-5 w-5" aria-hidden />}
            title="Clear insights"
            description="Overall and subject-wise percentages update the moment a record changes."
          />
          <FeatureCard
            icon={<BellRing className="h-5 w-5" aria-hidden />}
            title="Instant updates"
            description="Students see the change right away, with a preview of the notification behind it."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-soft transition-standard hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-lift">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-[var(--color-accent-ink)] transition-standard group-hover:bg-accent group-hover:text-white">
        {icon}
      </div>
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  )
}
