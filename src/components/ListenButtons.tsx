import { isSpeechAvailable, speakFrench } from '../lib/speech'
import './ListenButtons.css'

type Props = {
  text: string
  /** Show the slow-speed button next to the normal one. */
  withSlow?: boolean
}

export function ListenButtons({ text, withSlow = true }: Props) {
  if (!isSpeechAvailable()) return null
  return (
    <div className="listen">
      <button
        type="button"
        className="listen__btn"
        onClick={() => speakFrench(text)}
        aria-label={`Ouvir: ${text}`}
      >
        <SpeakerIcon />
        <span>Ouvir</span>
      </button>
      {withSlow && (
        <button
          type="button"
          className="listen__btn"
          onClick={() => speakFrench(text, { slow: true })}
          aria-label={`Ouvir devagar: ${text}`}
        >
          <span>Devagar</span>
        </button>
      )}
    </div>
  )
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M3 9v6h4l5 4V5L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4Zm-2.5-9v2.06a7 7 0 0 1 0 13.88V21a9 9 0 0 0 0-18Z"
      />
    </svg>
  )
}
