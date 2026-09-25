/*
 * Minimal offline support, written by hand (no Workbox). See MEMORY.md TASK-009.
 *
 * - install: cache the app shell plus the hashed JS/CSS that index.html
 *   references, so the app reopens offline after a single online visit.
 * - navigations: network first (new deploys show up when online), falling
 *   back to the cached index.html offline.
 * - other same-origin GETs: cache first. Vite asset names are content-hashed,
 *   so a cached file never goes stale; new ones are cached on first use.
 *
 * All URLs are relative to this file, so it works under any subpath.
 * Bump CACHE when this file's caching logic changes.
 */
const CACHE = 'learning-french-v1'
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icon-192.png',
  './apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      await cache.addAll(SHELL)
      const html = await (await fetch('./index.html', { cache: 'no-cache' })).text()
      const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map((m) => m[1])
      await cache.addAll(assets)
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request)
          const cache = await caches.open(CACHE)
          await cache.put('./index.html', response.clone())
          return response
        } catch {
          return (await caches.match('./index.html')) ?? Response.error()
        }
      })(),
    )
    return
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(request)
      if (cached) return cached
      const response = await fetch(request)
      if (response.ok) {
        const cache = await caches.open(CACHE)
        await cache.put(request, response.clone())
      }
      return response
    })(),
  )
})
