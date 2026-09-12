import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'md' | 'lg' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.5)] hover:bg-[var(--color-accent-hover)] hover:shadow-glow disabled:bg-neutral-400 disabled:shadow-none',
  secondary: 'bg-surface text-ink border border-border hover:border-accent/40 hover:bg-accent-soft hover:text-[var(--color-accent-ink)] disabled:opacity-50',
  ghost: 'bg-transparent text-ink hover:bg-brand-soft disabled:opacity-50',
  destructive: 'bg-danger text-white hover:brightness-95 disabled:opacity-50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-[var(--radius-sm)]',
  md: 'h-11 px-5 text-sm rounded-[var(--radius-sm)]',
  lg: 'h-[52px] px-6 text-[15px] rounded-[var(--radius-md)]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-standard active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  )
}
