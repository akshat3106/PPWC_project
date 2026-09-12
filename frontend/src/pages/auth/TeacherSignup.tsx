import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { Field, PasswordField } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function TeacherSignup() {
  const { signupTeacher } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    teacherId: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.name.trim()) nextErrors.name = 'Enter your full name.'
    if (!form.teacherId.trim()) nextErrors.teacherId = 'Enter your teacher ID.'
    if (!EMAIL_RE.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.password.length < 6) nextErrors.password = 'Use at least 6 characters.'
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    window.setTimeout(() => {
      const result = signupTeacher({
        name: form.name,
        teacherId: form.teacherId,
        email: form.email,
        password: form.password,
        department: form.department,
      })
      setLoading(false)
      if (result.ok) {
        navigate('/teacher/dashboard')
      } else {
        setErrors({ form: result.message })
      }
    }, 500)
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Teacher signup"
      subtitle="Create an account to manage classes."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/teacher/login" className="font-semibold text-accent hover:text-[var(--color-accent-hover)]">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field
          label="Full name"
          autoComplete="name"
          placeholder="Priya Menon"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
        />
        <Field
          label="Teacher ID"
          placeholder="FAC-021"
          value={form.teacherId}
          onChange={(e) => update('teacherId', e.target.value)}
          error={errors.teacherId}
        />
        <Field
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@attendly.edu"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
        />
        <Field
          label="Department (optional)"
          placeholder="Computer Science & Engineering"
          value={form.department}
          onChange={(e) => update('department', e.target.value)}
        />
        <PasswordField
          label="Password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
        />
        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />

        {errors.form && (
          <p role="alert" className="rounded-[var(--radius-sm)] bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
            {errors.form}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} icon={<UserPlus className="h-4 w-4" aria-hidden />}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}
