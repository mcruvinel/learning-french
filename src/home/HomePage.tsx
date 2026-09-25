import { Link, useNavigate } from 'react-router-dom'
import { lessons } from '../lessons'
import { restartLesson } from '../progress/progress'
import { useProgress } from '../progress/useProgress'
import { BackupActions } from './BackupActions'
import { currentLesson } from './currentLesson'
import './Home.css'

export function HomePage() {
  const { progress, update } = useProgress()
  const navigate = useNavigate()
  const lesson = currentLesson(lessons, progress)
  const completed = lessons.filter((l) => progress.lessons[l.id]?.completedAt)

  function restart(lessonId: string) {
    if (!window.confirm('Recomeçar a aula do início? A conclusão anterior continua registrada.')) return
    update((s) => restartLesson(s, lessonId, new Date().toISOString()))
    navigate(`/lesson/${lessonId}`)
  }

  const lp = lesson ? progress.lessons[lesson.id] : undefined
  const runDone = lp?.status === 'completed'
  const stepCount = lesson?.steps.length ?? 0
  const stepNumber = lp ? Math.min(lp.stepIndex + 1, stepCount) : 0
  const cta = !lp ? 'Começar' : runDone ? 'Rever' : 'Continuar'

  return (
    <main className="page home">
      <header className="home-header">
        <p className="eyebrow">Learning French</p>
        <h1 className="home-title serif">Bonjour, Matheus.</h1>
      </header>

      <section className="home-status" aria-label="Seu progresso">
        <div>
          <p className="home-status__value">
            {completed.length}/{lessons.length}
          </p>
          <p className="home-status__label">aulas concluídas</p>
        </div>
        <div>
          <p className="home-status__value">{lesson ? `Aula ${lesson.number}` : '—'}</p>
          <p className="home-status__label">aula atual</p>
        </div>
      </section>

      {lesson && (
        <section className="lesson-card" aria-labelledby="current-lesson-title">
          <p className="eyebrow">
            Aula {lesson.number} · {lesson.estimatedMinutes} min
          </p>
          <h2 id="current-lesson-title" className="lesson-card__title serif" lang="fr">
            {lesson.title}
          </h2>
          <p className="muted">{lesson.subtitle}</p>

          {lp && (
            <div className="lesson-card__progress">
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: runDone ? '100%' : `${(lp.stepIndex / stepCount) * 100}%` }}
                />
              </div>
              <p className="lesson-card__meta">
                {runDone
                  ? `Concluída em ${formatDate(lp.completedAt)}`
                  : `Passo ${stepNumber} de ${stepCount}`}
              </p>
            </div>
          )}

          <div className="lesson-card__actions">
            {runDone ? (
              <>
                <Link className="btn btn--primary" to={`/lesson/${lesson.id}/notes`}>
                  Notas da Aula {lesson.number}
                </Link>
                <Link className="btn btn--secondary" to={`/lesson/${lesson.id}`}>
                  {cta} Aula {lesson.number}
                </Link>
                <button type="button" className="btn btn--ghost" onClick={() => restart(lesson.id)}>
                  Refazer do início
                </button>
              </>
            ) : (
              <Link className="btn btn--primary" to={`/lesson/${lesson.id}`}>
                {cta} Aula {lesson.number}
              </Link>
            )}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section aria-labelledby="completed-title">
          <h2 id="completed-title" className="home-section-title">
            Concluídas
          </h2>
          <ul className="done-list">
            {completed.map((l) => (
              <li key={l.id}>
                <Link to={`/lesson/${l.id}/notes`} className="done-item">
                  <span>
                    <span className="done-item__num">Aula {l.number}</span>
                    <span className="serif" lang="fr">
                      {l.title}
                    </span>
                  </span>
                  <span className="muted small">{formatDate(progress.lessons[l.id]?.completedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {runDone && lessons.length === completed.length && (
        <p className="home-next muted">
          A próxima aula chega quando o currículo avançar. Enquanto isso: use as frases de hoje em
          voz alta.
        </p>
      )}

      <BackupActions prominent={Object.keys(progress.lessons).length === 0} />

      <footer className="home-footer">
        v{__APP_VERSION__} · progresso salvo neste aparelho; use o backup para levar a outro
      </footer>
    </main>
  )
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
