# Learning French — TODO

Last updated: 2026-09-24 23:10

Regras do projeto em [`CLAUDE.md`](./CLAUDE.md). O que aconteceu e por quê está
em [`MEMORY.md`](./MEMORY.md).

## Current milestone

v0.1 — Aula 1 usável + deploy no GitHub Pages

## Status

- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked
- [-] Rejected / no longer needed

## Tasks

### TASK-001 — Inspeção do repositório e documentos operacionais

Status: [~]
Priority: P0
Area: docs
Depends on: none

Goal:
Entender o estado real do repositório (C00) antes de mudar qualquer coisa, e
criar os dois artefatos de controle da sessão autônoma: `TODO.md` (estado do
trabalho) e `MEMORY.md` (memória do projeto).

Acceptance criteria:
- git status, log, remote, configs, docs, UI e testes inspecionados
- trabalho do usuário não commitado identificado (ou ausência dele confirmada)
- `TODO.md` reestruturado em tasks com ID, preservando o roadmap C00–C07
- `MEMORY.md` criado com estado atual, restrições e log de decisões

Study reference:
- MEMORY.md#task-001

---

### TASK-002 — Modelo de conteúdo de aula (tipos + validação)

Status: [ ]
Priority: P0
Area: learning / frontend
Depends on: TASK-001

Goal:
Uma aula nova deve ser principalmente conteúdo, não código de UI. Definir um
modelo tipado de aula (frases + passos de exercício) que o player sabe renderizar.

Acceptance criteria:
- tipos de domínio explícitos em `src/lessons/types.ts`
- passos cobrem: contexto, input de frases, reconhecimento, recuperação,
  falar em voz alta, micro-cenário, recap
- teste de integridade do conteúdo (ids únicos, referências a frases válidas,
  respostas corretas existentes)
- registro de aulas (`src/lessons/index.ts`) — adicionar a Aula 2 = adicionar
  um arquivo + uma linha

Study reference:
- MEMORY.md#task-002

---

### TASK-003 — Conteúdo da Aula 1: « Bonjour, je m'appelle Matheus »

Status: [ ]
Priority: P0
Area: learning
Depends on: TASK-002

Goal:
Uma primeira aula para zero absoluto que deixa o aprendiz capaz de interação
social básica: cumprimentar, agradecer, pedir por favor, sim/não, se apresentar,
dizer que é brasileiro e que fala pouco francês.

Acceptance criteria:
- subconjunto pequeno de frases (≈12), agrupado em blocos
- dica de pronúncia pensada para falante de português, sem pseudo-fonética
  enganosa; IPA opcional
- exercícios de reconhecimento, recuperação, fala e um micro-cenário real
  (boulangerie)
- conteúdo revisado quanto a correção do francês

Study reference:
- MEMORY.md#task-003

---

### TASK-004 — Persistência local de progresso

Status: [ ]
Priority: P0
Area: frontend
Depends on: TASK-002

Goal:
Progresso da aula (passo atual, respostas, conclusão, autoavaliação) sobrevive
a refresh e a reabrir o PWA.

Acceptance criteria:
- acesso a `localStorage` centralizado e versionado (`learning-french:v1:*`)
- tolera primeira visita, JSON corrompido, formato antigo/estranho e
  `localStorage` indisponível
- lógica de progresso em funções puras testadas

Study reference:
- MEMORY.md#task-004

---

### TASK-005 — Player de aula e verificação de respostas

Status: [ ]
Priority: P0
Area: frontend / learning
Depends on: TASK-002, TASK-004

Goal:
Renderizar qualquer aula do modelo como uma sequência interativa de passos, com
retomada no passo salvo.

Acceptance criteria:
- cada tipo de passo tem um componente pequeno
- recuperação (PT → FR digitado) tolera acentos, apóstrofos, pontuação e um
  erro de digitação em respostas longas
- fala em voz alta = autoconfirmação honesta (sem fingir avaliar)
- cenário com escolhas, feedback e nova tentativa
- teste de integração percorrendo passos e verificando persistência

Study reference:
- MEMORY.md#task-005

---

### TASK-006 — Home e shell mobile

Status: [ ]
Priority: P0
Area: frontend
Depends on: TASK-004

Goal:
Tela inicial com status, aula atual, aulas concluídas e CTA
Começar / Continuar / Refazer Aula 1.

Acceptance criteria:
- CTA muda conforme o progresso salvo
- funciona a partir de 320px, sem overflow horizontal, alvos ≥ 44px
- dark mode intencional (tokens existentes, tipografia editorial)

Study reference:
- MEMORY.md#task-006

---

### TASK-007 — Áudio com síntese de voz do navegador

Status: [ ]
Priority: P1
Area: frontend / learning
Depends on: TASK-005

Goal:
Ouvir cada frase em francês (normal e lento) sem API paga, como melhoria
progressiva.

Acceptance criteria:
- usa `speechSynthesis` com voz `fr-*` quando existir
- sem suporte: botão some e a aula continua funcionando
- nenhuma dependência nova

