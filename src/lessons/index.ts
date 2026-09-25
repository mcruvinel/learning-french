import { lesson01 } from './lesson-01'
import type { Lesson, Phrase } from './types'

/**
 * Every lesson in the course, in order. Adding Lesson 2 means adding a
 * content file next to lesson-01.ts and one entry here.
 */
export const lessons: readonly Lesson[] = [lesson01]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id)
}

export function getPhrase(lesson: Lesson, phraseId: string): Phrase {
  const phrase = lesson.phrases.find((p) => p.id === phraseId)
  if (!phrase) {
    // Content integrity is covered by lessons.test.ts; reaching this is a bug.
    throw new Error(`Phrase "${phraseId}" not found in ${lesson.id}`)
  }
  return phrase
}
