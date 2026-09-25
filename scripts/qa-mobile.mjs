// End-to-end smoke test of Lesson 1 in WebKit (Safari's engine) with iPhone
// viewports, against the production build served from a GitHub Pages-like
// subpath (/learning-french/). Not part of `npm run verify`: it needs
// Playwright + WebKit and python3, which are deliberately not project
// dependencies (see scripts/render-icons.mjs).
//
//   npm run build
//   PLAYWRIGHT_FROM=/tmp/pw/ node scripts/qa-mobile.mjs [screenshotDir]
//
// Walks every step with the right answers (recall typed WITHOUT accents),
// reloads mid-lesson to check resume, checks horizontal overflow on every
// step, completes the lesson, opens the notes, then stops its own static
// server and reloads to check the service worker serves the app offline.
// (Playwright's context.setOffline() breaks service-worker navigations in
// WebKit, so a real outage is used instead.)
import { spawn } from 'node:child_process'
import { cpSync, mkdtempSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { lesson01 } from '../src/lessons/lesson-01.ts'

const require = createRequire(process.env.PLAYWRIGHT_FROM ?? import.meta.url)
const { webkit, devices } = require('playwright')

const SHOTS = process.argv[2]
const PORT = 4300 + Math.floor(Math.random() * 500)
const BASE = `http://localhost:${PORT}/learning-french/`
const siteRoot = mkdtempSync(join(tmpdir(), 'fe-qa-'))
cpSync(new URL('../dist', import.meta.url), join(siteRoot, 'learning-french'), { recursive: true })

let server
async function startServer() {
  server = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: siteRoot, stdio: 'ignore' })
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(BASE)).ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 100))
  }
  throw new Error('static server did not start')
}
function stopServer() {
  server.kill()
  return new Promise((r) => server.once('exit', r))
}
const problems = []
const check = (ok, message) => {
  if (!ok) problems.push(message)
}

const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

async function assertNoOverflow(page, label) {
  const { scroll, width } = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    width: window.innerWidth,
  }))
  check(scroll <= width, `${label}: horizontal overflow (${scroll}px > ${width}px)`)
}

async function stepCounter(page) {
  return page.locator('.lesson-header__count').innerText()
}

