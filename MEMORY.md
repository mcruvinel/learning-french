# Morning Report

## TL;DR

A v0.1 está pronta **localmente**: Aula 1 interativa completa (24 passos), progresso
salvo no aparelho, notas Markdown para o Obsidian, PWA com offline, 34 testes
automatizados passando e a aula inteira percorrida em WebKit (motor do Safari)
a 390px e 320px. **Não está publicada**: um hook local do seu `~/.claude` proíbe
o Claude de enviar commits ao GitHub. O workflow do Pages e o remote estão
prontos; faltam três comandos seus (abaixo).

## What I can do now

- Rodar `npm run dev` e fazer a Aula 1 inteira no navegador.
- Depois de rodar os comandos de deploy: abrir no iPhone, instalar na tela de
  início, fazer a aula, copiar as notas para o Obsidian.

## What was completed

- TASK-001 — Inspeção do repositório, TODO.md por tasks, MEMORY.md
- TASK-002 — Modelo de conteúdo de aula (tipos + testes de integridade)
- TASK-003 — Conteúdo da Aula 1 « Bonjour, je m'appelle Matheus »
- TASK-004 — Persistência local versionada e tolerante a dados ruins
- TASK-005 — Player de aula + checagem de resposta digitada
- TASK-006 — Home e shell mobile
- TASK-007 — Áudio com `speechSynthesis` (som não verificado — headless)
- TASK-008 — Notas Markdown para Obsidian (copiar / baixar / compartilhar)
- TASK-009 — PWA mínimo (offline verificado em WebKit)
- TASK-011 — QA ponta a ponta em WebKit com viewport de iPhone
- TASK-012 — README, CHANGELOG, DECISIONS, CLAUDE.md

## What remains

- TASK-010 — Deploy no GitHub Pages: **[!] bloqueado** (push proibido para o Claude)
- TASK-013 — Validação no iPhone real (áudio, teclado, instalação, Obsidian)

## Deployment

Repository: `git@github.com:mcruvinel/learning-french.git` (remote `origin` configurado; repo remoto ainda vazio)
Branch: `main`
Commit: ver `git log -1` (o último é o commit de documentação desta sessão)
GitHub Pages: esperado em https://mcruvinel.github.io/learning-french/
Deployment status: **não publicado**. Comandos para publicar:

```sh
git push -u origin main
gh api -X POST repos/mcruvinel/learning-french/pages -f build_type=workflow
gh workflow run deploy.yml     # o 1º run do push pode falhar se o Pages ainda não existia
gh run watch
curl -sI https://mcruvinel.github.io/learning-french/ | head -1   # espera 200
```

## Validation

Build: ✅ `npm run build` — 305 kB JS (96 kB gzip), 13 kB CSS
Tests: ✅ 34 testes em 5 arquivos (Vitest + jsdom)
Lint: ✅ oxlint sem avisos
Typecheck: ✅ `tsc -b` estrito
Mobile: ✅ WebKit (Playwright) com perfil iPhone 13 (390px) e 320px: 24 passos, sem overflow horizontal, sem erro de JS. ⚠️ Não testado num iPhone físico.
Persistence: ✅ refresh no meio da aula retoma no mesmo passo com a resposta (teste jsdom + WebKit); JSON corrompido não quebra o app.
PWA: ✅ manifest + service worker; offline verificado em WebKit parando o servidor. ⚠️ "Adicionar à Tela de Início" não verificado.
GitHub Pages: ⚠️ build servido localmente em `/learning-french/` funciona; `npm ci && npm run verify` limpos numa cópia isolada (simula o CI). Deploy real não aconteceu.

## Important decisions

- DEC-001 — Adotar o repo vazio `learning-french` como remote
- DEC-002 — Aula como conteúdo TypeScript tipado; pipeline Markdown adiado
- DEC-003 — Um único objeto em localStorage + parse defensivo
- DEC-004 — `base: './'` em vez de `/learning-french/`
- DEC-005 — Service worker escrito à mão, sem Workbox
- DEC-006 — Fala autoconfirmada, sem reconhecimento de voz
- DEC-007 — Resposta digitada: acento/apóstrofo/1 erro contam como acerto
- DEC-008 — Playwright fora das dependências do projeto

## Read these tasks to study today's implementation

1. TASK-002 — como o modelo de conteúdo separa aula de UI
2. TASK-004 — persistência versionada e parse defensivo
3. TASK-005 — o player, o contrato `StepProps` e a checagem de respostas
4. TASK-009 — o service worker e o que "offline" significa aqui

