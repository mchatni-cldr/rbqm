import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, badge, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-border pb-5 mb-2', className)}>
      <div>
        {badge && <div className="mb-2.5">{badge}</div>}
        <h1 className="text-[1.65rem] font-bold tracking-tight leading-tight">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 mt-1">
          {actions}
        </div>
      )}
    </div>
  )
}
