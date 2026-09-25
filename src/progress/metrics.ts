import type { Lesson } from '../lessons/types'
import type { LessonProgress } from './types'

export type Score = { correct: number; total: number }

export type LessonMetrics = {
  /** Choice steps answered correctly on the (single) attempt. */
  recognition: Score
  /** Recall steps: exact + close count as correct; `total` counts answered steps. */
  recall: Score & { exact: number; close: number; wrong: number; revealed: number }
  /** Phrases confirmed as spoken aloud, out of all phrases in speak steps. */
  speaking: Score
  /** Scenario choices right on the first pick, out of choices answered. */
  scenario: Score
  /** Wall-clock minutes from start to completion, pauses included. */
  minutes: number | null
}

/**
 * Derived only from what was actually recorded. Unanswered steps are not
 * counted as wrong, and nothing is estimated.
 */
export function lessonMetrics(lesson: Lesson, progress: LessonProgress): LessonMetrics {
  const m: LessonMetrics = {
    recognition: { correct: 0, total: 0 },
    recall: { correct: 0, total: 0, exact: 0, close: 0, wrong: 0, revealed: 0 },
    speaking: { correct: 0, total: 0 },
    scenario: { correct: 0, total: 0 },
    minutes: null,
  }

  for (const step of lesson.steps) {
    const result = progress.results[step.id]
    if (step.kind === 'speak') {
      m.speaking.total += step.phraseIds.length
      if (result?.kind === 'speak') {
        m.speaking.correct += step.phraseIds.filter((id) => result.spoken.includes(id)).length
      }
    }
    if (!result) continue
    if (step.kind === 'choice' && result.kind === 'choice') {
      m.recognition.total += 1
      if (result.correct) m.recognition.correct += 1
    }
    if (step.kind === 'recall' && result.kind === 'recall') {
      m.recall.total += 1
      m.recall[result.outcome] += 1
      if (result.outcome === 'exact' || result.outcome === 'close') m.recall.correct += 1
    }
    if (step.kind === 'scenario' && result.kind === 'scenario') {
      const picks = Object.values(result.firstTry)
      m.scenario.total += picks.length
      m.scenario.correct += picks.filter(Boolean).length
    }
  }

  if (progress.status === 'completed' && progress.completedAt) {
    const ms = Date.parse(progress.completedAt) - Date.parse(progress.startedAt)
    if (Number.isFinite(ms) && ms >= 0) m.minutes = Math.max(1, Math.round(ms / 60000))
  }
  return m
}
