import { useMemo, useState } from 'react'
import { Site, RiskTier, KriId } from '@/lib/types'
import { getSitesByStudy } from '@/data/sites'
import { sortSitesByRisk } from '@/lib/utils'

export interface SiteFilters {
  countries: string[]
  riskTiers: RiskTier[]
  kriInBreach: KriId | null
}

const defaultFilters: SiteFilters = {
  countries: [],
  riskTiers: [],
  kriInBreach: null,
}

export function useSiteRisk(studyId: string) {
  const [filters, setFilters] = useState<SiteFilters>(defaultFilters)
  const [sortKey, setSortKey] = useState<'compositeRiskScore' | 'name' | 'enrollmentRate'>('compositeRiskScore')

  const allSites = useMemo(() => getSitesByStudy(studyId), [studyId])

  const filteredSites = useMemo(() => {
    let sites = [...allSites]

    if (filters.countries.length > 0) {
      sites = sites.filter(s => filters.countries.includes(s.countryCode))
    }

    if (filters.riskTiers.length > 0) {
      sites = sites.filter(s => filters.riskTiers.includes(s.riskTier))
    }

    if (filters.kriInBreach) {
      sites = sites.filter(s => {
        const kri = s.kriValues[filters.kriInBreach!]
        return kri && (kri.breachStatus === 'RED' || kri.breachStatus === 'QTL')
      })
    }

    return sortSitesByRisk(sites)
  }, [allSites, filters])

  const countries = useMemo(() => {
    const codes = [...new Set(allSites.map(s => s.countryCode))]
    return codes.sort()
  }, [allSites])

  return {
    sites: filteredSites,
    allSites,
    filters,
    setFilters,
    sortKey,
    setSortKey,
    countries,
  }
}
