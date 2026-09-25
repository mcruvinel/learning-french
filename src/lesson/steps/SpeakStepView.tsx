import { ListenButtons } from '../../components/ListenButtons'
import { getPhrase } from '../../lessons'
import type { SpeakStep } from '../../lessons/types'
import type { StepProps } from '../stepProps'
import { StepFooter } from '../StepFooter'

/**
 * Speak aloud. The app cannot hear you, and does not pretend to: the learner
 * confirms each phrase. Skipping is allowed (e.g. on the metro) and recorded
 * as fewer phrases spoken.
 */
export function SpeakStepView({ lesson, step, result, onResult, onContinue }: StepProps<SpeakStep>) {
  const spoken = result?.kind === 'speak' ? result.spoken : []
  const allSpoken = step.phraseIds.every((id) => spoken.includes(id))

  function toggle(id: string) {
    const next = spoken.includes(id) ? spoken.filter((s) => s !== id) : [...spoken, id]
    onResult({ kind: 'speak', spoken: next })
  }

  return (
    <>
      <div className="step-body">
        <p className="eyebrow">Falar em voz alta</p>
        <h1 className="step-title serif" tabIndex={-1}>
          {step.title}
        </h1>
        <p className="step-text">{step.instruction}</p>
        <ul className="speak-list">
          {step.phraseIds.map((id) => {
            const phrase = getPhrase(lesson, id)
            const done = spoken.includes(id)
            return (
              <li key={id} className="speak-item">
                <div>
                  <p className="speak-item__fr serif" lang="fr">
                    {phrase.fr}
                  </p>
                  <p className="muted">{phrase.pt}</p>
                </div>
                <div className="speak-item__actions">
                  <ListenButtons text={phrase.fr} withSlow={false} />
                  <button
                    type="button"
                    className={`toggle ${done ? 'toggle--on' : ''}`}
                    aria-pressed={done}
                    onClick={() => toggle(id)}
                  >
                    {done ? 'Falei ✓' : 'Falei'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <StepFooter
        label={allSpoken ? 'Continuar' : 'Continuar sem falar tudo'}
        onClick={onContinue}
      />
    </>
  )
}
