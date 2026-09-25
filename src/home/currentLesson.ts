import type { Lesson } from '../lessons/types'
import type { ProgressState } from '../progress/types'

/** First lesson never completed; if every lesson is done, the last one. */
export function currentLesson(lessons: readonly Lesson[], progress: ProgressState): Lesson | undefined {
  return lessons.find((l) => !progress.lessons[l.id]?.completedAt) ?? lessons.at(-1)
}
