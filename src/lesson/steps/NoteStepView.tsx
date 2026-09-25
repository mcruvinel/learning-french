import type { NoteStep } from '../../lessons/types'
import type { StepProps } from '../stepProps'
import { StepFooter } from '../StepFooter'

export function NoteStepView({ step, onContinue }: StepProps<NoteStep>) {
  return (
    <>
      <div className="step-body">
        <p className="eyebrow">Para saber</p>
        <h1 className="step-title serif" tabIndex={-1}>
          {step.title}
        </h1>
        <ul className="note-list">
          {step.paragraphs.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <StepFooter label="Continuar" onClick={onContinue} />
    </>
  )
}
