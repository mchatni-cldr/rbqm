import { KriValue } from '@/lib/types'
import { kriBreachStatus } from '@/lib/utils'

// Helper to generate weekly history with a trend
function genHistory(
  finalValue: number,
  weeks = 12,
  trend: 'flat' | 'worsening' | 'improving' = 'flat',
  noise = 2
): number[] {
  const history: number[] = []
  let val = finalValue

  // Work backwards from final value
  for (let i = 0; i < weeks; i++) {
    const jitter = (Math.random() - 0.5) * noise
    history.unshift(Math.max(0, val + jitter))

    if (trend === 'worsening') val -= (finalValue * 0.08) / weeks
    else if (trend === 'improving') val += (finalValue * 0.08) / weeks
  }

  history[history.length - 1] = finalValue
  return history.map(v => Math.round(v * 10) / 10)
}

function makeKri(
  current: number,
  kriId: string,
  trend: 'flat' | 'worsening' | 'improving' = 'flat',
  noise = 2
): KriValue {
  const history = genHistory(current, 12, trend, noise)
  const breachStatus = kriBreachStatus(kriId as never, current)
  const prevVal = history[history.length - 2] ?? current
  const delta = current - prevVal

  let trendDir: 'IMPROVING' | 'STABLE' | 'WORSENING' = 'STABLE'
  if (Math.abs(delta) > 1) {
    trendDir = trend === 'worsening' ? 'WORSENING' : trend === 'improving' ? 'IMPROVING' : 'STABLE'
  }

  const def = {
    AE_REPORTING_RATE: '%',
    QUERY_AGING: 'days',
    PROTOCOL_DEVIATION_RATE: '/100 visits',
    ENROLLMENT_RATE: '% of target',
    DATA_ENTRY_TIMELINESS: '%',
    MISSED_VISIT_RATE: '%',
    SAE_UNDERREPORTING: 'ratio',
    IC_COMPLIANCE: '%',
  } as Record<string, string>

  return {
    current,
    unit: def[kriId] ?? '',
    breachStatus,
    weeklyHistory: history,
    trend: trendDir,
    trendDelta: Math.round(delta * 10) / 10,
  }
}

// ─── STUDY-001: APEX-101 (8 sites) ───────────────────────────────────────────