## Recommended next action

Rodar os comandos de deploy acima e, no iPhone, fazer a Aula 1 de verdade
(TASK-013) — anotando no campo "Anotação" do recap o que travou.

---

# Learning French — Project Memory

> Memória durável do projeto. Não é log bruto: é conhecimento comprimido sobre
> o que foi feito, por quê, o que funciona e o que falta. Estado do trabalho
> fica em [`TODO.md`](./TODO.md); documentação estável em [`README.md`](./README.md).

## Current state

Last updated: 2026-09-24 23:40
Current version: 0.1.0
Deployment: não publicado (TASK-010 bloqueada)
Current lesson: Aula 1 — « Bonjour, je m'appelle Matheus » (conteúdo pronto)
Main stack: React 19 · TypeScript estrito · Vite 8 · react-router (hash) · Vitest · oxlint · CSS puro · localStorage

### What currently works

**Verified** (testado ou observado nesta sessão):

- Aula 1 completa, do início ao recap, em jsdom e em WebKit (390px e 320px).
- Progresso persiste em localStorage; refresh retoma no mesmo passo com as respostas.
- Dados corrompidos/antigos no storage não quebram o app.
- Recuperação digitada aceita respostas sem acento/apóstrofo e com 1 erro de digitação.
- Notas Markdown com métricas reais; seções na ordem pedida.
- Build de produção funciona servido em subpath (`/learning-french/`).
- Service worker controla a página e serve o app com o servidor parado.
- `npm ci` + `npm run verify` limpos (simulação do CI).

**Assumed** (razoável, não verificado):

- `speechSynthesis` no Safari do iOS fala com voz francesa (`lang = 'fr-FR'`).
  Os botões aparecem no WebKit, mas nenhum som foi ouvido.
- Copiar para a área de transferência e baixar `.md` funcionam no iOS Safari/PWA.
- O workflow do GitHub Actions funciona no primeiro run (versões de actions
  consultadas via API; YAML válido; nunca rodou).
- O ícone e o nome "Francês" aparecem bem na tela de início.

**Blocked**:

- Deploy (TASK-010): push proibido para o Claude por hook local.

### What is incomplete

- Deploy e validação no iPhone real (TASK-010, TASK-013).
- Francês da Aula 1 não revisado por falante nativo.
- Sem Aula 2: por decisão, o currículo vem do ChatGPT.

### Important constraints

- Um único usuário (Matheus), iPhone + Safari, PWA na tela de início.
- Sem backend, banco, auth, APIs de IA em runtime, serviços pagos, segredos.
- Deve funcionar em subpath do GitHub Pages e a partir de 320px.
- **O app evolui porque o aprendizado revela uma necessidade.** Não construir
  features só porque Duolingo/Anki têm (flashcards, SRS, badges, streaks...).
  Toda feature nova registra: Problema → Hipótese → Implementação mínima → Resultado.
- Dependência nova só se for materialmente mais simples ou mais segura do que
  implementar o requisito pequeno.
- O Claude não pode rodar `git push` nesta máquina (hook em `~/.claude/hooks/block-git-push.sh`).
  Publicar é sempre uma ação do usuário.

### Next recommended action

Publicar (comandos no Morning Report) e fazer a Aula 1 no iPhone (TASK-013).

---

## Decision log

### DEC-001 — Adotar o repo vazio `learning-french` como remote

Date: 2026-09-24
Related tasks: TASK-001, TASK-010

Context:
O repositório local não tinha remote. O roadmap C05 previa criar
um repositório novo no GitHub. Na conta existia `mcruvinel/learning-french`,
público, **vazio**, criado um minuto antes da sessão começar.

Options considered:
1. Criar um repositório novo como o C05 previa.
2. Usar `learning-french`.

Decision:
Usar `learning-french` (`origin = git@github.com:mcruvinel/learning-french.git`).

Why:
Um repo vazio criado segundos antes da sessão é o sinal mais forte da intenção
do usuário; criar um segundo repo público seria uma ação externa não pedida.

Tradeoffs:
O nome do repo difere da pasta local. Irrelevante para o build (DEC-004).

Revisit when:
Se preferir outro nome: `gh repo rename` + `git remote set-url`. Nenhum código muda.

### DEC-002 — Aula como conteúdo TypeScript tipado; pipeline Markdown adiado

Date: 2026-09-24
Related tasks: TASK-002, TASK-003

