import { useEffect, useRef, useState } from 'react'
import { ListenButtons } from '../../components/ListenButtons'
import type { ScenarioStep } from '../../lessons/types'
import type { StepProps } from '../stepProps'
import { StepFooter } from '../StepFooter'

/** Index of the first "you" turn at or after `from`, or turns.length. */
function nextChoiceIndex(step: ScenarioStep, from: number): number {
  const i = step.turns.findIndex((t, idx) => idx >= from && t.who === 'you')
  return i === -1 ? step.turns.length : i
}

/**
 * Micro scenario. Lines from the other person are revealed up to the next
 * choice; a wrong pick shows feedback and lets you try again. Only the first
 * pick of each choice counts for the metrics.
 */
export function ScenarioStepView({ step, result, onResult, onContinue }: StepProps<ScenarioStep>) {
  const saved = result?.kind === 'scenario' ? result : undefined
  const reached = saved?.reached ?? nextChoiceIndex(step, 0)
  const firstTry = saved?.firstTry ?? {}
  const done = reached >= step.turns.length
  const current = step.turns[reached]

  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const choiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reached > nextChoiceIndex(step, 0)) {
      choiceRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' })
    }
  }, [reached, step])

  function pick(optionIndex: number) {
    if (current?.who !== 'you') return
    const option = current.options[optionIndex]
    if (!option) return
    const key = String(reached)
    const nextFirstTry = key in firstTry ? firstTry : { ...firstTry, [key]: option.correct }
    if (option.correct) {
      setWrongPicks([])
      onResult({ kind: 'scenario', reached: nextChoiceIndex(step, reached + 1), firstTry: nextFirstTry })
    } else {
      setWrongPicks((w) => [...w, optionIndex])
      onResult({ kind: 'scenario', reached, firstTry: nextFirstTry })
    }
  }

  const lastWrong = wrongPicks.at(-1)
  const wrongFeedback =
    current?.who === 'you' && lastWrong !== undefined ? current.options[lastWrong]?.feedback : undefined

  return (
    <>
      <div className="step-body">
        <p className="eyebrow">Situação real</p>
        <h1 className="step-title serif" tabIndex={-1}>
          {step.title}
        </h1>
        <p className="step-text muted">{step.setting}</p>

        <ol className="dialogue">
          {step.turns.slice(0, reached).map((turn, i) =>
            turn.who === 'them' ? (
              <li key={i} className="bubble bubble--them">
                <p className="bubble__speaker">{turn.speaker}</p>
                <p className="bubble__fr serif" lang="fr">
                  {turn.fr}
                </p>
                <ListenButtons text={turn.fr} withSlow={false} />
                <details className="bubble__translation">
                  <summary>Tradução</summary>
                  <p>{turn.pt}</p>
                </details>
              </li>
            ) : (
              <li key={i} className="bubble bubble--you">
                <p className="bubble__speaker">Você</p>
                <p className="bubble__fr serif" lang="fr">
                  {turn.options.find((o) => o.correct)?.fr}
                </p>
                <p className="bubble__feedback">
                  {turn.options.find((o) => o.correct)?.feedback}
                </p>
              </li>
            ),
          )}
        </ol>

        <div ref={choiceRef}>
          {current?.who === 'you' && (
            <div className="scenario-choice">
              <p className="scenario-choice__situation">{current.situation}</p>
              <div className="options" role="group" aria-label="O que você diz?">
                {current.options.map((option, i) => (
                  <button
                    key={option.fr}
                    type="button"
                    lang="fr"
                    className={`option ${wrongPicks.includes(i) ? 'option--wrong' : ''}`}
                    disabled={wrongPicks.includes(i)}
                    onClick={() => pick(i)}
                  >
                    {option.fr}
                  </button>
                ))}
              </div>
              {wrongFeedback && (
                <p className="feedback feedback--bad" role="status">
                  {wrongFeedback} Tente de novo.
                </p>
              )}
            </div>
          )}
          {done && (
            <p className="feedback feedback--ok" role="status">
              Cena completa.
            </p>
          )}
        </div>
      </div>
      <StepFooter label="Continuar" onClick={onContinue} disabled={!done} />
    </>
  )
}
