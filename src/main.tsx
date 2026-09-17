import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { App } from './app/App'
import './styles/global.css'

/**
 * Hash routing is deliberate: GitHub Pages serves static files only, so a
 * refresh on a path like /sessions would 404. Hashes never reach the server.
 */
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
