export type SaveResult = 'saved' | 'cancelled' | 'failed'

/**
 * Hands a text file to the user.
 *
 * Touch devices (iPhone): the share sheet, where "Salvar em Arquivos" puts it
 * in iCloud Drive. A plain download is unreliable in an iOS home-screen app.
 * Elsewhere: a regular download.
 *
 * Call it directly from a tap handler: iOS only opens the share sheet during
 * a user gesture.
 */
export async function saveTextFile(name: string, text: string, type: string): Promise<SaveResult> {
  const file = new File([text], name, { type })
  const touch = window.matchMedia?.('(pointer: coarse)').matches ?? false

  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return 'saved'
    } catch (error) {
      return error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'failed'
    }
  }

  try {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    // Give Safari a moment to start the download before revoking.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return 'saved'
  } catch {
    return 'failed'
  }
}
