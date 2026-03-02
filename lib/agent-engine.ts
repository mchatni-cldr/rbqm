import { AgentActivity } from './types'

/**
 * Agent simulation engine — pure functions for deterministic playback
 */

export interface AgentSimulationState {
  visibleActivities: AgentActivity[]
  isThinking: boolean
  currentIndex: number
  isComplete: boolean
}

/**
 * Compute cumulative delay for each activity entry
 */
export function computeActivityDelays(activities: AgentActivity[], speedMultiplier = 1): number[] {
  let cumulative = 0
  return activities.map(a => {
    const delay = cumulative
    cumulative += (a.durationMs ?? 2000) / speedMultiplier
    return delay
  })
}

/**
 * Get the agent "status" based on current visible activities
 */
export type AgentStatus = 'IDLE' | 'SCANNING' | 'INVESTIGATING' | 'ALERT'

export interface AgentStatusInfo {
  status: AgentStatus
  message: string
  studyId?: string
  signalId?: string
}

export function getAgentStatusInfo(
  isThinking: boolean,
  lastActivity: AgentActivity | undefined,
  pendingSignalsCount: number
): AgentStatusInfo {
  if (!lastActivity) {
    return {
      status: 'IDLE',
      message: 'Agent monitoring active — next scan in 4h 23m',
    }
  }

  if (isThinking) {
    if (lastActivity.actionType === 'SCAN') {
      return {
        status: 'SCANNING',
        message: `Scanning sites across 8 KRIs...`,
        studyId: lastActivity.studyId,
      }
    }
    if (lastActivity.signalId) {
      return {
        status: 'INVESTIGATING',
        message: `Investigating ${lastActivity.signalId}...`,
        studyId: lastActivity.studyId,
        signalId: lastActivity.signalId,
      }
    }
  }

  if (pendingSignalsCount > 0) {
    return {
      status: 'ALERT',
      message: `${pendingSignalsCount} new signal${pendingSignalsCount > 1 ? 's' : ''} require human review`,
    }
  }

  return {
    status: 'IDLE',
    message: 'Agent monitoring active — next scan in 4h 23m',
  }
}

/**
 * Format confidence with color class
 */
export function confidenceClass(confidence: number): string {
  if (confidence >= 90) return 'text-green-600'
  if (confidence >= 75) return 'text-amber-600'
  return 'text-red-600'
}

/**
 * Get action type color and label
 */
export const ACTION_LABELS: Record<string, string> = {
  SCAN: 'Scanning',
  DETECT: 'Signal Detected',
  INVESTIGATE: 'Investigating',
  CROSS_REFERENCE: 'Cross-referencing',
  ANALYZE: 'Analyzing',
  CONCLUDE: 'Conclusion',
  RECOMMEND: 'CAPA Issued',
  ESCALATE: 'Escalation',
}
