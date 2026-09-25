import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="page">
      <p className="eyebrow">Learning French</p>
      <h1 className="serif" style={{ marginTop: 'var(--space-2)' }}>
        Página não encontrada
      </h1>
      <p className="muted" style={{ margin: 'var(--space-3) 0 var(--space-6)' }}>
        Esse endereço não existe no app.
      </p>
      <Link className="btn btn--primary" to="/">
        Voltar ao início
      </Link>
    </main>
  )
}
