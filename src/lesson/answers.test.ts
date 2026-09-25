import { describe, expect, test } from 'vitest'
import { checkRecall, editDistance } from './answers'

describe('checkRecall', () => {
  test('exact ignores case, punctuation and spacing', () => {
    expect(checkRecall('merci', ['Merci'])).toBe('exact')
    expect(checkRecall('  Parlez-vous anglais ?  ', ['Parlez-vous anglais ?'])).toBe('exact')
    expect(checkRecall('parlez vous anglais', ['Parlez-vous anglais ?'])).toBe('exact')
    expect(checkRecall('S’il vous plaît', ["S'il vous plaît"])).toBe('exact')
  })

  test('missing accents or apostrophes are close, not wrong', () => {
    expect(checkRecall('sil vous plait', ["S'il vous plaît"])).toBe('close')
    expect(checkRecall('je suis bresilien', ['Je suis brésilien.'])).toBe('close')
    expect(checkRecall('je m appelle matheus', ["Je m'appelle Matheus."])).toBe('close')
  })

  test('one typo in a long answer is close', () => {
    expect(checkRecall('au revoire', ['Au revoir'])).toBe('close')
    expect(checkRecall('je mapelle matheus', ["Je m'appelle Matheus."])).toBe('close')
  })

  test('short answers need the right letters', () => {
    expect(checkRecall('merc', ['Merci'])).toBe('wrong')
    expect(checkRecall('mercy', ['Merci'])).toBe('wrong')
  })

  test('wrong or empty answers are wrong', () => {
    expect(checkRecall('', ['Merci'])).toBe('wrong')
    expect(checkRecall('   ', ['Merci'])).toBe('wrong')
    expect(checkRecall('bonjour', ['Au revoir'])).toBe('wrong')
    expect(checkRecall('je suis', ['Je suis brésilien.'])).toBe('wrong')
  })

  test('any accepted form matches', () => {
    expect(checkRecall('vous parlez anglais?', ['Parlez-vous anglais ?', 'Vous parlez anglais ?'])).toBe(
      'exact',
    )
  })
})

test('editDistance', () => {
  expect(editDistance('merci', 'merci')).toBe(0)
  expect(editDistance('merci', 'mersi')).toBe(1)
  expect(editDistance('', 'abc')).toBe(3)
  expect(editDistance('bonjour', 'bonsoir')).toBe(2)
})
