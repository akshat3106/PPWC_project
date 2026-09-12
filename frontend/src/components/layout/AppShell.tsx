import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'
import type { Role } from '@/types'

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar role={role} />
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pt-10 lg:px-12 lg:pb-12">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
        <MobileNav role={role} />
      </div>
    </div>
  )
}
