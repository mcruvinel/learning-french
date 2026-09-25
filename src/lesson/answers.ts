import type { RecallOutcome } from '../progress/types'

/**
 * Typed-answer checking for recall steps.
 *
 * On an iPhone keyboard, accents, apostrophes and hyphens cost effort and are
 * easy to miss. What matters in this exercise is retrieving the phrase, so:
 * - "exact": same text ignoring case, punctuation and extra spaces;
 * - "close": same letters ignoring accents, apostrophes, hyphens and spaces,
 *   or one typo away in an answer of 6+ letters. Counts as correct, and the
 *   UI shows the proper spelling.
 */
export function checkRecall(input: string, accepted: readonly string[]): RecallOutcome {
  const typed = tidy(input)
  if (typed === '') return 'wrong'
  if (accepted.some((a) => tidy(a) === typed)) return 'exact'

  const looseTyped = loose(typed)
  const isClose = accepted.some((a) => {
    const target = loose(tidy(a))
    return (
      target === looseTyped || (target.length >= 6 && editDistance(target, looseTyped) <= 1)
    )
  })
  return isClose ? 'close' : 'wrong'
}

/** Lowercase, unify apostrophes, turn punctuation and hyphens into spaces. */
function tidy(s: string): string {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[.,!?;:«»"()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Strip accents, apostrophes and spaces: "s'il vous plaît" → "silvousplait". */
function loose(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['\s]/g, '')
}

/** Levenshtein distance; inputs here are a few dozen characters at most. */
export function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min((prev[j] ?? 0) + 1, (curr[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost)
    }
    prev = curr
  }
  return prev[b.length] ?? 0
}
