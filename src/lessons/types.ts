/**
 * Lesson content model.
 *
 * A lesson is data: a list of phrases plus an ordered list of steps. The
 * lesson player (src/lesson/) knows how to render each step kind, so a new
 * lesson is a new content file, not new UI.
 */

export type Phrase = {
  id: string
  fr: string
  pt: string
  /** Pronunciation guidance written for a Brazilian Portuguese speaker. */
  tip: string
  /** Optional IPA, shown small. Never required to follow the lesson. */
  ipa?: string
  /** Extra usage note (register, variants, gender). */
  note?: string
}

/** 1. Context. The player also lists the lesson's objectives here. */
export type IntroStep = {
  kind: 'intro'
  id: string
  title: string
  paragraphs: string[]
}

/** 2 + 3. Input: a small block of phrases to read, listen to and repeat. */
export type PhrasesStep = {
  kind: 'phrases'
  id: string
  title: string
  lead?: string
  phraseIds: string[]
}

/** Short explanatory card between blocks (pronunciation rules, culture). */
export type NoteStep = {
  kind: 'note'
  id: string
  title: string
  paragraphs: string[]
}

/** 4. Recognition: pick the right option. */
export type ChoiceStep = {
  kind: 'choice'
  id: string
  /** Portuguese instruction, e.g. "O que significa?". */
  instruction: string
  /** The prompt shown big. If `promptPhraseId` is set, it can also be played. */
  prompt: string
  promptLang: 'fr' | 'pt'
  promptPhraseId?: string
  options: string[]
  answerIndex: number
  explanation?: string
}

/** 5. Retrieval: see Portuguese, type the French from memory. */
export type RecallStep = {
  kind: 'recall'
  id: string
  promptPt: string
  /** Canonical answer is phrase.fr; `alsoAccept` lists other valid forms. */
  phraseId: string
  alsoAccept?: string[]
  hint?: string
}

/** 6. Speak aloud. Self-confirmed: the app does not evaluate speech. */
export type SpeakStep = {
  kind: 'speak'
  id: string
  title: string
  instruction: string
  phraseIds: string[]
}

export type ScenarioLine = {
  who: 'them'
  speaker: string
  fr: string
  pt: string
}

export type ScenarioChoice = {
  who: 'you'
  /** What the learner wants to do, in Portuguese. */
  situation: string
  options: { fr: string; correct: boolean; feedback: string }[]
}

/** 7. Micro scenario: a tiny real-world exchange. */
export type ScenarioStep = {
  kind: 'scenario'
  id: string
  title: string
  setting: string
  turns: (ScenarioLine | ScenarioChoice)[]
}

/** 8. Recap: phrases learned, self-assessment, completion, notes export. */
export type RecapStep = {
  kind: 'recap'
  id: string
  title: string
}

export type LessonStep =
  | IntroStep
  | PhrasesStep
  | NoteStep
  | ChoiceStep
  | RecallStep
  | SpeakStep
  | ScenarioStep
  | RecapStep

export type Lesson = {
  id: string
  /** 1-based order in the course; used for "Aula 1" labels and file names. */
  number: number
  title: string
  subtitle: string
  estimatedMinutes: number
  objectives: string[]
  phrases: Phrase[]
  steps: LessonStep[]
  /** Pronunciation takeaways reused in the recap and the Markdown notes. */
  pronunciationNotes: string[]
  /** What the next lesson will cover; goes into the Markdown notes. */
  nextLesson: string
}
