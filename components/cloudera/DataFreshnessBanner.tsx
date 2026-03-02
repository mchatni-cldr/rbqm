import { gxpDataSources } from '@/data/data-sources'
import { ClouderaComponentBadge } from './ClouderaComponentBadge'
import { relativeTime } from '@/lib/utils'

interface Props {
  className?: string
}

export function DataFreshnessBanner({ className }: Props) {
  // Use the most recent sync timestamp from any connected source
  const connected = gxpDataSources.filter(s => s.status === 'CONNECTED')
  const mostRecent = connected.reduce((latest, src) =>
    src.lastSync > latest.lastSync ? src : latest
  )
  const sourceNames = ['EDC (Medidata Rave)', 'CTMS (Veeva)', 'Safety DB (Argus)', 'Lab/LIMS']

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-50/30 px-4 py-2.5 text-sm ${className ?? ''}`}>
      <ClouderaComponentBadge component="CDF" />
      <div className="w-px h-4 bg-orange-200 shrink-0" />
      <span className="text-orange-800 text-xs">
        <span className="font-medium">Last ingested:</span>{' '}
        <span className="font-bold text-orange-900">{relativeTime(mostRecent.lastSync)}</span>
      </span>
      <span className="text-orange-300">·</span>
      <span className="text-orange-700 text-xs hidden sm:inline truncate">
        {sourceNames.join(' · ')}
      </span>
      <span className="ml-auto flex items-center gap-1.5 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-green-700 font-semibold">Live</span>
      </span>
    </div>
  )
}
