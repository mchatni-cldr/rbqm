'use client'

import { use, useEffect, useRef } from 'react'
import { getActivitiesByStudy } from '@/data/agent-log'
import { useAgentSimulation } from '@/hooks/useAgentSimulation'
import { getAgentStatusInfo } from '@/lib/agent-engine'
import { PageHeader } from '@/components/layout/PageHeader'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { AgentStatusBanner } from '@/components/agent/AgentStatusBanner'
import { AgentActivityItem } from '@/components/agent/AgentActivityItem'
import { AgentThinkingAnimation } from '@/components/agent/AgentThinkingAnimation'
import { getSignalsByStudy } from '@/data/signals'
import { Button } from '@/components/ui/button'
import { RotateCcw, Play, ChevronDown } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default function AgentPage({ params }: Props) {
  const { id } = use(params)
  const allActivities = getActivitiesByStudy(id)
  const feedBottomRef = useRef<HTMLDivElement>(null)

  const {
    visibleActivities,
    isThinking,
    isComplete,
    replay,
    speedMultiplier,
    setSpeedMultiplier,
  } = useAgentSimulation(allActivities, true)

  const activeSignals = getSignalsByStudy(id).filter(s => s.status !== 'CLOSED')
  const lastActivity = visibleActivities[visibleActivities.length - 1]
  const statusInfo = getAgentStatusInfo(isThinking, lastActivity, activeSignals.filter(s => s.severity === 'CRITICAL').length)

  // Auto-scroll to bottom as new activities appear
  useEffect(() => {
    if (feedBottomRef.current) {
      feedBottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [visibleActivities.length, isThinking])

  return (
    <div className="space-y-4 max-w-3xl">
      <PageHeader
        title="Agent Activity Feed"
        description="Live autonomous RBQM agent monitoring — powered by Cloudera AI"
        badge={<ClouderaComponentBadge component="CAI" />}
        actions={
          <div className="flex items-center gap-2">
            <select
              value={speedMultiplier}
              onChange={e => setSpeedMultiplier(Number(e.target.value))}
              className="rounded border border-border bg-card px-2 py-1.5 text-xs font-medium"
            >
              <option value={1}>1× speed</option>
              <option value={3}>3× speed</option>
              <option value={5}>5× speed</option>
              <option value={10}>10× speed</option>
            </select>
            <Button variant="outline" size="sm" onClick={replay} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Replay
            </Button>
          </div>
        }
      />

      {/* Status banner */}
      <AgentStatusBanner statusInfo={statusInfo} />

      {/* Activities */}
      <div className="space-y-3">
        {visibleActivities.length === 0 && !isThinking && (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-muted-foreground mb-4">Agent starting up — monitoring {id}...</p>
            <Button onClick={replay} className="gap-1.5">
              <Play className="h-4 w-4" />
              Start Simulation
            </Button>
          </div>
        )}

        {visibleActivities.map((activity, i) => (
          <AgentActivityItem
            key={activity.id}
            activity={activity}
            isNew={i === visibleActivities.length - 1 && !isThinking}
          />
        ))}

        {/* Thinking animation */}
        {isThinking && (
          <AgentThinkingAnimation
            message={lastActivity?.actionType === 'SCAN' ? 'Agent scanning KRI datasets...' :
              'Agent analyzing data and reasoning...'}
          />
        )}

        {/* Completion */}
        {isComplete && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
            <p className="text-sm font-semibold text-green-800">✓ Agent cycle complete — {allActivities.length} activities processed</p>
            <p className="text-xs text-green-600 mt-1">Next automated scan in 4h 23m</p>
            <Button variant="outline" size="sm" onClick={replay} className="mt-3 gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Replay from start
            </Button>
          </div>
        )}

        <div ref={feedBottomRef} />
      </div>

      {/* Cloudera SDX audit note */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-3">
        <ClouderaComponentBadge component="SDX" />
        <div className="text-xs text-emerald-800">
          <span className="font-semibold">GxP Audit Trail Active: </span>
          All agent activities are written to the immutable audit log via Apache Atlas (Cloudera SDX).
          Full data lineage traceable to source system records. ALCOA+ compliant.
        </div>
      </div>
    </div>
  )
}
