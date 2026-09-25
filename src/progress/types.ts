export type RecallOutcome =
  /** Same spelling as the answer, ignoring case and punctuation. */
  | 'exact'
  /** Right answer with missing accents, apostrophes or one typo. Counts as correct. */
  | 'close'
  | 'wrong'
  /** The learner asked to see the answer without trying. */
  | 'revealed'

export type StepResult =
  | { kind: 'choice'; selected: number; correct: boolean }
  | { kind: 'recall'; answer: string; outcome: RecallOutcome }
  /** Phrase ids the learner confirmed saying aloud. Self-reported. */
  | { kind: 'speak'; spoken: string[] }
  /**
   * `reached` is how many turns are revealed. `firstTry` maps the index of
   * each answered "you" turn to whether the first pick was right.
   */
  | { kind: 'scenario'; reached: number; firstTry: Record<string, boolean> }

export type SelfRating = 'hard' | 'ok' | 'easy'

export type LessonProgress = {
  lessonId: string
  /** State of the current run through the lesson. */
  status: 'in-progress' | 'completed'
  stepIndex: number
  startedAt: string
  updatedAt: string
  /** Most recent completion. Survives restarting the lesson. */
  completedAt: string | null
  timesCompleted: number
  results: Record<string, StepResult>
  selfRating: SelfRating | null
  difficultPhraseIds: string[]
  /** Free-text reflection written in the recap; goes into the notes. */
  reflection: string
}

export type ProgressState = {
  version: 1
  lessons: Record<string, LessonProgress>
}
