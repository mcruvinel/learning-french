# Deploy Now

O primeiro deploy já foi feito (2026-09-25). Depois disso o histórico local foi
reescrito para remover a linha de co-autoria do Claude dos commits (mesmo
conteúdo, hashes novos). Para publicar o histórico reescrito:

```bash
cd <raiz do repositório>
git status                                  # esperado: "nothing to commit, working tree clean"
git push --force-with-lease origin main
gh run watch --exit-status $(gh run list --workflow deploy.yml --limit 1 --json databaseId -q '.[0].databaseId')
curl -sI https://mcruvinel.github.io/learning-french/ | head -1
```

- URL pública: https://mcruvinel.github.io/learning-french/
- Sucesso = run verde (`build` e `deploy`), `HTTP/2 200`, e o rodapé da Home
  mostra `v0.1.0+<hash>` igual a `git rev-parse --short HEAD`.
- Depois de confirmar, o backup local pode ser apagado:
  `git branch -D backup/antes-de-remover-coautor`

Releases seguintes: `git push` normal em `main` publica sozinho.

---

# Morning Report

> Atualizado em 2026-09-25 (sessão de endurecimento da v0.1). A sessão anterior
> (2026-09-24) construiu a v0.1; esta revalidou, revisou a aula e endureceu o
> service worker. Nenhuma feature nova de produto.

## TL;DR

A v0.1 continua pronta **localmente** e agora está mais correta e mais segura
para releases futuros: a Aula 1 foi revisada (regras de pronúncia que
contradiziam a própria aula foram corrigidas), o service worker não pode mais
transformar um 404 ou uma página de Wi-Fi de hotel no "app offline", e o
rodapé mostra o commit do build. **Publicada** em
https://mcruvinel.github.io/learning-french/ (deploy feito pelo usuário e
observado: runs verdes, HTTP 200). Falta publicar o histórico reescrito sem
co-autoria ("Deploy Now").

## What I can do now

- Abrir o app no iPhone e executar o checklist da TASK-013.
- Publicar o histórico reescrito ("Deploy Now").

## What was completed

Sessão 2026-09-25:
- TASK-014 — Revisão crítica do francês e do design da Aula 1
- TASK-015 — Service worker consistente entre releases + id de build visível
- TASK-010 — preflight do deploy; deploy feito pelo usuário e observado

Sessão 2026-09-24:
- TASK-001 a TASK-009, TASK-011, TASK-012 (ver registros abaixo)

## What remains

- TASK-013 — Checklist no iPhone real (humano)

## Deployment

Repository: `git@github.com:mcruvinel/learning-french.git` (público)
Branch: `main`
Commit: HEAD de `main` (`git log -1`) — o hash aparece no rodapé do app publicado
GitHub Pages: https://mcruvinel.github.io/learning-french/
Deployment status: **publicado e observado** em 2026-09-25 — runs `36132278468` (push) e `36132354025` (manual) verdes, `HTTP/2 200`, bundle servindo `0.1.0+8558409` (hash anterior à reescrita do histórico; o próximo push mostra o hash novo)

## Validation

Build: ✅ `npm ci` limpo + `npm run build` (305 kB JS / 96 kB gzip)
Tests: ✅ 34 testes (Vitest + jsdom)
Lint: ✅ oxlint, sem avisos
Typecheck: ✅ `tsc -b` estrito
Mobile: ✅ WebKit, perfil iPhone 13 (390px) e 320px, 24 passos, sem overflow, sem erros de JS. ⚠️ iPhone físico não testado.
Persistence: ✅ refresh no meio retoma o passo (jsdom + WebKit); JSON corrompido não quebra.
PWA: ✅ offline com servidor parado; ✅ ciclo de release A→B (B carrega online, bundle de A removido do cache, 404 cai no shell em cache, B abre offline). ⚠️ "Adicionar à Tela de Início" não verificado.
GitHub Pages: ✅ build servido em `/learning-french/` passa todo o QA; caminhos relativos; SW com escopo `/learning-french/`; YAML do workflow válido. ✅ Deploy real observado (HTTP 200).

## Important decisions

- DEC-009 — Dicas de pronúncia miram as armadilhas do falante brasileiro (novo)
- DEC-010 — O shell offline é sempre um par consistente index.html + bundle (novo)
- DEC-002 — Aula como conteúdo TypeScript tipado
- DEC-004 — `base: './'`
- DEC-005 — Service worker escrito à mão

