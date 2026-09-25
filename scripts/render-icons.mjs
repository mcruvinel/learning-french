// Rasterizes public/favicon.svg into the PNG icons the PWA manifest and iOS
// need. Run once when the mark changes; the PNGs are committed.
//
// Needs Playwright with WebKit, which is deliberately NOT a project
// dependency. Install it anywhere and point PLAYWRIGHT_FROM at that folder:
//   (cd /tmp/pw && npm i playwright && npx playwright install webkit)
//   PLAYWRIGHT_FROM=/tmp/pw/ node scripts/render-icons.mjs
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(process.env.PLAYWRIGHT_FROM ?? import.meta.url)
const { webkit } = require('playwright')

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
const sizes = { 'icon-192.png': 192, 'icon-512.png': 512, 'apple-touch-icon.png': 180 }

const browser = await webkit.launch()
for (const [name, size] of Object.entries(sizes)) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(
    `<style>html,body{margin:0;background:#0a0e13}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  )
  await page.screenshot({ path: new URL(`../public/${name}`, import.meta.url).pathname })
  await page.close()
}
await browser.close()
console.log('icons written:', Object.keys(sizes).join(', '))
