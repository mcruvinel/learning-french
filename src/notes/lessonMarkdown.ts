import type { Lesson, Phrase } from '../lessons/types'
import { lessonMetrics, type Score } from '../progress/metrics'
import type { LessonProgress, SelfRating } from '../progress/types'

/** Which point of the project produced the note; evidence for the article. */
export const TECH_MILESTONE = 'v0.1 — Aula 1 interativa, progresso local, PWA, GitHub Pages'

type NoteMeta = {
  appVersion: string
  /** Used for the Date line when the lesson is not completed yet. */
  now: Date
}

const RATING_LABEL: Record<SelfRating, string> = {
  hard: 'Difícil',
  ok: 'Ok',
  easy: 'Fácil',
}

/**
 * Obsidian-friendly Markdown for one lesson. Every number comes from the
 * recorded progress; if something was not recorded the note says so instead
 * of guessing.
 */
export function buildLessonMarkdown(
  lesson: Lesson,
  progress: LessonProgress | undefined,
  meta: NoteMeta,
): string {
  const session = String(lesson.number).padStart(2, '0')
  const doneAt = progress?.status === 'completed' ? progress.completedAt : null
  const date = localDate(doneAt ? new Date(doneAt) : meta.now)
  const words = lesson.phrases.filter((p) => !isSentence(p))
  const sentences = lesson.phrases.filter(isSentence)

  const lines: string[] = [
    '---',
    'tags: [learning-french, frances]',
    `lesson: ${lesson.number}`,
    `date: ${date}`,
    '---',
    '',
    `# Learning French — Session ${session}`,
    '',
    `Date: ${date}`,
    '',
    '## Goal',
    '',
    `**Aula ${lesson.number} — ${lesson.title}.** ${lesson.subtitle}.`,
    '',
    ...lesson.objectives.map((o) => `- ${o}`),
    '',
    '## Vocabulary',
    '',
    '| French | Portuguese | Notes |',
    '| --- | --- | --- |',
    ...words.map((p) => `| ${cell(p.fr)} | ${cell(p.pt)} | ${cell(p.note ?? '')} |`),
    '',
    '## Useful phrases',
    '',
    ...sentences.map((p) => `- **${p.fr}** — ${p.pt}${p.note ? ` _(${p.note})_` : ''}`),
    '',
    '## Pronunciation notes',
    '',
    ...lesson.pronunciationNotes.map((n) => `- ${n}`),
    '',
    ...lesson.phrases.map((p) => `- **${p.fr}**${p.ipa ? ` /${p.ipa}/` : ''} — ${p.tip}`),
    '',
    '## Exercises / performance',
    '',
    ...performanceLines(lesson, progress),
    '',
    '## Difficulties',
    '',
    ...difficultyLines(lesson, progress),
    '',
    '## What felt easy',
    '',
    ...easyLines(lesson, progress),
    '',
  ]

  if (progress?.reflection.trim()) {
    lines.push('## Reflection', '', progress.reflection.trim(), '')
  }

  lines.push(
    '## Next session',
    '',
    lesson.nextLesson,
    '',
    '## Project evidence',
    '',
    `- App version: ${meta.appVersion}`,
    `- Lesson: ${lesson.id} — ${lesson.title}`,
    `- Completion: ${completionLine(lesson, progress)}`,
    `- Relevant technical milestone: ${TECH_MILESTONE}`,
    '',
  )
  return lines.join('\n')
}

export function notesFileName(lesson: Lesson): string {
  return `learning-french-session-${String(lesson.number).padStart(2, '0')}.md`
}

/** Full sentences end with punctuation ("Je suis brésilien."); words do not. */
function isSentence(p: Phrase): boolean {
  return /[.?!]$/.test(p.fr.trim())
}

