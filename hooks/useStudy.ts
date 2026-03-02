import { useMemo } from 'react'
import { studies } from '@/data/studies'
import { Study } from '@/lib/types'

export function useStudy(studyId: string): Study | undefined {
  return useMemo(() => studies.find(s => s.id === studyId), [studyId])
}

export function useStudies() {
  return studies
}
