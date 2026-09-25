import { describe, expect, test } from 'vitest'
import { lesson01 } from '../lessons/lesson-01'
import { lessonMetrics } from './metrics'
import { parseProgress } from './parse'
import {
  completeLesson,
  emptyProgress,
  goToStep,
  recordResult,
  restartLesson,
  startLesson,
  toggleDifficultPhrase,
} from './progress'

const T0 = '2026-09-25T08:00:00.000Z'
const T1 = '2026-09-25T08:20:00.000Z'
const T2 = '2026-09-26T09:00:00.000Z'
const ID = 'lesson-01'

describe('progress transitions', () => {
  test('starting a lesson creates a run once and keeps existing progress', () => {
    const started = startLesson(emptyProgress, ID, T0)
    expect(started.lessons[ID]?.stepIndex).toBe(0)
    const moved = goToStep(started, ID, 5, T1)
    expect(startLesson(moved, ID, T2)).toBe(moved)
  })

  test('completing counts once and survives a restart', () => {
    let s = startLesson(emptyProgress, ID, T0)
    s = recordResult(s, ID, 'rec-bonjour', { kind: 'choice', selected: 0, correct: true }, T0)
    s = completeLesson(s, ID, T1)
    s = completeLesson(s, ID, T2)
    expect(s.lessons[ID]).toMatchObject({ status: 'completed', completedAt: T1, timesCompleted: 1 })

    s = restartLesson(s, ID, T2)
    expect(s.lessons[ID]).toMatchObject({
      status: 'in-progress',
      stepIndex: 0,
      results: {},
      completedAt: T1,
      timesCompleted: 1,
    })
  })

  test('transitions on an unknown lesson are no-ops', () => {
    expect(goToStep(emptyProgress, 'nope', 3, T0)).toBe(emptyProgress)
  })

  test('toggling a difficult phrase adds then removes it', () => {
    let s = startLesson(emptyProgress, ID, T0)
    s = toggleDifficultPhrase(s, ID, 'merci', T0)
    expect(s.lessons[ID]?.difficultPhraseIds).toEqual(['merci'])
    s = toggleDifficultPhrase(s, ID, 'merci', T0)
    expect(s.lessons[ID]?.difficultPhraseIds).toEqual([])
  })
})

describe('parseProgress', () => {
  test('round-trips a valid state through JSON', () => {
    let s = startLesson(emptyProgress, ID, T0)
    s = recordResult(s, ID, 'recall-merci', { kind: 'recall', answer: 'merci', outcome: 'exact' }, T0)
    s = recordResult(s, ID, 'scenario-boulangerie', { kind: 'scenario', reached: 3, firstTry: { '0': true } }, T0)
    expect(parseProgress(JSON.parse(JSON.stringify(s)))).toEqual(s)
  })

  test.each([undefined, null, 'garbage', 42, [], { version: 2, lessons: {} }, { version: 1 }])(
    'falls back to empty progress for %j',
    (raw) => {
      expect(parseProgress(raw)).toEqual(emptyProgress)
    },
  )

  test('drops only the malformed parts', () => {
    const parsed = parseProgress({
      version: 1,
      lessons: {
        broken: { status: 'weird' },
        [ID]: {
          status: 'in-progress',
          stepIndex: 4,
          startedAt: T0,
          updatedAt: T0,
          results: {
            good: { kind: 'choice', selected: 1, correct: false },
            bad: { kind: 'choice', selected: 'x' },
            unknown: { kind: 'flashcard' },
          },
          difficultPhraseIds: ['merci', 7],
        },
      },
    })
    expect(Object.keys(parsed.lessons)).toEqual([ID])
    expect(parsed.lessons[ID]).toMatchObject({
      stepIndex: 4,
      completedAt: null,
      timesCompleted: 0,
      selfRating: null,
      reflection: '',
      difficultPhraseIds: ['merci'],
      results: { good: { kind: 'choice', selected: 1, correct: false } },
    })
  })
})

describe('lessonMetrics', () => {
  test('counts only recorded results', () => {
    let s = startLesson(emptyProgress, ID, T0)
    s = recordResult(s, ID, 'rec-bonjour', { kind: 'choice', selected: 0, correct: true }, T0)
    s = recordResult(s, ID, 'rec-merci', { kind: 'choice', selected: 0, correct: false }, T0)
    s = recordResult(s, ID, 'recall-merci', { kind: 'recall', answer: 'merci', outcome: 'exact' }, T0)
    s = recordResult(s, ID, 'recall-please', { kind: 'recall', answer: 'sil vous plait', outcome: 'close' }, T0)
    s = recordResult(s, ID, 'recall-goodbye', { kind: 'recall', answer: '', outcome: 'revealed' }, T0)
    s = recordResult(s, ID, 'speak-courtesy', { kind: 'speak', spoken: ['bonjour', 'merci'] }, T0)
    s = recordResult(s, ID, 'scenario-boulangerie', { kind: 'scenario', reached: 5, firstTry: { '0': true, '2': false } }, T0)
    s = completeLesson(s, ID, T1)

    const m = lessonMetrics(lesson01, s.lessons[ID]!)
    expect(m.recognition).toEqual({ correct: 1, total: 2 })
    expect(m.recall).toEqual({ correct: 2, total: 3, exact: 1, close: 1, wrong: 0, revealed: 1 })
    expect(m.speaking).toEqual({ correct: 2, total: 9 })
    expect(m.scenario).toEqual({ correct: 1, total: 2 })
    expect(m.minutes).toBe(20)
  })
})