## Read these tasks to study today's implementation

1. TASK-015 — por que um service worker "network-first" ainda pode prender o app num estado ruim
2. TASK-014 — o que estava errado na aula e por quê
3. TASK-009 — o service worker original, para comparar

## Recommended next action

Fazer a Aula 1 no iPhone seguindo o checklist da TASK-013.
A próxima iteração do produto só será decidida depois do seu relato.

---

# Learning French — Project Memory

> Memória durável do projeto. Não é log bruto: é conhecimento comprimido sobre
> o que foi feito, por quê, o que funciona e o que falta. Estado do trabalho
> fica em [`TODO.md`](./TODO.md); documentação estável em [`README.md`](./README.md).

## Current state

Last updated: 2026-09-25
Current version: 0.1.0 (o build mostra `0.1.0+<commit>`)
Deployment: https://mcruvinel.github.io/learning-french/ (publicado 2026-09-25)
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
- Ciclo de release simulado (build A instalado → build B publicado): B carrega
  online, o bundle de A sai do cache, um 404 cai no shell em cache, B abre offline.
- `npm ci` + `npm run verify` limpos (simulação do CI).
- SSH do usuário autentica no GitHub; `origin` está vazio (primeiro push simples).

**Assumed** (razoável, não verificado):

- `speechSynthesis` no Safari do iOS fala com voz francesa (`lang = 'fr-FR'`).
  Os botões aparecem no WebKit, mas nenhum som foi ouvido.
- Copiar para a área de transferência e baixar `.md` funcionam no iOS Safari/PWA.
- O workflow do GitHub Actions funciona (versões de actions consultadas via
  API; YAML válido; nunca rodou). O run disparado pelo primeiro push deve falhar
  em `configure-pages` porque o Pages ainda não existe — por isso o
  `gh workflow run` em "Deploy Now".
- O token do `gh` é um PAT fine-grained sem acesso às configurações de Actions
  (HTTP 403 ao ler permissões); pode também não conseguir habilitar o Pages.
  "Deploy Now" traz o caminho pela interface web.
- O ícone e o nome "Francês" aparecem bem na tela de início.

**Blocked**:

- Nada. O Claude continua sem poder rodar push (hook local): publicar é sempre ação do usuário.

### What is incomplete

- Validação no iPhone real (TASK-013).
- Francês da Aula 1 revisado criticamente (TASK-014), mas não por falante nativo.
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

Rodar "Deploy Now" e fazer a Aula 1 no iPhone (checklist da TASK-013).

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
Assets de deploys antigos ficavam no cache (~300 kB cada) — **corrigido na
TASK-015/DEC-010**, que também passou a rejeitar respostas ruins como shell.
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

### DEC-009 — Dicas de pronúncia miram as armadilhas do falante brasileiro

Date: 2026-09-25
Related tasks: TASK-014

