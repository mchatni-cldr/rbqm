'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { gxpDataSources } from '@/data/data-sources'
import { CLOUDERA_COMPONENTS } from '@/lib/constants'
import { relativeTime } from '@/lib/utils'
import { KRI_MAP } from '@/lib/constants'
import { Database, ArrowRight, Shield, Zap, Cpu, Bot } from 'lucide-react'

const SOURCE_ICONS: Record<string, string> = {
  EDC: '📋', CTMS: '🏥', SAFETY_DB: '⚠️', ETMF: '📁', RTSM: '💊', LAB_LIMS: '🧪', EPRO: '📱'
}

interface ClouderaComponentDetail {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  description: string
  technicalDetails: string[]
  gxpRelevance: string
}

const CDP_COMPONENTS: ClouderaComponentDetail[] = [
  {
    id: 'CDF',
    name: 'Cloudera Data Flow',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    description: 'Real-time streaming ingestion from all 7 GxP source systems via NiFi processors',
    technicalDetails: ['Apache NiFi connectors for each source', 'Schema-on-read with Avro schemas', 'TLS 1.3 encrypted data transit', 'Backpressure handling + DLQ'],
    gxpRelevance: 'Contemporaneous data capture per ALCOA+ principles. Immutable raw zone ensures Original source data is preserved.',
  },
  {
    id: 'CDE',
    name: 'Cloudera Data Engineering',
    icon: <Cpu className="h-5 w-5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    description: 'Apache Spark + Airflow pipelines computing 8 KRIs across 48 sites weekly',
    technicalDetails: ['Apache Spark for KRI computation', 'Apache Airflow for pipeline orchestration', 'Delta Lake for ACID transactions', 'Validated pipeline versioning'],
    gxpRelevance: '21 CFR Part 11 compliant pipeline audit trail. All KRI computations reproducible and version-controlled.',
  },
  {
    id: 'CAI',
    name: 'Cloudera AI',
    icon: <Bot className="h-5 w-5" />,
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-300',
    description: 'Autonomous RBQM agent: KRI signal detection, root cause analysis, CAPA generation',
    technicalDetails: ['LLM-powered root cause reasoning', 'Statistical anomaly detection models', 'Predictive QTL breach forecasting', 'Structured CAPA template generation'],
    gxpRelevance: 'ICH E6 R3-aligned signal detection with human-reviewable reasoning trails. All recommendations require human approval.',
  },
  {
    id: 'SDX',
    name: 'Cloudera SDX',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    description: 'Shared Data Experience: Apache Ranger (access control) + Apache Atlas (data lineage)',
    technicalDetails: ['Apache Atlas for full data lineage', 'Apache Ranger for RBAC', 'Immutable audit event log', 'Data catalog with GxP metadata tags'],
    gxpRelevance: 'Complete digital thread from GxP source → KRI → signal → CAPA. Supports FDA BIMO inspection readiness.',
  },
]

const DATA_ZONES = [
  {
    name: 'RAW ZONE',
    color: 'bg-red-50 border-red-200 text-red-800',
    badge: 'Immutable',
    desc: 'Exact copy of source data, never modified. Supports regulatory audit.',
  },
  {
    name: 'REFINED ZONE',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    badge: 'Computed',
    desc: 'KRI calculations, aggregations, validated transformations.',
  },
  {
    name: 'SANDBOX ZONE',
    color: 'bg-violet-50 border-violet-200 text-violet-800',
    badge: 'AI/ML',
    desc: 'Agent training data, predictive models, ad-hoc analysis.',
  },
]

