import type { LessonProgress, ProgressState, RecallOutcome, StepResult } from './types'

/**
 * Turns whatever is in storage into a valid ProgressState.
 *
 * Storage outlives code: a stored value may be from an older build, edited by
 * hand, or truncated. Anything that does not match the current shape is
 * dropped at the smallest possible granularity (one step result, one lesson)
 * instead of wiping all progress.
 */
export function parseProgress(raw: unknown): ProgressState {
  const empty: ProgressState = { version: 1, lessons: {} }
  if (!isRecord(raw) || raw.version !== 1 || !isRecord(raw.lessons)) return empty

  const lessons: Record<string, LessonProgress> = {}
  for (const [id, value] of Object.entries(raw.lessons)) {
    const lesson = parseLesson(id, value)
    if (lesson) lessons[id] = lesson
  }
  return { version: 1, lessons }
}

function parseLesson(lessonId: string, v: unknown): LessonProgress | null {
  if (!isRecord(v)) return null
  if (v.status !== 'in-progress' && v.status !== 'completed') return null
  if (!isNonNegativeInt(v.stepIndex)) return null
  if (typeof v.startedAt !== 'string' || typeof v.updatedAt !== 'string') return null

  const results: Record<string, StepResult> = {}
  if (isRecord(v.results)) {
    for (const [stepId, r] of Object.entries(v.results)) {
      const result = parseResult(r)
      if (result) results[stepId] = result
    }
  }

  return {
    lessonId,
    status: v.status,
    stepIndex: v.stepIndex,
    startedAt: v.startedAt,
    updatedAt: v.updatedAt,
    completedAt: typeof v.completedAt === 'string' ? v.completedAt : null,
    timesCompleted: isNonNegativeInt(v.timesCompleted) ? v.timesCompleted : 0,
    results,
    selfRating:
      v.selfRating === 'hard' || v.selfRating === 'ok' || v.selfRating === 'easy'
        ? v.selfRating
        : null,
    difficultPhraseIds: Array.isArray(v.difficultPhraseIds)
      ? v.difficultPhraseIds.filter((id): id is string => typeof id === 'string')
      : [],
    reflection: typeof v.reflection === 'string' ? v.reflection : '',
  }
}

const RECALL_OUTCOMES: readonly RecallOutcome[] = ['exact', 'close', 'wrong', 'revealed']

function parseResult(r: unknown): StepResult | null {
  if (!isRecord(r)) return null
  switch (r.kind) {
    case 'choice':
      return isNonNegativeInt(r.selected) && typeof r.correct === 'boolean'
        ? { kind: 'choice', selected: r.selected, correct: r.correct }
        : null
    case 'recall': {
      const outcome = RECALL_OUTCOMES.find((o) => o === r.outcome)
      return typeof r.answer === 'string' && outcome
        ? { kind: 'recall', answer: r.answer, outcome }
        : null
    }
    case 'speak':
      return Array.isArray(r.spoken)
        ? { kind: 'speak', spoken: r.spoken.filter((s): s is string => typeof s === 'string') }
        : null
    case 'scenario': {
      if (!isNonNegativeInt(r.reached) || !isRecord(r.firstTry)) return null
      const firstTry: Record<string, boolean> = {}
      for (const [turn, ok] of Object.entries(r.firstTry)) {
        if (typeof ok === 'boolean') firstTry[turn] = ok
      }
      return { kind: 'scenario', reached: r.reached, firstTry }
    }
    default:
      return null
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isNonNegativeInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0
}
