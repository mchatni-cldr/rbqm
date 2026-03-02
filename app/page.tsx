import { studies } from '@/data/studies'
import { signals } from '@/data/signals'
import { sites } from '@/data/sites'
import { StudyCard } from '@/components/portfolio/StudyCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/ui/stat-card'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { AlertTriangle, Activity, MapPin, TrendingUp, Server } from 'lucide-react'
import Link from 'next/link'

export default function PortfolioPage() {
  const totalEnrolled = studies.reduce((sum, s) => sum + s.enrolledSubjects, 0)
  const totalTarget = studies.reduce((sum, s) => sum + s.targetSubjects, 0)
  const activeSignals = signals.filter(s => s.status !== 'CLOSED')
  const criticalSignals = activeSignals.filter(s => s.severity === 'CRITICAL')
  const redStudies = studies.filter(s => s.riskTier === 'RED')

  return (
    <div>
      <PageHeader
        centered
        title="Portfolio Overview"
        description="Veridian Therapeutics · 3 active studies · Agentic RBQM monitoring"
        actions={
          <Link
            href="/architecture"
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <Server className="h-3.5 w-3.5" />
            View Architecture
          </Link>
        }
      />

      {/* Critical alerts banner */}
      {criticalSignals.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              {criticalSignals.length} Critical Signal{criticalSignals.length > 1 ? 's' : ''} Require Immediate Review
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              {criticalSignals.map(s => s.title).join(' · ')}
            </p>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
        </div>
      )}

      {/* Portfolio KPIs */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Enrolled"
          value={totalEnrolled}
          sub={`of ${totalTarget} target (${Math.round(totalEnrolled/totalTarget*100)}%)`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Active Sites"
          value={sites.length}
          sub="across 14 countries"
          icon={<MapPin className="h-5 w-5" />}
        />
        <StatCard
          label="Open Signals"
          value={activeSignals.length}
          sub={`${criticalSignals.length} critical · 7 closed`}
          variant={criticalSignals.length > 0 ? 'red' : 'default'}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Studies at Risk"
          value={`${redStudies.length} RED`}
          sub={`${studies.filter(s => s.riskTier === 'YELLOW').length} YELLOW · ${studies.filter(s => s.riskTier === 'GREEN').length} GREEN`}
          variant={redStudies.length > 0 ? 'red' : 'green'}
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      {/* Studies grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {studies.map(study => (
          <StudyCard key={study.id} study={study} />
        ))}
      </div>

      {/* Cloudera attribution */}
      <div className="mt-8 rounded-xl border border-border bg-gradient-to-br from-slate-50 to-white p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Powered by Cloudera Data Platform
          </p>
          <span className="text-[10px] text-muted-foreground/60 font-mono">CDP 7.3</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(['CDF', 'CDE', 'CAI', 'SDX'] as const).map(c => (
            <div key={c} className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-colors">
              <ClouderaComponentBadge component={c} size="md" className="mb-2.5" />
              <p className="text-xs text-muted-foreground leading-snug">
                {c === 'CDF' && '7 GxP source systems ingesting in real-time'}
                {c === 'CDE' && 'KRI computation across 4,608 data points weekly'}
                {c === 'CAI' && 'Autonomous agent: detect, investigate, CAPA'}
                {c === 'SDX' && 'GxP audit trail, data lineage, 21 CFR Part 11'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
