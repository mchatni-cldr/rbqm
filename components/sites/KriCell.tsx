import { KriValue, KriId } from '@/lib/types'
import { formatKriValue, breachStatusBg } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { KRI_MAP } from '@/lib/constants'

interface Props {
  kriId: KriId
  value: KriValue
}

export function KriCell({ kriId, value }: Props) {
  const def = KRI_MAP[kriId]
  const isBreaching = value.breachStatus === 'RED' || value.breachStatus === 'QTL'

  const trendArrow = value.trend === 'IMPROVING' ? '↑' : value.trend === 'WORSENING' ? '↓' : '→'
  const trendColor = value.trend === 'WORSENING' ? 'text-red-500' : value.trend === 'IMPROVING' ? 'text-green-500' : 'text-slate-400'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`
          flex flex-col items-center justify-center rounded px-2 py-1.5 min-w-[64px] cursor-default
          ${breachStatusBg(value.breachStatus)}
          ${isBreaching ? 'font-semibold' : ''}
        `}>
          <span className="text-xs font-mono tabular-nums leading-tight">
            {formatKriValue(kriId, value.current)}
          </span>
          <span className={`text-[10px] leading-tight ${trendColor}`}>
            {trendArrow}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs space-y-1">
          <p className="font-semibold">{def?.label}</p>
          <p>Current: {formatKriValue(kriId, value.current)} {def?.unit}</p>
          <p>Red threshold: {def?.redThreshold} {def?.unit}</p>
          <p>QTL: {def?.qtlThreshold} {def?.unit}</p>
          <p>Trend: {value.trend} ({value.trendDelta > 0 ? '+' : ''}{value.trendDelta})</p>
          <p className="font-medium">Status: {value.breachStatus}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
