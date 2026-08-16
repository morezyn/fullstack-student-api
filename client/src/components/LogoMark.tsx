interface LogoMarkProps {
  className?: string
}

function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <g transform="skewX(-6)" fill="currentColor">
        <rect x="11" y="8.75" width="13" height="3.2" rx="1.6" opacity="0.92" />
        <rect x="7" y="14.4" width="17" height="3.2" rx="1.6" />
        <rect x="11" y="20" width="13" height="3.2" rx="1.6" opacity="0.84" />
      </g>
    </svg>
  )
}

export default LogoMark
