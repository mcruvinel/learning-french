# CLAUDE.md — regras do projeto

App companion pessoal para aprender francês funcional do zero. Software
pessoal para **um único usuário**, não um
SaaS de idiomas.

## Divisão de responsabilidades

- **ChatGPT**: currículo, sessões de francês, exercícios, roleplays, métricas de
  aprendizado, insights de produto, notas do artigo. Gera um arquivo Markdown
  por aula.
- **Claude Code**: implementação do app, repositório, testes, Git, deploy,
  documentação técnica.

O app **não faz nenhuma chamada a API de IA** (nem OpenAI, nem Claude).

## Filosofia de produto

> Aprender → observar um problema real → adaptar o método → implementar só se
> for útil → medir → documentar.

Não construir: autenticação, backend, banco de dados, contas, features sociais,
pagamentos, APIs de IA, abstrações desnecessárias, design system genérico.
Não implementar algo só porque outros apps de idioma têm.

Antes de adicionar uma dependência, perguntar: _isso é materialmente mais
simples ou mais seguro do que implementar o requisito pequeno nós mesmos?_

## Stack

React · TypeScript estrito · Vite · CSS puro · localStorage · Markdown como
fonte de conteúdo · PWA · GitHub Actions → GitHub Pages.

Proibido: Next.js, SSR, Supabase, Firebase, Prisma, Redux, Zustand, Tailwind
(sem motivo concreto), bibliotecas de componentes, serverless functions.

## Ambiente alvo

iPhone · Safari · instalado na tela de início como PWA. Deve funcionar a partir
de ~320px de largura e em subpath do GitHub Pages. Roteamento por **hash**
(`HashRouter`) para que refresh nunca dê 404.

## Design

Mobile-first, calmo, premium, editorial, focado, rápido. Dark-only. Sem estética
gamificada infantil, sem gradientes em excesso, sem animação desnecessária, sem
clichê francês (Torre Eiffel decorativa). Alvos de toque ≥ 44px.

## Padrões de engenharia

- TypeScript estrito; tipos de domínio explícitos.
- Componentes pequenos, nomes claros, funções simples, HTML semântico.
- Evitar abstrações genéricas prematuras, arquivos gigantes, código esperto.
- Acesso ao `localStorage` centralizado e versionado (`learning-french:v1:*`),
  nunca `localStorage.getItem()` espalhado por componentes.
- Testes cobrem lógica que vale proteger. Não perseguir % de cobertura.

## Verificação antes de encerrar uma sessão

```sh
npm run verify   # typecheck + lint + testes + build de produção
```

## Protocolo de sessão de desenvolvimento

Desde 2026-09-24 o trabalho é organizado em **tasks com ID** (`TASK-001`…) em
`TODO.md`, e o conhecimento do projeto vive em `MEMORY.md` (estado atual, log de
decisões `DEC-xxx` e um registro de estudo por task). As sessões `C00`–`C07`
originais estão mapeadas no fim do `TODO.md`. Em cada sessão:

1. Ler `CLAUDE.md`, `TODO.md` e o topo de `MEMORY.md`.
2. Ler o código relevante.
3. Trabalhar **apenas** nas tasks combinadas — não avançar escopo futuro.
4. Marcar a task `[~]` ao começar; `[x]` só depois de checar o aceite.
5. Rodar a verificação (`npm run verify`).
6. Atualizar `TODO.md` e o registro da task em `MEMORY.md`.
7. Fazer commits limpos, um por unidade de trabalho.
8. Reportar: o que foi implementado, decisões, arquivos, verificação,
   limitações conhecidas e a próxima ação.

Decisões relevantes vão para `MEMORY.md#decision-log`.
Mudanças visíveis ao usuário vão para `CHANGELOG.md`.
