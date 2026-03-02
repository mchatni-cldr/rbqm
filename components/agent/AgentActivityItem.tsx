'use client'

import { AgentActivity } from '@/lib/types'
import { AGENT_ACTION_CONFIG } from '@/lib/constants'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { format } from 'date-fns'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Props {
  activity: AgentActivity
  isNew?: boolean
}

export function AgentActivityItem({ activity, isNew }: Props) {
  const [expanded, setExpanded] = useState(isNew || false)
  const cfg = AGENT_ACTION_CONFIG[activity.actionType]

  return (
    <div className={`rounded-xl border transition-all ${isNew ? 'border-violet-300 bg-violet-50/50 shadow-sm' : 'border-border bg-card'}`}>
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base ${
            isNew ? 'bg-violet-100 border-violet-300' : 'bg-muted border-border'
          }`}>
            {cfg.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
                {cfg.label}
              </span>
              {activity.signalId && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono">{activity.signalId}</span>
              )}
              <span className="ml-auto text-xs text-muted-foreground">
                {format(new Date(activity.timestamp), 'HH:mm:ss')}
              </span>
            </div>
            <p className="text-sm font-medium leading-snug">{activity.title}</p>
          </div>

          <div className="shrink-0 ml-2">
            {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <p className="text-sm text-slate-700 leading-relaxed mb-3">{activity.detail}</p>

          {activity.confidence !== undefined && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground">Confidence:</span>
              <div className="flex-1 h-1.5 rounded-full bg-gray-200 max-w-xs">
                <div
                  className={`h-1.5 rounded-full ${activity.confidence >= 90 ? 'bg-green-500' : activity.confidence >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${activity.confidence}%` }}
                />
              </div>
              <span className={`text-xs font-bold ${activity.confidence >= 90 ? 'text-green-700' : activity.confidence >= 75 ? 'text-amber-700' : 'text-red-700'}`}>
                {activity.confidence}%
              </span>
            </div>
          )}

          {activity.dataAccessed && activity.dataAccessed.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Data accessed:</p>
              <div className="flex flex-wrap gap-1.5">
                {activity.dataAccessed.map((d, i) => (
                  <span key={i} className="inline-flex items-center rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-700">
                    📊 {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activity.outcome && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs">
              <span className="font-semibold text-green-700">Outcome: </span>
              <span className="text-green-800">{activity.outcome}</span>
            </div>
          )}

          <div className="mt-2 flex justify-end">
            <ClouderaComponentBadge component="CAI" />
          </div>
        </div>
      )}
    </div>
  )
}
