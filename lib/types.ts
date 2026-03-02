// Core domain types for RBQM Agentic Demo

export type RiskTier = 'GREEN' | 'YELLOW' | 'RED'
export type SignalStatus = 'OPEN' | 'INVESTIGATING' | 'RCA_COMPLETE' | 'CAPA_ISSUED' | 'CLOSED'
export type SignalSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR'
export type AgentActionType = 'SCAN' | 'DETECT' | 'INVESTIGATE' | 'CROSS_REFERENCE' | 'ANALYZE' | 'CONCLUDE' | 'RECOMMEND' | 'ESCALATE'
export type DetectionSource = 'AGENT' | 'MANUAL'
export type DataSourceStatus = 'CONNECTED' | 'DELAYED' | 'ERROR'

export type KriId =
  | 'AE_REPORTING_RATE'
  | 'QUERY_AGING'
  | 'PROTOCOL_DEVIATION_RATE'
  | 'ENROLLMENT_RATE'
  | 'DATA_ENTRY_TIMELINESS'
  | 'MISSED_VISIT_RATE'
  | 'SAE_UNDERREPORTING'
  | 'IC_COMPLIANCE'

export type BreachStatus = 'QTL' | 'RED' | 'YELLOW' | 'GREEN'

export interface KriValue {
  current: number
  unit: string
  breachStatus: BreachStatus
  weeklyHistory: number[] // 12 weeks, oldest first
  trend: 'IMPROVING' | 'STABLE' | 'WORSENING'
  trendDelta: number // change from prev week
}

export interface Site {
  id: string
  studyId: string
  name: string
  country: string
  countryCode: string
  coordinates: [number, number] // [lng, lat] for react-simple-maps
  compositeRiskScore: number // 0-100
  riskTier: RiskTier
  kriValues: Record<KriId, KriValue>
  openSignals: number
  enrolledSubjects: number
  targetSubjects: number
  principalInvestigator: string
  lastMonitoringVisit: string // ISO date
  siteActivationDate: string // ISO date
}

export interface Study {
  id: string
  name: string
  phase: string
  therapeuticArea: string
  indication: string
  sponsor: string
  protocol: string
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD'
  riskTier: RiskTier
  totalSites: number
  enrolledSubjects: number
  targetSubjects: number
  enrollmentRate: number // %
  startDate: string
  plannedEndDate: string
  openSignals: number
  criticalSignals: number
  countries: string[]
}

export interface ActionItem {
  id: string
  description: string
  owner: string
  dueDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  completedDate?: string
}

export interface Investigation {
  rootCause: string
  rootCauseCategory: 'STAFFING' | 'PROCESS' | 'TRAINING' | 'TECHNOLOGY' | 'PATIENT' | 'SITE_CAPACITY'
  confidence: number // 0-100
  findings: string[]
  dataSources: string[]
  analysisDate: string
}

export interface Capa {
  issuedDate: string
  targetCompletionDate: string
  actions: ActionItem[]
  effectivenessCheck: string // ISO date
}

export interface AgentActivity {
  id: string
  studyId: string
  signalId?: string
  timestamp: string // ISO datetime
  actionType: AgentActionType
  title: string // short headline
  detail: string // full reasoning narrative
  dataAccessed?: string[]
  outcome?: string
  confidence?: number // 0-100
  durationMs?: number // drives simulation delay
}

export interface Signal {
  id: string
  studyId: string
  siteId: string
  kriId: KriId
  severity: SignalSeverity
  status: SignalStatus
  detectedBy: DetectionSource
  detectedAt: string // ISO datetime
  title: string
  description: string
  kriValue: number
  kriThreshold: number
  investigation?: Investigation
  capa?: Capa
  agentActivityIds: string[]
  resolvedAt?: string
}

export interface GxpDataSource {
  id: string
  name: string
  category: string
  vendor: string
  dataTypes: string[]
  krisEnabled: KriId[]
  refreshRate: string
  clouderaIngestionMethod: string
  recordCount: number
  lastSync: string
  status: DataSourceStatus
  clouderaComponent: 'CDF' | 'CDE' | 'CAI' | 'SDX'
}

export interface KriDefinition {
  id: KriId
  label: string
  unit: string
  description: string
  redThreshold: number
  qtlThreshold: number
  higherIsBetter: boolean // true = higher value is better (like compliance %)
  weight: number // for composite score, sums to 1.0
}

export interface StudyTab {
  label: string
  href: string
  value: string
}
