'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AgentActivity } from '@/lib/types'

export interface AgentSimulationResult {
  visibleActivities: AgentActivity[]
  isThinking: boolean
  isComplete: boolean
  currentIndex: number
  replay: () => void
  speedMultiplier: number
  setSpeedMultiplier: (v: number) => void
}

export function useAgentSimulation(
  activities: AgentActivity[],
  autoStart = false
): AgentSimulationResult {
  const [visibleActivities, setVisibleActivities] = useState<AgentActivity[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  // replayCount increments trigger a fresh simulation run
  const [replayCount, setReplayCount] = useState(autoStart ? 0 : -1)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
  }, [])

  const replay = useCallback(() => {
    setReplayCount(c => c + 1)
  }, [])

  useEffect(() => {
    // replayCount < 0 means autoStart=false and replay hasn't been triggered
    if (replayCount < 0 || activities.length === 0) return

    clearAllTimeouts()
    setVisibleActivities([])
    setIsThinking(false)
    setIsComplete(false)
    setCurrentIndex(0)

    let cumulative = 0

    activities.forEach((activity, index) => {
      const showAt = cumulative
      const thinkDuration = (activity.durationMs ?? 2000) / speedMultiplier

      const t1 = setTimeout(() => {
        setIsThinking(true)
        setCurrentIndex(index)
      }, showAt)

      const t2 = setTimeout(() => {
        setIsThinking(false)
        setVisibleActivities(prev => [...prev, activity])
        if (index === activities.length - 1) {
          setIsComplete(true)
        }
      }, showAt + thinkDuration)

      timeoutsRef.current.push(t1, t2)
      cumulative += thinkDuration + 300
    })

    return () => clearAllTimeouts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayCount, activities, speedMultiplier])

  return {
    visibleActivities,
    isThinking,
    isComplete,
    currentIndex,
    replay,
    speedMultiplier,
    setSpeedMultiplier,
  }
}
