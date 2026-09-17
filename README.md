# Learning French

Companion app pessoal para aprender francês do zero.

Não é um produto. É software pessoal para um único usuário, construído junto com
o aprendizado.

## O experimento

Três objetivos entrelaçados:

1. Aprender francês funcional para situações práticas.
2. Construir um app de estudo cujas features nasçam de necessidades reais de
   aprendizado — não de suposições.
3. Coletar evidência técnica e de aprendizado para um artigo futuro sobre
   aprender francês com o ChatGPT enquanto um agente de codificação constrói o
   software de apoio.

A regra que governa o backlog:

> Aprender → observar um problema real → adaptar o método → implementar só se for
> útil → medir → documentar.

**O ChatGPT** cuida do currículo, das aulas, dos exercícios, dos roleplays e das
métricas de aprendizado, e gera um arquivo Markdown por aula.
**O Claude Code** cuida do app, do repositório, dos testes, do deploy e da
documentação técnica.

O app em si **não faz nenhuma chamada a API de IA**.

## Arquitetura

| Escolha | Motivo |
| --- | --- |
| React + TypeScript + Vite | SPA estática, build rápido, tipos estritos |
| CSS puro com tokens | App pequeno; um design system genérico não se justifica |
| Roteamento por hash | GitHub Pages é estático — refresh nunca pode dar 404 |
| Markdown no repositório | Fonte da verdade do conteúdo, sem backend nem CMS |
| localStorage versionado | Progresso local, sem contas e sem banco de dados |
| GitHub Pages + Actions | Hospedagem gratuita, sem serviço pago |

Sem backend. Sem banco de dados. Sem autenticação. Sem serviço pago.

```
src/
  app/       # shell da aplicação
  styles/    # tokens e estilos globais
  lib/       # lógica de domínio e acesso a storage (a partir do C03)
content/     # aulas em Markdown (a partir do C02)
docs/        # decisões técnicas e de produto
```

## Desenvolvimento

```sh
npm install
npm run dev       # servidor local
npm run verify    # typecheck + lint + testes + build de produção
```

Rode `npm run verify` antes de encerrar qualquer sessão de desenvolvimento.

## Documentos do projeto

- [`CLAUDE.md`](./CLAUDE.md) — regras que guiam a implementação
- [`TODO.md`](./TODO.md) — roadmap por sessão de desenvolvimento
- [`docs/DECISIONS.md`](./docs/DECISIONS.md) — decisões e o porquê delas
- [`CHANGELOG.md`](./CHANGELOG.md) — mudanças visíveis ao usuário

## Instalação no iPhone

Chega no C05, junto com a publicação no GitHub Pages.
