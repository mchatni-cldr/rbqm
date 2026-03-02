import { Investigation } from '@/lib/types'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { CheckCircle, Database, FileText } from 'lucide-react'

interface Props {
  investigation: Investigation
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  STAFFING: { label: 'Staffing Gap', icon: '👥' },
  PROCESS: { label: 'Process Failure', icon: '⚙️' },
  TRAINING: { label: 'Training Deficiency', icon: '📚' },
  TECHNOLOGY: { label: 'Technology Issue', icon: '💻' },
  PATIENT: { label: 'Patient Factors', icon: '👤' },
  SITE_CAPACITY: { label: 'Site Capacity', icon: '🏥' },
}

export function RootCausePanel({ investigation }: Props) {
  const category = CATEGORY_LABELS[investigation.rootCauseCategory]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Root Cause Analysis</h4>
        <ClouderaComponentBadge component="CAI" />
      </div>

      {/* Category + confidence */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl">
          {category?.icon}
        </div>
        <div>
          <p className="font-semibold">{category?.label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1 h-1.5 w-32 rounded-full bg-gray-200">
              <div
                className={`h-1.5 rounded-full ${investigation.confidence >= 90 ? 'bg-green-500' : investigation.confidence >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${investigation.confidence}%` }}
              />
            </div>
            <span className={`text-xs font-semibold ${investigation.confidence >= 90 ? 'text-green-700' : investigation.confidence >= 75 ? 'text-amber-700' : 'text-red-700'}`}>
              {investigation.confidence}% confidence
            </span>
          </div>
        </div>
      </div>

      {/* Root cause statement */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
        <p className="text-xs font-medium text-slate-500 mb-1">Root Cause Statement</p>
        <p className="text-sm text-slate-800 leading-relaxed">{investigation.rootCause}</p>
      </div>

      {/* Findings */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Findings</p>
        <ul className="space-y-1.5">
          {investigation.findings.map((finding, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
              <span className="text-slate-700">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Data sources */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Data Sources Analyzed</p>
        <div className="flex flex-wrap gap-2">
          {investigation.dataSources.map((src, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-1 text-xs text-blue-700">
              <Database className="h-3 w-3" />
              {src}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
