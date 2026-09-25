import type { Lesson, LessonStep } from '../lessons/types'
import type { StepResult } from '../progress/types'

/** Contract between the lesson player and every step component. */
export type StepProps<S extends LessonStep> = {
  lesson: Lesson
  step: S
  /** What was already recorded for this step, e.g. after a refresh. */
  result: StepResult | undefined
  onResult: (result: StepResult) => void
  onContinue: () => void
}
