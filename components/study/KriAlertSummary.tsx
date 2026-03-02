import { Site } from '@/lib/types'
import { KRI_DEFINITIONS } from '@/lib/constants'
import { COUNTRY_FLAGS } from '@/lib/constants'
import { formatKriValue } from '@/lib/utils'
import Link from 'next/link'

interface Props {
  sites: Site[]
}

export function KriAlertSummary({ sites }: Props) {
  // Build a flat list of all KRI breaches
  const breaches: { site: Site; kriLabel: string; kriId: string; value: number; status: string }[] = []

  for (const site of sites) {
    for (const kri of KRI_DEFINITIONS) {
      const v = site.kriValues[kri.id]
      if (!v) continue
      if (v.breachStatus === 'QTL' || v.breachStatus === 'RED') {
        breaches.push({
          site,
          kriLabel: kri.label,
          kriId: kri.id,
          value: v.current,
          status: v.breachStatus,
        })
      }
    }
  }

  // Sort by QTL first, then site risk score
  breaches.sort((a, b) => {
    if (a.status === 'QTL' && b.status !== 'QTL') return -1
    if (a.status !== 'QTL' && b.status === 'QTL') return 1
    return b.site.compositeRiskScore - a.site.compositeRiskScore
  })

  if (breaches.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No KRI breaches detected
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {breaches.slice(0, 8).map((b, i) => (
        <div
          key={`${b.site.id}-${b.kriId}`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
            b.status === 'QTL' ? 'bg-purple-50 border border-purple-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            b.status === 'QTL' ? 'bg-purple-200 text-purple-800' : 'bg-red-200 text-red-800'
          }`}>
            {b.status}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{b.site.name}</p>
            <p className="text-xs text-muted-foreground">{b.kriLabel}</p>
          </div>
          <span className="shrink-0 font-mono text-xs font-semibold">
            {formatKriValue(b.kriId as never, b.value)}
          </span>
          <span className="shrink-0">{COUNTRY_FLAGS[b.site.countryCode]}</span>
        </div>
      ))}
      {breaches.length > 8 && (
        <p className="text-center text-xs text-muted-foreground pt-1">
          +{breaches.length - 8} more breaches
        </p>
      )}
    </div>
  )
}
