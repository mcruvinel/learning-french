import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lessonMetrics, type Score } from '../../progress/metrics'
import {
  completeLesson,
  setReflection,
  setSelfRating,
  toggleDifficultPhrase,
} from '../../progress/progress'
import { BACKUP_MESSAGES, saveProgressBackup } from '../../progress/saveBackup'
import { useProgress } from '../../progress/useProgress'
import type { SelfRating } from '../../progress/types'
import type { RecapStep } from '../../lessons/types'
import type { StepProps } from '../stepProps'

const RATINGS: { value: SelfRating; label: string }[] = [
  { value: 'hard', label: 'Difícil' },
  { value: 'ok', label: 'Ok' },
  { value: 'easy', label: 'Fácil' },
]

/**
 * Recap: what was learned, real performance, self-assessment, completion.
 * Reads and writes progress directly because it edits several fields.
 */
export function RecapStepView({ lesson, step }: StepProps<RecapStep>) {
  const { progress, update } = useProgress()
  const [backupMessage, setBackupMessage] = useState<string | null>(null)
  const lp = progress.lessons[lesson.id]
  if (!lp) return null
  const m = lessonMetrics(lesson, lp)
  const now = () => new Date().toISOString()
  const completed = lp.status === 'completed'

  /** Completing also saves the progress backup (.json), in the same tap. */
  function complete() {
    const t = now()
    update((s) => completeLesson(s, lesson.id, t))
    void saveBackup(completeLesson(progress, lesson.id, t))
  }

  async function saveBackup(state = progress) {
    const result = await saveProgressBackup(state)
    setBackupMessage(BACKUP_MESSAGES[result])
  }

  return (
    <div className="step-body">
      <p className="eyebrow">Aula {lesson.number}</p>
      <h1 className="step-title serif" tabIndex={-1}>
        {step.title}
      </h1>

      <section className="card" aria-labelledby="recap-perf">
        <h2 id="recap-perf" className="eyebrow">
          Seu desempenho
        </h2>
        <dl className="stats">
          <Stat label="Reconhecer" score={m.recognition} />
          <Stat label="Lembrar" score={m.recall} />
          <Stat label="Falei" score={m.speaking} />
          <Stat label="Cenas" score={m.scenario} />
        </dl>
        <p className="muted small">
          Cenas: escolhas certas de primeira. Fala: autoconfirmada, o app não avalia pronúncia.
        </p>
      </section>

      <section aria-labelledby="recap-phrases">
        <h2 id="recap-phrases" className="section-title">
          O que você aprendeu
        </h2>
        <p className="muted small">Toque nas frases que ainda parecem difíceis. Elas vão para as notas.</p>
        <ul className="recap-phrases">
          {lesson.phrases.map((p) => {
            const hard = lp.difficultPhraseIds.includes(p.id)
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`recap-phrase ${hard ? 'recap-phrase--hard' : ''}`}
                  aria-pressed={hard}
                  onClick={() => update((s) => toggleDifficultPhrase(s, lesson.id, p.id, now()))}
                >
                  <span className="serif" lang="fr">
                    {p.fr}
                  </span>
                  <span className="muted">{p.pt}</span>
                  {hard && <span className="recap-phrase__flag">difícil</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="recap-rating">
        <h2 id="recap-rating" className="section-title">
          Como foi a aula?
        </h2>
        <div className="segmented" role="group" aria-labelledby="recap-rating">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              aria-pressed={lp.selfRating === r.value}
              className={`segmented__btn ${lp.selfRating === r.value ? 'segmented__btn--on' : ''}`}
              onClick={() => update((s) => setSelfRating(s, lesson.id, r.value, now()))}
            >
              {r.label}
            </button>
          ))}
        </div>
        <label className="field">
          <span className="section-title small">Anotação (opcional)</span>
          <textarea
            className="textarea"
            rows={3}
            value={lp.reflection}
            placeholder="O que travou? O que surpreendeu?"
            onChange={(e) => {
              const value = e.target.value
              update((s) => setReflection(s, lesson.id, value, now()))
            }}
          />
        </label>
      </section>

      <div className="step-footer">
        {completed ? (
          <>
            <p className="feedback feedback--ok" role="status">
              Aula {lesson.number} concluída. Bravo !
            </p>
            <p className="muted small" role="status">
              {backupMessage ?? 'Guarde o backup (.json) no iCloud Drive para continuar em outro aparelho.'}
            </p>
            <button type="button" className="btn btn--ghost" onClick={() => void saveBackup()}>
              Salvar backup do progresso
            </button>
            <Link className="btn btn--primary" to={`/lesson/${lesson.id}/notes`}>
              Ver notas para o Obsidian
            </Link>
            <Link className="btn btn--secondary" to="/">
              Voltar ao início
            </Link>
          </>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={complete}
          >
            Concluir aula e salvar backup
          </button>
        )}
      </div>
    </div>
  )
}

function Stat({ label, score }: { label: string; score: Score }) {
  return (
    <div className="stat">
      <dt>{label}</dt>
      <dd>
        {score.total === 0 ? '—' : `${score.correct}/${score.total}`}
      </dd>
    </div>
  )
}
