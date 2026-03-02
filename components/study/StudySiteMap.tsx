'use client'

import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { Site } from '@/lib/types'
import { RISK_TIER_COLORS, COUNTRY_FLAGS } from '@/lib/constants'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface Props {
  sites: Site[]
  studyId: string
}

export function StudySiteMap({ sites, studyId }: Props) {
  const [hoveredSite, setHoveredSite] = useState<Site | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  return (
    <div className="relative select-none">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 110, center: [15, 20] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: '#e2e8f0', stroke: '#cbd5e1', strokeWidth: 0.4, outline: 'none' },
                    hover:   { fill: '#e2e8f0', stroke: '#cbd5e1', strokeWidth: 0.4, outline: 'none' },
                    pressed: { fill: '#e2e8f0', outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {sites.map(site => {
            const color = RISK_TIER_COLORS[site.riskTier]
            const r = site.riskTier === 'RED' ? 5 : site.riskTier === 'YELLOW' ? 4 : 3.5

            return (
              <Marker
                key={site.id}
                coordinates={site.coordinates as [number, number]}
                onMouseEnter={(e) => {
                  setHoveredSite(site)
                  const rect = (e.currentTarget as SVGElement)
                    .closest('svg')
                    ?.getBoundingClientRect()
                  const svgRect = (e.target as SVGElement).getBoundingClientRect()
                  if (rect) {
                    setTooltipPos({
                      x: svgRect.left - rect.left + 10,
                      y: svgRect.top - rect.top - 52,
                    })
                  }
                }}
                onMouseLeave={() => setHoveredSite(null)}
              >
                {/* Pulse ring for RED sites */}
                {site.riskTier === 'RED' && (
                  <circle r={r + 5} fill={color} opacity={0.25}>
                    <animate
                      attributeName="r"
                      from={r}
                      to={r + 8}
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.35"
                      to="0"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  r={r}
                  fill={color}
                  stroke="white"
                  strokeWidth={1.2}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Hover tooltip — absolutely positioned over the SVG */}
      {hoveredSite && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-border bg-white px-3 py-2 shadow-lg text-xs"
          style={{ left: tooltipPos.x, top: tooltipPos.y, minWidth: 180 }}
        >
          <p className="font-semibold text-slate-800 leading-tight">{hoveredSite.name}</p>
          <p className="text-slate-500 mt-0.5">
            {COUNTRY_FLAGS[hoveredSite.countryCode]} {hoveredSite.country}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: RISK_TIER_COLORS[hoveredSite.riskTier] }}
            />
            <span className="font-medium" style={{ color: RISK_TIER_COLORS[hoveredSite.riskTier] }}>
              {hoveredSite.riskTier}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">Score: {hoveredSite.compositeRiskScore.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 justify-center text-xs text-muted-foreground">
        {(['RED', 'YELLOW', 'GREEN'] as const).map(tier => (
          <span key={tier} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: RISK_TIER_COLORS[tier] }}
            />
            {tier} ({sites.filter(s => s.riskTier === tier).length})
          </span>
        ))}
      </div>
    </div>
  )
}
