import { RiskTier } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TrafficLightProps {
  tier: RiskTier
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const TIER_CONFIG = {
  RED: { label: 'Red', dot: 'bg-red-500', ring: 'ring-red-200', text: 'text-red-700', bg: 'bg-red-50' },
  YELLOW: { label: 'Yellow', dot: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-700', bg: 'bg-amber-50' },
  GREEN: { label: 'Green', dot: 'bg-green-500', ring: 'ring-green-200', text: 'text-green-700', bg: 'bg-green-50' },
}

const SIZE_CONFIG = {
  sm: { dot: 'h-2.5 w-2.5', text: 'text-xs', pad: 'px-2 py-0.5' },
  md: { dot: 'h-3 w-3', text: 'text-sm', pad: 'px-2.5 py-1' },
  lg: { dot: 'h-4 w-4', text: 'text-base', pad: 'px-3 py-1.5' },
}

export function TrafficLight({ tier, size = 'md', showLabel = true, className }: TrafficLightProps) {
  const tc = TIER_CONFIG[tier]
  const sc = SIZE_CONFIG[size]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold ring-1',
        tc.bg, tc.text, tc.ring, sc.text, sc.pad,
        className
      )}
    >
      <span className={cn('rounded-full', tc.dot, sc.dot)} />
      {showLabel && tier}
    </span>
  )
}
