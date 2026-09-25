import { useState, type FormEvent } from 'react'
import { ListenButtons } from '../../components/ListenButtons'
import { getPhrase } from '../../lessons'
import type { RecallStep } from '../../lessons/types'
import { checkRecall } from '../answers'
import type { StepProps } from '../stepProps'
import { StepFooter } from '../StepFooter'

const OUTCOME_TEXT = {
  exact: 'Certo.',
  close: 'Certo — confira a grafia.',
  wrong: 'Ainda não.',
  revealed: 'Sem problema. Esta é a resposta:',
} as const

/** Retrieval: see Portuguese, type French from memory. One attempt. */
export function RecallStepView({ lesson, step, result, onResult, onContinue }: StepProps<RecallStep>) {
  const phrase = getPhrase(lesson, step.phraseId)
  const answered = result?.kind === 'recall' ? result : undefined
  const [draft, setDraft] = useState('')
  const [showHint, setShowHint] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    if (draft.trim() === '') return
    const outcome = checkRecall(draft, [phrase.fr, ...(step.alsoAccept ?? [])])
    onResult({ kind: 'recall', answer: draft.trim(), outcome })
  }

  const isRight = answered?.outcome === 'exact' || answered?.outcome === 'close'

  return (
    <>
      <div className="step-body">
        <p className="eyebrow">Lembrar sem olhar</p>
        <h1 className="step-instruction" tabIndex={-1}>
          Como se diz em francês?
        </h1>
        <p className="prompt serif">{step.promptPt}</p>

        {!answered && (
          <form className="recall-form" onSubmit={submit}>
            <label className="visually-hidden" htmlFor={`recall-${step.id}`}>
              Sua resposta em francês
            </label>
            <input
              id={`recall-${step.id}`}
              className="recall-input"
              type="text"
              lang="fr"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Escreva em francês"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="done"
            />
            <button type="submit" className="btn btn--secondary" disabled={draft.trim() === ''}>
              Verificar
            </button>
            <div className="recall-aux">
              {step.hint &&
                (showHint ? (
                  <p className="muted">{step.hint}</p>
                ) : (
                  <button type="button" className="btn btn--ghost" onClick={() => setShowHint(true)}>
                    Dica
                  </button>
                ))}
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => onResult({ kind: 'recall', answer: draft.trim(), outcome: 'revealed' })}
              >
                Não lembro — mostrar
              </button>
            </div>
          </form>
        )}

        {answered && (
          <div className={`feedback ${isRight ? 'feedback--ok' : 'feedback--bad'}`} role="status">
            <p className="feedback__title">{OUTCOME_TEXT[answered.outcome]}</p>
            {answered.answer && answered.outcome !== 'exact' && (
              <p>
                Você escreveu: <span lang="fr">{answered.answer}</span>
              </p>
            )}
            <p className="feedback__answer serif" lang="fr">
              {phrase.fr}
            </p>
            <ListenButtons text={phrase.fr} withSlow={false} />
            {answered.outcome !== 'exact' && (
              <p className="muted">Diga em voz alta uma vez antes de continuar.</p>
            )}
          </div>
        )}
      </div>
      <StepFooter label="Continuar" onClick={onContinue} disabled={!answered} />
    </>
  )
}