export const kriValuesStudy001: Record<string, Record<string, KriValue>> = {
  // Site 001-01: Green site
  'SITE-001-01': {
    AE_REPORTING_RATE: makeKri(94.2, 'AE_REPORTING_RATE', 'flat', 1.5),
    QUERY_AGING: makeKri(8.1, 'QUERY_AGING', 'flat', 1),
    PROTOCOL_DEVIATION_RATE: makeKri(2.1, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.3),
    ENROLLMENT_RATE: makeKri(87.5, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(96.3, 'DATA_ENTRY_TIMELINESS', 'flat', 1),
    MISSED_VISIT_RATE: makeKri(5.2, 'MISSED_VISIT_RATE', 'flat', 0.5),
    SAE_UNDERREPORTING: makeKri(0.92, 'SAE_UNDERREPORTING', 'flat', 0.05),
    IC_COMPLIANCE: makeKri(100, 'IC_COMPLIANCE', 'flat', 0),
  },
  // Site 001-02: Yellow site
  'SITE-001-02': {
    AE_REPORTING_RATE: makeKri(74.5, 'AE_REPORTING_RATE', 'worsening', 2),
    QUERY_AGING: makeKri(18.3, 'QUERY_AGING', 'worsening', 1.5),
    PROTOCOL_DEVIATION_RATE: makeKri(4.2, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.4),
    ENROLLMENT_RATE: makeKri(62.5, 'ENROLLMENT_RATE', 'flat', 3),
    DATA_ENTRY_TIMELINESS: makeKri(80.1, 'DATA_ENTRY_TIMELINESS', 'flat', 2),
    MISSED_VISIT_RATE: makeKri(14.8, 'MISSED_VISIT_RATE', 'flat', 1),
    SAE_UNDERREPORTING: makeKri(0.68, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(95.0, 'IC_COMPLIANCE', 'flat', 1),
  },
  // Site 001-03: Green
  'SITE-001-03': {
    AE_REPORTING_RATE: makeKri(91.0, 'AE_REPORTING_RATE', 'flat', 1.5),
    QUERY_AGING: makeKri(11.2, 'QUERY_AGING', 'flat', 1),
    PROTOCOL_DEVIATION_RATE: makeKri(1.8, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.2),
    ENROLLMENT_RATE: makeKri(75.0, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(93.5, 'DATA_ENTRY_TIMELINESS', 'flat', 1.5),
    MISSED_VISIT_RATE: makeKri(8.1, 'MISSED_VISIT_RATE', 'flat', 0.8),
    SAE_UNDERREPORTING: makeKri(0.88, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(98.0, 'IC_COMPLIANCE', 'flat', 0.5),
  },
  // Site 001-04: RED site
  'SITE-001-04': {
    AE_REPORTING_RATE: makeKri(58.3, 'AE_REPORTING_RATE', 'worsening', 3),
    QUERY_AGING: makeKri(28.7, 'QUERY_AGING', 'worsening', 2),
    PROTOCOL_DEVIATION_RATE: makeKri(7.1, 'PROTOCOL_DEVIATION_RATE', 'worsening', 0.5),
    ENROLLMENT_RATE: makeKri(37.5, 'ENROLLMENT_RATE', 'worsening', 2),
    DATA_ENTRY_TIMELINESS: makeKri(66.2, 'DATA_ENTRY_TIMELINESS', 'worsening', 2),
    MISSED_VISIT_RATE: makeKri(28.4, 'MISSED_VISIT_RATE', 'worsening', 1.5),
    SAE_UNDERREPORTING: makeKri(0.38, 'SAE_UNDERREPORTING', 'worsening', 0.04),
    IC_COMPLIANCE: makeKri(87.5, 'IC_COMPLIANCE', 'flat', 1),
  },
  // Site 001-05: Green
  'SITE-001-05': {
    AE_REPORTING_RATE: makeKri(89.0, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(12.5, 'QUERY_AGING', 'flat', 1.2),
    PROTOCOL_DEVIATION_RATE: makeKri(2.8, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.3),
    ENROLLMENT_RATE: makeKri(81.2, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(91.2, 'DATA_ENTRY_TIMELINESS', 'flat', 1.5),
    MISSED_VISIT_RATE: makeKri(7.3, 'MISSED_VISIT_RATE', 'flat', 0.7),
    SAE_UNDERREPORTING: makeKri(0.85, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(100, 'IC_COMPLIANCE', 'flat', 0),
  },
  // Site 001-06: Yellow
  'SITE-001-06': {
    AE_REPORTING_RATE: makeKri(77.2, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(19.8, 'QUERY_AGING', 'worsening', 1.5),
    PROTOCOL_DEVIATION_RATE: makeKri(4.8, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.4),
    ENROLLMENT_RATE: makeKri(55.0, 'ENROLLMENT_RATE', 'flat', 3),
    DATA_ENTRY_TIMELINESS: makeKri(78.5, 'DATA_ENTRY_TIMELINESS', 'flat', 2),
    MISSED_VISIT_RATE: makeKri(16.2, 'MISSED_VISIT_RATE', 'flat', 1.2),
    SAE_UNDERREPORTING: makeKri(0.62, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(93.0, 'IC_COMPLIANCE', 'flat', 1),
  },
  // Site 001-07: Green
  'SITE-001-07': {
    AE_REPORTING_RATE: makeKri(96.1, 'AE_REPORTING_RATE', 'flat', 1),
    QUERY_AGING: makeKri(6.4, 'QUERY_AGING', 'flat', 0.8),
    PROTOCOL_DEVIATION_RATE: makeKri(1.4, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.2),
    ENROLLMENT_RATE: makeKri(93.7, 'ENROLLMENT_RATE', 'flat', 1.5),
    DATA_ENTRY_TIMELINESS: makeKri(97.8, 'DATA_ENTRY_TIMELINESS', 'flat', 0.8),
    MISSED_VISIT_RATE: makeKri(3.8, 'MISSED_VISIT_RATE', 'flat', 0.4),
    SAE_UNDERREPORTING: makeKri(0.95, 'SAE_UNDERREPORTING', 'flat', 0.02),
    IC_COMPLIANCE: makeKri(100, 'IC_COMPLIANCE', 'flat', 0),
  },
  // Site 001-08: Yellow
  'SITE-001-08': {
    AE_REPORTING_RATE: makeKri(73.4, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(22.1, 'QUERY_AGING', 'worsening', 1.5),
    PROTOCOL_DEVIATION_RATE: makeKri(5.3, 'PROTOCOL_DEVIATION_RATE', 'worsening', 0.4),
    ENROLLMENT_RATE: makeKri(58.3, 'ENROLLMENT_RATE', 'flat', 3),
    DATA_ENTRY_TIMELINESS: makeKri(76.8, 'DATA_ENTRY_TIMELINESS', 'flat', 2),
    MISSED_VISIT_RATE: makeKri(21.4, 'MISSED_VISIT_RATE', 'worsening', 1.2),
    SAE_UNDERREPORTING: makeKri(0.55, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(91.3, 'IC_COMPLIANCE', 'flat', 1),
  },
}

// ─── STUDY-002: CARDIO-SHIELD-202 (18 sites) ─────────────────────────────────

export const kriValuesStudy002: Record<string, Record<string, KriValue>> = {
  // Site 002-01: CRITICAL RED — Cleveland Cardiac Institute (the main demo site)
  'SITE-002-01': {
    AE_REPORTING_RATE: makeKri(51.2, 'AE_REPORTING_RATE', 'worsening', 3),
    QUERY_AGING: makeKri(38.4, 'QUERY_AGING', 'worsening', 2.5),
    PROTOCOL_DEVIATION_RATE: makeKri(9.2, 'PROTOCOL_DEVIATION_RATE', 'worsening', 0.6),
    ENROLLMENT_RATE: makeKri(28.6, 'ENROLLMENT_RATE', 'worsening', 2),
    DATA_ENTRY_TIMELINESS: makeKri(54.7, 'DATA_ENTRY_TIMELINESS', 'worsening', 3),
    MISSED_VISIT_RATE: makeKri(34.1, 'MISSED_VISIT_RATE', 'worsening', 2),
    SAE_UNDERREPORTING: makeKri(0.28, 'SAE_UNDERREPORTING', 'worsening', 0.03),
    IC_COMPLIANCE: makeKri(84.2, 'IC_COMPLIANCE', 'worsening', 1.5),
  },
  // Site 002-02: RED
  'SITE-002-02': {
    AE_REPORTING_RATE: makeKri(63.5, 'AE_REPORTING_RATE', 'worsening', 2.5),
    QUERY_AGING: makeKri(32.1, 'QUERY_AGING', 'worsening', 2),
    PROTOCOL_DEVIATION_RATE: makeKri(7.8, 'PROTOCOL_DEVIATION_RATE', 'worsening', 0.5),
    ENROLLMENT_RATE: makeKri(33.3, 'ENROLLMENT_RATE', 'worsening', 2),
    DATA_ENTRY_TIMELINESS: makeKri(59.1, 'DATA_ENTRY_TIMELINESS', 'worsening', 2.5),
    MISSED_VISIT_RATE: makeKri(31.2, 'MISSED_VISIT_RATE', 'worsening', 1.8),
    SAE_UNDERREPORTING: makeKri(0.31, 'SAE_UNDERREPORTING', 'worsening', 0.03),
    IC_COMPLIANCE: makeKri(85.7, 'IC_COMPLIANCE', 'flat', 1.2),
  },
  // Site 002-03: YELLOW
  'SITE-002-03': {
    AE_REPORTING_RATE: makeKri(72.1, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(23.4, 'QUERY_AGING', 'flat', 1.5),
    PROTOCOL_DEVIATION_RATE: makeKri(5.6, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.4),
    ENROLLMENT_RATE: makeKri(52.8, 'ENROLLMENT_RATE', 'flat', 2.5),
    DATA_ENTRY_TIMELINESS: makeKri(77.3, 'DATA_ENTRY_TIMELINESS', 'flat', 2),
    MISSED_VISIT_RATE: makeKri(22.8, 'MISSED_VISIT_RATE', 'flat', 1.3),
    SAE_UNDERREPORTING: makeKri(0.58, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(91.5, 'IC_COMPLIANCE', 'flat', 1),
  },
  // Site 002-04: GREEN
  'SITE-002-04': {
    AE_REPORTING_RATE: makeKri(92.7, 'AE_REPORTING_RATE', 'flat', 1.5),
    QUERY_AGING: makeKri(9.2, 'QUERY_AGING', 'flat', 0.8),
    PROTOCOL_DEVIATION_RATE: makeKri(2.3, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.2),
    ENROLLMENT_RATE: makeKri(76.2, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(94.8, 'DATA_ENTRY_TIMELINESS', 'flat', 1),
    MISSED_VISIT_RATE: makeKri(6.4, 'MISSED_VISIT_RATE', 'flat', 0.6),
    SAE_UNDERREPORTING: makeKri(0.91, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(99.0, 'IC_COMPLIANCE', 'flat', 0.5),
  },
  // Site 002-05: RED
  'SITE-002-05': {
    AE_REPORTING_RATE: makeKri(65.8, 'AE_REPORTING_RATE', 'worsening', 2.5),
    QUERY_AGING: makeKri(29.8, 'QUERY_AGING', 'worsening', 2),
    PROTOCOL_DEVIATION_RATE: makeKri(6.7, 'PROTOCOL_DEVIATION_RATE', 'worsening', 0.5),
    ENROLLMENT_RATE: makeKri(40.0, 'ENROLLMENT_RATE', 'worsening', 2.5),
    DATA_ENTRY_TIMELINESS: makeKri(68.4, 'DATA_ENTRY_TIMELINESS', 'worsening', 2),
    MISSED_VISIT_RATE: makeKri(25.6, 'MISSED_VISIT_RATE', 'worsening', 1.5),
    SAE_UNDERREPORTING: makeKri(0.42, 'SAE_UNDERREPORTING', 'worsening', 0.04),
    IC_COMPLIANCE: makeKri(88.9, 'IC_COMPLIANCE', 'flat', 1.2),
  },
  // Sites 006-018: mix of green/yellow/one more red
  'SITE-002-06': {
    AE_REPORTING_RATE: makeKri(85.3, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(14.2, 'QUERY_AGING', 'flat', 1),
    PROTOCOL_DEVIATION_RATE: makeKri(3.4, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.3),
    ENROLLMENT_RATE: makeKri(68.0, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(88.7, 'DATA_ENTRY_TIMELINESS', 'flat', 1.5),
    MISSED_VISIT_RATE: makeKri(11.3, 'MISSED_VISIT_RATE', 'flat', 0.9),
    SAE_UNDERREPORTING: makeKri(0.79, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(96.2, 'IC_COMPLIANCE', 'flat', 0.8),
  },
  'SITE-002-07': {
    AE_REPORTING_RATE: makeKri(79.8, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(17.5, 'QUERY_AGING', 'flat', 1.2),
    PROTOCOL_DEVIATION_RATE: makeKri(4.1, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.3),
    ENROLLMENT_RATE: makeKri(61.5, 'ENROLLMENT_RATE', 'flat', 2.5),
    DATA_ENTRY_TIMELINESS: makeKri(82.4, 'DATA_ENTRY_TIMELINESS', 'flat', 1.8),
    MISSED_VISIT_RATE: makeKri(17.8, 'MISSED_VISIT_RATE', 'flat', 1.1),
    SAE_UNDERREPORTING: makeKri(0.72, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(94.5, 'IC_COMPLIANCE', 'flat', 0.9),
  },
  'SITE-002-08': {
    AE_REPORTING_RATE: makeKri(88.2, 'AE_REPORTING_RATE', 'flat', 1.5),
    QUERY_AGING: makeKri(10.8, 'QUERY_AGING', 'flat', 0.9),
    PROTOCOL_DEVIATION_RATE: makeKri(2.7, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.25),
    ENROLLMENT_RATE: makeKri(72.2, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(91.5, 'DATA_ENTRY_TIMELINESS', 'flat', 1.2),
    MISSED_VISIT_RATE: makeKri(9.4, 'MISSED_VISIT_RATE', 'flat', 0.7),
    SAE_UNDERREPORTING: makeKri(0.84, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(97.8, 'IC_COMPLIANCE', 'flat', 0.5),
  },
  'SITE-002-09': {
    AE_REPORTING_RATE: makeKri(71.3, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(20.7, 'QUERY_AGING', 'worsening', 1.5),
    PROTOCOL_DEVIATION_RATE: makeKri(5.1, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.4),
    ENROLLMENT_RATE: makeKri(50.0, 'ENROLLMENT_RATE', 'flat', 2.5),
    DATA_ENTRY_TIMELINESS: makeKri(76.4, 'DATA_ENTRY_TIMELINESS', 'flat', 2),
    MISSED_VISIT_RATE: makeKri(21.1, 'MISSED_VISIT_RATE', 'flat', 1.3),
    SAE_UNDERREPORTING: makeKri(0.56, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(90.7, 'IC_COMPLIANCE', 'flat', 1),
  },
  'SITE-002-10': {
    AE_REPORTING_RATE: makeKri(93.4, 'AE_REPORTING_RATE', 'flat', 1.2),
    QUERY_AGING: makeKri(7.8, 'QUERY_AGING', 'flat', 0.7),
    PROTOCOL_DEVIATION_RATE: makeKri(1.9, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.2),
    ENROLLMENT_RATE: makeKri(82.5, 'ENROLLMENT_RATE', 'flat', 1.5),
    DATA_ENTRY_TIMELINESS: makeKri(95.6, 'DATA_ENTRY_TIMELINESS', 'flat', 1),
    MISSED_VISIT_RATE: makeKri(5.8, 'MISSED_VISIT_RATE', 'flat', 0.5),
    SAE_UNDERREPORTING: makeKri(0.93, 'SAE_UNDERREPORTING', 'flat', 0.02),
    IC_COMPLIANCE: makeKri(100, 'IC_COMPLIANCE', 'flat', 0),
  },
  'SITE-002-11': {
    AE_REPORTING_RATE: makeKri(86.7, 'AE_REPORTING_RATE', 'flat', 1.8),
    QUERY_AGING: makeKri(13.4, 'QUERY_AGING', 'flat', 1),
    PROTOCOL_DEVIATION_RATE: makeKri(3.2, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.3),
    ENROLLMENT_RATE: makeKri(69.4, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(89.3, 'DATA_ENTRY_TIMELINESS', 'flat', 1.3),
    MISSED_VISIT_RATE: makeKri(10.7, 'MISSED_VISIT_RATE', 'flat', 0.8),
    SAE_UNDERREPORTING: makeKri(0.81, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(97.1, 'IC_COMPLIANCE', 'flat', 0.6),
  },
  'SITE-002-12': {
    AE_REPORTING_RATE: makeKri(76.4, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(19.1, 'QUERY_AGING', 'flat', 1.3),
    PROTOCOL_DEVIATION_RATE: makeKri(4.6, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.35),
    ENROLLMENT_RATE: makeKri(57.1, 'ENROLLMENT_RATE', 'flat', 2.5),
    DATA_ENTRY_TIMELINESS: makeKri(80.8, 'DATA_ENTRY_TIMELINESS', 'flat', 1.8),
    MISSED_VISIT_RATE: makeKri(18.3, 'MISSED_VISIT_RATE', 'flat', 1.2),
    SAE_UNDERREPORTING: makeKri(0.67, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(92.8, 'IC_COMPLIANCE', 'flat', 0.9),
  },
  'SITE-002-13': {
    AE_REPORTING_RATE: makeKri(90.1, 'AE_REPORTING_RATE', 'flat', 1.5),
    QUERY_AGING: makeKri(11.5, 'QUERY_AGING', 'flat', 0.9),
    PROTOCOL_DEVIATION_RATE: makeKri(2.5, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.22),
    ENROLLMENT_RATE: makeKri(79.3, 'ENROLLMENT_RATE', 'flat', 1.8),
    DATA_ENTRY_TIMELINESS: makeKri(93.2, 'DATA_ENTRY_TIMELINESS', 'flat', 1.1),
    MISSED_VISIT_RATE: makeKri(7.9, 'MISSED_VISIT_RATE', 'flat', 0.6),
    SAE_UNDERREPORTING: makeKri(0.87, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(98.5, 'IC_COMPLIANCE', 'flat', 0.4),
  },
  'SITE-002-14': {
    AE_REPORTING_RATE: makeKri(83.6, 'AE_REPORTING_RATE', 'flat', 1.8),
    QUERY_AGING: makeKri(15.7, 'QUERY_AGING', 'flat', 1.1),
    PROTOCOL_DEVIATION_RATE: makeKri(3.8, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.3),
    ENROLLMENT_RATE: makeKri(64.7, 'ENROLLMENT_RATE', 'flat', 2.2),
    DATA_ENTRY_TIMELINESS: makeKri(87.1, 'DATA_ENTRY_TIMELINESS', 'flat', 1.4),
    MISSED_VISIT_RATE: makeKri(13.6, 'MISSED_VISIT_RATE', 'flat', 0.9),
    SAE_UNDERREPORTING: makeKri(0.77, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(95.7, 'IC_COMPLIANCE', 'flat', 0.7),
  },
  'SITE-002-15': {
    AE_REPORTING_RATE: makeKri(68.9, 'AE_REPORTING_RATE', 'worsening', 2.5),
    QUERY_AGING: makeKri(24.6, 'QUERY_AGING', 'worsening', 1.8),
    PROTOCOL_DEVIATION_RATE: makeKri(5.9, 'PROTOCOL_DEVIATION_RATE', 'worsening', 0.4),
    ENROLLMENT_RATE: makeKri(46.2, 'ENROLLMENT_RATE', 'worsening', 2.5),
    DATA_ENTRY_TIMELINESS: makeKri(71.8, 'DATA_ENTRY_TIMELINESS', 'worsening', 2.2),
    MISSED_VISIT_RATE: makeKri(23.7, 'MISSED_VISIT_RATE', 'flat', 1.4),
    SAE_UNDERREPORTING: makeKri(0.48, 'SAE_UNDERREPORTING', 'worsening', 0.04),
    IC_COMPLIANCE: makeKri(89.3, 'IC_COMPLIANCE', 'flat', 1.1),
  },
  'SITE-002-16': {
    AE_REPORTING_RATE: makeKri(91.8, 'AE_REPORTING_RATE', 'flat', 1.3),
    QUERY_AGING: makeKri(8.9, 'QUERY_AGING', 'flat', 0.7),
    PROTOCOL_DEVIATION_RATE: makeKri(2.1, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.2),
    ENROLLMENT_RATE: makeKri(78.6, 'ENROLLMENT_RATE', 'flat', 1.7),
    DATA_ENTRY_TIMELINESS: makeKri(94.3, 'DATA_ENTRY_TIMELINESS', 'flat', 1),
    MISSED_VISIT_RATE: makeKri(6.8, 'MISSED_VISIT_RATE', 'flat', 0.5),
    SAE_UNDERREPORTING: makeKri(0.90, 'SAE_UNDERREPORTING', 'flat', 0.02),
    IC_COMPLIANCE: makeKri(99.3, 'IC_COMPLIANCE', 'flat', 0.3),
  },
  'SITE-002-17': {
    AE_REPORTING_RATE: makeKri(74.3, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(22.8, 'QUERY_AGING', 'worsening', 1.5),
    PROTOCOL_DEVIATION_RATE: makeKri(4.9, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.35),
    ENROLLMENT_RATE: makeKri(55.6, 'ENROLLMENT_RATE', 'flat', 2.3),
    DATA_ENTRY_TIMELINESS: makeKri(79.4, 'DATA_ENTRY_TIMELINESS', 'flat', 1.8),
    MISSED_VISIT_RATE: makeKri(19.6, 'MISSED_VISIT_RATE', 'flat', 1.2),
    SAE_UNDERREPORTING: makeKri(0.63, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(92.1, 'IC_COMPLIANCE', 'flat', 0.9),
  },
  'SITE-002-18': {
    AE_REPORTING_RATE: makeKri(87.5, 'AE_REPORTING_RATE', 'flat', 1.7),
    QUERY_AGING: makeKri(12.9, 'QUERY_AGING', 'flat', 1),
    PROTOCOL_DEVIATION_RATE: makeKri(3.0, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.27),
    ENROLLMENT_RATE: makeKri(71.4, 'ENROLLMENT_RATE', 'flat', 2.1),
    DATA_ENTRY_TIMELINESS: makeKri(90.6, 'DATA_ENTRY_TIMELINESS', 'flat', 1.2),
    MISSED_VISIT_RATE: makeKri(10.1, 'MISSED_VISIT_RATE', 'flat', 0.8),
    SAE_UNDERREPORTING: makeKri(0.83, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(97.4, 'IC_COMPLIANCE', 'flat', 0.5),
  },
}

// ─── STUDY-003: NEURO-CALM-303 (22 sites) ─────────────────────────────────────

export const kriValuesStudy003: Record<string, Record<string, KriValue>> = {
  // Site 003-01: RED
  'SITE-003-01': {
    AE_REPORTING_RATE: makeKri(59.4, 'AE_REPORTING_RATE', 'worsening', 3),
    QUERY_AGING: makeKri(27.8, 'QUERY_AGING', 'worsening', 2),
    PROTOCOL_DEVIATION_RATE: makeKri(6.8, 'PROTOCOL_DEVIATION_RATE', 'worsening', 0.5),
    ENROLLMENT_RATE: makeKri(38.5, 'ENROLLMENT_RATE', 'worsening', 2),
    DATA_ENTRY_TIMELINESS: makeKri(65.7, 'DATA_ENTRY_TIMELINESS', 'worsening', 2.5),
    MISSED_VISIT_RATE: makeKri(27.3, 'MISSED_VISIT_RATE', 'worsening', 1.6),
    SAE_UNDERREPORTING: makeKri(0.39, 'SAE_UNDERREPORTING', 'worsening', 0.04),
    IC_COMPLIANCE: makeKri(86.4, 'IC_COMPLIANCE', 'flat', 1.4),
  },
  // Sites 003-02 through 003-22: mix of green/yellow
  'SITE-003-02': {
    AE_REPORTING_RATE: makeKri(88.9, 'AE_REPORTING_RATE', 'flat', 1.8),
    QUERY_AGING: makeKri(11.3, 'QUERY_AGING', 'flat', 0.9),
    PROTOCOL_DEVIATION_RATE: makeKri(2.4, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.22),
    ENROLLMENT_RATE: makeKri(74.3, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(92.1, 'DATA_ENTRY_TIMELINESS', 'flat', 1.2),
    MISSED_VISIT_RATE: makeKri(8.6, 'MISSED_VISIT_RATE', 'flat', 0.7),
    SAE_UNDERREPORTING: makeKri(0.86, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(98.2, 'IC_COMPLIANCE', 'flat', 0.5),
  },
  'SITE-003-03': {
    AE_REPORTING_RATE: makeKri(75.6, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(20.3, 'QUERY_AGING', 'flat', 1.4),
    PROTOCOL_DEVIATION_RATE: makeKri(4.7, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.37),
    ENROLLMENT_RATE: makeKri(58.8, 'ENROLLMENT_RATE', 'flat', 2.3),
    DATA_ENTRY_TIMELINESS: makeKri(79.7, 'DATA_ENTRY_TIMELINESS', 'flat', 1.9),
    MISSED_VISIT_RATE: makeKri(18.9, 'MISSED_VISIT_RATE', 'flat', 1.2),
    SAE_UNDERREPORTING: makeKri(0.65, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(93.4, 'IC_COMPLIANCE', 'flat', 0.9),
  },
  'SITE-003-04': {
    AE_REPORTING_RATE: makeKri(91.5, 'AE_REPORTING_RATE', 'flat', 1.4),
    QUERY_AGING: makeKri(9.7, 'QUERY_AGING', 'flat', 0.8),
    PROTOCOL_DEVIATION_RATE: makeKri(2.0, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.18),
    ENROLLMENT_RATE: makeKri(80.8, 'ENROLLMENT_RATE', 'flat', 1.6),
    DATA_ENTRY_TIMELINESS: makeKri(94.6, 'DATA_ENTRY_TIMELINESS', 'flat', 1),
    MISSED_VISIT_RATE: makeKri(6.1, 'MISSED_VISIT_RATE', 'flat', 0.5),
    SAE_UNDERREPORTING: makeKri(0.92, 'SAE_UNDERREPORTING', 'flat', 0.02),
    IC_COMPLIANCE: makeKri(99.1, 'IC_COMPLIANCE', 'flat', 0.3),
  },
  'SITE-003-05': {
    AE_REPORTING_RATE: makeKri(82.3, 'AE_REPORTING_RATE', 'flat', 1.9),
    QUERY_AGING: makeKri(16.1, 'QUERY_AGING', 'flat', 1.1),
    PROTOCOL_DEVIATION_RATE: makeKri(3.7, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.3),
    ENROLLMENT_RATE: makeKri(65.4, 'ENROLLMENT_RATE', 'flat', 2.2),
    DATA_ENTRY_TIMELINESS: makeKri(86.8, 'DATA_ENTRY_TIMELINESS', 'flat', 1.4),
    MISSED_VISIT_RATE: makeKri(14.2, 'MISSED_VISIT_RATE', 'flat', 0.9),
    SAE_UNDERREPORTING: makeKri(0.78, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(96.0, 'IC_COMPLIANCE', 'flat', 0.7),
  },
  'SITE-003-06': {
    AE_REPORTING_RATE: makeKri(70.7, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(21.6, 'QUERY_AGING', 'worsening', 1.5),
    PROTOCOL_DEVIATION_RATE: makeKri(5.2, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.4),
    ENROLLMENT_RATE: makeKri(51.5, 'ENROLLMENT_RATE', 'flat', 2.5),
    DATA_ENTRY_TIMELINESS: makeKri(75.9, 'DATA_ENTRY_TIMELINESS', 'flat', 2),
    MISSED_VISIT_RATE: makeKri(22.4, 'MISSED_VISIT_RATE', 'flat', 1.3),
    SAE_UNDERREPORTING: makeKri(0.54, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(90.2, 'IC_COMPLIANCE', 'flat', 1.1),
  },
  'SITE-003-07': {
    AE_REPORTING_RATE: makeKri(95.3, 'AE_REPORTING_RATE', 'flat', 1.1),
    QUERY_AGING: makeKri(7.2, 'QUERY_AGING', 'flat', 0.6),
    PROTOCOL_DEVIATION_RATE: makeKri(1.5, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.15),
    ENROLLMENT_RATE: makeKri(91.2, 'ENROLLMENT_RATE', 'flat', 1.3),
    DATA_ENTRY_TIMELINESS: makeKri(97.1, 'DATA_ENTRY_TIMELINESS', 'flat', 0.9),
    MISSED_VISIT_RATE: makeKri(4.3, 'MISSED_VISIT_RATE', 'flat', 0.4),
    SAE_UNDERREPORTING: makeKri(0.94, 'SAE_UNDERREPORTING', 'flat', 0.02),
    IC_COMPLIANCE: makeKri(100, 'IC_COMPLIANCE', 'flat', 0),
  },
  'SITE-003-08': {
    AE_REPORTING_RATE: makeKri(84.8, 'AE_REPORTING_RATE', 'flat', 1.7),
    QUERY_AGING: makeKri(14.8, 'QUERY_AGING', 'flat', 1),
    PROTOCOL_DEVIATION_RATE: makeKri(3.5, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.28),
    ENROLLMENT_RATE: makeKri(67.9, 'ENROLLMENT_RATE', 'flat', 2.1),
    DATA_ENTRY_TIMELINESS: makeKri(88.4, 'DATA_ENTRY_TIMELINESS', 'flat', 1.3),
    MISSED_VISIT_RATE: makeKri(12.7, 'MISSED_VISIT_RATE', 'flat', 0.9),
    SAE_UNDERREPORTING: makeKri(0.80, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(96.7, 'IC_COMPLIANCE', 'flat', 0.6),
  },
  'SITE-003-09': {
    AE_REPORTING_RATE: makeKri(77.9, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(18.7, 'QUERY_AGING', 'flat', 1.3),
    PROTOCOL_DEVIATION_RATE: makeKri(4.3, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.33),
    ENROLLMENT_RATE: makeKri(60.9, 'ENROLLMENT_RATE', 'flat', 2.3),
    DATA_ENTRY_TIMELINESS: makeKri(81.6, 'DATA_ENTRY_TIMELINESS', 'flat', 1.7),
    MISSED_VISIT_RATE: makeKri(16.8, 'MISSED_VISIT_RATE', 'flat', 1.1),
    SAE_UNDERREPORTING: makeKri(0.70, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(94.1, 'IC_COMPLIANCE', 'flat', 0.8),
  },
  'SITE-003-10': {
    AE_REPORTING_RATE: makeKri(90.6, 'AE_REPORTING_RATE', 'flat', 1.4),
    QUERY_AGING: makeKri(10.4, 'QUERY_AGING', 'flat', 0.8),
    PROTOCOL_DEVIATION_RATE: makeKri(2.2, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.2),
    ENROLLMENT_RATE: makeKri(77.4, 'ENROLLMENT_RATE', 'flat', 1.9),
    DATA_ENTRY_TIMELINESS: makeKri(93.8, 'DATA_ENTRY_TIMELINESS', 'flat', 1.1),
    MISSED_VISIT_RATE: makeKri(7.6, 'MISSED_VISIT_RATE', 'flat', 0.6),
    SAE_UNDERREPORTING: makeKri(0.88, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(98.9, 'IC_COMPLIANCE', 'flat', 0.4),
  },
  'SITE-003-11': {
    AE_REPORTING_RATE: makeKri(73.2, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(21.2, 'QUERY_AGING', 'flat', 1.4),
    PROTOCOL_DEVIATION_RATE: makeKri(5.0, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.4),
    ENROLLMENT_RATE: makeKri(53.7, 'ENROLLMENT_RATE', 'flat', 2.4),
    DATA_ENTRY_TIMELINESS: makeKri(77.8, 'DATA_ENTRY_TIMELINESS', 'flat', 1.9),
    MISSED_VISIT_RATE: makeKri(20.6, 'MISSED_VISIT_RATE', 'flat', 1.3),
    SAE_UNDERREPORTING: makeKri(0.57, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(91.6, 'IC_COMPLIANCE', 'flat', 1),
  },
  'SITE-003-12': {
    AE_REPORTING_RATE: makeKri(86.1, 'AE_REPORTING_RATE', 'flat', 1.7),
    QUERY_AGING: makeKri(13.6, 'QUERY_AGING', 'flat', 1),
    PROTOCOL_DEVIATION_RATE: makeKri(3.1, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.25),
    ENROLLMENT_RATE: makeKri(70.6, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(89.9, 'DATA_ENTRY_TIMELINESS', 'flat', 1.2),
    MISSED_VISIT_RATE: makeKri(11.4, 'MISSED_VISIT_RATE', 'flat', 0.8),
    SAE_UNDERREPORTING: makeKri(0.82, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(97.3, 'IC_COMPLIANCE', 'flat', 0.5),
  },
  'SITE-003-13': {
    AE_REPORTING_RATE: makeKri(92.4, 'AE_REPORTING_RATE', 'flat', 1.3),
    QUERY_AGING: makeKri(8.6, 'QUERY_AGING', 'flat', 0.7),
    PROTOCOL_DEVIATION_RATE: makeKri(1.8, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.17),
    ENROLLMENT_RATE: makeKri(83.7, 'ENROLLMENT_RATE', 'flat', 1.5),
    DATA_ENTRY_TIMELINESS: makeKri(95.2, 'DATA_ENTRY_TIMELINESS', 'flat', 1),
    MISSED_VISIT_RATE: makeKri(5.5, 'MISSED_VISIT_RATE', 'flat', 0.5),
    SAE_UNDERREPORTING: makeKri(0.91, 'SAE_UNDERREPORTING', 'flat', 0.02),
    IC_COMPLIANCE: makeKri(99.4, 'IC_COMPLIANCE', 'flat', 0.3),
  },
  'SITE-003-14': {
    AE_REPORTING_RATE: makeKri(80.4, 'AE_REPORTING_RATE', 'flat', 1.9),
    QUERY_AGING: makeKri(16.8, 'QUERY_AGING', 'flat', 1.2),
    PROTOCOL_DEVIATION_RATE: makeKri(3.9, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.31),
    ENROLLMENT_RATE: makeKri(63.2, 'ENROLLMENT_RATE', 'flat', 2.2),
    DATA_ENTRY_TIMELINESS: makeKri(85.6, 'DATA_ENTRY_TIMELINESS', 'flat', 1.5),
    MISSED_VISIT_RATE: makeKri(15.3, 'MISSED_VISIT_RATE', 'flat', 1),
    SAE_UNDERREPORTING: makeKri(0.75, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(95.3, 'IC_COMPLIANCE', 'flat', 0.7),
  },
  'SITE-003-15': {
    AE_REPORTING_RATE: makeKri(67.3, 'AE_REPORTING_RATE', 'worsening', 2.5),
    QUERY_AGING: makeKri(25.7, 'QUERY_AGING', 'worsening', 1.8),
    PROTOCOL_DEVIATION_RATE: makeKri(6.1, 'PROTOCOL_DEVIATION_RATE', 'worsening', 0.45),
    ENROLLMENT_RATE: makeKri(44.8, 'ENROLLMENT_RATE', 'worsening', 2.5),
    DATA_ENTRY_TIMELINESS: makeKri(70.4, 'DATA_ENTRY_TIMELINESS', 'worsening', 2.2),
    MISSED_VISIT_RATE: makeKri(24.9, 'MISSED_VISIT_RATE', 'flat', 1.4),
    SAE_UNDERREPORTING: makeKri(0.46, 'SAE_UNDERREPORTING', 'worsening', 0.04),
    IC_COMPLIANCE: makeKri(88.6, 'IC_COMPLIANCE', 'flat', 1.2),
  },
  'SITE-003-16': {
    AE_REPORTING_RATE: makeKri(89.7, 'AE_REPORTING_RATE', 'flat', 1.5),
    QUERY_AGING: makeKri(10.9, 'QUERY_AGING', 'flat', 0.8),
    PROTOCOL_DEVIATION_RATE: makeKri(2.6, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.23),
    ENROLLMENT_RATE: makeKri(75.9, 'ENROLLMENT_RATE', 'flat', 1.8),
    DATA_ENTRY_TIMELINESS: makeKri(92.7, 'DATA_ENTRY_TIMELINESS', 'flat', 1.1),
    MISSED_VISIT_RATE: makeKri(8.8, 'MISSED_VISIT_RATE', 'flat', 0.7),
    SAE_UNDERREPORTING: makeKri(0.85, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(97.8, 'IC_COMPLIANCE', 'flat', 0.5),
  },
  'SITE-003-17': {
    AE_REPORTING_RATE: makeKri(83.5, 'AE_REPORTING_RATE', 'flat', 1.8),
    QUERY_AGING: makeKri(15.4, 'QUERY_AGING', 'flat', 1.1),
    PROTOCOL_DEVIATION_RATE: makeKri(3.6, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.29),
    ENROLLMENT_RATE: makeKri(66.7, 'ENROLLMENT_RATE', 'flat', 2.1),
    DATA_ENTRY_TIMELINESS: makeKri(87.9, 'DATA_ENTRY_TIMELINESS', 'flat', 1.3),
    MISSED_VISIT_RATE: makeKri(13.1, 'MISSED_VISIT_RATE', 'flat', 0.9),
    SAE_UNDERREPORTING: makeKri(0.79, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(96.4, 'IC_COMPLIANCE', 'flat', 0.6),
  },
  'SITE-003-18': {
    AE_REPORTING_RATE: makeKri(78.6, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(19.4, 'QUERY_AGING', 'flat', 1.3),
    PROTOCOL_DEVIATION_RATE: makeKri(4.4, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.34),
    ENROLLMENT_RATE: makeKri(59.3, 'ENROLLMENT_RATE', 'flat', 2.3),
    DATA_ENTRY_TIMELINESS: makeKri(82.2, 'DATA_ENTRY_TIMELINESS', 'flat', 1.7),
    MISSED_VISIT_RATE: makeKri(17.5, 'MISSED_VISIT_RATE', 'flat', 1.1),
    SAE_UNDERREPORTING: makeKri(0.69, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(93.8, 'IC_COMPLIANCE', 'flat', 0.8),
  },
  'SITE-003-19': {
    AE_REPORTING_RATE: makeKri(93.8, 'AE_REPORTING_RATE', 'flat', 1.2),
    QUERY_AGING: makeKri(8.1, 'QUERY_AGING', 'flat', 0.6),
    PROTOCOL_DEVIATION_RATE: makeKri(1.7, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.16),
    ENROLLMENT_RATE: makeKri(85.2, 'ENROLLMENT_RATE', 'flat', 1.4),
    DATA_ENTRY_TIMELINESS: makeKri(96.4, 'DATA_ENTRY_TIMELINESS', 'flat', 0.9),
    MISSED_VISIT_RATE: makeKri(4.8, 'MISSED_VISIT_RATE', 'flat', 0.4),
    SAE_UNDERREPORTING: makeKri(0.93, 'SAE_UNDERREPORTING', 'flat', 0.02),
    IC_COMPLIANCE: makeKri(99.7, 'IC_COMPLIANCE', 'flat', 0.2),
  },
  'SITE-003-20': {
    AE_REPORTING_RATE: makeKri(85.9, 'AE_REPORTING_RATE', 'flat', 1.6),
    QUERY_AGING: makeKri(13.1, 'QUERY_AGING', 'flat', 0.9),
    PROTOCOL_DEVIATION_RATE: makeKri(3.3, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.26),
    ENROLLMENT_RATE: makeKri(72.0, 'ENROLLMENT_RATE', 'flat', 2),
    DATA_ENTRY_TIMELINESS: makeKri(90.1, 'DATA_ENTRY_TIMELINESS', 'flat', 1.2),
    MISSED_VISIT_RATE: makeKri(10.9, 'MISSED_VISIT_RATE', 'flat', 0.8),
    SAE_UNDERREPORTING: makeKri(0.83, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(97.6, 'IC_COMPLIANCE', 'flat', 0.5),
  },
  'SITE-003-21': {
    AE_REPORTING_RATE: makeKri(76.1, 'AE_REPORTING_RATE', 'flat', 2),
    QUERY_AGING: makeKri(20.8, 'QUERY_AGING', 'flat', 1.4),
    PROTOCOL_DEVIATION_RATE: makeKri(4.8, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.38),
    ENROLLMENT_RATE: makeKri(56.4, 'ENROLLMENT_RATE', 'flat', 2.4),
    DATA_ENTRY_TIMELINESS: makeKri(80.3, 'DATA_ENTRY_TIMELINESS', 'flat', 1.8),
    MISSED_VISIT_RATE: makeKri(19.2, 'MISSED_VISIT_RATE', 'flat', 1.2),
    SAE_UNDERREPORTING: makeKri(0.61, 'SAE_UNDERREPORTING', 'flat', 0.04),
    IC_COMPLIANCE: makeKri(92.5, 'IC_COMPLIANCE', 'flat', 0.9),
  },
  'SITE-003-22': {
    AE_REPORTING_RATE: makeKri(87.4, 'AE_REPORTING_RATE', 'flat', 1.7),
    QUERY_AGING: makeKri(12.7, 'QUERY_AGING', 'flat', 0.9),
    PROTOCOL_DEVIATION_RATE: makeKri(2.9, 'PROTOCOL_DEVIATION_RATE', 'flat', 0.24),
    ENROLLMENT_RATE: makeKri(68.8, 'ENROLLMENT_RATE', 'flat', 2.1),
    DATA_ENTRY_TIMELINESS: makeKri(91.4, 'DATA_ENTRY_TIMELINESS', 'flat', 1.2),
    MISSED_VISIT_RATE: makeKri(9.7, 'MISSED_VISIT_RATE', 'flat', 0.7),
    SAE_UNDERREPORTING: makeKri(0.84, 'SAE_UNDERREPORTING', 'flat', 0.03),
    IC_COMPLIANCE: makeKri(98.1, 'IC_COMPLIANCE', 'flat', 0.4),
  },
}