Context:
A primeira versão da Aula 1 descrevia sons de forma genérica ("consoantes finais
são mudas", "força na última sílaba"). A revisão mostrou que as regras
genéricas contradiziam palavras da própria aula (bonjou**r**, s'i**l**) e não
avisavam dos erros que um brasileiro realmente comete.

Options considered:
1. Manter regras gerais curtas e deixar exceções para depois.
2. Dicas escritas a partir dos erros previsíveis de quem fala português do Brasil.

Decision:
Opção 2. Cada dica diz o que fazer **e** qual hábito do português evitar:
não engolir o "r" final ("falá"), "l" de fim de sílaba com a língua nos dentes
(não "Brasiu"), vogais nasais sem o "u"/"i" final de "bom", "bem", "não", e
sílabas de peso quase igual em vez de acento forte.

Why:
O aprendiz já tem um sistema fonológico. O erro mais provável não é "não saber
o som", é transferir o hábito do português. Uma regra que o próprio conteúdo
contradiz ensina a desconfiar das regras.

Tradeoffs:
Dicas um pouco mais longas. A aula não ganhou frases novas.

Revisit when:
O relato do uso real mostrar qual dica funcionou e qual confundiu.

### DEC-010 — O shell offline é sempre um par consistente index.html + bundle

Date: 2026-09-25
Related tasks: TASK-015

Context:
O projeto terá vários releases. O service worker original (DEC-005) era
network-first para a página, mas gravava **qualquer** resposta de navegação como
`index.html` e gravava o HTML novo antes do bundle novo.

Options considered:
1. Trocar por Workbox / `vite-plugin-pwa`.
2. Corrigir o SW à mão: validar a resposta e atualizar o shell de forma atômica.
3. Tirar o service worker (sem offline).

Decision:
Opção 2. Uma função `refreshShell(html)` usada na instalação e após cada
navegação boa: baixa os assets referenciados, só então grava o `index.html`, e
remove bundles não referenciados. Só vira shell uma resposta 200, `text/html`,
sem redirect.

Why:
Os bugs eram concretos e pequenos (demonstrados pelo QA contra o SW antigo);
a correção é ~30 linhas. Workbox resolveria o precache, mas não a regra de
"não aceitar uma página de portal como app", que precisaria ser escrita de
qualquer forma.

Tradeoffs:
Num release novo, o bundle pode ser baixado duas vezes (pela página e pelo
`refreshShell`). Um app aberto em segundo plano no iOS continua na versão
carregada até ser relançado — o rodapé mostra qual build está rodando.

Revisit when:
O app passar a ter mais de um bundle (code splitting) ou assets grandes (áudio).

---

## Task records

## TASK-001 — Inspeção do repositório e documentos operacionais

Status: completed
Date: 2026-09-24
Commit: `47e4d52`
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
Commit: `43ecf83`
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
Commit: `43ecf83`
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
  garganta, dígrafos oi/ou/au. **As duas primeiras estavam erradas ou enganosas
  e foram corrigidas na TASK-014** (r/l finais soam; sílabas de peso igual).
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
Commit: `dd81e41`
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
Commits: `44f4790` (UI), `dd81e41` (answers.ts)
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
Commit: `44f4790`
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
Commit: `44f4790`
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
Commits: `4367b0a` (gerador), `44f4790` (tela)
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
`__APP_VERSION__` vem do `package.json` via `define` no Vite (desde a
TASK-015 inclui o commit: `0.1.0+825826f`).

### Validation

4 testes (ordem das seções, métricas reais, lição intocada, nome de arquivo);
WebKit confere título e métricas na prévia. Copiar/baixar não testados no iPhone.

## TASK-009 — PWA mínimo

Status: completed
Date: 2026-09-24
Commit: `0c5c9d7`
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
**Revisado na TASK-015**: o SW desta task gravava qualquer resposta como shell
e nunca limpava bundles antigos — ver DEC-010.

## TASK-010 — Deploy no GitHub Pages via Actions

Status: completed (push e habilitação do Pages feitos pelo usuário)
Date: 2026-09-24
Commit: `ecb9209`
Files changed:
- .github/workflows/deploy.yml
- vite.config.ts (`base: './'`, em `44f4790`)

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

### Preflight (2026-09-25)

Verificado sem enviar nada:
- `dist/index.html` sem caminhos absolutos; SW registrado como `./sw.js`
  (escopo `/learning-french/`); manifest com `start_url`/`scope` `./`.
- Roteamento por hash: nenhuma rota chega ao servidor; refresh e deep link
  funcionam online e offline.
- Repo público, `default_branch` main, sem Pages, sem environments.
- `git ls-remote origin` e `ssh -T git@github.com` funcionam com a chave do usuário.
- O `configure-pages` não consegue habilitar o Pages com o `GITHUB_TOKEN`; por
  isso o passo manual (API ou interface web) em "Deploy Now".
- Os comandos de "Deploy Now" nunca foram executados — são o plano, não um resultado.

### Result (observado em 2026-09-25)

O usuário fez o push e habilitou o Pages. Observado via `gh`/`curl`: run do
push (`36132278468`) e run manual (`36132354025`) verdes; o push não falhou em
`configure-pages`, então o Pages já estava habilitado antes do push;
`https://mcruvinel.github.io/learning-french/` responde `HTTP/2 200` e o bundle
contém `0.1.0+8558409`.

Depois, a pedido do usuário, o histórico foi reescrito localmente
(`git filter-branch --msg-filter`) para remover as linhas
`Co-Authored-By: Claude` de todos os commits: mesmo conteúdo, hashes novos
(esta memória já cita os hashes novos). Backup local:
`backup/antes-de-remover-coautor`. Publicar exige `--force-with-lease`
("Deploy Now").

## TASK-011 — Validação mobile e QA do fluxo completo

Status: completed
Date: 2026-09-24
Commit: `7c0c61d`
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

Status: not started (tarefa humana)
Depends on: TASK-010

O que o headless não prova. Marque conforme for fazendo e anote o que falhar:

- [ ] 1. Safari abre https://mcruvinel.github.io/learning-french/ e o rodapé mostra `v0.1.0+<hash>` do último commit.
- [ ] 2. Compartilhar → **Adicionar à Tela de Início**: ícone "Fr." e nome "Francês" aparecem.
- [ ] 3. Abrir pelo ícone: tela cheia, sem barra do Safari, topo não fica sob o notch/relógio.
- [ ] 4. **Ouvir** em "Cortesia básica" produz voz **francesa** (anotar qual voz; com o botão de silencioso ligado também?).
- [ ] 5. **Devagar** soa claramente mais lento e ainda natural.
- [ ] 6. Recuperação: o teclado não cobre o campo nem o botão Verificar; "Retorno" envia; sem zoom na tela.
- [ ] 7. No meio da aula, fechar o app (deslizar para cima) e reabrir: volta no mesmo passo.
- [ ] 8. Terminar a Aula 1 inteira, marcar frases difíceis e escrever a anotação.
- [ ] 9. Notas → **Copiar Markdown** → colar numa nota nova no Obsidian (testar também Compartilhar).
- [ ] 10. Modo avião → abrir pelo ícone: a Home aparece com o progresso; entrar na aula funciona.

Ao terminar, relatar: o que funcionou, o que foi difícil, o que pareceu
desnecessário. A próxima iteração nasce desse relato.

## TASK-014 — Revisão crítica do francês e do design da Aula 1

Status: completed
Date: 2026-09-25
Commit: `f264fee`
Files changed:
- src/lessons/lesson-01.ts
- src/app/App.test.tsx (rótulo da opção de Bonjour)

### Problem

A Aula 1 foi escrita numa sessão autônoma sem revisão. Um aprendiz de zero
absoluto confia em cada regra; um erro ali vira hábito de pronúncia.

### What was reviewed

Francês, naturalidade, utilidade prática, dicas de pronúncia para
brasileiro, notas culturais, traduções, respostas dos exercícios, realismo dos cenários.

### Corrections

| Onde | Antes | Depois | Por quê |
| --- | --- | --- | --- |
| Regra geral | "Consoantes finais ficam mudas" | Mudas, **exceto r e l** finais | A regra fazia o aprendiz calar o r de bonjour/bonsoir/au revoir e o l de s'il |
| Regra geral | "A força cai na última sílaba: mer-CI" | Sílabas de peso quase igual; a última um pouco mais longa | Francês não tem acento de palavra forte; "mer-CI" enfático soa estrangeiro |
| "r" | Só dizia o que o r não é | Perto do "rr" de "carro", mais suave e com voz; nunca engolir o r final | Guia positivo + hábito brasileiro de engolir r final ("falá") |
| "l" | Não mencionado | "l" com a língua nos dentes, nunca "u" ("Brasiu") | Vocalização do l é o erro brasileiro mais previsível em s'il, appelle, parle |
| Nasais | "como 'om' de bom", "como 'em' de bem" | Mesma vogal, **sem** o "u"/"i" final (bõu, bẽi, não) | O português ditonga as nasais; o francês não |
| Bonjour | "Bom dia / Olá" | "Olá / Bom dia / Boa tarde" | Usado até o fim da tarde; a nota já dizia isso |
| Bonsoir | Horário fixo de escurecer | Troca por volta das 18h; no inverno já está escuro | O pôr do sol varia; a regra social é por volta das 18h |
| brésilien | — | "bré" com "ê" fechado | Brasileiro tende a abrir para "bré" como "é" |
| français | "an como em maçã" | Perto do "ã", com a boca mais aberta | [ɑ̃] é mais aberto e posterior que o "ã" |
| Excusez-moi | — | Nota: no metrô, "Pardon" | É o que se ouve de fato para passar/esbarrar (nota, não frase nova) |
| Nota cultural | — | "Bonjour, monsieur / madame" | A vendedora do cenário já usa; o aprendiz precisa reconhecer |
| Cena da escola de esqui | "Vous vous appelez comment ?" | "C'est à quel nom ?" | É a pergunta real num balcão com reserva; serve para hotel e restaurante |
| Cena da escola de esqui | "Enchantée ! Vous êtes d'où ?" | "Très bien. Vous venez d'où ?" | "Enchantée" após dar um nome de reserva soa estranho |
| Cena da escola de esqui | "Demain, cours à neuf heures" | "Votre cours est demain à neuf heures" | Frase telegráfica → frase natural; "Pas de souci" é o mais comum hoje |
| Feedback | "E ela vai falar mais devagar" | "Muitas vezes a pessoa passa a falar mais devagar" | Não prometer o que não se controla |

Mantido de propósito: 12 frases; "Parlez-vous anglais ?" (a nota já cita
"Vous parlez anglais ?", aceito na resposta digitada); "Tchau / Até logo" →
Au revoir (no Brasil "tchau" serve com desconhecidos; Salut ficou fora por ser
informal); apontar + "S'il vous plaît" na boulangerie (pedir pelo nome é da
próxima aula).

### Validation

Testes de integridade e fluxo passam; QA WebKit percorre a aula nova a 390px e 320px.
Não revisado por falante nativo.

### Things learned

- Uma regra simplificada que o próprio conteúdo contradiz é pior que nenhuma regra.
- As armadilhas previsíveis vêm da língua materna (DEC-009), não da língua-alvo.

## TASK-015 — Service worker consistente entre releases + id de build

Status: completed
Date: 2026-09-25
Commits: `9432751` (SW + QA), `825826f` (id de build)
Files changed:
- public/sw.js
- scripts/qa-mobile.mjs
- vite.config.ts, src/vite-env.d.ts

### Problem

O projeto terá vários releases, usados no iPhone em redes ruins (hotel,
montanha). Problemas concretos do SW original:
1. Gravava qualquer resposta de navegação como `index.html`: um 404 durante um
   deploy do Pages ou uma página de login de Wi-Fi viraria o "app offline".
2. Com resposta ruim online, mostrava o erro em vez do shell em cache.
3. Gravava o HTML novo antes do bundle novo: se a rede caísse no meio, o próximo
   início offline teria HTML apontando para um bundle ausente (tela branca).
4. Nunca removia bundles antigos (~300 kB por release).
5. Não havia como saber qual build o celular estava rodando.

### Solution

- `refreshShell(html)`: baixa os assets que faltam, **depois** grava o
  `index.html`, **depois** apaga assets em `/assets/` que o novo HTML não referencia.
- `isGoodShell(response)`: só `ok`, sem `redirected`, `content-type` HTML.
- Navegação: rede → se boa, devolve e atualiza o shell em segundo plano
  (`event.waitUntil`); se falha ou é ruim, devolve o shell em cache.
- `CACHE` passou para `learning-french-v2` (o `activate` apaga o v1).
- `__APP_VERSION__` = `versão+commit curto` (`git rev-parse` no build;
  `-dirty` se houver mudança não commitada). Aparece no rodapé e nas notas.

### Key concepts

- Ciclo de vida do SW: install → activate → fetch; `skipWaiting`, `clients.claim`
- Consistência de cache: atualizar dependências antes do "ponteiro" (index.html)
- `Response.redirected`, captive portals, network-first com validação

### Why this approach

Ver DEC-010. Também verificado: o navegador checa o `sw.js` sem cache HTTP
(`updateViaCache: 'imports'` padrão), então mudar o `sw.js` num release futuro
é detectado.

### Validation

Nova fase no `scripts/qa-mobile.mjs`: instala build A, "publica" build B
(bundle novo, bundle de A apagado do servidor), recarrega online → B carregado,
A fora do cache; servidor responde 404 → shell em cache; servidor parado → B
offline. **Rodado contra o SW antigo, falha em 3 checks** (A não removido, 404
substitui o app, B não abre offline porque o 404 virou o shell). Com o novo, passa.

### Things learned

- "Network-first" não basta: também é preciso decidir **qual** resposta de rede
  merece virar o shell.
- O teste de regressão só vale se falhar no código antigo — foi conferido.

### Future improvements

- Nenhuma agora. Se houver code splitting ou áudio gravado, revisar DEC-010.

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
- **Revisão que achou erro de ensino**: a regra "consoantes finais são mudas",
  escrita pelo próprio agente, contradizia bonjour/s'il na mesma aula (TASK-014).
- **Restrição de uso real → engenharia**: Wi-Fi de hotel com portal de login levou
  a validar respostas no service worker (TASK-015).
- Tamanho: ~2.900 linhas em `src/` (incl. testes e conteúdo); 3 dependências de runtime.
