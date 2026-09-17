# TODO — roadmap de desenvolvimento

Sessões de desenvolvimento do Claude Code. Regras em [`CLAUDE.md`](./CLAUDE.md).

Status: `pendente` · `em andamento` · `concluída`

---

## C00 — Fundação de repositório e engenharia — **concluída** (2026-09-17)

Objetivo: base limpa de projeto.

- [x] inspecionar o diretório antes de mudar qualquer coisa
- [x] inicializar o Git
- [x] criar o projeto React + TypeScript + Vite
- [x] estabelecer estrutura de pastas clara
- [x] criar `CLAUDE.md`
- [x] criar `TODO.md`
- [x] criar `docs/DECISIONS.md`
- [x] criar `CHANGELOG.md`
- [x] configurar lint e typecheck
- [x] teste básico (smoke test do shell)
- [x] app shell inicial
- [x] build de produção funcionando
- [x] `.gitignore` sensato
- [x] README explicando o experimento e a arquitetura
- [x] commit inicial

---

## C01 — Shell mobile e navegação — pendente

Objetivo: esqueleto de app real, usável no iPhone.

- [ ] layout mobile-first
- [ ] navegação inferior ergonômica
- [ ] Hoje
- [ ] Sessões
- [ ] Frases
- [ ] Revisão
- [ ] Progresso
- [ ] comportamento responsivo
- [ ] estados vazios básicos

Dados de placeholder só onde for inevitável. Não construir a funcionalidade
completa ainda.

Aceite: navegação funciona; sem overflow horizontal em telas estreitas;
controles de toque usáveis; cada área tem um estado vazio com propósito;
build/typecheck/testes passam.

---

## C02 — Pipeline de conteúdo Markdown — pendente

Objetivo: arquivos Markdown de aula como fonte de conteúdo.

- [ ] `/content/sessions`
- [ ] uma sessão de exemplo/bootstrap
- [ ] carregamento de Markdown
- [ ] parsing de frontmatter
- [ ] modelo de domínio tipado da sessão
- [ ] erros de parsing tratados com elegância
- [ ] lista de sessões
- [ ] detalhe de sessão
- [ ] renderização das seções úteis da aula

Aceite: adicionar um arquivo Markdown disponibiliza a sessão automaticamente,
sem editar tela nenhuma; conteúdo malformado falha sem quebrar o app; o código
é simples de entender rápido.

---

## C03 — Frases, listening e progresso local — pendente

Objetivo: transformar o conteúdo das aulas em algo útil entre as sessões.

- [ ] modelo de frase útil
- [ ] lista de frases
- [ ] suporte a categorias/tags
- [ ] detalhe da frase
- [ ] TTS nativo do navegador em francês, quando suportado
- [ ] velocidade normal, velocidade lenta, repetir
- [ ] favoritos
- [ ] estado de frase difícil
- [ ] abstração de localStorage versionada
- [ ] estado básico de conclusão de sessão

Aceite: dá para abrir o app numa tela de iPhone e revisar/ouvir frases; o estado
persiste após reload; TTS indisponível é tratado com elegância.

---

## C04 — Fluxo de revisão — pendente

Objetivo: o primeiro loop de prática genuinamente útil.

- [ ] marcação Novamente / Aprendendo / Sei
- [ ] armazenar estado de revisão, último timestamp e contagem
- [ ] tela de Revisão priorizando: Novamente → Aprendendo → não vistas → Sei

Sem SM-2 nem qualquer sistema complexo de repetição espaçada ainda.

Aceite: o loop de revisão pode ser completado; o estado persiste; a ordenação é
determinística e testável; a implementação deixa espaço para iterar depois.

---

## C05 — PWA e publicação no GitHub Pages — pendente

Objetivo: publicar o MVP usável antes da sessão de francês S01.

- [ ] web app manifest
- [ ] metadados de instalação
- [ ] ícone do projeto
- [ ] app shell offline
- [ ] cache razoável
- [ ] roteamento compatível com GitHub Pages
- [ ] deploy via GitHub Actions
- [ ] `base` do Vite correto para o subpath
- [ ] validação em produção
- [ ] criar o repositório no GitHub e configurar o remote
- [ ] instruções de instalação no iPhone no README
- [ ] tag `v0.1.0-mvp`

Aceite: app acessível por URL HTTPS pública; navegação funciona hospedada;
refresh não quebra a rota; instalável na tela de início do iPhone; o shell
reabre offline depois de um primeiro carregamento online.

**Este é o ponto em que a sessão de francês S01 pode começar.**

---

## C06 — Integração do baseline — pendente

Objetivo: preparar o app para exibir os dados reais do baseline de S01.

**Não inventar conteúdo de S01 antes de o ChatGPT gerar.**

Aceite: o S01 real pode ser colocado no diretório de conteúdo sem mudança de
código; o conteúdo é parseado e exibido; campos de métricas de aprendizado são
representáveis sem redesenhar o app.

---

## C07+ — Iterações guiadas por evidência — pendente

Sem backlog fixo. Novas sessões nascem apenas de: problemas de aprendizado
observados, necessidades práticas, bugs, problemas de usabilidade ou
necessidades de medição para o artigo.

Todo pedido futuro registra: Problema → Hipótese → Implementação mínima →
Resultado.
