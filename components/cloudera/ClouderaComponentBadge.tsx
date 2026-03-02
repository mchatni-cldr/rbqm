import { CLOUDERA_COMPONENTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type ClouderaComponentId = keyof typeof CLOUDERA_COMPONENTS

interface Props {
  component: ClouderaComponentId
  size?: 'sm' | 'md'
  className?: string
}

export function ClouderaComponentBadge({ component, size = 'sm', className }: Props) {
  const cfg = CLOUDERA_COMPONENTS[component]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        cfg.bgColor,
        cfg.textColor,
        cfg.borderColor,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className
      )}
      title={cfg.description}
    >
      <span>{cfg.icon}</span>
      {cfg.name}
    </span>
  )
}
