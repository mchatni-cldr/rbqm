import { AgentActivity } from '@/lib/types'
import { AGENT_ACTION_CONFIG } from '@/lib/constants'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { format } from 'date-fns'

interface Props {
  activities: AgentActivity[]
}

export function AgentTimeline({ activities }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Agent Investigation Timeline</p>
        <ClouderaComponentBadge component="CAI" />
      </div>
      {activities.map((activity, i) => {
        const cfg = AGENT_ACTION_CONFIG[activity.actionType]
        return (
          <div key={activity.id} className="relative pl-8">
            {/* Timeline line */}
            {i < activities.length - 1 && (
              <div className="absolute left-3.5 top-6 bottom-0 w-px bg-border" />
            )}
            {/* Icon */}
            <div className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-border text-sm">
              {cfg.icon}
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold uppercase ${cfg.color}`}>{cfg.label}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {format(new Date(activity.timestamp), 'HH:mm:ss')}
                </span>
              </div>
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3">{activity.detail}</p>
              {activity.confidence !== undefined && (
                <p className={`text-xs font-semibold mt-1 ${activity.confidence >= 90 ? 'text-green-600' : 'text-amber-600'}`}>
                  Confidence: {activity.confidence}%
                </p>
              )}
              {activity.dataAccessed && activity.dataAccessed.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {activity.dataAccessed.map((d, j) => (
                    <span key={j} className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
