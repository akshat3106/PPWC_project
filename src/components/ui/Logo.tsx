export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden className="shrink-0 drop-shadow-[0_4px_10px_rgba(79,70,229,0.35)]">
        <defs>
          <linearGradient id="attendly-logo-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f46e5" />
            <stop offset="1" stopColor="#171717" />
          </linearGradient>
        </defs>
        <rect width="28" height="28" rx="8" fill="url(#attendly-logo-grad)" />
        <path
          d="M8 14.5L12 18.5L20 9.5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[17px] font-semibold tracking-tight text-ink">Attendly</span>
    </div>
  )
}