async function run(deviceName, viewport) {
  const browser = await webkit.launch()
  const context = await browser.newContext({ ...devices[deviceName], ...(viewport && { viewport }) })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const tag = viewport ? `${viewport.width}px` : deviceName

  await page.goto(BASE)
  await page.getByRole('link', { name: 'Começar Aula 1' }).click()
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${tag}-00-intro.png`, fullPage: true })

  for (const [i, step] of lesson01.steps.entries()) {
    await page.waitForFunction(
      (n) => document.querySelector('.lesson-header__count')?.textContent?.startsWith(`${n}/`),
      i + 1,
    )
    await assertNoOverflow(page, `${tag} step ${i + 1} (${step.id})`)
    const shoot = async (suffix = '') => {
      if (SHOTS) {
        await page.screenshot({ path: `${SHOTS}/${tag}-${String(i + 1).padStart(2, '0')}-${step.id}${suffix}.png`, fullPage: false })
      }
    }

    switch (step.kind) {
      case 'intro':
        await page.getByRole('button', { name: 'Começar' }).click()
        break
      case 'phrases':
      case 'note':
        await shoot()
        await page.getByRole('button', { name: 'Continuar' }).click()
        break
      case 'choice':
        await page.getByRole('button', { name: step.options[step.answerIndex], exact: true }).click()
        await shoot()
        await page.getByRole('button', { name: 'Continuar' }).click()
        break
      case 'recall': {
        const phrase = lesson01.phrases.find((p) => p.id === step.phraseId)
        const input = page.getByLabel('Sua resposta em francês')
        await input.fill(stripAccents(phrase.fr).toLowerCase())
        await shoot('-typing')
        await input.press('Enter')
        check(await page.getByText(/^Certo/).isVisible(), `${tag} ${step.id}: answer not accepted`)
        await shoot()
        // Refresh in the middle of the lesson: the same step must come back.
        if (step.id === 'recall-goodbye') {
          const before = await stepCounter(page)
          await page.reload()
          await page.waitForSelector('.lesson-header__count')
          check((await stepCounter(page)) === before, `${tag}: reload changed step (${before})`)
          check(await page.getByText(/^Certo/).isVisible(), `${tag}: reload lost the recall result`)
        }
        await page.getByRole('button', { name: 'Continuar' }).click()
        break
      }
      case 'speak':
        // Each tap relabels the button to "Falei ✓", so always take the first left.
        while ((await page.getByRole('button', { name: 'Falei', exact: true }).count()) > 0) {
          await page.getByRole('button', { name: 'Falei', exact: true }).first().click()
        }
        await shoot()
        await page.getByRole('button', { name: 'Continuar', exact: true }).click()
        break
      case 'scenario':
        for (const turn of step.turns) {
          if (turn.who !== 'you') continue
          const right = turn.options.find((o) => o.correct)
          await page.locator('.scenario-choice').getByRole('button', { name: right.fr, exact: true }).click()
        }
        await assertNoOverflow(page, `${tag} ${step.id} finished`)
        await shoot()
        await page.getByRole('button', { name: 'Continuar' }).click()
        break
      case 'recap':
        await page.getByRole('button', { name: 'Fácil' }).click()
        await page.getByRole('button', { name: /^Bonjour/ }).click() // mark as difficult
        await shoot()
        await page.getByRole('button', { name: 'Concluir aula' }).click()
        await page.getByRole('link', { name: 'Ver notas para o Obsidian' }).click()
        break
    }
  }

  const md = await page.getByLabel('Prévia do Markdown').innerText()
  check(md.includes('# Learning French — Session 01'), `${tag}: notes heading missing`)
  check(md.includes(`- Reconhecimento: 7/7 certas`), `${tag}: recognition metric wrong`)
  check(md.includes('Marquei como difícil: **Bonjour**'), `${tag}: difficult phrase missing`)
  await assertNoOverflow(page, `${tag} notes`)
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${tag}-99-notes.png` })

  await page.getByRole('link', { name: '← Início' }).click()
  check(await page.getByRole('link', { name: 'Notas da Aula 1' }).isVisible(), `${tag}: home not showing completion`)
  await assertNoOverflow(page, `${tag} home completed`)
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${tag}-99-home-done.png`, fullPage: true })

  // Offline: after one online visit the service worker must serve the app.
  const swReady = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'unsupported'
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((r) => setTimeout(() => r(null), 5000)),
    ])
    return reg ? 'ready' : 'timeout'
  })
  let offline = `service worker ${swReady}`
  if (swReady === 'ready') {
    await page.reload() // make sure this page load is controlled by the worker
    await stopServer()
    try {
      await page.reload()
      await page.getByRole('link', { name: 'Notas da Aula 1' }).waitFor({ timeout: 5000 })
      await page.goto(`${BASE}#/lesson/lesson-01`)
      await page.locator('.lesson-header__count').waitFor({ timeout: 5000 })
      offline = 'offline reload + deep link OK (server stopped)'
    } catch (e) {
      offline = `offline FAILED: ${e.message.split('\n')[0]}`
      problems.push(`${tag}: ${offline}`)
    }
    await startServer()
  } else {
    problems.push(`${tag}: ${offline}`)
  }

  check(errors.length === 0, `${tag}: page errors: ${errors.join(' | ')}`)
  await browser.close()
  return `${tag}: ${lesson01.steps.length} steps OK · ${offline}`
}

await startServer()
const results = []
results.push(await run('iPhone 13'))
results.push(await run('iPhone SE', { width: 320, height: 568 }))
await stopServer()
console.log(results.join('\n'))
if (problems.length) {
  console.log('\nPROBLEMS:\n- ' + problems.join('\n- '))
  process.exit(1)
}
console.log('All checks passed.')
