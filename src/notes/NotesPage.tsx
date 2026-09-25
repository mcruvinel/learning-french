import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { NotFound } from '../app/NotFound'
import { getLesson } from '../lessons'
import { useProgress } from '../progress/useProgress'
import { buildLessonMarkdown, notesFileName } from './lessonMarkdown'
import './Notes.css'

type Status = { kind: 'idle' } | { kind: 'ok' | 'error'; message: string }

export function NotesPage() {
  const { lessonId = '' } = useParams()
  const lesson = getLesson(lessonId)
  const { progress } = useProgress()
  const lp = lesson ? progress.lessons[lesson.id] : undefined
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const markdown = useMemo(
    () =>
      lesson ? buildLessonMarkdown(lesson, lp, { appVersion: __APP_VERSION__, now: new Date() }) : '',
    [lesson, lp],
  )

  if (!lesson) return <NotFound />
  const fileName = notesFileName(lesson)
  const canShare = typeof navigator.share === 'function'

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setStatus({ kind: 'ok', message: 'Markdown copiado. Cole numa nota nova no Obsidian.' })
    } catch {
      setStatus({ kind: 'error', message: 'Não deu para copiar. Selecione o texto abaixo e copie.' })
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    // Give Safari a moment to start the download before revoking.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus({ kind: 'ok', message: `Arquivo ${fileName} gerado.` })
  }

  async function share() {
    try {
      await navigator.share({ title: fileName, text: markdown })
    } catch {
      // Cancelling the share sheet also rejects; nothing to report.
    }
  }

  return (
    <main className="page notes">
      <header className="notes-header">
        <Link to="/" className="notes-back">
          ← Início
        </Link>
        <p className="eyebrow">Notas · Aula {lesson.number}</p>
        <h1 className="serif notes-title">Para o Obsidian</h1>
        <p className="muted small">
          Gerado a partir do que você registrou nesta aula: acertos, frases marcadas como difíceis e
          sua anotação.
          {lp?.status !== 'completed' && ' A aula ainda não foi concluída.'}
        </p>
      </header>

      <div className="notes-actions">
        <button type="button" className="btn btn--primary" onClick={copy}>
          Copiar Markdown
        </button>
        <button type="button" className="btn btn--secondary" onClick={download}>
          Baixar .md
        </button>
        {canShare && (
          <button type="button" className="btn btn--secondary" onClick={share}>
            Compartilhar
          </button>
        )}
      </div>
      {status.kind !== 'idle' && (
        <p className={`feedback ${status.kind === 'ok' ? 'feedback--ok' : 'feedback--bad'}`} role="status">
          {status.message}
        </p>
      )}

      <pre className="notes-preview" aria-label="Prévia do Markdown">
        {markdown}
      </pre>
    </main>
  )
}
