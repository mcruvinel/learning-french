import { saveTextFile, type SaveResult } from '../lib/saveFile'
import { backupFileName, serializeBackup } from './backup'
import type { ProgressState } from './types'

export function saveProgressBackup(progress: ProgressState): Promise<SaveResult> {
  const now = new Date()
  return saveTextFile(backupFileName(now), serializeBackup(progress, now), 'application/json')
}

export const BACKUP_MESSAGES: Record<SaveResult, string> = {
  saved: 'Backup do progresso salvo. Guarde o .json no iCloud Drive para continuar em outro aparelho.',
  cancelled: 'Backup não salvo. Você pode salvar de novo a qualquer momento.',
  failed: 'Não deu para salvar o backup neste navegador.',
}
