import type { Phrase } from '../lessons/types'
import { ListenButtons } from './ListenButtons'
import './PhraseCard.css'

export function PhraseCard({ phrase }: { phrase: Phrase }) {
  return (
    <article className="phrase" lang="pt-BR">
      <p className="phrase__fr" lang="fr">
        {phrase.fr}
      </p>
      <p className="phrase__pt">{phrase.pt}</p>
      <ListenButtons text={phrase.fr} />
      <p className="phrase__tip">
        <span className="phrase__label">Pronúncia</span>
        {phrase.tip}
        {phrase.ipa && <span className="phrase__ipa"> /{phrase.ipa}/</span>}
      </p>
      {phrase.note && <p className="phrase__note">{phrase.note}</p>}
    </article>
  )
}
