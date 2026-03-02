'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSitesByStudy } from '@/data/sites'
import { studies } from '@/data/studies'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { DataFreshnessBanner } from '@/components/cloudera/DataFreshnessBanner'
import { TrafficLight } from '@/components/ui/traffic-light'
import { KriCell } from '@/components/sites/KriCell'
import { KRI_DEFINITIONS, COUNTRY_FLAGS } from '@/lib/constants'
import { Site, RiskTier, KriId } from '@/lib/types'
import { sortSitesByRisk } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Filter, ArrowUpDown } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default function SiteRiskTablePage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()

  const study = studies.find(s => s.id === id)
  if (!study) return notFound()

  const allSites = getSitesByStudy(id)

  // Filter state
  const [selectedTiers, setSelectedTiers] = useState<RiskTier[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [kriBreachFilter, setKriBreachFilter] = useState<KriId | null>(null)

  // Apply filters
  let sites = [...allSites]
  if (selectedTiers.length > 0) sites = sites.filter(s => selectedTiers.includes(s.riskTier))
  if (selectedCountries.length > 0) sites = sites.filter(s => selectedCountries.includes(s.countryCode))
  if (kriBreachFilter) sites = sites.filter(s => {
    const v = s.kriValues[kriBreachFilter]
    return v && (v.breachStatus === 'RED' || v.breachStatus === 'QTL')
  })
  sites = sortSitesByRisk(sites)

  const countries = [...new Set(allSites.map(s => s.countryCode))].sort()
  const toggleTier = (tier: RiskTier) => setSelectedTiers(prev =>
    prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
  )
  const toggleCountry = (cc: string) => setSelectedCountries(prev =>
    prev.includes(cc) ? prev.filter(c => c !== cc) : [...prev, cc]
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Site Risk Table"
        description={`${sites.length} of ${allSites.length} sites · Sorted by composite risk score`}
        badge={<ClouderaComponentBadge component="CDE" />}
      />

      <DataFreshnessBanner />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Filters:</span>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Risk:</span>
          {(['RED', 'YELLOW', 'GREEN'] as RiskTier[]).map(tier => (
            <button
              key={tier}
              onClick={() => toggleTier(tier)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border ${
                selectedTiers.includes(tier)
                  ? tier === 'RED' ? 'bg-red-500 text-white border-red-500'
                    : tier === 'YELLOW' ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-green-500 text-white border-green-500'
                  : 'border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">KRI breach:</span>
          <select
            value={kriBreachFilter ?? ''}
            onChange={e => setKriBreachFilter(e.target.value ? e.target.value as KriId : null)}
            className="rounded border border-border bg-card px-2 py-0.5 text-xs"
          >
            <option value="">Any KRI</option>
            {KRI_DEFINITIONS.map(k => (
              <option key={k.id} value={k.id}>{k.label}</option>
            ))}
          </select>
        </div>

        {(selectedTiers.length > 0 || selectedCountries.length > 0 || kriBreachFilter) && (
          <button
            onClick={() => { setSelectedTiers([]); setSelectedCountries([]); setKriBreachFilter(null) }}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="sticky left-0 z-10 bg-muted/30 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground min-w-[200px]">
                Site
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk</th>
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Score</th>
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Enrolled</th>
              {KRI_DEFINITIONS.map(kri => (
                <th key={kri.id} className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  {kri.label.split(' ').slice(0, 2).join(' ')}
                </th>
              ))}
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signals</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site, idx) => (
              <SiteRow
                key={site.id}
                site={site}
                studyId={id}
                isFirst={idx === 0}
                onClick={() => router.push(`/studies/${id}/sites/${site.id}`)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* KRI legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-purple-100" />
          <span className="text-purple-700">QTL breach</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-100" />
          <span className="text-red-700">Red threshold breach</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-100" />
          <span className="text-amber-700">Yellow threshold</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-green-50" />
          <span className="text-green-700">Compliant</span>
        </span>
      </div>
    </div>
  )
}

function SiteRow({ site, studyId, isFirst, onClick }: {
  site: Site
  studyId: string
  isFirst: boolean
  onClick: () => void
}) {
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/30 ${
        isFirst && site.riskTier === 'RED' ? 'bg-red-50/50' : ''
      }`}
    >
      {/* Site name */}
      <td className="sticky left-0 z-10 bg-card px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">{COUNTRY_FLAGS[site.countryCode] ?? '🌍'}</span>
          <div className="min-w-0">
            <p className="font-medium truncate">{site.name}</p>
            <p className="text-xs text-muted-foreground truncate">{site.id} · {site.country}</p>
          </div>
        </div>
      </td>

      {/* Risk tier */}
      <td className="px-3 py-3 text-center">
        <TrafficLight tier={site.riskTier} size="sm" showLabel={false} />
      </td>

      {/* Composite score */}
      <td className="px-3 py-3 text-center">
        <span className={`font-bold tabular-nums ${
          site.riskTier === 'RED' ? 'text-red-600' :
          site.riskTier === 'YELLOW' ? 'text-amber-600' : 'text-green-600'
        }`}>
          {site.compositeRiskScore.toFixed(1)}
        </span>
      </td>

      {/* Enrollment */}
      <td className="px-3 py-3 text-center">
        <span className="text-xs tabular-nums">
          {site.enrolledSubjects}<span className="text-muted-foreground">/{site.targetSubjects}</span>
        </span>
      </td>

      {/* KRI cells */}
      {KRI_DEFINITIONS.map(kri => (
        <td key={kri.id} className="px-2 py-2 text-center">
          <KriCell kriId={kri.id} value={site.kriValues[kri.id]} />
        </td>
      ))}

      {/* Open signals */}
      <td className="px-3 py-3 text-center">
        {site.openSignals > 0 ? (
          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
            site.riskTier === 'RED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {site.openSignals}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </td>
    </tr>
  )
}
