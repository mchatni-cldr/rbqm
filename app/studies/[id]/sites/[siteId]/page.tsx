'use client'

import { use } from 'react'
import { getSiteById } from '@/data/sites'
import { getSignalsByStudy } from '@/data/signals'
import { PageHeader } from '@/components/layout/PageHeader'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { TrafficLight } from '@/components/ui/traffic-light'
import { StatCard } from '@/components/ui/stat-card'
import { SeverityBadge, SignalStatusBadge } from '@/components/signals/SignalStatusBadge'
import { KRI_DEFINITIONS, KRI_MAP, COUNTRY_FLAGS } from '@/lib/constants'
import { formatKriValue, breachStatusBg } from '@/lib/utils'
import { format } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { subjectsSite002_01 } from '@/data/subjects'

interface Props {
  params: Promise<{ id: string; siteId: string }>
}

export default function SiteDetailPage({ params }: Props) {
  const { id, siteId } = use(params)
  const site = getSiteById(siteId)
  if (!site) return <div className="p-8 text-muted-foreground">Site not found</div>

  const siteSignals = getSignalsByStudy(id).filter(s => s.siteId === siteId && s.status !== 'CLOSED')
  const subjects = siteId === 'SITE-002-01' ? subjectsSite002_01 : []

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href={`/studies/${id}/sites`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Site Risk Table
      </Link>

      <PageHeader
        title={site.name}
        description={`${site.id} · ${COUNTRY_FLAGS[site.countryCode]} ${site.country} · ${site.principalInvestigator}`}
        badge={
          <div className="flex gap-2">
            <TrafficLight tier={site.riskTier} size="md" />
            <ClouderaComponentBadge component="CDE" />
          </div>
        }
      />

      {/* Site KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Composite Score"
          value={site.compositeRiskScore.toFixed(1)}
          sub={`Risk tier: ${site.riskTier}`}
          variant={site.riskTier === 'RED' ? 'red' : site.riskTier === 'YELLOW' ? 'yellow' : 'green'}
        />
        <StatCard
          label="Enrollment"
          value={`${site.enrolledSubjects}/${site.targetSubjects}`}
          sub={`${Math.round(site.enrolledSubjects/site.targetSubjects*100)}% of target`}
        />
        <StatCard
          label="Open Signals"
          value={siteSignals.length}
          variant={siteSignals.length > 0 ? 'red' : 'default'}
        />
        <StatCard
          label="Last Monitoring Visit"
          value={format(new Date(site.lastMonitoringVisit), 'MMM d, yyyy')}
          sub={`Activated: ${format(new Date(site.siteActivationDate), 'MMM yyyy')}`}
        />
      </div>

      {/* Signals for this site */}
      {siteSignals.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
          <h3 className="font-semibold mb-3 text-red-800">Active Signals ({siteSignals.length})</h3>
          <div className="space-y-2">
            {siteSignals.map(sig => (
              <div key={sig.id} className="flex items-center gap-3 bg-white rounded-lg border border-border p-3 text-sm">
                <SeverityBadge severity={sig.severity} />
                <span className="flex-1 font-medium truncate">{sig.title}</span>
                <SignalStatusBadge status={sig.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KRI Breakdown + Trend Charts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">KRI Breakdown & Trends</h3>
          <ClouderaComponentBadge component="CDE" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {KRI_DEFINITIONS.map(kri => {
            const kriVal = site.kriValues[kri.id]
            if (!kriVal) return null

            // Build chart data from weekly history
            const chartData = kriVal.weeklyHistory.map((v, i) => ({
              week: `W${i + 1}`,
              value: v,
            }))

            const isBreaching = kriVal.breachStatus === 'RED' || kriVal.breachStatus === 'QTL'
            const lineColor = isBreaching ? '#ef4444' : kriVal.breachStatus === 'YELLOW' ? '#f59e0b' : '#22c55e'

            return (
              <div key={kri.id} className={`rounded-xl border p-4 ${isBreaching ? 'border-red-200 bg-red-50/30' : 'border-border bg-card'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold">{kri.label}</h4>
                    <p className="text-xs text-muted-foreground">{kri.unit}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-bold tabular-nums ${breachStatusBg(kriVal.breachStatus)} px-2 py-0.5 rounded`}>
                      {formatKriValue(kri.id, kriVal.current)}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">{kriVal.breachStatus}</p>
                  </div>
                </div>

                {/* Trend chart */}
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 9 }} domain={['auto', 'auto']} />
                    {/* Red threshold line */}
                    <ReferenceLine
                      y={kri.redThreshold}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                    {/* QTL line */}
                    <ReferenceLine
                      y={kri.qtlThreshold}
                      stroke="#7c3aed"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                    <ReTooltip
                      contentStyle={{ fontSize: 11, borderRadius: 6 }}
                      formatter={(v: number | undefined) => [v !== undefined ? formatKriValue(kri.id, v) : '', kri.label]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={lineColor}
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="flex gap-3 text-[10px] text-muted-foreground mt-1">
                  <span><span className="text-red-500">---</span> Red ({kri.redThreshold}{kri.unit})</span>
                  <span><span className="text-purple-500">---</span> QTL ({kri.qtlThreshold}{kri.unit})</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Subject list if available */}
      {subjects.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Enrolled Subjects</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subject #</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Visit Compliance</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Open Queries</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">AEs</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(subj => (
                  <tr key={subj.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-mono text-xs">{subj.subjectNumber}</td>
                    <td className="px-4 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        subj.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        subj.status === 'WITHDRAWN' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {subj.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-gray-200">
                          <div
                            className={`h-1.5 rounded-full ${subj.visitCompliance >= 80 ? 'bg-green-500' : subj.visitCompliance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${subj.visitCompliance}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums">{subj.visitCompliance.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {subj.openQueries > 0 ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">{subj.openQueries}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-center text-xs">{subj.aeCount}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {format(new Date(subj.lastVisitDate), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
