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
  const [speedMultiplier, setSpeedMultiplier] = useState(5) // default 5x for demo
  const [running, setRunning] = useState(autoStart)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
  }, [])

  const replay = useCallback(() => {
    clearAllTimeouts()
    setVisibleActivities([])
    setIsThinking(false)
    setIsComplete(false)
    setCurrentIndex(0)
    setRunning(true)
  }, [clearAllTimeouts])

  useEffect(() => {
    if (!running || activities.length === 0) return

    clearAllTimeouts()

    let cumulative = 0

    activities.forEach((activity, index) => {
      const showAt = cumulative
      const thinkDuration = (activity.durationMs ?? 2000) / speedMultiplier

      // Show thinking state before this activity
      const t1 = setTimeout(() => {
        setIsThinking(true)
        setCurrentIndex(index)
      }, showAt)

      // Reveal the activity after thinking
      const t2 = setTimeout(() => {
        setIsThinking(false)
        setVisibleActivities(prev => [...prev, activity])
        if (index === activities.length - 1) {
          setIsComplete(true)
          setRunning(false)
        }
      }, showAt + thinkDuration)

      timeoutsRef.current.push(t1, t2)
      cumulative += thinkDuration + 300 // small gap between entries
    })

    return () => clearAllTimeouts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, activities, speedMultiplier])

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
