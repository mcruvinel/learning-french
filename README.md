# Learning French

Companion app pessoal para aprender francês funcional do zero.

Não é um produto. É software pessoal para um único usuário, construído junto com
o aprendizado.

## O experimento

Três objetivos entrelaçados:

1. Aprender francês funcional (cumprimentar, pedir, pagar,
   se localizar, resolver problemas simples).
2. Construir um app de estudo cujas features nasçam de necessidades reais de
   aprendizado — não de suposições.
3. Coletar evidência técnica e de aprendizado para um artigo futuro sobre
   aprender francês com IA abordando o problema como desenvolvedor.

A regra que governa o backlog:

> Aprender → observar um problema real → adaptar o método → implementar só se for
> útil → medir → documentar.

**O ChatGPT** cuida do currículo, das aulas, dos exercícios e das métricas de
aprendizado. **O Claude Code** cuida do app, do repositório, dos testes, do
deploy e da documentação técnica. O app em si **não faz nenhuma chamada a API
de IA**.

## O que o app faz (v0.1)

- **Home**: status, aula atual, aulas concluídas, CTA Começar / Continuar / Rever.
- **Aula 1 — « Bonjour, je m'appelle Matheus »**: 24 passos — contexto, frases
  com dica de pronúncia e áudio, reconhecimento, recuperação digitada (PT → FR),
  falar em voz alta (autoconfirmado), dois micro-cenários (boulangerie e escola de
  esqui) e recap com autoavaliação.
- **Progresso local**: sobrevive a refresh e a reabrir o app.
- **Notas para Obsidian**: Markdown gerado a partir do desempenho registrado —
  copiar, baixar `.md` ou compartilhar.
- **PWA**: instalável na tela de início; reabre offline depois da primeira visita.

## Stack

| Escolha | Motivo |
| --- | --- |
| React 19 + TypeScript estrito + Vite 8 | SPA estática, build rápido, tipos estritos |
| CSS puro com tokens | App pequeno; design system genérico não se justifica |
| `HashRouter` | GitHub Pages é estático — refresh nunca pode dar 404 |
| `base: './'` no Vite | O mesmo build funciona em `/` e em qualquer subpath |
| Conteúdo de aula em TypeScript tipado | Aula nova = arquivo de conteúdo, não UI nova |
| localStorage versionado | Progresso local, sem contas e sem banco |
| `speechSynthesis` do navegador | Áudio em francês sem API paga; melhoria progressiva |
| Service worker escrito à mão | Offline básico sem Workbox |
| GitHub Actions → GitHub Pages | Hospedagem gratuita |

Sem backend. Sem banco de dados. Sem autenticação. Sem serviço pago.
Dependências de runtime: `react`, `react-dom`, `react-router-dom`.

```
src/
  app/          # rotas (App.tsx), NotFound, teste de integração do fluxo
  home/         # tela inicial
  lesson/       # player de aula, um componente por tipo de passo, checagem de respostas
  lessons/      # CONTEÚDO: tipos (types.ts), Aula 1 (lesson-01.ts), registro (index.ts)
  progress/     # estado de progresso: tipos, transições puras, parse defensivo, métricas
  notes/        # gerador de Markdown para Obsidian e tela de notas
  components/   # PhraseCard, ListenButtons
  lib/          # storage.ts (único acesso ao localStorage), speech.ts (TTS)
  pwa/          # registro do service worker
  styles/       # tokens, global, primitivas de UI
public/         # manifest, sw.js, ícones
scripts/        # render-icons.mjs, qa-mobile.mjs (usam Playwright de fora do projeto)
```

### Onde fica o conteúdo

`src/lessons/lesson-01.ts`. Para criar a Aula 2: copiar o formato para
`lesson-02.ts` e adicionar ao array em `src/lessons/index.ts`. O teste
`src/lessons/lessons.test.ts` acusa referências quebradas (frase inexistente,
resposta fora do intervalo, cenário sem exatamente uma opção certa).

### Onde fica o progresso

Uma chave de localStorage: `learning-french:v1:progress` (formato em
`src/progress/types.ts`). Só `src/lib/storage.ts` toca o localStorage. Dados
malformados são descartados na menor granularidade possível
(`src/progress/parse.ts`). O progresso existe **só neste aparelho**.

## Desenvolvimento

```sh
npm install
npm run dev       # servidor local
npm test          # testes (Vitest)
npm run build     # build de produção em dist/
npm run verify    # typecheck + lint + testes + build — rode antes de commitar
```

QA opcional em WebKit (motor do Safari) com viewport de iPhone, servindo o build
num subpath estilo GitHub Pages: percorre a Aula 1 a 390px e 320px, testa
refresh, offline e um ciclo de release (build A instalado → build B publicado):

```sh
(mkdir -p /tmp/pw && cd /tmp/pw && npm i playwright && npx playwright install webkit)
npm run build
PLAYWRIGHT_FROM=/tmp/pw/ node scripts/qa-mobile.mjs [pasta-de-screenshots]
```

## Deploy

`.github/workflows/deploy.yml`: a cada push em `main`, roda `npm run verify` e
publica `dist/` no GitHub Pages. Remote: `git@github.com:mcruvinel/learning-french.git`.
URL esperada: `https://mcruvinel.github.io/learning-french/`.

Primeira publicação: Pages precisa estar configurado com a fonte "GitHub
Actions". Os comandos exatos estão em [`MEMORY.md` → Deploy Now](./MEMORY.md#deploy-now).

Cada build mostra `versão+commit` (ex.: `0.1.0+885a96c`) no rodapé da Home e
nas notas — é assim que se confere qual deploy o iPhone está rodando.

### Service worker e releases

`public/sw.js` mantém em cache um par consistente `index.html` + bundle. Com
rede, a abertura do app busca o `index.html` novo (um release aparece na
próxima abertura online); respostas ruins (404, redirect de Wi-Fi de hotel)
nunca substituem o app em cache; bundles antigos são removidos. Se mudar a
lógica de cache, trocar a constante `CACHE`. Detalhes: MEMORY.md, DEC-010.

## Instalação no iPhone

1. Abrir a URL no **Safari**.
2. Compartilhar → **Adicionar à Tela de Início**.
3. Abrir pelo ícone "Francês". Depois da primeira abertura online, o app abre
   sem rede.

Sem som no áudio? Verificar volume/modo silencioso e se há voz francesa em
Ajustes → Acessibilidade → Conteúdo Falado → Vozes.

## Documentos do projeto

- [`CLAUDE.md`](./CLAUDE.md) — regras que guiam a implementação
- [`TODO.md`](./TODO.md) — **estado atual do trabalho**: tasks com ID e status
- [`MEMORY.md`](./MEMORY.md) — **memória do projeto**: o que foi feito, por quê,
  decisões (DEC-xxx) e um registro de estudo por task (TASK-xxx)
- [`docs/DECISIONS.md`](./docs/DECISIONS.md) — decisões da fundação (C00)
- [`CHANGELOG.md`](./CHANGELOG.md) — mudanças visíveis ao usuário

README = documentação estável. MEMORY = conhecimento que evolui. TODO = estado atual.
