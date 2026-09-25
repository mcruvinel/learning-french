import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLesson } from '../lessons'
import type { Lesson, LessonStep } from '../lessons/types'
import { goToStep, recordResult, startLesson } from '../progress/progress'
import { useProgress } from '../progress/useProgress'
import type { StepResult } from '../progress/types'
import { NotFound } from '../app/NotFound'
import { ChoiceStepView } from './steps/ChoiceStepView'
import { IntroStepView } from './steps/IntroStepView'
import { NoteStepView } from './steps/NoteStepView'
import { PhrasesStepView } from './steps/PhrasesStepView'
import { RecallStepView } from './steps/RecallStepView'
import { RecapStepView } from './steps/RecapStepView'
import { ScenarioStepView } from './steps/ScenarioStepView'
import { SpeakStepView } from './steps/SpeakStepView'
import type { StepProps } from './stepProps'
import './Lesson.css'

const now = () => new Date().toISOString()

export function LessonPage() {
  const { lessonId = '' } = useParams()
  const lesson = getLesson(lessonId)
  return lesson ? <LessonPlayer lesson={lesson} /> : <NotFound />
}

/** Renders the saved step of a lesson and moves through the steps. */
function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { progress, update } = useProgress()
  const lp = progress.lessons[lesson.id]
  const bodyRef = useRef<HTMLElement>(null)

  useEffect(() => {
    update((s) => startLesson(s, lesson.id, now()))
  }, [lesson.id, update])

  const index = Math.min(lp?.stepIndex ?? 0, lesson.steps.length - 1)
  const step = lesson.steps[index]

  // New step: back to the top, focus its heading for screen readers.
  useEffect(() => {
    window.scrollTo?.(0, 0)
    bodyRef.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [index])

  if (!lp || !step) return null

  const go = (target: number) => update((s) => goToStep(s, lesson.id, target, now()))
  const props = {
    lesson,
    result: lp.results[step.id],
    onResult: (result: StepResult) =>
      update((s) => recordResult(s, lesson.id, step.id, result, now())),
    onContinue: () => go(index + 1),
  }

  return (
    <div className="page lesson">
      <header className="lesson-header">
        <button
          type="button"
          className="icon-btn"
          aria-label="Passo anterior"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          <BackIcon />
        </button>
        <div
          className="progress-bar lesson-header__bar"
          role="progressbar"
          aria-label="Progresso na aula"
          aria-valuemin={1}
          aria-valuemax={lesson.steps.length}
          aria-valuenow={index + 1}
        >
          <div
            className="progress-bar__fill"
            style={{ width: `${((index + 1) / lesson.steps.length) * 100}%` }}
          />
        </div>
        <span className="lesson-header__count">
          {index + 1}/{lesson.steps.length}
        </span>
        <Link to="/" className="icon-btn" aria-label="Sair da aula">
          <CloseIcon />
        </Link>
      </header>
      <main className="lesson-main" ref={bodyRef} key={step.id}>
        {renderStep(step, props)}
      </main>
    </div>
  )
}

type CommonProps = Omit<StepProps<LessonStep>, 'step'>

function renderStep(step: LessonStep, props: CommonProps) {
  switch (step.kind) {
    case 'intro':
      return <IntroStepView {...props} step={step} />
    case 'phrases':
      return <PhrasesStepView {...props} step={step} />
    case 'note':
      return <NoteStepView {...props} step={step} />
    case 'choice':
      return <ChoiceStepView {...props} step={step} />
    case 'recall':
      return <RecallStepView {...props} step={step} />
    case 'speak':
      return <SpeakStepView {...props} step={step} />
    case 'scenario':
      return <ScenarioStepView {...props} step={step} />
    case 'recap':
      return <RecapStepView {...props} step={step} />
  }
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M15 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