Study reference:
- MEMORY.md#task-007

---

### TASK-008 — Exportação Markdown para Obsidian

Status: [ ]
Priority: P0
Area: frontend / learning
Depends on: TASK-004

Goal:
No fim da aula, gerar uma nota Markdown com vocabulário, frases, pronúncia,
desempenho real, dificuldades e evidência do projeto.

Acceptance criteria:
- gerador puro e testado; métricas só de dados realmente registrados
- ações: Copiar Markdown e Baixar `.md`
- acessível pela Home depois de concluir

Study reference:
- MEMORY.md#task-008

---

### TASK-009 — PWA mínimo (manifest, ícones, offline básico)

Status: [ ]
Priority: P1
Area: PWA
Depends on: TASK-006

Goal:
Instalar na tela de início do iPhone e reabrir o app sem rede depois do
primeiro carregamento.

Acceptance criteria:
- manifest com nome, cores, ícones PNG; `apple-touch-icon`
- service worker escrito à mão, pequeno, sem dependência
- comportamento offline realmente verificado (ou documentado como não verificado)

Study reference:
- MEMORY.md#task-009

---

### TASK-010 — Deploy no GitHub Pages via Actions

Status: [ ]
Priority: P0
Area: deployment
Depends on: TASK-009

Goal:
URL HTTPS pública servindo o app a partir de um subpath.

Acceptance criteria:
- build funciona em subpath (`/<repo>/`) — verificado localmente
- workflow mínimo: build + verify + deploy-pages
- remote configurado, push feito, Pages habilitado, deploy verificado por HTTP

Study reference:
- MEMORY.md#task-010

---

### TASK-011 — Validação mobile e QA do fluxo completo

Status: [ ]
Priority: P0
Area: testing
Depends on: TASK-005, TASK-006, TASK-008

Goal:
Checar a experiência real num viewport de iPhone: layout, teclado, refresh,
conclusão, exportação.

Acceptance criteria:
- percorrer a Aula 1 inteira num motor WebKit com viewport de iPhone
- sem overflow horizontal em 320px e 390px
- refresh no meio da aula retoma no mesmo passo

Study reference:
- MEMORY.md#task-011

---

### TASK-012 — README e documentação estável

Status: [ ]
Priority: P1
Area: docs
Depends on: TASK-010

Goal:
Outro desenvolvedor entende o projeto, roda, testa e publica só lendo o README.

Acceptance criteria:
- README cobre: objetivo, stack, rodar, build, testes, deploy, onde fica o
  conteúdo, onde fica a persistência, papel do TODO.md e do MEMORY.md
- `CHANGELOG.md` e `docs/DECISIONS.md` atualizados

Study reference:
- MEMORY.md#task-012

---

## Fora da v0.1 (só entra se o aprendizado pedir)

Ideias registradas para não se perderem. Nenhuma está comprometida. A regra:
uma feature só nasce de um problema observado nas aulas reais.

- **Pipeline de aulas em Markdown (antigo C02)** — carregar o Markdown gerado
  pelo ChatGPT. Adiado até existir o formato real de uma aula do ChatGPT; ver
  DEC-002.
- **Navegação em abas: Hoje / Sessões / Frases / Revisão / Progresso (antigo
  C01)** — adiado: com uma aula só, cinco abas seriam cinco estados vazios.
- **Lista de frases com favoritos e "difícil" (antigo C03)** — o recap da Aula 1
  já coleta "frases difíceis"; se a lista crescer e revisar ficar difícil, vira
  tela própria.
- **Fluxo de revisão Novamente / Aprendendo / Sei (antigo C04)** — sem SM-2.
  Só depois de 2–3 aulas mostrarem que revisar entre aulas é um problema.
- **Integração do baseline S01 (antigo C06)**.
- **Reconhecimento de fala** — só se for confiável o bastante; hoje não é
  objetivo.
- **Tag `v0.1.0-mvp`** — criar depois que o usuário validar no iPhone real.

## Histórico: roadmap por sessões C00–C07

O roadmap original (sessões `Cxx`) foi substituído por tasks com ID na sessão
autônoma de 2026-09-24, a pedido do usuário. Mapeamento:

| Sessão | Status | Para onde foi |
| --- | --- | --- |
| C00 — Fundação | concluída (2026-09-17) | commit `ec92453` |
| C01 — Shell mobile e navegação | parcial | TASK-006 (Home); abas adiadas |
| C02 — Pipeline Markdown | adiada | "Fora da v0.1"; DEC-002 |
| C03 — Frases, listening, progresso | parcial | TASK-004, TASK-007 |
| C04 — Fluxo de revisão | adiada | "Fora da v0.1" |
| C05 — PWA e GitHub Pages | nesta sessão | TASK-009, TASK-010 |
| C06 — Baseline S01 | adiada | "Fora da v0.1" |
| C07+ — Iterações por evidência | contínuo | regra geral do backlog |
