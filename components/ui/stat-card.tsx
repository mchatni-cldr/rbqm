import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'flat'
  variant?: 'default' | 'red' | 'yellow' | 'green'
  icon?: React.ReactNode
  className?: string
}

const VARIANT_STYLES = {
  default: 'bg-card border-border',
  red: 'bg-red-50 border-red-200',
  yellow: 'bg-amber-50 border-amber-200',
  green: 'bg-green-50 border-green-200',
}

const ACCENT_STYLES = {
  default: '',
  red: 'border-l-4 border-l-red-500',
  yellow: 'border-l-4 border-l-amber-500',
  green: 'border-l-4 border-l-green-500',
}

const VALUE_STYLES = {
  default: 'text-foreground',
  red: 'text-red-700',
  yellow: 'text-amber-700',
  green: 'text-green-700',
}

const ICON_STYLES = {
  default: 'text-muted-foreground',
  red: 'text-red-400',
  yellow: 'text-amber-400',
  green: 'text-green-400',
}

export function StatCard({ label, value, sub, variant = 'default', icon, className }: StatCardProps) {
  return (
    <Card className={cn('border', VARIANT_STYLES[variant], ACCENT_STYLES[variant], className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{label}</p>
            <p className={cn('mt-1.5 text-2xl font-bold tabular-nums leading-none', VALUE_STYLES[variant])}>{value}</p>
            {sub && <p className="mt-1 text-xs text-muted-foreground leading-snug">{sub}</p>}
          </div>
          {icon && (
            <div className={cn('ml-3 shrink-0', ICON_STYLES[variant])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
