import type { LessonProgress, ProgressState, SelfRating, StepResult } from './types'

/**
 * Pure state transitions. Components never build progress objects by hand;
 * they call these through `useProgress().update(...)`. `now` is an ISO string
 * passed in so tests are deterministic.
 */

export const emptyProgress: ProgressState = { version: 1, lessons: {} }

function newRun(lessonId: string, now: string, previous?: LessonProgress): LessonProgress {
  return {
    lessonId,
    status: 'in-progress',
    stepIndex: 0,
    startedAt: now,
    updatedAt: now,
    completedAt: previous?.completedAt ?? null,
    timesCompleted: previous?.timesCompleted ?? 0,
    results: {},
    selfRating: null,
    difficultPhraseIds: [],
    reflection: '',
  }
}

function withLesson(state: ProgressState, lesson: LessonProgress): ProgressState {
  return { ...state, lessons: { ...state.lessons, [lesson.lessonId]: lesson } }
}

function patchLesson(
  state: ProgressState,
  lessonId: string,
  now: string,
  patch: (lesson: LessonProgress) => Partial<LessonProgress>,
): ProgressState {
  const lesson = state.lessons[lessonId]
  if (!lesson) return state
  return withLesson(state, { ...lesson, ...patch(lesson), updatedAt: now })
}

/** Creates progress for a lesson on first open; keeps existing progress otherwise. */
export function startLesson(state: ProgressState, lessonId: string, now: string): ProgressState {
  if (state.lessons[lessonId]) return state
  return withLesson(state, newRun(lessonId, now))
}

/** Starts a fresh run. The last completion date and the completion count are kept. */
export function restartLesson(state: ProgressState, lessonId: string, now: string): ProgressState {
  return withLesson(state, newRun(lessonId, now, state.lessons[lessonId]))
}

export function goToStep(
  state: ProgressState,
  lessonId: string,
  stepIndex: number,
  now: string,
): ProgressState {
  return patchLesson(state, lessonId, now, () => ({ stepIndex: Math.max(0, stepIndex) }))
}

export function recordResult(
  state: ProgressState,
  lessonId: string,
  stepId: string,
  result: StepResult,
  now: string,
): ProgressState {
  return patchLesson(state, lessonId, now, (l) => ({
    results: { ...l.results, [stepId]: result },
  }))
}

export function setSelfRating(
  state: ProgressState,
  lessonId: string,
  rating: SelfRating,
  now: string,
): ProgressState {
  return patchLesson(state, lessonId, now, () => ({ selfRating: rating }))
}

export function toggleDifficultPhrase(
  state: ProgressState,
  lessonId: string,
  phraseId: string,
  now: string,
): ProgressState {
  return patchLesson(state, lessonId, now, (l) => ({
    difficultPhraseIds: l.difficultPhraseIds.includes(phraseId)
      ? l.difficultPhraseIds.filter((id) => id !== phraseId)
      : [...l.difficultPhraseIds, phraseId],
  }))
}

export function setReflection(
  state: ProgressState,
  lessonId: string,
  reflection: string,
  now: string,
): ProgressState {
  return patchLesson(state, lessonId, now, () => ({ reflection }))
}

export function completeLesson(state: ProgressState, lessonId: string, now: string): ProgressState {
  return patchLesson(state, lessonId, now, (l) =>
    l.status === 'completed'
      ? {}
      : { status: 'completed', completedAt: now, timesCompleted: l.timesCompleted + 1 },
  )
}
