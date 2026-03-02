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

const VALUE_STYLES = {
  default: 'text-foreground',
  red: 'text-red-700',
  yellow: 'text-amber-700',
  green: 'text-green-700',
}

export function StatCard({ label, value, sub, variant = 'default', icon, className }: StatCardProps) {
  return (
    <Card className={cn('border', VARIANT_STYLES[variant], className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{label}</p>
            <p className={cn('mt-1 text-2xl font-bold tabular-nums', VALUE_STYLES[variant])}>{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          {icon && (
            <div className="ml-3 shrink-0 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
