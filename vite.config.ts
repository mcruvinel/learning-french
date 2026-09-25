import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version: string
}

/**
 * Short commit of the build, shown next to the version (e.g. 0.1.0+5503487)
 * so the installed PWA shows which deploy it is running. A build with
 * uncommitted changes gets a "-dirty" suffix.
 */
function buildId(): string {
  try {
    const sha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim() !== ''
    return dirty ? `${sha}-dirty` : sha
  } catch {
    return 'local'
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs: the same build works at `/` and under any GitHub
  // Pages subpath (`/<repo>/`). Safe because routing is hash-based, so the
  // document is always the root index.html. See MEMORY.md DEC-004.
  base: './',
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(`${pkg.version}+${buildId()}`),
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
