import { createContext, useContext } from 'react'
import type { ProgressState } from './types'

export type ProgressContextValue = {
  progress: ProgressState
  /** Apply a pure transition from progress.ts; the result is persisted. */
  update: (transition: (state: ProgressState) => ProgressState) => void
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext)
  if (!value) throw new Error('useProgress must be used inside <ProgressProvider>')
  return value
}