Context:
`docs/DECISIONS.md` (C00) previa carregar aulas a partir de Markdown gerado pelo
ChatGPT (C02). A v0.1 precisava de uma aula **interativa** (escolhas, respostas
aceitas, cenários com feedback), e ainda não existe nenhuma aula real do ChatGPT
para saber o formato.

Options considered:
1. Markdown com frontmatter + parser próprio para exercícios.
2. JSON em `/content`.
3. Módulos TypeScript tipados (`src/lessons/lesson-01.ts`).

Decision:
Módulos TypeScript tipados, com uma união discriminada de tipos de passo.

Why:
O compilador valida a forma do conteúdo de graça; nenhuma dependência de parser;
exercícios são estruturas, não prosa. Inventar um formato Markdown de exercício
antes de ver o que o ChatGPT produz seria desenhar para uma suposição.

Tradeoffs:
Conteúdo exige editar um arquivo `.ts` (não é "colar o Markdown do ChatGPT").
Isso contradiz parcialmente a decisão do C00 — registrado lá também.

Revisit when:
Houver 2–3 aulas reais do ChatGPT. Aí o formato delas decide: pedir ao ChatGPT
que gere o próprio `lesson-0N.ts`, ou escrever um conversor Markdown → `Lesson`.

### DEC-003 — Um único objeto em localStorage + parse defensivo

Date: 2026-09-24
Related tasks: TASK-004

Context:
Persistir passo atual, respostas, conclusão e autoavaliação, sobrevivendo a
refresh, a builds novos e a dados malformados.

Options considered:
1. IndexedDB (direto ou via `idb`).
2. localStorage, uma chave por lição/campo.
3. localStorage, um objeto `ProgressState` versionado numa chave.

Decision:
Opção 3: chave `learning-french:v1:progress`, validada por `parseProgress`.

Why:
Poucos KB de dados, síncrono, sem dependência, fácil de inspecionar no DevTools.
Um objeto só torna as transições puras e testáveis.

Tradeoffs:
localStorage pode ser apagado pelo iOS se o site não for usado por semanas
(política de ITP para sites não instalados). Instalado na tela de início, o
risco é menor, mas o progresso **não tem backup**. As notas Markdown exportadas
funcionam como registro durável.

Revisit when:
Perder progresso acontecer de fato, ou precisar de export/import de progresso.

### DEC-004 — `base: './'` em vez de `/learning-french/`

Date: 2026-09-24
Related tasks: TASK-010

Context:
GitHub Pages serve o app em `/<repo>/`. Vite por padrão gera URLs absolutas `/assets/...`.

Options considered:
1. `base: '/learning-french/'` (padrão da documentação do Vite).
2. `base: './'` (URLs relativas).

Decision:
`base: './'`.

Why:
Com `HashRouter`, o documento é sempre o `index.html` da raiz do app, então URLs
relativas sempre resolvem. O mesmo build funciona em `/`, no preview local e em
qualquer nome de repositório — renomear o repo não quebra nada.

Tradeoffs:
Se um dia trocar para `BrowserRouter`, rotas aninhadas quebrariam as URLs
relativas. Isso já é descartado pela decisão de roteamento por hash (C00).

Revisit when:
Trocar de estratégia de roteamento.

### DEC-005 — Service worker escrito à mão, sem Workbox

Date: 2026-09-24
Related tasks: TASK-009

Context:
Offline básico para usar sem rede (metrô, avião, montanha).

Options considered:
1. `vite-plugin-pwa` (Workbox, manifest de precache gerado no build).
2. `public/sw.js` escrito à mão (~70 linhas).
3. Sem service worker (só manifest).

Decision:
Opção 2.

Why:
O requisito é pequeno: um app de 3 arquivos. O plugin traz Workbox e uma camada
de configuração para aprender. O truque que dispensa o manifest de precache:
no `install`, o SW baixa `index.html` e extrai por regex os `./assets/*` que ele
referencia.

Tradeoffs:
Assets de deploys antigos ficam no cache (poucos KB cada); `sw.js` não muda entre
deploys, então o `activate` que limpa caches só roda quando `CACHE` for trocado.
Navegação é network-first: com rede lenta, a abertura espera a rede.

Revisit when:
Cache crescer de forma perceptível, ou abrir com rede ruim ficar lento no uso real.

### DEC-006 — Fala autoconfirmada, sem reconhecimento de voz

