import { KriDefinition, KriId } from './types'

export const KRI_DEFINITIONS: KriDefinition[] = [
  {
    id: 'AE_REPORTING_RATE',
    label: 'AE Reporting Rate',
    unit: '%',
    description: 'Percentage of adverse events reported within required timeframe',
    redThreshold: 70,
    qtlThreshold: 60,
    higherIsBetter: true,
    weight: 0.20,
  },
  {
    id: 'QUERY_AGING',
    label: 'Query Aging',
    unit: 'days',
    description: 'Average days outstanding for open data queries',
    redThreshold: 21,
    qtlThreshold: 30,
    higherIsBetter: false,
    weight: 0.15,
  },
  {
    id: 'PROTOCOL_DEVIATION_RATE',
    label: 'Protocol Deviation Rate',
    unit: '/100 visits',
    description: 'Number of protocol deviations per 100 patient visits',
    redThreshold: 5.0,
    qtlThreshold: 8.0,
    higherIsBetter: false,
    weight: 0.20,
  },
  {
    id: 'ENROLLMENT_RATE',
    label: 'Enrollment Rate',
    unit: '% of target',
    description: 'Percentage of target enrollment achieved',
    redThreshold: 50,
    qtlThreshold: 30,
    higherIsBetter: true,
    weight: 0.10,
  },
  {
    id: 'DATA_ENTRY_TIMELINESS',
    label: 'Data Entry Timeliness',
    unit: '%',
    description: 'Percentage of CRF pages entered within protocol-specified timeframe',
    redThreshold: 75,
    qtlThreshold: 60,
    higherIsBetter: true,
    weight: 0.10,
  },
  {
    id: 'MISSED_VISIT_RATE',
    label: 'Missed Visit Rate',
    unit: '%',
    description: 'Percentage of scheduled visits that were missed or unexcused',
    redThreshold: 20,
    qtlThreshold: 30,
    higherIsBetter: false,
    weight: 0.10,
  },
  {
    id: 'SAE_UNDERREPORTING',
    label: 'SAE Underreporting Index',
    unit: 'ratio',
    description: 'Ratio of SAEs reported vs expected based on disease area baseline',
    redThreshold: 0.5,
    qtlThreshold: 0.3,
    higherIsBetter: true,
    weight: 0.10,
  },
  {
    id: 'IC_COMPLIANCE',
    label: 'Informed Consent Compliance',
    unit: '%',
    description: 'Percentage of subjects with fully compliant informed consent documentation',
    redThreshold: 90,
    qtlThreshold: 85,
    higherIsBetter: true,
    weight: 0.05,
  },
]

export const KRI_MAP: Record<KriId, KriDefinition> = Object.fromEntries(
  KRI_DEFINITIONS.map(k => [k.id, k])
) as Record<KriId, KriDefinition>

export const RISK_TIER_COLORS: Record<string, string> = {
  RED: '#ef4444',
  YELLOW: '#f59e0b',
  GREEN: '#22c55e',
}

export const RISK_TIER_BG: Record<string, string> = {
  RED: 'bg-red-500',
  YELLOW: 'bg-amber-500',
  GREEN: 'bg-green-500',
}

export const BREACH_STATUS_COLORS: Record<string, string> = {
  QTL: '#7c3aed',
  RED: '#ef4444',
  YELLOW: '#f59e0b',
  GREEN: '#22c55e',
}

export const CLOUDERA_COMPONENTS = {
  CDF: {
    id: 'CDF',
    name: 'Cloudera Data Flow',
    shortName: 'CDF',
    icon: '⚡',
    color: '#FF6B35',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    description: 'Real-time streaming ingestion from GxP source systems via NiFi connectors',
  },
  CDE: {
    id: 'CDE',
    name: 'Cloudera Data Engineering',
    shortName: 'CDE',
    icon: '⚙',
    color: '#0066CC',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    description: 'KRI computation pipelines using Apache Spark & Airflow on validated infrastructure',
  },
  CAI: {
    id: 'CAI',
    name: 'Cloudera AI',
    shortName: 'CAI',
    icon: '🤖',
    color: '#6D28D9',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-800',
    borderColor: 'border-violet-300',
    description: 'Autonomous RBQM agent: signal detection, root cause analysis, CAPA generation',
  },
  SDX: {
    id: 'SDX',
    name: 'Cloudera SDX',
    shortName: 'SDX',
    icon: '🛡',
    color: '#065F46',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    description: 'Shared Data Experience: Apache Ranger + Atlas for GxP audit trail & data lineage',
  },
} as const

export const SIGNAL_STATUS_CONFIG = {
  OPEN: { label: 'Open', color: 'bg-red-100 text-red-800 border-red-200' },
  INVESTIGATING: { label: 'Investigating', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  RCA_COMPLETE: { label: 'RCA Complete', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  CAPA_ISSUED: { label: 'CAPA Issued', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  CLOSED: { label: 'Closed', color: 'bg-green-100 text-green-800 border-green-200' },
}

export const SEVERITY_CONFIG = {
  CRITICAL: { label: 'Critical', color: 'bg-red-600 text-white' },
  MAJOR: { label: 'Major', color: 'bg-orange-500 text-white' },
  MINOR: { label: 'Minor', color: 'bg-yellow-400 text-black' },
}

export const AGENT_ACTION_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  SCAN: { icon: '🔍', label: 'Scanning', color: 'text-blue-600' },
  DETECT: { icon: '⚠', label: 'Detected', color: 'text-amber-600' },
  INVESTIGATE: { icon: '🔬', label: 'Investigating', color: 'text-violet-600' },
  CROSS_REFERENCE: { icon: '🔗', label: 'Cross-referencing', color: 'text-teal-600' },
  ANALYZE: { icon: '📊', label: 'Analyzing', color: 'text-blue-600' },
  CONCLUDE: { icon: '✅', label: 'Concluded', color: 'text-green-600' },
  RECOMMEND: { icon: '📋', label: 'Recommending', color: 'text-violet-600' },
  ESCALATE: { icon: '🚨', label: 'Escalated', color: 'text-red-600' },
}

export const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸',
  UK: '🇬🇧',
  DE: '🇩🇪',
  FR: '🇫🇷',
  ES: '🇪🇸',
  BR: '🇧🇷',
  JP: '🇯🇵',
  KR: '🇰🇷',
  AU: '🇦🇺',
  IN: '🇮🇳',
  CA: '🇨🇦',
  NL: '🇳🇱',
  PL: '🇵🇱',
  AR: '🇦🇷',
}
