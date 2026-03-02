'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { studies } from '@/data/studies'
import { TrafficLight } from '@/components/ui/traffic-light'
import { Badge } from '@/components/ui/badge'

const STUDY_ICONS: Record<string, string> = {
  'STUDY-001': '🧬',
  'STUDY-002': '❤️',
  'STUDY-003': '🧠',
}

interface Props {
  studyId: string
  studyName: string
}

export function StudyNav({ studyId, studyName }: Props) {
  const pathname = usePathname()
  const study = studies.find(s => s.id === studyId)

  const tabs = [
    { label: 'Overview', href: `/studies/${studyId}` },
    { label: 'Site Risk Table', href: `/studies/${studyId}/sites` },
    { label: `Signals ${study?.criticalSignals ? `(${study.criticalSignals}⚠)` : `(${study?.openSignals})`}`, href: `/studies/${studyId}/signals` },
    { label: 'Agent Activity', href: `/studies/${studyId}/agent` },
  ]

  return (
    <div className="mb-6">
      {/* Study header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
          {STUDY_ICONS[studyId]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold leading-tight truncate">{studyName}</h2>
            {study && <TrafficLight tier={study.riskTier} size="sm" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {study?.phase} · {study?.therapeuticArea} · {study?.indication} · {study?.totalSites} sites
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-0 -mb-px">
          {tabs.map(tab => {
            const isActive = tab.href === `/studies/${studyId}`
              ? pathname === tab.href
              : pathname.startsWith(tab.href) && !pathname.startsWith(tab.href + '/')
                || pathname === tab.href

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
