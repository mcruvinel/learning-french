import { PhraseCard } from '../../components/PhraseCard'
import { getPhrase } from '../../lessons'
import type { PhrasesStep } from '../../lessons/types'
import type { StepProps } from '../stepProps'
import { StepFooter } from '../StepFooter'

export function PhrasesStepView({ lesson, step, onContinue }: StepProps<PhrasesStep>) {
  return (
    <>
      <div className="step-body">
        <p className="eyebrow">Frases novas</p>
        <h1 className="step-title serif" tabIndex={-1}>
          {step.title}
        </h1>
        {step.lead && <p className="step-text">{step.lead}</p>}
        <div className="stack">
          {step.phraseIds.map((id) => (
            <PhraseCard key={id} phrase={getPhrase(lesson, id)} />
          ))}
        </div>
      </div>
      <StepFooter label="Continuar" onClick={onContinue} />
    </>
  )
}
