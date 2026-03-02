'use client'

import { Site } from '@/lib/types'
import { RISK_TIER_COLORS, COUNTRY_FLAGS } from '@/lib/constants'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  sites: Site[]
  studyId: string
}

// Simple SVG world map representation with site dots
export function StudySiteMap({ sites, studyId }: Props) {
  const [hoveredSite, setHoveredSite] = useState<Site | null>(null)

  // Map world coordinates to SVG viewBox 0 0 1000 500
  // lng: -180 to 180 -> 0 to 1000
  // lat: 90 to -90 -> 0 to 500
  function projectCoords(lng: number, lat: number) {
    const x = ((lng + 180) / 360) * 1000
    const y = ((90 - lat) / 180) * 500
    return { x, y }
  }

  return (
    <div className="relative">
      <svg viewBox="0 0 1000 500" className="w-full rounded-lg bg-slate-50 border border-slate-200">
        {/* World map outline - simplified continent paths */}
        <g fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5">
          {/* North America */}
          <path d="M 60 80 L 250 80 L 270 150 L 230 200 L 200 250 L 180 300 L 120 280 L 80 220 L 60 150 Z" />
          {/* South America */}
          <path d="M 160 300 L 220 290 L 240 350 L 230 430 L 200 460 L 170 440 L 150 380 L 140 330 Z" />
          {/* Europe */}
          <path d="M 440 70 L 540 70 L 560 100 L 540 140 L 480 150 L 440 130 L 420 100 Z" />
          {/* Africa */}
          <path d="M 450 160 L 530 150 L 560 200 L 550 300 L 520 370 L 490 380 L 460 350 L 440 280 L 440 200 Z" />
          {/* Asia */}
          <path d="M 550 60 L 850 60 L 900 120 L 870 200 L 800 220 L 700 210 L 620 180 L 580 140 L 550 100 Z" />
          {/* Australia */}
          <path d="M 770 310 L 870 300 L 900 340 L 880 390 L 840 400 L 790 380 L 760 350 Z" />
        </g>

        {/* Site markers */}
        {sites.map(site => {
          const { x, y } = projectCoords(site.coordinates[0], site.coordinates[1])
          const color = RISK_TIER_COLORS[site.riskTier]

          return (
            <g key={site.id}>
              {/* Pulse ring for red sites */}
              {site.riskTier === 'RED' && (
                <circle cx={x} cy={y} r={10} fill={color} opacity={0.2}>
                  <animate attributeName="r" from="6" to="14" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={x}
                cy={y}
                r={site.riskTier === 'RED' ? 7 : site.riskTier === 'YELLOW' ? 6 : 5}
                fill={color}
                stroke="white"
                strokeWidth="1.5"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredSite(site)}
                onMouseLeave={() => setHoveredSite(null)}
              />
            </g>
          )
        })}

        {/* Tooltip */}
        {hoveredSite && (() => {
          const { x, y } = projectCoords(hoveredSite.coordinates[0], hoveredSite.coordinates[1])
          const tooltipX = Math.min(x, 820)
          const tooltipY = Math.max(y - 60, 10)
          return (
            <g>
              <rect x={tooltipX} y={tooltipY} width={180} height={55} rx={4} fill="white" stroke="#e2e8f0" strokeWidth="1" />
              <text x={tooltipX + 8} y={tooltipY + 18} fontSize="10" fontWeight="bold" fill="#1e293b">
                {hoveredSite.name.substring(0, 25)}
              </text>
              <text x={tooltipX + 8} y={tooltipY + 31} fontSize="9" fill="#64748b">
                {COUNTRY_FLAGS[hoveredSite.countryCode]} {hoveredSite.country}
              </text>
              <text x={tooltipX + 8} y={tooltipY + 44} fontSize="9" fill={RISK_TIER_COLORS[hoveredSite.riskTier]}>
                ● {hoveredSite.riskTier} · Score: {hoveredSite.compositeRiskScore.toFixed(1)}
              </text>
            </g>
          )
        })()}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 justify-center text-xs text-muted-foreground">
        {(['RED', 'YELLOW', 'GREEN'] as const).map(tier => (
          <span key={tier} className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ backgroundColor: RISK_TIER_COLORS[tier] }} />
            {tier} ({sites.filter(s => s.riskTier === tier).length})
          </span>
        ))}
      </div>
    </div>
  )
}
