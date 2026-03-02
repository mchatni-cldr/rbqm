import { SignalStatus, SignalSeverity } from '@/lib/types'
import { SIGNAL_STATUS_CONFIG, SEVERITY_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StatusProps {
  status: SignalStatus
  className?: string
}

export function SignalStatusBadge({ status, className }: StatusProps) {
  const cfg = SIGNAL_STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', cfg.color, className)}>
      {cfg.label}
    </span>
  )
}

interface SeverityProps {
  severity: SignalSeverity
  className?: string
}

export function SeverityBadge({ severity, className }: SeverityProps) {
  const cfg = SEVERITY_CONFIG[severity]
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold', cfg.color, className)}>
      {severity === 'CRITICAL' && '⚠ '}
      {cfg.label}
    </span>
  )
}