function performanceLines(lesson: Lesson, progress: LessonProgress | undefined): string[] {
  if (!progress) return ['- Nenhum exercício registrado.']
  const m = lessonMetrics(lesson, progress)
  const lines = [
    `- Reconhecimento: ${score(m.recognition)} certas`,
    `- Recuperação (PT → FR, digitando): ${score(m.recall)} certas` +
      ` (${m.recall.exact} exatas, ${m.recall.close} com grafia aproximada,` +
      ` ${m.recall.wrong} erradas, ${m.recall.revealed} reveladas sem tentar)`,
    `- Fala em voz alta: ${score(m.speaking)} frases marcadas como faladas (autoconfirmação, sem avaliação de pronúncia)`,
    `- Cenários: ${score(m.scenario)} escolhas certas na primeira tentativa`,
    `- Autoavaliação: ${progress.selfRating ? RATING_LABEL[progress.selfRating] : 'não registrada'}`,
  ]
  if (m.minutes !== null) {
    lines.push(`- Tempo entre início e conclusão: ${m.minutes} min (inclui pausas)`)
  }
  return lines
}

function difficultyLines(lesson: Lesson, progress: LessonProgress | undefined): string[] {
  if (!progress) return ['- Nada registrado ainda.']
  const lines: string[] = []

  for (const id of progress.difficultPhraseIds) {
    const p = lesson.phrases.find((ph) => ph.id === id)
    if (p) lines.push(`- Marquei como difícil: **${p.fr}** (${p.pt})`)
  }
  for (const step of lesson.steps) {
    const r = progress.results[step.id]
    if (step.kind === 'recall' && r?.kind === 'recall') {
      const p = lesson.phrases.find((ph) => ph.id === step.phraseId)
      if (!p) continue
      if (r.outcome === 'wrong') {
        lines.push(`- Recuperação: “${step.promptPt}” → escrevi “${r.answer}”, o certo é **${p.fr}**`)
      } else if (r.outcome === 'revealed') {
        lines.push(`- Recuperação: não lembrei “${step.promptPt}” (**${p.fr}**)`)
      } else if (r.outcome === 'close') {
        lines.push(`- Grafia: escrevi “${r.answer}”, a forma correta é **${p.fr}**`)
      }
    }
    if (step.kind === 'choice' && r?.kind === 'choice' && !r.correct) {
      const right = step.options[step.answerIndex] ?? ''
      lines.push(`- Reconhecimento: “${step.prompt}” → escolhi “${step.options[r.selected] ?? '?'}”, o certo é “${right}”`)
    }
  }
  return lines.length > 0 ? lines : ['- Nenhuma dificuldade registrada nos exercícios.']
}

/** Phrases retrieved exactly from memory and not marked as difficult. */
function easyLines(lesson: Lesson, progress: LessonProgress | undefined): string[] {
  if (!progress) return ['- Nada registrado ainda.']
  const easy = lesson.steps.flatMap((step) => {
    const r = progress.results[step.id]
    if (step.kind !== 'recall' || r?.kind !== 'recall' || r.outcome !== 'exact') return []
    if (progress.difficultPhraseIds.includes(step.phraseId)) return []
    const p = lesson.phrases.find((ph) => ph.id === step.phraseId)
    return p ? [`- Lembrei de primeira, com a grafia certa: **${p.fr}**`] : []
  })
  return easy.length > 0 ? easy : ['- Nenhuma frase recuperada com grafia exata.']
}

function completionLine(lesson: Lesson, progress: LessonProgress | undefined): string {
  if (!progress) return 'não iniciada'
  if (progress.status === 'completed' && progress.completedAt) {
    const times = progress.timesCompleted > 1 ? ` (${progress.timesCompleted}ª vez)` : ''
    return `concluída em ${progress.completedAt}${times}`
  }
  return `em andamento — passo ${progress.stepIndex + 1} de ${lesson.steps.length}`
}

function score(s: Score): string {
  return `${s.correct}/${s.total}`
}

/** Pipes would break the Markdown table. */
function cell(text: string): string {
  return text.replace(/\|/g, '\\|')
}

function localDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
