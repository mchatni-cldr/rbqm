import { useMemo, useState } from 'react'
import { Signal, SignalSeverity, SignalStatus, KriId, DetectionSource } from '@/lib/types'
import { getSignalsByStudy } from '@/data/signals'

export interface SignalFilters {
  severities: SignalSeverity[]
  statuses: SignalStatus[]
  kriTypes: KriId[]
  detectionSources: DetectionSource[]
}

const defaultFilters: SignalFilters = {
  severities: [],
  statuses: [],
  kriTypes: [],
  detectionSources: [],
}

const SEVERITY_ORDER: Record<SignalSeverity, number> = {
  CRITICAL: 0,
  MAJOR: 1,
  MINOR: 2,
}

export function useSignals(studyId: string) {
  const [filters, setFilters] = useState<SignalFilters>(defaultFilters)
  const [hideClosedSignals, setHideClosedSignals] = useState(true)

  const allSignals = useMemo(() => getSignalsByStudy(studyId), [studyId])

  const filteredSignals = useMemo(() => {
    let sigs = [...allSignals]

    if (hideClosedSignals) {
      sigs = sigs.filter(s => s.status !== 'CLOSED')
    }

    if (filters.severities.length > 0) {
      sigs = sigs.filter(s => filters.severities.includes(s.severity))
    }

    if (filters.statuses.length > 0) {
      sigs = sigs.filter(s => filters.statuses.includes(s.status))
    }

    if (filters.kriTypes.length > 0) {
      sigs = sigs.filter(s => filters.kriTypes.includes(s.kriId))
    }

    if (filters.detectionSources.length > 0) {
      sigs = sigs.filter(s => filters.detectionSources.includes(s.detectedBy))
    }

    // Sort: CRITICAL first, then MAJOR, then MINOR, then by date
    return sigs.sort((a, b) => {
      const severityDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      if (severityDiff !== 0) return severityDiff
      return new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    })
  }, [allSignals, filters, hideClosedSignals])

  const counts = useMemo(() => ({
    total: allSignals.length,
    open: allSignals.filter(s => s.status !== 'CLOSED').length,
    critical: allSignals.filter(s => s.severity === 'CRITICAL' && s.status !== 'CLOSED').length,
    major: allSignals.filter(s => s.severity === 'MAJOR' && s.status !== 'CLOSED').length,
    minor: allSignals.filter(s => s.severity === 'MINOR' && s.status !== 'CLOSED').length,
    closed: allSignals.filter(s => s.status === 'CLOSED').length,
  }), [allSignals])

  return {
    signals: filteredSignals,
    allSignals,
    filters,
    setFilters,
    hideClosedSignals,
    setHideClosedSignals,
    counts,
  }
}
