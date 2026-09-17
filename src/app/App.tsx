import './App.css'

/**
 * C00 app shell. Navigation and the real screens arrive in C01; this only
 * proves the stack, the visual tokens and hash routing are wired correctly.
 */
export function App() {
  return (
    <main className="app">
      <p className="app__eyebrow">Learning French</p>
      <h1 className="app__title">Bonjour !</h1>
      <p className="app__subtitle">Do zero, uma sessão por vez.</p>

      <section className="app__card">
        <h2>Fundação técnica pronta</h2>
        <p>
          React, TypeScript estrito, Vite e Vitest configurados. As telas Hoje,
          Sessões, Frases, Revisão e Progresso chegam na sessão C01.
        </p>
      </section>

      <p className="app__footer">
        Un petit pas chaque jour.
      </p>
    </main>
  )
}
