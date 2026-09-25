import { useRef, useState, type ChangeEvent } from 'react'
import { mergeProgress, readBackup } from '../progress/backup'
import { BACKUP_MESSAGES, saveProgressBackup } from '../progress/saveBackup'
import { useProgress } from '../progress/useProgress'

type Status = { ok: boolean; message: string } | null

/**
 * Import / save the progress backup (.json). Progress lives only in this
 * browser; this file is how it moves between devices.
 */
export function BackupActions({ prominent }: { prominent: boolean }) {
  const { progress, update } = useProgress()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>(null)
  const hasProgress = Object.keys(progress.lessons).length > 0

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target
    const file = input.files?.[0]
    input.value = '' // allow picking the same file again
    if (!file) return
    const incoming = readBackup(await file.text())
    if (!incoming) {
      setStatus({ ok: false, message: 'Arquivo não reconhecido como backup do Learning French.' })
      return
    }
    update((s) => mergeProgress(s, incoming))
    const n = Object.keys(incoming.lessons).length
    setStatus({ ok: true, message: `Progresso importado (${n} ${n === 1 ? 'aula' : 'aulas'}). Vale o mais recente de cada aula.` })
  }

  async function save() {
    const result = await saveProgressBackup(progress)
    setStatus({ ok: result === 'saved', message: BACKUP_MESSAGES[result] })
  }

  return (
    <section className={prominent ? 'backup backup--prominent' : 'backup'} aria-label="Backup do progresso">
      {prominent && (
        <p className="muted small">Já estudou em outro aparelho? Importe o backup para continuar de onde parou.</p>
      )}
      <div className="backup__actions">
        <button
          type="button"
          className={prominent ? 'btn btn--secondary' : 'btn btn--ghost'}
          onClick={() => inputRef.current?.click()}
        >
          Importar progresso (.json)
        </button>
        {hasProgress && (
          <button type="button" className="btn btn--ghost" onClick={save}>
            Salvar backup
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="visually-hidden"
        tabIndex={-1}
        aria-label="Arquivo de backup do progresso"
        onChange={importFile}
      />
      {status && (
        <p className={`feedback ${status.ok ? 'feedback--ok' : 'feedback--bad'}`} role="status">
          {status.message}
        </p>
      )}
    </section>
  )
}
