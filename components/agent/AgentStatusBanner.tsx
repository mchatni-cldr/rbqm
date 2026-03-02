'use client'

import { AgentStatusInfo } from '@/lib/agent-engine'
import { ClouderaComponentBadge } from '@/components/cloudera/ClouderaComponentBadge'
import { Activity, Search, AlertTriangle, Eye } from 'lucide-react'

interface Props {
  statusInfo: AgentStatusInfo
}

const STATUS_STYLES = {
  IDLE: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', dot: 'bg-green-500', icon: Eye },
  SCANNING: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500 animate-ping', icon: Search },
  INVESTIGATING: { bg: 'bg-violet-50 border-violet-200', text: 'text-violet-800', dot: 'bg-violet-500 animate-ping', icon: Activity },
  ALERT: { bg: 'bg-red-50 border-red-300', text: 'text-red-800', dot: 'bg-red-500 animate-ping', icon: AlertTriangle },
}

export function AgentStatusBanner({ statusInfo }: Props) {
  const style = STATUS_STYLES[statusInfo.status]
  const Icon = style.icon

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${style.bg}`}>
      <div className="relative">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${style.dot}`} />
        {statusInfo.status !== 'IDLE' && (
          <span className={`absolute inset-0 rounded-full ${style.dot} opacity-50`} style={{ animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
        )}
      </div>
      <Icon className={`h-4 w-4 ${style.text}`} />
      <div className="flex-1">
        <p className={`text-sm font-semibold ${style.text}`}>{statusInfo.message}</p>
      </div>
      <ClouderaComponentBadge component="CAI" />
    </div>
  )
}
