export function SunMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M24 6v5M24 37v5M6 24h5M37 24h5M10.5 10.5l3.5 3.5M34 34l3.5 3.5M37.5 10.5 34 14M14 34l-3.5 3.5" />
      </g>
    </svg>
  );
}
