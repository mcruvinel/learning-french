import { describe, expect, test } from 'vitest'
import { lessons } from './index'
import type { Lesson } from './types'

/** Returns every broken reference or inconsistency in a lesson's content. */
function contentProblems(lesson: Lesson): string[] {
  const problems: string[] = []
  const phraseIds = new Set(lesson.phrases.map((p) => p.id))
  const stepIds = new Set<string>()

  if (phraseIds.size !== lesson.phrases.length) problems.push('duplicate phrase id')

  const checkPhrase = (stepId: string, phraseId: string) => {
    if (!phraseIds.has(phraseId)) problems.push(`${stepId}: unknown phrase ${phraseId}`)
  }

  for (const step of lesson.steps) {
    if (stepIds.has(step.id)) problems.push(`duplicate step id ${step.id}`)
    stepIds.add(step.id)

    switch (step.kind) {
      case 'phrases':
      case 'speak':
        step.phraseIds.forEach((id) => checkPhrase(step.id, id))
        break
      case 'recall':
        checkPhrase(step.id, step.phraseId)
        break
      case 'choice':
        if (step.promptPhraseId) checkPhrase(step.id, step.promptPhraseId)
        if (step.options[step.answerIndex] === undefined) {
          problems.push(`${step.id}: answerIndex out of range`)
        }
        if (new Set(step.options).size !== step.options.length) {
          problems.push(`${step.id}: duplicate options`)
        }
        break
      case 'scenario':
        step.turns.forEach((turn, i) => {
          if (turn.who === 'you' && turn.options.filter((o) => o.correct).length !== 1) {
            problems.push(`${step.id} turn ${i}: needs exactly one correct option`)
          }
        })
        break
      case 'intro':
      case 'note':
      case 'recap':
        break
    }
  }

  const last = lesson.steps.at(-1)
  if (last?.kind !== 'recap') problems.push('last step must be the recap')
  return problems
}

describe('lesson content', () => {
  test('lesson ids and numbers are unique', () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length)
    expect(new Set(lessons.map((l) => l.number)).size).toBe(lessons.length)
  })

  test.each(lessons.map((l) => [l.id, l] as const))('%s has no broken references', (_, lesson) => {
    expect(contentProblems(lesson)).toEqual([])
  })

  test.each(lessons.map((l) => [l.id, l] as const))(
    '%s introduces every phrase in a phrases step before practising it',
    (_, lesson) => {
      const introduced = new Set<string>()
      for (const step of lesson.steps) {
        if (step.kind === 'phrases') step.phraseIds.forEach((id) => introduced.add(id))
        if (step.kind === 'recall') expect(introduced).toContain(step.phraseId)
        if (step.kind === 'speak') step.phraseIds.forEach((id) => expect(introduced).toContain(id))
      }
    },
  )
})
