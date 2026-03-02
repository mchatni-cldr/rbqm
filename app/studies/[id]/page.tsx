import { studies } from '@/data/studies'
import { getSitesByStudy } from '@/data/sites'
import { getSignalsByStudy } from '@/data/signals'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/stat-card'
import { TrafficLight } from '@/components/ui/traffic-light'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { StudySiteMap } from '@/components/study/StudySiteMap'
import { KriAlertSummary } from '@/components/study/KriAlertSummary'
import { KRI_DEFINITIONS } from '@/lib/constants'
import Link from 'next/link'
import { AlertTriangle, MapPin, TrendingUp, Users, Activity } from 'lucide-react'
import { COUNTRY_FLAGS } from '@/lib/constants'

interface Props {
  params: Promise<{ id: string }>
}

export default async function StudyOverviewPage({ params }: Props) {
  const { id } = await params
  const study = studies.find(s => s.id === id)
  if (!study) notFound()

  const sites = getSitesByStudy(id)
  const allSignals = getSignalsByStudy(id)
  const activeSignals = allSignals.filter(s => s.status !== 'CLOSED')
  const criticalSignals = activeSignals.filter(s => s.severity === 'CRITICAL')
  const redSites = sites.filter(s => s.riskTier === 'RED')
  const enrollmentPct = Math.round((study.enrolledSubjects / study.targetSubjects) * 100)

  // Count KRI breaches across all sites
  const kriBreachCounts = KRI_DEFINITIONS.map(kri => {
    const breaches = sites.filter(site => {
      const v = site.kriValues[kri.id]
      return v && (v.breachStatus === 'RED' || v.breachStatus === 'QTL')
    })
    return { kri, count: breaches.length }
  }).filter(x => x.count > 0).sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${study.name} — Study Overview`}
        description={`${study.protocol} · ${study.phase} · ${study.indication} · ${study.sponsor}`}
        badge={<ClouderaComponentBadge component="CDE" />}
        actions={
          <div className="flex gap-2">
            <Link
              href={`/studies/${id}/sites`}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Site Risk Table →
            </Link>
            <Link
              href={`/studies/${id}/signals`}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
            >
              Signals ({activeSignals.length})
            </Link>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard label="Risk Tier" value={study.riskTier} variant={study.riskTier === 'RED' ? 'red' : study.riskTier === 'YELLOW' ? 'yellow' : 'green'} />
        <StatCard label="Enrolled" value={`${study.enrolledSubjects}/${study.targetSubjects}`} sub={`${enrollmentPct}% of target`} />
        <StatCard label="Sites" value={study.totalSites} sub={`${redSites.length} RED · ${sites.filter(s=>s.riskTier==='YELLOW').length} YELLOW`} variant={redSites.length > 0 ? 'red' : 'default'} />
        <StatCard label="Open Signals" value={activeSignals.length} sub={`${criticalSignals.length} critical`} variant={criticalSignals.length > 0 ? 'red' : 'default'} />
        <StatCard label="Countries" value={study.countries.length} sub={study.countries.map(c => COUNTRY_FLAGS[c] ?? c).join(' ')} />
      </div>

      {/* Enrollment progress */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Enrollment Progress</h3>
          <ClouderaComponentBadge component="CDE" />
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <Progress value={enrollmentPct} className="h-3" />
          </div>
          <span className="text-sm font-bold tabular-nums w-14 text-right">{enrollmentPct}%</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-2xl font-bold">{study.enrolledSubjects}</p>
            <p className="text-xs text-muted-foreground">Enrolled</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{study.targetSubjects - study.enrolledSubjects}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{study.targetSubjects}</p>
            <p className="text-xs text-muted-foreground">Target</p>
          </div>
        </div>
      </div>

      {/* Site map + KRI alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Site Locations</h3>
            <ClouderaComponentBadge component="CDF" />
          </div>
          <StudySiteMap sites={sites} studyId={id} />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Top KRI Alerts</h3>
            <Link href={`/studies/${id}/sites`} className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <KriAlertSummary sites={sites} />
        </div>
      </div>
    </div>
  )
}
