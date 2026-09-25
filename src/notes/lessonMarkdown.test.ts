import { describe, expect, test } from 'vitest'
import { lesson01 } from '../lessons/lesson-01'
import { completeLesson, emptyProgress, recordResult, setReflection, setSelfRating, startLesson, toggleDifficultPhrase } from '../progress/progress'
import { buildLessonMarkdown, notesFileName } from './lessonMarkdown'

const ID = 'lesson-01'
const meta = { appVersion: '0.1.0', now: new Date(2026, 8, 25, 10, 0) }

function completedRun() {
  let s = startLesson(emptyProgress, ID, '2026-09-25T08:00:00.000Z')
  s = recordResult(s, ID, 'rec-merci', { kind: 'choice', selected: 0, correct: false }, 'x')
  s = recordResult(s, ID, 'recall-merci', { kind: 'recall', answer: 'merci', outcome: 'exact' }, 'x')
  s = recordResult(s, ID, 'recall-brazilian', { kind: 'recall', answer: 'je suis brasilero', outcome: 'wrong' }, 'x')
  s = toggleDifficultPhrase(s, ID, 'excusez-moi', 'x')
  s = setSelfRating(s, ID, 'ok', 'x')
  s = setReflection(s, ID, 'O “r” da garganta ainda é estranho.', 'x')
  s = completeLesson(s, ID, '2026-09-25T08:25:00.000Z')
  return s.lessons[ID]
}

describe('buildLessonMarkdown', () => {
  test('has the expected sections in order', () => {
    const md = buildLessonMarkdown(lesson01, completedRun(), meta)
    const headings = md.split('\n').filter((l) => l.startsWith('#'))
    expect(headings).toEqual([
      '# Learning French — Session 01',
      '## Goal',
      '## Vocabulary',
      '## Useful phrases',
      '## Pronunciation notes',
      '## Exercises / performance',
      '## Difficulties',
      '## What felt easy',
      '## Reflection',
      '## Next session',
      '## Project evidence',
    ])
  })

  test('uses recorded results and never invents them', () => {
    const md = buildLessonMarkdown(lesson01, completedRun(), meta)
    expect(md).toContain('| Merci | Obrigado | Merci beaucoup = muito obrigado. |')
    expect(md).toContain("- **Je m'appelle Matheus.** — Meu nome é Matheus.")
    expect(md).toContain('- Reconhecimento: 0/1 certas')
    expect(md).toContain('escrevi “je suis brasilero”, o certo é **Je suis brésilien.**')
    expect(md).toContain('Marquei como difícil: **Excusez-moi**')
    expect(md).toContain('Lembrei de primeira, com a grafia certa: **Merci**')
    expect(md).toContain('- Autoavaliação: Ok')
    expect(md).toContain('- Tempo entre início e conclusão: 25 min (inclui pausas)')
    expect(md).toContain('- Completion: concluída em 2026-09-25T08:25:00.000Z')
    expect(md).toContain('- App version: 0.1.0')
  })

  test('an untouched lesson says nothing was recorded', () => {
    const md = buildLessonMarkdown(lesson01, undefined, meta)
    expect(md).toContain('Date: 2026-09-25')
    expect(md).toContain('- Nenhum exercício registrado.')
    expect(md).toContain('- Completion: não iniciada')
    expect(md).not.toContain('## Reflection')
  })

  test('file name is stable and sortable', () => {
    expect(notesFileName(lesson01)).toBe('learning-french-session-01.md')
  })
})
