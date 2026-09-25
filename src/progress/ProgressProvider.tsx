import { useEffect, useState, type ReactNode } from 'react'
import { readStored, writeStored } from '../lib/storage'
import { parseProgress } from './parse'
import { ProgressContext } from './useProgress'

const STORAGE_KEY = 'progress'

/** Loads progress once from storage and writes it back on every change. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(() => parseProgress(readStored(STORAGE_KEY)))

  useEffect(() => {
    writeStored(STORAGE_KEY, progress)
  }, [progress])

  return <ProgressContext value={{ progress, update: setProgress }}>{children}</ProgressContext>
}
