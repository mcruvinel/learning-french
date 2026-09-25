/**
 * The only module that touches localStorage.
 *
 * Keys are namespaced and versioned (`learning-french:v1:<key>`) so a future
 * breaking change to a stored shape can move to `v2` without reading garbage.
 * Every access is wrapped: Safari private mode, a full quota or a disabled
 * storage must degrade to "nothing saved", never to a crash.
 */
const NAMESPACE = 'learning-french:v1:'

export function readStored(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(NAMESPACE + key)
    return raw === null ? undefined : (JSON.parse(raw) as unknown)
  } catch {
    return undefined
  }
}

/** Returns false when the value could not be saved. */
export function writeStored(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(NAMESPACE + key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
