/**
 * Registers public/sw.js in production builds only: in dev a cache-first
 * worker would serve stale modules and make hot reload confusing.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Offline support is a convenience; the app works without it.
    })
  })
}
