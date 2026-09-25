import { parseProgress } from './parse'
import type { ProgressState } from './types'

/**
 * Progress backup file (.json). The only way progress moves between devices:
 * there is no server. Saved when a lesson is completed (or on demand),
 * imported by picking the file on the Home screen.
 */

const APP = 'learning-french'

type BackupFile = {
  app: typeof APP
  kind: 'progress-backup'
  exportedAt: string
  progress: ProgressState
}

export function serializeBackup(progress: ProgressState, now: Date): string {
  const file: BackupFile = { app: APP, kind: 'progress-backup', exportedAt: now.toISOString(), progress }
  return JSON.stringify(file, null, 2)
}

export function backupFileName(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${APP}-progresso-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`
}

/**
 * Reads a backup file's text. Accepts the wrapped format above or a bare
 * ProgressState. Returns null when nothing usable is inside.
 */
export function readBackup(text: string): ProgressState | null {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return null
  }
  const candidate =
    typeof raw === 'object' && raw !== null && 'progress' in raw ? (raw as { progress: unknown }).progress : raw
  const state = parseProgress(candidate)
  return Object.keys(state.lessons).length > 0 ? state : null
}

/** Per lesson, the most recently updated version wins; lessons on one side only are kept. */
export function mergeProgress(local: ProgressState, incoming: ProgressState): ProgressState {
  const lessons = { ...local.lessons }
  for (const [id, theirs] of Object.entries(incoming.lessons)) {
    const ours = lessons[id]
    if (!ours || Date.parse(theirs.updatedAt) > Date.parse(ours.updatedAt)) lessons[id] = theirs
  }
  return { version: 1, lessons }
}
