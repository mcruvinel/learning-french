/**
 * French text-to-speech through the browser's own speechSynthesis.
 *
 * Progressive enhancement: no network, no API key, no dependency. Where it is
 * missing the UI hides the listen buttons and the lesson still works.
 */

export function isSpeechAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  )
}

function frenchVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === 'fr-FR' && v.localService) ??
    voices.find((v) => v.lang === 'fr-FR') ??
    voices.find((v) => v.lang.startsWith('fr'))
  )
}

export function speakFrench(text: string, { slow = false } = {}): void {
  if (!isSpeechAvailable()) return
  const synth = window.speechSynthesis
  // A new tap interrupts whatever is still playing instead of queueing.
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  const voice = frenchVoice()
  if (voice) utterance.voice = voice
  utterance.rate = slow ? 0.6 : 0.9
  synth.speak(utterance)
}
