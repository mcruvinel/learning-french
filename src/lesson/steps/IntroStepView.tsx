import type { IntroStep } from '../../lessons/types'
import type { StepProps } from '../stepProps'
import { StepFooter } from '../StepFooter'

export function IntroStepView({ lesson, step, onContinue }: StepProps<IntroStep>) {
  return (
    <>
      <div className="step-body">
        <p className="eyebrow">
          Aula {lesson.number} · cerca de {lesson.estimatedMinutes} min
        </p>
        <h1 className="step-title serif" tabIndex={-1}>
          {lesson.title}
        </h1>
        <h2 className="step-subtitle">{step.title}</h2>
        {step.paragraphs.map((p) => (
          <p key={p} className="step-text">
            {p}
          </p>
        ))}
        <section className="card">
          <h3 className="eyebrow">No fim desta aula você consegue</h3>
          <ul className="checklist">
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
      </div>
      <StepFooter label="Começar" onClick={onContinue} />
    </>
  )
}