Date: 2026-09-24
Related tasks: TASK-005

Context:
Falar em voz alta é essencial para o objetivo (comunicação funcional).

Options considered:
1. Web Speech `SpeechRecognition` para "corrigir" a pronúncia.
2. Autoconfirmação: o aprendiz marca "Falei".

Decision:
Autoconfirmação, com "Continuar sem falar tudo" permitido (metrô, lugar público).

Why:
Reconhecimento de voz não mede pronúncia — só transcreve — e o suporte no iOS é
inconsistente. Um "correto" falso seria pior do que nenhuma avaliação. A métrica
vai para as notas rotulada como autoconfirmada.

Revisit when:
A prática mostrar que falar sozinho não basta — aí a solução provável é gravar e
ouvir a própria voz, não um score.

### DEC-007 — Resposta digitada: acento, apóstrofo e 1 erro contam como acerto

Date: 2026-09-24
Related tasks: TASK-005

Context:
No teclado do iPhone, acentos franceses e apóstrofos custam esforço. O exercício
mede **recuperação** da frase, não ortografia.

Decision:
Três níveis: `exact` (ignora maiúsculas/pontuação), `close` (ignora
acentos/apóstrofos/hífens/espaços, ou 1 edição em respostas de 6+ letras) e
`wrong`. `close` conta como acerto, mas a UI mostra a grafia certa e as notas
registram "Grafia: escrevi X". Respostas curtas (Merci, Oui) exigem as letras certas.

Revisit when:
A ortografia virar objetivo (escrever mensagens, formulários).

### DEC-008 — Playwright fora das dependências do projeto

Date: 2026-09-24
Related tasks: TASK-009, TASK-011

Context:
Precisava de um navegador de verdade (idealmente WebKit, o motor do Safari) para
QA mobile e para rasterizar o ícone SVG em PNG. Chrome não estava instalado.

Decision:
Playwright + WebKit instalados numa pasta temporária; os scripts
(`scripts/qa-mobile.mjs`, `scripts/render-icons.mjs`) carregam via
`createRequire(PLAYWRIGHT_FROM)`.

Why:
São ferramentas usadas raramente; como devDependency, cada `npm ci` do CI
baixaria ~100 MB de navegador sem necessidade.

Tradeoffs:
Rodar os scripts exige um passo manual de instalação (documentado no README).

---

## Task records

## TASK-001 — Inspeção do repositório e documentos operacionais

Status: completed
Date: 2026-09-24
Commit: `85324b4`
Files changed:
- TODO.md
- MEMORY.md

### Problem

Retomar um projeto num estado desconhecido sem destruir trabalho, e deixar um
rastro legível para uma sessão autônoma noturna.

### Solution

Inspeção: `git status` limpo, 1 commit (C00), sem remote, sem CI, sem PWA.
`npm run verify` passando na linha de base. `gh` autenticado; repo vazio
`learning-french` encontrado (DEC-001). O roadmap C00–C07 virou tasks com ID;
o mapeamento ficou no fim do TODO.md.

### Things learned

- O roadmap C01 (cinco abas) teria gerado cinco estados vazios com uma aula só —
  adiado. Exemplo de escopo cortado por falta de evidência.

## TASK-002 — Modelo de conteúdo de aula

Status: completed
Date: 2026-09-24
Commit: `24afb1f`
Files changed:
- src/lessons/types.ts
- src/lessons/index.ts
- src/lessons/lessons.test.ts

### Problem

"A Aula 2 deve ser principalmente conteúdo, não UI nova."

### Solution

Uma `Lesson` tem `phrases: Phrase[]` e `steps: LessonStep[]`. `LessonStep` é uma
**união discriminada** pelo campo `kind`: `intro`, `phrases`, `note`, `choice`,
`recall`, `speak`, `scenario`, `recap`. Os passos referenciam frases por id.

### How it works

- O player faz `switch (step.kind)` e o TypeScript estreita o tipo em cada ramo
  (`renderStep` em `src/lesson/LessonPage.tsx`). Adicionar um `kind` novo sem
  tratá-lo quebra a compilação.
- `index.ts` exporta `lessons` (ordem do curso), `getLesson(id)` e
  `getPhrase(lesson, id)`.
- `lessons.test.ts` valida: ids únicos, referências a frases existentes,
  `answerIndex` dentro do intervalo, opções sem duplicata, exatamente uma opção
  certa por escolha de cenário, recap como último passo, e que toda frase
  praticada (recall/speak) foi apresentada antes num passo `phrases`.

