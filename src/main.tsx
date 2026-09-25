import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './app/App'
import { registerServiceWorker } from './pwa/registerServiceWorker'
import { ProgressProvider } from './progress/ProgressProvider'
import './styles/global.css'
import './styles/ui.css'

/**
 * Hash routing is deliberate: GitHub Pages serves static files only, so a
 * refresh on a path like /lesson/lesson-01 would 404. Hashes never reach the
 * server.
 */
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
)

registerServiceWorker()
