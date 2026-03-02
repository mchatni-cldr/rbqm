import Link from 'next/link'
import { Study } from '@/lib/types'
import { TrafficLight } from '@/components/ui/traffic-light'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, MapPin, FlaskConical, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  study: Study
}

const STUDY_ICONS: Record<string, string> = {
  'STUDY-001': '🧬',
  'STUDY-002': '❤️',
  'STUDY-003': '🧠',
}

export function StudyCard({ study }: Props) {
  const enrollmentPct = Math.round((study.enrolledSubjects / study.targetSubjects) * 100)

  return (
    <Link href={`/studies/${study.id}`} className="block group">
      <Card className={cn(
        'border-2 transition-all hover:shadow-md hover:-translate-y-0.5',
        study.riskTier === 'RED' ? 'border-red-200 hover:border-red-300' :
        study.riskTier === 'YELLOW' ? 'border-amber-200 hover:border-amber-300' :
        'border-green-200 hover:border-green-300'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{STUDY_ICONS[study.id]}</span>
              <div>
                <p className="text-lg font-bold leading-tight">{study.name}</p>
                <p className="text-xs text-muted-foreground">{study.protocol} · {study.phase}</p>
              </div>
            </div>
            <TrafficLight tier={study.riskTier} size="md" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Indication & area */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">{study.therapeuticArea}</Badge>
            <Badge variant="outline" className="text-xs">{study.indication}</Badge>
          </div>

          {/* Enrollment */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Enrollment
              </span>
              <span className="font-semibold">{study.enrolledSubjects}/{study.targetSubjects} <span className="text-muted-foreground font-normal">({enrollmentPct}%)</span></span>
            </div>
            <Progress value={enrollmentPct} className="h-2" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">Sites</p>
              <p className="font-bold text-sm">{study.totalSites}</p>
            </div>
            <div className="rounded-md bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">Countries</p>
              <p className="font-bold text-sm">{study.countries.length}</p>
            </div>
            <div className={cn(
              'rounded-md p-2',
              study.criticalSignals > 0 ? 'bg-red-50' : 'bg-muted/50'
            )}>
              <p className={cn('text-xs', study.criticalSignals > 0 ? 'text-red-600' : 'text-muted-foreground')}>Signals</p>
              <p className={cn('font-bold text-sm', study.criticalSignals > 0 ? 'text-red-700' : '')}>
                {study.openSignals}
                {study.criticalSignals > 0 && (
                  <span className="text-[10px] ml-1 text-red-500">({study.criticalSignals}⚠)</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
