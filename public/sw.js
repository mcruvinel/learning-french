/*
 * Minimal offline support, written by hand (no Workbox). See MEMORY.md TASK-009
 * and TASK-015.
 *
 * - The cached app shell is always a consistent pair: an index.html plus the
 *   hashed JS/CSS it references. refreshShell() caches the assets first and
 *   only then replaces index.html, then drops assets no longer referenced.
 * - install: refreshShell() from the network, so one online visit is enough
 *   to reopen offline.
 * - navigations: network first, so a new deploy shows up on the next online
 *   launch. Only a genuine 200 HTML page from this origin (no redirect, e.g.
 *   a hotel Wi-Fi login page) becomes the new shell; anything else falls back
 *   to the cached shell.
 * - other same-origin GETs: cache first. Vite asset names are content-hashed,
 *   so a cached file never goes stale.
 *
 * All URLs are relative to this file, so it works under any subpath.
 * Bump CACHE only when this file's caching logic changes.
 */
const CACHE = 'learning-french-v2'
const INDEX = './index.html'
const STATIC = ['./manifest.webmanifest', './favicon.svg', './icon-192.png', './apple-touch-icon.png']

function assetsIn(html) {
  return [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map((m) => m[1])
}

function isGoodShell(response) {
  return (
    response.ok &&
    !response.redirected &&
    (response.headers.get('content-type') ?? '').includes('text/html')
  )
}

async function refreshShell(html) {
  const cache = await caches.open(CACHE)
  const assets = assetsIn(html)
  const missing = []
  for (const url of assets) {
    if (!(await cache.match(url))) missing.push(url)
  }
  await cache.addAll(missing)
  await cache.put(INDEX, new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))

  const keep = new Set(assets.map((url) => new URL(url, self.location.href).href))
  for (const request of await cache.keys()) {
    const path = new URL(request.url).pathname
    if (path.includes('/assets/') && !keep.has(request.url)) await cache.delete(request)
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      await cache.addAll(STATIC)
      const response = await fetch(INDEX, { cache: 'no-cache' })
      if (!isGoodShell(response)) throw new Error(`index.html: HTTP ${response.status}`)
      await refreshShell(await response.text())
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

async function cachedShell() {
  return (await caches.match(INDEX)) ?? Response.error()
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        let response
        try {
          response = await fetch(request)
        } catch {
          return cachedShell()
        }
        if (!isGoodShell(response)) return cachedShell()
        // Update the cached shell in the background; the page loads right away.
        event.waitUntil(response.clone().text().then(refreshShell).catch(() => {}))
        return response
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
