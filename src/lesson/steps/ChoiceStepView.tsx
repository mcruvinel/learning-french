import { ListenButtons } from '../../components/ListenButtons'
import type { ChoiceStep } from '../../lessons/types'
import type { StepProps } from '../stepProps'
import { StepFooter } from '../StepFooter'

/** Recognition: one attempt, then the right answer is shown. */
export function ChoiceStepView({ step, result, onResult, onContinue }: StepProps<ChoiceStep>) {
  const answered = result?.kind === 'choice' ? result : undefined
  const correctOption = step.options[step.answerIndex]
  const optionLang = step.promptLang === 'fr' ? 'pt-BR' : 'fr'

  return (
    <>
      <div className="step-body">
        <p className="eyebrow">Reconhecer</p>
        <h1 className="step-instruction" tabIndex={-1}>
          {step.instruction}
        </h1>
        <p className="prompt serif" lang={step.promptLang === 'fr' ? 'fr' : 'pt-BR'}>
          {step.prompt}
        </p>
        {step.promptLang === 'fr' && <ListenButtons text={step.prompt} withSlow={false} />}

        <div className="options" role="group" aria-label="Opções">
          {step.options.map((option, i) => {
            let state = ''
            if (answered && i === step.answerIndex) state = 'option--correct'
            else if (answered && i === answered.selected) state = 'option--wrong'
            return (
              <button
                key={option}
                type="button"
                lang={optionLang}
                className={`option ${state}`}
                disabled={answered !== undefined}
                onClick={() =>
                  onResult({ kind: 'choice', selected: i, correct: i === step.answerIndex })
                }
              >
                {option}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className={`feedback ${answered.correct ? 'feedback--ok' : 'feedback--bad'}`} role="status">
            <p className="feedback__title">
              {answered.correct ? 'Certo.' : `Resposta: ${correctOption ?? ''}`}
            </p>
            {step.explanation && <p>{step.explanation}</p>}
          </div>
        )}
      </div>
      <StepFooter label="Continuar" onClick={onContinue} disabled={!answered} />
    </>
  )
}
