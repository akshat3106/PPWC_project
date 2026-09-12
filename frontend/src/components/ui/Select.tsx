import type { KeyboardEvent, ReactNode } from 'react'
import { Children, isValidElement, useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

interface OptionData {
  value: string
  label: ReactNode
  disabled?: boolean
}

interface SelectProps {
  label: string
  value: string
  onChange: (e: { target: { value: string } }) => void
  children: ReactNode
  id?: string
  className?: string
  disabled?: boolean
}

function extractOptions(children: ReactNode): OptionData[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return []
    const props = child.props as { value?: string; children?: ReactNode; disabled?: boolean }
    return [{ value: String(props.value ?? ''), label: props.children, disabled: props.disabled }]
  })
}

export function SelectField({ label, id, className = '', value, onChange, children, disabled }: SelectProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  const options = extractOptions(children)
  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : options[0]

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(Math.max(0, selectedIndex))
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function openList() {
    if (disabled) return
    setActiveIndex(Math.max(0, selectedIndex))
    setOpen(true)
  }

  function commit(val: string) {
    onChange({ target: { value: val } })
    setOpen(false)
  }

  function onButtonKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const opt = options[activeIndex]
      if (opt && !opt.disabled) commit(opt.value)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5" ref={rootRef}>
      <label htmlFor={selectId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          id={selectId}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${selectId}-listbox`}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onButtonKeyDown}
          className={`flex h-11 w-full items-center justify-between gap-2 rounded-[var(--radius-md)] border bg-surface px-3.5 text-left text-[15px] text-ink transition-standard focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 ${
            open ? 'border-accent ring-2 ring-accent/20' : 'border-border'
          } ${className}`}
        >
          <span className="truncate">{selected?.label}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted transition-standard ${open ? 'rotate-180 text-accent' : ''}`}
            aria-hidden
          />
        </button>

        {open && (
          <ul
            id={`${selectId}-listbox`}
            role="listbox"
            aria-activedescendant={options[activeIndex] ? `${selectId}-opt-${activeIndex}` : undefined}
            className="animate-fade-slide absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-[var(--radius-md)] border border-border bg-surface p-1.5 shadow-lift"
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value
              const isActive = idx === activeIndex
              return (
                <li
                  key={opt.value}
                  id={`${selectId}-opt-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => !opt.disabled && commit(opt.value)}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-[15px] transition-standard ${
                    isSelected
                      ? 'bg-accent-soft font-medium text-[var(--color-accent-ink)]'
                      : isActive
                        ? 'bg-brand-soft text-ink'
                        : 'text-ink'
                  } ${opt.disabled ? 'pointer-events-none opacity-40' : ''}`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
