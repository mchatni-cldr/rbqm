import { Capa, ActionItem } from '@/lib/types'
import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  capa: Capa
}

const STATUS_CONFIG = {
  PENDING: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-slate-50' },
  IN_PROGRESS: { icon: Loader, color: 'text-blue-600', bg: 'bg-blue-50' },
  COMPLETED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  OVERDUE: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
}

export function ActionPlanCard({ capa }: Props) {
  const completedCount = capa.actions.filter(a => a.status === 'COMPLETED').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Corrective & Preventive Actions</h4>
        <span className="text-xs text-muted-foreground">{completedCount}/{capa.actions.length} complete</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-gray-200">
        <div
          className="h-1.5 rounded-full bg-green-500 transition-all"
          style={{ width: `${(completedCount / capa.actions.length) * 100}%` }}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-border p-2.5">
          <p className="text-muted-foreground">Issued</p>
          <p className="font-semibold">{format(new Date(capa.issuedDate), 'MMM d, yyyy')}</p>
        </div>
        <div className="rounded-lg border border-border p-2.5">
          <p className="text-muted-foreground">Target Completion</p>
          <p className="font-semibold">{format(new Date(capa.targetCompletionDate), 'MMM d, yyyy')}</p>
        </div>
      </div>

      {/* Action items */}
      <div className="space-y-2">
        {capa.actions.map((action, i) => {
          const cfg = STATUS_CONFIG[action.status]
          const Icon = cfg.icon

          return (
            <div key={action.id} className={`rounded-lg border border-border p-3 ${cfg.bg}`}>
              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border border-border text-xs font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{action.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                    <span className="font-medium">Owner: {action.owner}</span>
                    <span>Due: {format(new Date(action.dueDate), 'MMM d')}</span>
                    <span className={`flex items-center gap-0.5 font-medium ${cfg.color}`}>
                      <Icon className="h-3 w-3" />
                      {action.status.replace('_', ' ')}
                    </span>
                  </div>
                  {action.completedDate && (
                    <p className="text-xs text-green-600 mt-0.5">
                      Completed: {format(new Date(action.completedDate), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Effectiveness check: {format(new Date(capa.effectivenessCheck), 'MMM d, yyyy')}
      </p>
    </div>
  )
}
