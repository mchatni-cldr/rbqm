import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { KriId, KriValue, BreachStatus, RiskTier, Site } from './types'
import { KRI_MAP } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determine the breach status of a KRI value given its definition
 */
export function kriBreachStatus(kriId: KriId, value: number): BreachStatus {
  const def = KRI_MAP[kriId]
  if (!def) return 'GREEN'

  if (def.higherIsBetter) {
    if (value <= def.qtlThreshold) return 'QTL'
    if (value <= def.redThreshold) return 'RED'
    if (value <= def.redThreshold * 1.1) return 'YELLOW'
    return 'GREEN'
  } else {
    if (value >= def.qtlThreshold) return 'QTL'
    if (value >= def.redThreshold) return 'RED'
    if (value >= def.redThreshold * 0.8) return 'YELLOW'
    return 'GREEN'
  }
}

/**
 * Normalize a single KRI value to a penalty score 0-100
 * 100 = at QTL (worst), 0 = fully compliant (best)
 */
export function normalizeKriPenalty(kriId: KriId, value: number): number {
  const def = KRI_MAP[kriId]
  if (!def) return 0

  if (def.higherIsBetter) {
    const green = def.redThreshold * 1.1  // matches kriBreachStatus GREEN boundary
    const red = def.redThreshold
    const qtl = def.qtlThreshold

    if (value >= green) return 0          // GREEN zone → no penalty
    if (value >= red) {                   // YELLOW zone → 0–30 penalty
      return ((green - value) / (green - red)) * 30
    }
    if (value >= qtl) {                   // RED zone → 30–70 penalty
      return 30 + ((red - value) / (red - qtl)) * 40
    }
    return 70 + Math.min(30, ((qtl - value) / qtl) * 30)  // QTL → 70–100
  } else {
    const green = def.redThreshold * 0.6
    const red = def.redThreshold
    const qtl = def.qtlThreshold

    if (value <= green) return 0
    if (value <= red) {
      return ((value - green) / (red - green)) * 30
    }
    if (value <= qtl) {
      return 30 + ((value - red) / (qtl - red)) * 40
    }
    return 70 + Math.min(30, ((value - qtl) / qtl) * 30)
  }
}

/**
 * Compute composite risk score for a site from its KRI values
 * Returns 0-100, higher = more risk
 */
export function computeCompositeRiskScore(kriValues: Partial<Record<KriId, KriValue>>): number {
  let totalScore = 0
  let totalWeight = 0

  for (const [kriId, kriVal] of Object.entries(kriValues)) {
    const def = KRI_MAP[kriId as KriId]
    if (!def || !kriVal) continue

    const penalty = normalizeKriPenalty(kriId as KriId, kriVal.current)
    totalScore += penalty * def.weight
    totalWeight += def.weight
  }

  if (totalWeight === 0) return 0
  return Math.round((totalScore / totalWeight) * 100) / 100
}

/**
 * Determine risk tier from composite score
 */
export function riskTierFromScore(score: number): RiskTier {
  if (score >= 60) return 'RED'
  if (score >= 35) return 'YELLOW'
  return 'GREEN'
}

export function riskTierColor(tier: RiskTier): string {
  switch (tier) {
    case 'RED': return 'text-red-500'
    case 'YELLOW': return 'text-amber-500'
    case 'GREEN': return 'text-green-500'
  }
}

export function riskTierBg(tier: RiskTier): string {
  switch (tier) {
    case 'RED': return 'bg-red-500'
    case 'YELLOW': return 'bg-amber-500'
    case 'GREEN': return 'bg-green-500'
  }
}

export function riskTierBgLight(tier: RiskTier): string {
  switch (tier) {
    case 'RED': return 'bg-red-50 border-red-200 text-red-800'
    case 'YELLOW': return 'bg-amber-50 border-amber-200 text-amber-800'
    case 'GREEN': return 'bg-green-50 border-green-200 text-green-800'
  }
}

export function breachStatusBg(status: BreachStatus): string {
  switch (status) {
    case 'QTL': return 'bg-purple-100 text-purple-800'
    case 'RED': return 'bg-red-100 text-red-800'
    case 'YELLOW': return 'bg-amber-100 text-amber-800'
    case 'GREEN': return 'bg-green-50 text-green-800'
  }
}

export function breachStatusDot(status: BreachStatus): string {
  switch (status) {
    case 'QTL': return 'bg-purple-500'
    case 'RED': return 'bg-red-500'
    case 'YELLOW': return 'bg-amber-500'
    case 'GREEN': return 'bg-green-500'
  }
}

export function formatKriValue(kriId: KriId, value: number): string {
  const def = KRI_MAP[kriId]
  if (!def) return `${value}`

  switch (def.unit) {
    case '%':
    case '% of target':
      return `${value.toFixed(1)}%`
    case 'days':
      return `${value.toFixed(1)}d`
    case '/100 visits':
      return `${value.toFixed(2)}`
    case 'ratio':
      return `${value.toFixed(2)}`
    default:
      return `${value.toFixed(1)}`
  }
}

export function sortSitesByRisk(sites: Site[]): Site[] {
  return [...sites].sort((a, b) => b.compositeRiskScore - a.compositeRiskScore)
}

export function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
