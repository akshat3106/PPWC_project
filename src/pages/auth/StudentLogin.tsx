import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { Field, PasswordField } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { DEMO_CREDENTIALS } from '@/data/mockData'

export function StudentLogin() {
  const { loginStudent } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!email.trim()) nextErrors.email = 'Enter your student ID or email.'
    if (!password) nextErrors.password = 'Enter your password.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    window.setTimeout(() => {
      const result = loginStudent(email, password)
      setLoading(false)
      if (result.ok) {
        navigate('/student/dashboard')
      } else {
        setErrors({ form: result.message })
      }
    }, 500)
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Student login"
      subtitle="Sign in to see your attendance."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/student/signup" className="font-semibold text-accent hover:text-[var(--color-accent-hover)]">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field
          label="Email or student ID"
          type="text"
          autoComplete="username"
          placeholder="arjun.sharma@attendly.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {errors.form && (
          <p role="alert" className="rounded-[var(--radius-sm)] bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
            {errors.form}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} icon={<LogIn className="h-4 w-4" aria-hidden />}>
          Log in
        </Button>

        <p className="rounded-[var(--radius-sm)] bg-brand-soft px-3 py-2 text-xs text-muted">
          Demo account: {DEMO_CREDENTIALS.student.email} / {DEMO_CREDENTIALS.student.password}
        </p>
      </form>
    </AuthLayout>
  )
}
