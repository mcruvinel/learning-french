import type { ReactNode } from 'react'

type Props = {
  label: string
  onClick: () => void
  disabled?: boolean
  /** Optional secondary action rendered above the primary button. */
  secondary?: ReactNode
}

/** Primary action pinned to the bottom of the screen, above the home indicator. */
export function StepFooter({ label, onClick, disabled = false, secondary }: Props) {
  return (
    <div className="step-footer">
      {secondary}
      <button type="button" className="btn btn--primary" onClick={onClick} disabled={disabled}>
        {label}
      </button>
    </div>
  )
}
