'use client'

import { use, useState } from 'react'
import { studies } from '@/data/studies'
import { getSignalsByStudy } from '@/data/signals'
import { Signal, SignalSeverity, SignalStatus } from '@/lib/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { DataFreshnessBanner } from '@/components/cloudera/DataFreshnessBanner'
import { SeverityBadge, SignalStatusBadge } from '@/components/signals/SignalStatusBadge'
import { SignalDetailDrawer } from '@/components/signals/SignalDetailDrawer'
import { KRI_MAP, COUNTRY_FLAGS, AGENT_ACTION_CONFIG } from '@/lib/constants'
import { getSiteById } from '@/data/sites'
import { getActivitiesBySignal } from '@/data/agent-log'
import { formatKriValue, relativeTime } from '@/lib/utils'
import { format } from 'date-fns'
import { Filter, Bot, User } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

const SEVERITY_ORDER: Record<SignalSeverity, number> = { CRITICAL: 0, MAJOR: 1, MINOR: 2 }

export default function SignalsPage({ params }: Props) {
  const { id } = use(params)
  const allSignals = getSignalsByStudy(id)

  const [selectedSeverities, setSelectedSeverities] = useState<SignalSeverity[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<SignalStatus[]>([])
  const [showClosed, setShowClosed] = useState(false)
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filter
  let signals = [...allSignals]
  if (!showClosed) signals = signals.filter(s => s.status !== 'CLOSED')
  if (selectedSeverities.length > 0) signals = signals.filter(s => selectedSeverities.includes(s.severity))
  if (selectedStatuses.length > 0) signals = signals.filter(s => selectedStatuses.includes(s.status))
  signals = signals.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])

  const counts = {
    total: allSignals.filter(s => s.status !== 'CLOSED').length,
    critical: allSignals.filter(s => s.severity === 'CRITICAL' && s.status !== 'CLOSED').length,
    major: allSignals.filter(s => s.severity === 'MAJOR' && s.status !== 'CLOSED').length,
    minor: allSignals.filter(s => s.severity === 'MINOR' && s.status !== 'CLOSED').length,
    closed: allSignals.filter(s => s.status === 'CLOSED').length,
  }

  const toggleSeverity = (s: SignalSeverity) =>
    setSelectedSeverities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  function openSignal(sig: Signal) {
    setSelectedSignal(sig)
    setDrawerOpen(true)
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Signal Investigation Queue"
        description={`${counts.total} active signals · ${counts.critical} critical`}
        badge={<ClouderaComponentBadge component="CAI" />}
      />

      <DataFreshnessBanner />

      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setSelectedSeverities([])}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            selectedSeverities.length === 0 ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-accent'
          }`}
        >
          All Open ({counts.total})
        </button>
        <button
          onClick={() => toggleSeverity('CRITICAL')}
          className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
            selectedSeverities.includes('CRITICAL') ? 'bg-red-600 text-white border-red-600' : 'border-red-200 text-red-600 hover:bg-red-50'
          }`}
        >
          ⚠ Critical ({counts.critical})
        </button>
        <button
          onClick={() => toggleSeverity('MAJOR')}
          className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
            selectedSeverities.includes('MAJOR') ? 'bg-orange-500 text-white border-orange-500' : 'border-orange-200 text-orange-600 hover:bg-orange-50'
          }`}
        >
          Major ({counts.major})
        </button>
        <button
          onClick={() => toggleSeverity('MINOR')}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            selectedSeverities.includes('MINOR') ? 'bg-yellow-400 text-black border-yellow-400' : 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'
          }`}
        >
          Minor ({counts.minor})
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={showClosed}
            onChange={e => setShowClosed(e.target.checked)}
            className="rounded"
          />
          Show closed ({counts.closed})
        </label>
      </div>

      {/* Signal cards */}
      <div className="space-y-3">
        {signals.map(signal => (
          <SignalCard
            key={signal.id}
            signal={signal}
            onClick={() => openSignal(signal)}
          />
        ))}
        {signals.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No signals match the current filters</p>
          </div>
        )}
      </div>

      <SignalDetailDrawer
        signal={selectedSignal}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}

function SignalCard({ signal, onClick }: { signal: Signal; onClick: () => void }) {
  const site = getSiteById(signal.siteId)
  const kriDef = KRI_MAP[signal.kriId]
  const activities = getActivitiesBySignal(signal.id)
  const latestActivity = activities[activities.length - 1]
  const latestActivityCfg = latestActivity ? AGENT_ACTION_CONFIG[latestActivity.actionType] : null

  const borderColor = signal.severity === 'CRITICAL' ? 'border-red-300' :
    signal.severity === 'MAJOR' ? 'border-orange-200' : 'border-yellow-200'
  const bgColor = signal.severity === 'CRITICAL' ? 'bg-red-50/30' : 'bg-card'

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 ${borderColor} ${bgColor} p-4 transition-all hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <SeverityBadge severity={signal.severity} />
            <SignalStatusBadge status={signal.status} />
            <span className="text-xs font-mono text-muted-foreground">{signal.id}</span>
            <span className="ml-auto text-xs text-muted-foreground">{relativeTime(signal.detectedAt)}</span>
          </div>

          <h3 className="font-semibold leading-tight mb-1">{signal.title}</h3>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span>{COUNTRY_FLAGS[site?.countryCode ?? ''] ?? ''} {site?.name}</span>
            <span>·</span>
            <span>KRI: {kriDef?.label}</span>
            <span>·</span>
            <span className="font-mono font-semibold text-slate-700">
              {formatKriValue(signal.kriId, signal.kriValue)} {kriDef?.unit}
            </span>
          </div>

          {/* Agent latest activity */}
          {latestActivity && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
                <span>{latestActivityCfg?.icon}</span>
                <span className="font-medium">Cloudera AI:</span>
              </div>
              <span className="text-xs text-muted-foreground truncate">{latestActivity.title}</span>
            </div>
          )}
        </div>

        {/* Detection source */}
        <div className="shrink-0">
          {signal.detectedBy === 'AGENT' ? (
            <div title="Detected by Cloudera AI">
              <ClouderaComponentBadge component="CAI" size="sm" />
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600">
              <User className="h-3 w-3" />
              Manual
            </span>
          )}
        </div>
      </div>

      {/* CAPA progress if available */}
      {signal.capa && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-2.5">
          <span>CAPA:</span>
          {signal.capa.actions.map(a => (
            <span
              key={a.id}
              className={`h-2 w-2 rounded-full ${
                a.status === 'COMPLETED' ? 'bg-green-500' :
                a.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              title={a.description}
            />
          ))}
          <span className="ml-auto text-[11px]">
            {signal.capa.actions.filter(a => a.status === 'COMPLETED').length}/{signal.capa.actions.length} complete
          </span>
        </div>
      )}
    </div>
  )
}
