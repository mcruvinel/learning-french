import { describe, expect, test } from 'vitest'
import { backupFileName, mergeProgress, readBackup, serializeBackup } from './backup'
import { completeLesson, emptyProgress, goToStep, startLesson } from './progress'

const T0 = '2026-09-25T08:00:00.000Z'
const T1 = '2026-09-25T09:00:00.000Z'
const T2 = '2026-09-26T09:00:00.000Z'

describe('backup file', () => {
  test('round-trips progress', () => {
    const state = completeLesson(startLesson(emptyProgress, 'lesson-01', T0), 'lesson-01', T1)
    expect(readBackup(serializeBackup(state, new Date(T1)))).toEqual(state)
  })

  test('accepts a bare progress object', () => {
    const state = startLesson(emptyProgress, 'lesson-01', T0)
    expect(readBackup(JSON.stringify(state))).toEqual(state)
  })

  test.each(['', 'not json', '{}', '[]', '{"progress": {"version": 1, "lessons": {}}}'])(
    'rejects %j',
    (text) => {
      expect(readBackup(text)).toBeNull()
    },
  )

  test('file name carries the local date', () => {
    expect(backupFileName(new Date(2026, 8, 25, 23, 0))).toBe('learning-french-progresso-2026-09-25.json')
  })
})

describe('mergeProgress', () => {
  const older = goToStep(startLesson(emptyProgress, 'lesson-01', T0), 'lesson-01', 3, T0)
  const newer = goToStep(startLesson(emptyProgress, 'lesson-01', T0), 'lesson-01', 9, T2)

  test('the most recently updated lesson wins, in either direction', () => {
    expect(mergeProgress(older, newer).lessons['lesson-01']?.stepIndex).toBe(9)
    expect(mergeProgress(newer, older).lessons['lesson-01']?.stepIndex).toBe(9)
  })

  test('keeps lessons that exist on only one side', () => {
    const other = startLesson(emptyProgress, 'lesson-02', T1)
    const merged = mergeProgress(older, other)
    expect(Object.keys(merged.lessons).sort()).toEqual(['lesson-01', 'lesson-02'])
  })
})