### Key concepts

- União discriminada (discriminated union) e narrowing no TypeScript
- Conteúdo como dado; referências por id; testes de integridade de conteúdo

### Why this approach

Ver DEC-002. Validação em dois níveis: forma pelo compilador, referências pelo teste.

### Alternatives considered

Markdown + parser (sem formato real do ChatGPT para basear); JSON (perde tipos);
componentes por aula (cada aula = código).

### Important code paths

- `src/lessons/types.ts` — o contrato
- `src/lesson/LessonPage.tsx` → `renderStep`
- `src/lesson/stepProps.ts` — `StepProps<S>` que todo passo recebe

### Validation

3 testes de integridade; typecheck estrito.

### Future improvements

- Converter Markdown do ChatGPT → `Lesson` quando o formato existir (DEC-002).

## TASK-003 — Conteúdo da Aula 1

Status: completed
Date: 2026-09-24
Commit: `24afb1f`
Files changed:
- src/lessons/lesson-01.ts

### Problem

Primeira aula para zero absoluto, que gere capacidade social imediata, sem sobrecarga.

### Solution

12 frases em três blocos: **cortesia** (Bonjour, Bonsoir, Au revoir, Merci,
S'il vous plaît), **básicos** (Oui, Non, Excusez-moi) e **apresentação**
(Je m'appelle Matheus, Je suis brésilien, Je parle un peu français,
Parlez-vous anglais ?). 24 passos. Cada bloco segue o ciclo
**input → reconhecimento → recuperação → fala**. Fecham a aula dois
micro-cenários: boulangerie (8h — só com gesto + frases da aula, o
aprendiz consegue comprar um croissant) e escola de esqui (18h,
escuro → Bonsoir; apresentação completa).

### Learning decisions

- **Cortados**: Salut (informal, pouco útil com desconhecidos), Je ne parle pas
  bien français (redundante com "un peu"), Merci beaucoup (virou nota de Merci e
  aparece no cenário).
- **Bonsoir entrou** porque no inverno escurece cedo.
- **Pronúncia sem pseudo-fonética**: as dicas descrevem sons em relação ao
  português ("o 'u' francês é um 'i' com lábios de 'u'"; "'oi' = 'uá'") em vez
  de reescrever o francês com letras do português. IPA aparece pequeno, opcional.
- Quatro regras gerais: acento na última sílaba, consoantes finais mudas, "r" de
  garganta, dígrafos oi/ou/au.
- Nota cultural: Bonjour ao entrar em loja é quase obrigatório.
- Falas dos outros personagens usam francês que o aprendiz ainda não sabe
  ("Qu'est-ce que je vous sers ?", "Un euro vingt") com tradução escondida
  atrás de "Tradução": treina tolerância a não entender tudo.

### Validation

Testes de integridade; revisão do francês feita pelo Claude.
**Não revisado por falante nativo nem pelo currículo do ChatGPT.** Vale pedir ao
ChatGPT para revisar `lesson-01.ts` (especialmente as dicas de pronúncia).

### Future improvements

- Ajustar dicas que se mostrarem confusas no uso real.

## TASK-004 — Persistência local de progresso

Status: completed
Date: 2026-09-24
Commit: `39ab58f`
Files changed:
- src/lib/storage.ts
- src/progress/types.ts
- src/progress/parse.ts
- src/progress/progress.ts
- src/progress/metrics.ts
- src/progress/useProgress.ts
- src/progress/ProgressProvider.tsx
- src/progress/progress.test.ts

### Problem

Progresso precisa sobreviver a refresh e a reabrir o PWA, e tolerar primeira
visita, JSON corrompido, formato antigo e storage indisponível (modo privado).

### Solution

Um objeto `ProgressState` numa chave versionada, lido uma vez e regravado a cada mudança.

### How it works

- **Formato** (`types.ts`): `{ version: 1, lessons: { [lessonId]: LessonProgress } }`.
  `LessonProgress` tem `status` da rodada atual (`in-progress`/`completed`),
  `stepIndex`, `startedAt`, `updatedAt`, `completedAt` (última conclusão,
  sobrevive a "Refazer"), `timesCompleted`, `results` (por id de passo),
  `selfRating`, `difficultPhraseIds`, `reflection`.
- `StepResult` também é união discriminada: `choice {selected, correct}`,
  `recall {answer, outcome}`, `speak {spoken[]}`,
  `scenario {reached, firstTry{turnIndex: bool}}`.
- **Acesso** (`lib/storage.ts`): `readStored`/`writeStored` com prefixo
  `learning-french:v1:` e `try/catch` em tudo — nenhum outro arquivo toca `localStorage`.
- **Parse defensivo** (`parse.ts`): valida campo a campo; descarta a menor parte
  inválida (um resultado, uma lição) em vez de zerar tudo; campos opcionais
  ausentes ganham default (isso também é a "migração" de formatos antigos).
- **Transições puras** (`progress.ts`): `startLesson`, `restartLesson`,
  `goToStep`, `recordResult`, `setSelfRating`, `toggleDifficultPhrase`,
  `setReflection`, `completeLesson`. Recebem `now` como string → testes determinísticos.
- **React** (`ProgressProvider.tsx` + `useProgress.ts`): `useState` com
  inicializador lazy lendo o storage; `useEffect` grava a cada mudança.
  Componentes chamam `update(s => recordResult(s, ...))`.
- **Métricas** (`metrics.ts`): derivadas só do que foi registrado; passo não
  respondido não conta como erro.

### Key concepts

- Serialização JSON e validação em runtime de `unknown`
- Hidratação de estado React a partir de storage (lazy initializer)
- Funções puras + reducer-like updates; versionamento de chave

### Alternatives considered

IndexedDB, chaves separadas, Zustand/Redux (proibidos) — ver DEC-003.

### Validation

14 testes: transições, round-trip JSON, 7 entradas inválidas → estado vazio,
descarte granular, métricas. Integração: refresh retoma passo (jsdom e WebKit),
JSON corrompido abre a Home normalmente.

### Things learned

- `exactOptionalPropertyTypes` força decidir entre `campo?: T` e `campo: T | null`;
  no storage, `null` explícito é mais claro.

### Future improvements

- Export/import de progresso, só se perder dados virar problema real.

## TASK-005 — Player de aula e verificação de respostas

Status: completed
Date: 2026-09-24
Commits: `f3714ed` (UI), `39ab58f` (answers.ts)
Files changed:
- src/lesson/LessonPage.tsx, stepProps.ts, StepFooter.tsx, Lesson.css
- src/lesson/steps/*StepView.tsx (8 arquivos)
- src/lesson/answers.ts + answers.test.ts
- src/components/PhraseCard.tsx
- src/app/App.tsx, src/app/App.test.tsx, src/app/NotFound.tsx

### Problem

Renderizar qualquer aula do modelo como sequência interativa e retomável.

### How it works

- Rota `#/lesson/:lessonId` → `LessonPage` → `LessonPlayer`. No mount chama
  `startLesson` (idempotente). O passo exibido é `lesson.steps[progress.stepIndex]`
  — **o storage é a fonte da verdade da posição**, por isso o refresh retoma.
- Cada passo recebe `StepProps`: `result` já gravado, `onResult`, `onContinue`.
  Resultados são gravados **no momento da resposta**, não ao continuar —
  refresh depois de responder mostra a resposta dada.
- `key={step.id}` remonta o passo (estado local limpo); um effect rola para o
  topo e foca o `h1` do passo (leitores de tela).
- Header: voltar (passo anterior), barra de progresso (`role=progressbar`), sair.
  Rodapé fixo (`position: sticky`) com o botão principal acima do home indicator
  (`env(safe-area-inset-bottom)`).
- **Escolha**: uma tentativa; mostra certo/errado + explicação.
- **Recuperação**: `<input>` com `autocapitalize=none`, `autocorrect=off`,
  `lang=fr`, fonte ≥16px (evita zoom do iOS). Enter envia. "Não lembro — mostrar"
  grava `revealed`. `checkRecall` (DEC-007) usa normalização NFC/NFD e distância de Levenshtein.
- **Fala**: botão "Falei" por frase (`aria-pressed`) — DEC-006.
- **Cenário**: `reached` aponta para o próximo turno "você"; falas do outro até
  ali ficam visíveis. Erro mostra feedback e permite tentar de novo; só a
  primeira tentativa de cada turno vai para `firstTry`.
- **Recap**: métricas, frases tocáveis como "difícil", autoavaliação
  (Difícil/Ok/Fácil), anotação livre, "Concluir aula".

### Key concepts

- União discriminada + componente por variante; estado derivado do storage
- Acessibilidade: foco gerenciado, `aria-pressed`, `role=status`, alvos ≥44px
- iOS: safe areas, zoom em inputs <16px, sticky footer

### Validation

6 testes de integração (`App.test.tsx`), 7 de `checkRecall`; fluxo completo em WebKit.

### Future improvements

- Se errar na recuperação se repetir, considerar repetir a frase errada no fim
  da aula — só com evidência.

## TASK-006 — Home e shell mobile

Status: completed
Date: 2026-09-24
Commit: `f3714ed`
Files changed:
- src/home/HomePage.tsx, Home.css, currentLesson.ts
- src/styles/tokens.css, ui.css; index.html

### How it works

"Aula atual" = primeira aula nunca concluída (senão a última). CTA:
sem progresso → "Começar Aula 1"; em andamento → "Continuar Aula 1" + "Passo X
de Y"; concluída → "Notas da Aula 1", "Rever Aula 1", "Refazer do início" (com
`confirm`). Rodapé honesto: "progresso salvo só neste aparelho".

### Design decisions

- Serifa do sistema (`ui-serif` → New York no iOS) para títulos e texto em
  francês: tom editorial sem baixar fonte. Sans do sistema para UI.
- Paleta existente do C00; verde/vermelho/amarelo só para resultado.
- Sem gradientes além do fade do rodapé fixo; sem animação além da barra.

### Validation

WebKit 390px e 320px, sem overflow horizontal (checado em todos os passos).

## TASK-007 — Áudio com síntese de voz do navegador

Status: completed (som não verificado)
Date: 2026-09-24
Commit: `f3714ed`
Files changed:
- src/lib/speech.ts
- src/components/ListenButtons.tsx

### How it works

`speakFrench(text, {slow})`: `speechSynthesis.cancel()` (novo toque interrompe),
`SpeechSynthesisUtterance` com `lang = 'fr-FR'`, voz `fr-FR` local se houver,
`rate` 0.9 (normal) ou 0.6 (devagar). Sem suporte → `ListenButtons` retorna `null`.

### Validation

**Verified**: botões aparecem no WebKit; somem no jsdom (sem API) e a aula funciona.
**Assumed**: som em francês no iPhone. Headless não reproduz áudio.

### Future improvements

- Se a voz do iOS for ruim para alguma frase, gravar áudio próprio só dessa frase.

## TASK-008 — Exportação Markdown para Obsidian

Status: completed
Date: 2026-09-24
Commits: `cde06e4` (gerador), `f3714ed` (tela)
Files changed:
- src/notes/lessonMarkdown.ts + test
- src/notes/NotesPage.tsx, Notes.css

### How it works

`buildLessonMarkdown(lesson, progress, {appVersion, now})` é função pura.
Frontmatter (`tags`, `lesson`, `date`) + seções: Goal, Vocabulary (tabela das
palavras soltas), Useful phrases (frases terminadas em pontuação), Pronunciation
notes, Exercises/performance, Difficulties (frases marcadas + erros reais com o
que foi escrito), What felt easy (recuperadas com grafia exata e não marcadas),
Reflection (se houver), Next session, Project evidence. Sem dado registrado, a
nota diz "Nenhum exercício registrado" — nunca estima.
Tela: Copiar (`navigator.clipboard`), Baixar (`Blob` + `<a download>`),
Compartilhar (`navigator.share`, só se existir — útil no iOS para mandar ao Obsidian).
`__APP_VERSION__` vem do `package.json` via `define` no Vite.

### Validation

4 testes (ordem das seções, métricas reais, lição intocada, nome de arquivo);
WebKit confere título e métricas na prévia. Copiar/baixar não testados no iPhone.

## TASK-009 — PWA mínimo

Status: completed
Date: 2026-09-24
Commit: `00525a1`
Files changed:
- public/manifest.webmanifest, public/sw.js, public/*.png, public/favicon.svg
- index.html, src/pwa/registerServiceWorker.ts, src/main.tsx
- scripts/render-icons.mjs

### How it works

- Manifest com `start_url`/`scope` relativos (`./`), `display: standalone`,
  ícones 192/512 (+ `maskable`). iOS usa `apple-touch-icon` (180px PNG) e
  `apple-mobile-web-app-*`.
- Ícone: "Fr." em New York com ponto azul; SVG rasterizado por WebKit
  (`render-icons.mjs`), conteúdo dentro da zona segura de ícones maskable.
- SW (DEC-005): install cacheia shell + assets citados no `index.html`;
  navegação network-first com fallback; resto cache-first. Registrado só em produção.

### Validation

**Verified** em WebKit: SW controla a página; cache contém shell + JS/CSS
hasheados; com o servidor HTTP **parado**, reload e deep link
`#/lesson/lesson-01` funcionam.
**Descoberta**: `context.setOffline(true)` do Playwright quebra navegações
servidas pelo SW no WebKit ("internal error"). O teste de offline para o servidor
de verdade em vez de emular.
**Não verificado**: instalação no iPhone.

## TASK-010 — Deploy no GitHub Pages via Actions

Status: blocked
Date: 2026-09-24
Commit: `0a3c0be`
Files changed:
- .github/workflows/deploy.yml
- vite.config.ts (`base: './'`, em `f3714ed`)

### How it works

Push em `main` → job `build` (checkout, Node 24, `npm ci`, `npm run verify`,
configure-pages, upload `dist`) → job `deploy` (`deploy-pages`). Versões das
actions consultadas via API do GitHub na sessão (checkout v7, setup-node v7,
configure-pages v6, upload-pages-artifact v5, deploy-pages v5). Engines
conferidos: jsdom exige Node ≥24.15, vite ≥22.12 — Node 24 atende.

### Blocked

O hook `~/.claude/hooks/block-git-push.sh` recusa qualquer comando Bash que
contenha o texto `git push` (inclusive dentro de strings de documentação — foi
preciso escrever arquivos de outra forma). Decisão: respeitar a política; não
contornar via API. Comandos para o usuário estão no Morning Report.

### Validation

YAML parseado; `npm ci` + `npm run verify` numa worktree limpa; build servido
em `/learning-french/` passa no QA completo. Deploy real: não aconteceu.

## TASK-011 — Validação mobile e QA do fluxo completo

Status: completed
Date: 2026-09-24
Commit: `6785783`
Files changed:
- scripts/qa-mobile.mjs

### How it works

Copia `dist/` para `<tmp>/learning-french/`, sobe `python3 -m http.server`,
e com Playwright WebKit (perfil iPhone 13 e depois 320×568) percorre os 24
passos lendo as respostas do próprio `lesson-01.ts` (Node 26 importa `.ts`
direto, removendo tipos). Recuperação digitada **sem acentos**; reload no meio;
overflow checado a cada passo; recap marca uma frase difícil; confere métricas
nas notas; depois para o servidor e testa offline.

### Things learned

- Screenshots revistos: tipografia legível a 320px; rodapé fixo não cobre conteúdo.
- O script encontrou um bug **dele mesmo** (rótulo do botão muda para "Falei ✓",
  deslocando `nth`), não do app.

## TASK-012 — README e documentação estável

Status: completed
Date: 2026-09-24
Files changed:
- README.md, CHANGELOG.md, docs/DECISIONS.md, CLAUDE.md, TODO.md, MEMORY.md

### Solution

README reescrito (o que o app faz, stack, onde ficam conteúdo e progresso, dev,
QA, deploy, instalação no iPhone). `docs/DECISIONS.md` ganhou ponteiro para o log
aqui e nota de revisão da decisão de Markdown. `CLAUDE.md`: protocolo de sessão
atualizado para tasks com ID + MEMORY.md.

## TASK-013 — Validação no iPhone real

Status: not started
Depends on: TASK-010

O que o headless não prova: som do `speechSynthesis`, teclado sobre o campo de
recuperação, "Adicionar à Tela de Início", offline em modo avião, colar no Obsidian.

---

## Evidence for the article

- **Restrição técnica → decisão de arquitetura**: Pages estático → hash routing
  (C00) → que por sua vez permitiu `base: './'` (DEC-004): uma decisão habilitou a outra.
- **Necessidade de aprendizado → produto**: tolerância a acentos (DEC-007) nasceu
  do teclado do iPhone, não de um requisito genérico; "Continuar sem falar tudo"
  nasceu de estudar em público.
- **Honestidade de métrica**: fala autoconfirmada rotulada como tal; minutos
  "inclui pausas"; passo não respondido não conta como erro.
- **Escopo cortado por falta de evidência**: 5 abas (C01), revisão/SRS (C04) e
  pipeline Markdown (C02) adiados até as aulas reais pedirem.
- **Limite do agente**: o deploy parou numa política local de segurança; o
  agente preparou tudo e devolveu a ação externa ao humano.
- Tamanho: ~2.900 linhas em `src/` (incl. testes e conteúdo); 3 dependências de runtime.