export default function ArchitecturePage() {
  const [selectedComponent, setSelectedComponent] = useState<ClouderaComponentDetail | null>(null)
  const [selectedSource, setSelectedSource] = useState<typeof gxpDataSources[0] | null>(null)

  return (
    <div className="space-y-8">
      <PageHeader
        centered
        title="Cloudera Data Architecture"
        description="GxP-compliant data foundation powering agentic RBQM · Veridian Therapeutics"
      />

      {/* GxP compliance banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-emerald-700 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-800">GxP-Validated Architecture</p>
            <p className="text-sm text-emerald-700 mt-0.5">
              This architecture implements <strong>ALCOA+</strong> principles (Attributable, Legible, Contemporaneous, Original, Accurate),
              <strong> 21 CFR Part 11</strong> electronic records compliance, and <strong>ICH E6 R3</strong> RBQM requirements through
              the Cloudera Shared Data Experience (SDX) governance layer.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture flow diagram */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-6 text-center">GxP Source Systems → Cloudera CDP → RBQM Dashboard</h3>

        {/* Source systems */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center mb-3">
            GxP Systems of Record
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {gxpDataSources.map(src => (
              <button
                key={src.id}
                onClick={() => setSelectedSource(selectedSource?.id === src.id ? null : src)}
                className={`rounded-lg border-2 p-2.5 text-center transition-all hover:shadow-sm ${
                  selectedSource?.id === src.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-orange-300 hover:border-orange-500'
                }`}
              >
                <div className="text-xl mb-1">{SOURCE_ICONS[src.id]}</div>
                <p className="text-[10px] font-semibold leading-tight">{src.name.split('(')[0].trim()}</p>
                <span className={`mt-1 inline-block h-1.5 w-1.5 rounded-full ${src.status === 'CONNECTED' ? 'bg-green-500' : 'bg-red-500'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Selected source detail */}
        {selectedSource && (
          <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{SOURCE_ICONS[selectedSource.id]}</span>
              <span className="font-semibold">{selectedSource.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">Last sync: {relativeTime(selectedSource.lastSync)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-medium text-muted-foreground mb-1">Data Types</p>
                <ul className="space-y-0.5">
                  {selectedSource.dataTypes.map(d => <li key={d} className="text-slate-700">• {d}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-medium text-muted-foreground mb-1">Details</p>
                <p><strong>Vendor:</strong> {selectedSource.vendor}</p>
                <p><strong>Refresh:</strong> {selectedSource.refreshRate}</p>
                <p><strong>Method:</strong> {selectedSource.clouderaIngestionMethod}</p>
                <p><strong>Records:</strong> {selectedSource.recordCount.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="font-medium text-muted-foreground text-xs mb-1">KRIs Enabled</p>
              <div className="flex flex-wrap gap-1">
                {selectedSource.krisEnabled.map(k => (
                  <span key={k} className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-700">
                    {KRI_MAP[k]?.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Arrow down */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="h-px w-20 bg-orange-300" />
            <ArrowRight className="h-5 w-5 text-orange-500 rotate-90" />
            <div className="h-px w-20 bg-orange-300" />
          </div>
        </div>

        {/* CDP */}
        <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-white p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px flex-1 bg-orange-200" />
            <p className="text-center text-xs font-bold uppercase tracking-widest text-orange-700 px-2">
              Cloudera Data Platform (CDP)
            </p>
            <div className="h-px flex-1 bg-orange-200" />
          </div>

          {/* Components grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {CDP_COMPONENTS.map(comp => (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(selectedComponent?.id === comp.id ? null : comp)}
                className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-sm ${
                  selectedComponent?.id === comp.id
                    ? `${comp.borderColor} ${comp.bgColor}`
                    : 'border-border bg-white hover:border-slate-300'
                }`}
              >
                <div className={`flex items-center gap-2 mb-1.5 ${comp.color}`}>
                  {comp.icon}
                  <span className="font-semibold text-sm">{comp.name}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{comp.description}</p>
              </button>
            ))}
          </div>

          {/* Selected component detail */}
          {selectedComponent && (
            <div className={`rounded-xl border-2 ${selectedComponent.borderColor} ${selectedComponent.bgColor} p-4`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Technical Details</p>
                  <ul className="space-y-1">
                    {selectedComponent.technicalDetails.map(d => (
                      <li key={d} className="text-xs flex items-start gap-1.5">
                        <span className="mt-0.5">▸</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">GxP Relevance</p>
                  <p className="text-xs leading-relaxed">{selectedComponent.gxpRelevance}</p>
                </div>
              </div>
            </div>
          )}

          {/* Data lake zones */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600/80 text-center mb-2">
              GxP Data Lake — Three-Zone Architecture
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DATA_ZONES.map(zone => (
                <div key={zone.name} className={`rounded-lg border p-2.5 ${zone.color}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[11px] font-bold">{zone.name}</p>
                    <span className="text-[9px] rounded bg-white/60 px-1 py-0.5">{zone.badge}</span>
                  </div>
                  <p className="text-[10px] leading-snug opacity-80">{zone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="h-px w-20 bg-violet-300" />
            <ArrowRight className="h-5 w-5 text-violet-500 rotate-90" />
            <div className="h-px w-20 bg-violet-300" />
          </div>
        </div>

        {/* RBQM Dashboard output */}
        <div className="rounded-xl border-2 border-violet-300 bg-violet-50 p-4 text-center">
          <p className="font-bold text-violet-800 mb-2">RBQM Agent Dashboard</p>
          <div className="flex justify-center gap-4 text-xs text-violet-700">
            <span>📊 Site Risk Table</span>
            <span>🚨 Signal Queue</span>
            <span>🤖 Agent Feed</span>
            <span>🗺️ Global Map</span>
          </div>
        </div>
      </div>

      {/* Compliance certifications */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { badge: '21 CFR Part 11', title: 'Electronic Records', desc: 'Immutable raw zone + full audit trail from Apache Atlas satisfy FDA electronic records requirements' },
          { badge: 'ICH E6 R3', title: 'RBQM Mandate', desc: 'Risk-based monitoring with documented KRI thresholds, signal management, and centralized monitoring' },
          { badge: 'ALCOA+', title: 'Data Integrity', desc: 'Attributable (SDX), Legible (catalog), Contemporaneous (CDF streaming), Original (raw zone), Accurate (validated pipelines)' },
        ].map(item => (
          <div key={item.badge} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <span className="inline-block rounded-full bg-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800 mb-2">
              {item.badge}
            </span>
            <p className="font-semibold text-emerald-800 mb-1">{item.title}</p>
            <p className="text-xs text-emerald-700 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
