'use client'

import { Signal } from '@/lib/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SeverityBadge, SignalStatusBadge } from './SignalStatusBadge'
import { RootCausePanel } from './RootCausePanel'
import { ActionPlanCard } from './ActionPlanCard'
import { AgentTimeline } from '../agent/AgentTimeline'
import { KRI_MAP, COUNTRY_FLAGS } from '@/lib/constants'
import { getSiteById } from '@/data/sites'
import { getActivitiesBySignal } from '@/data/agent-log'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { formatKriValue } from '@/lib/utils'
import { format } from 'date-fns'

interface Props {
  signal: Signal | null
  open: boolean
  onClose: () => void
}

export function SignalDetailDrawer({ signal, open, onClose }: Props) {
  if (!signal) return null

  const site = getSiteById(signal.siteId)
  const kriDef = KRI_MAP[signal.kriId]
  const activities = getActivitiesBySignal(signal.id)

  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent className="w-[600px] sm:w-[700px] sm:max-w-none overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <SeverityBadge severity={signal.severity} />
            <SignalStatusBadge status={signal.status} />
            <span className="text-xs text-muted-foreground ml-auto">{signal.id}</span>
          </div>
          <SheetTitle className="text-left leading-tight mt-2">{signal.title}</SheetTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span>{COUNTRY_FLAGS[site?.countryCode ?? ''] ?? '🌍'} {site?.name}</span>
            <span>·</span>
            <span>KRI: {kriDef?.label}</span>
            <span>·</span>
            <span>Detected: {format(new Date(signal.detectedAt), 'MMM d, yyyy HH:mm')}</span>
            <span>·</span>
            <span>By: {signal.detectedBy}</span>
          </div>
        </SheetHeader>

        <Separator className="mb-4" />

        {/* KRI breach highlight */}
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-600 uppercase tracking-wide">{kriDef?.label}</p>
              <p className="text-2xl font-bold text-red-700 tabular-nums">
                {formatKriValue(signal.kriId, signal.kriValue)} {kriDef?.unit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Threshold</p>
              <p className="text-lg font-semibold text-muted-foreground tabular-nums">
                {signal.kriThreshold}{kriDef?.unit}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-600">{signal.description}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={signal.investigation ? 'rca' : 'details'}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Signal Details</TabsTrigger>
            {signal.investigation && <TabsTrigger value="rca">Root Cause Analysis</TabsTrigger>}
            {signal.capa && <TabsTrigger value="capa">CAPA</TabsTrigger>}
            {activities.length > 0 && <TabsTrigger value="agent">Agent Activity ({activities.length})</TabsTrigger>}
          </TabsList>

          <TabsContent value="details" className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Site</p>
                <p className="font-semibold">{site?.name}</p>
                <p className="text-xs text-muted-foreground">{site?.id}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Principal Investigator</p>
                <p className="font-semibold">{site?.principalInvestigator}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Detection Method</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="font-semibold">{signal.detectedBy}</p>
                  {signal.detectedBy === 'AGENT' && <ClouderaComponentBadge component="CAI" size="sm" />}
                </div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Study</p>
                <p className="font-semibold">{signal.studyId}</p>
              </div>
            </div>
            {signal.resolvedAt && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm">
                <p className="text-green-700 font-semibold">
                  Resolved: {format(new Date(signal.resolvedAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            )}
          </TabsContent>

          {signal.investigation && (
            <TabsContent value="rca">
              <RootCausePanel investigation={signal.investigation} />
            </TabsContent>
          )}

          {signal.capa && (
            <TabsContent value="capa">
              <ActionPlanCard capa={signal.capa} />
            </TabsContent>
          )}

          {activities.length > 0 && (
            <TabsContent value="agent">
              <AgentTimeline activities={activities} />
            </TabsContent>
          )}
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
