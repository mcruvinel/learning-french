import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { lesson01 } from '../lessons/lesson-01'
import { readBackup, serializeBackup } from '../progress/backup'
import { completeLesson, emptyProgress, startLesson } from '../progress/progress'
import { ProgressProvider } from '../progress/ProgressProvider'
import { App } from './App'

const KEY = 'learning-french:v1:progress'

/** Mounting from scratch reads localStorage again, like a page refresh. */
function mount(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </MemoryRouter>,
  )
}

function stored() {
  return JSON.parse(localStorage.getItem(KEY) ?? 'null')
}

function seedAtStep(stepId: string) {
  const stepIndex = lesson01.steps.findIndex((s) => s.id === stepId)
  const t = '2026-09-25T08:00:00.000Z'
  localStorage.setItem(
    KEY,
    JSON.stringify({
      version: 1,
      lessons: {
        'lesson-01': { status: 'in-progress', stepIndex, startedAt: t, updatedAt: t, results: {} },
      },
    }),
  )
}

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))

beforeEach(() => {
  localStorage.clear()
  window.scrollTo = vi.fn()
})
afterEach(cleanup)

describe('Lesson 1 flow', () => {
  test('first visit offers to start Lesson 1', () => {
    mount()
    expect(screen.getByRole('heading', { name: 'Bonjour, Matheus.' })).toBeDefined()
    expect(screen.getByRole('link', { name: 'Começar Aula 1' })).toBeDefined()
  })

  test('progress survives a refresh and resumes on the same step', () => {
    mount('/lesson/lesson-01')
    click('Começar')
    click('Continuar') // phrases
    click('Continuar') // pronunciation note
    click('Olá / Bom dia / Boa tarde')
    expect(screen.getByText('Certo.')).toBeDefined()
    expect(stored().lessons['lesson-01'].results['rec-bonjour']).toEqual({
      kind: 'choice',
      selected: 0,
      correct: true,
    })

    cleanup()
    mount('/lesson/lesson-01')
    expect(screen.getByText('Certo.')).toBeDefined()
    expect(screen.getByText('4/' + lesson01.steps.length)).toBeDefined()

    cleanup()
    mount('/')
    expect(screen.getByRole('link', { name: 'Continuar Aula 1' })).toBeDefined()
  })

  test('recall accepts an answer typed without accents', () => {
    seedAtStep('recall-brazilian')
    mount('/lesson/lesson-01')
    fireEvent.change(screen.getByLabelText('Sua resposta em francês'), {
      target: { value: 'je suis bresilien' },
    })
    click('Verificar')
    expect(screen.getByText('Certo — confira a grafia.')).toBeDefined()
    expect(stored().lessons['lesson-01'].results['recall-brazilian'].outcome).toBe('close')
  })

  test('a wrong scenario pick gives feedback and allows another try', () => {
    seedAtStep('scenario-boulangerie')
    mount('/lesson/lesson-01')
    click('Au revoir !')
    expect(screen.getByText(/Au revoir é para sair/)).toBeDefined()
    click('Bonjour !')
    expect(screen.getByText("Bonjour monsieur ! Qu'est-ce que je vous sers ?")).toBeDefined()
    expect(stored().lessons['lesson-01'].results['scenario-boulangerie']).toEqual({
      kind: 'scenario',
      reached: 2,
      firstTry: { '0': false },
    })
  })

  test('completing the recap leads to Obsidian notes', () => {
    seedAtStep('recap')
    mount('/lesson/lesson-01')
    click('Ok')
    click('Concluir aula e salvar backup')
    expect(stored().lessons['lesson-01'].status).toBe('completed')
    fireEvent.click(screen.getByRole('link', { name: 'Ver notas para o Obsidian' }))
    expect(screen.getByRole('heading', { name: 'Para o Obsidian' })).toBeDefined()
    expect(screen.getByLabelText('Prévia do Markdown').textContent).toContain(
      '# Learning French — Session 01',
    )

    cleanup()
    mount('/')
    expect(screen.getByRole('link', { name: 'Notas da Aula 1' })).toBeDefined()
    expect(screen.getByText('1/1')).toBeDefined()
  })

  test('corrupted storage does not break the app', () => {
    localStorage.setItem(KEY, '{not json')
    mount()
    expect(screen.getByRole('link', { name: 'Começar Aula 1' })).toBeDefined()
  })
})

describe('progress backup (.json)', () => {
  test('completing the lesson saves a backup with the completed progress', async () => {
    let saved: Blob | undefined
    URL.createObjectURL = vi.fn((blob: Blob) => {
      saved = blob
      return 'blob:test'
    })
    URL.revokeObjectURL = vi.fn()
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    seedAtStep('recap')
    mount('/lesson/lesson-01')
    click('Concluir aula e salvar backup')
    await screen.findByText(/Backup do progresso salvo/)

    expect(clickSpy).toHaveBeenCalled()
    const backup = readBackup(await saved!.text())
    expect(backup?.lessons['lesson-01']?.status).toBe('completed')
    clickSpy.mockRestore()
  })

  test('importing on an empty device restores the lesson', async () => {
    const t = '2026-09-25T08:00:00.000Z'
    const done = completeLesson(startLesson(emptyProgress, 'lesson-01', t), 'lesson-01', t)
    const file = new File([serializeBackup(done, new Date(t))], 'backup.json', { type: 'application/json' })

    mount()
    expect(screen.getByText(/Já estudou em outro aparelho/)).toBeDefined()
    fireEvent.change(screen.getByLabelText('Arquivo de backup do progresso'), { target: { files: [file] } })

    await screen.findByText(/Progresso importado \(1 aula\)/)
    expect(screen.getByRole('link', { name: 'Notas da Aula 1' })).toBeDefined()
    await waitFor(() => expect(stored().lessons['lesson-01'].status).toBe('completed'))
  })

  test('an unrelated file is rejected without touching progress', async () => {
    mount()
    const file = new File(['{"hello": "world"}'], 'x.json', { type: 'application/json' })
    fireEvent.change(screen.getByLabelText('Arquivo de backup do progresso'), { target: { files: [file] } })
    await screen.findByText(/Arquivo não reconhecido/)
    expect(screen.getByRole('link', { name: 'Começar Aula 1' })).toBeDefined()
  })
})
