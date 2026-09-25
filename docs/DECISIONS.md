# Decisões

Registro das decisões de produto e técnicas que valem explicar. Detalhes triviais
de implementação não entram aqui.

> **A partir de 2026-09-24**, novas decisões são registradas em
> [`MEMORY.md` → Decision log](../MEMORY.md#decision-log) (`DEC-001`…), junto
> com o registro de estudo de cada task. Este arquivo guarda as decisões da
> fundação (C00).

Formato:

```md
## Decisão

### Problema
### Opções consideradas
### Decisão
### Por quê
### Resultado
### Nota para o artigo
```

---

## Roteamento por hash em vez de history API

### Problema

O app será hospedado no GitHub Pages, que serve apenas arquivos estáticos a
partir de um subpath (`/learning-french/`). Com roteamento por history API, um
refresh em `/sessions` pede esse caminho ao servidor, que não tem arquivo lá e
responde 404. O truque comum (copiar `index.html` para `404.html`) funciona, mas
adiciona um redirect visível e um estado intermediário estranho.

### Opções consideradas

1. `BrowserRouter` + hack do `404.html`.
2. `HashRouter` do react-router-dom.
3. Router próprio em hash, sem dependência (~60 linhas).

### Decisão

`HashRouter` do `react-router-dom`.

### Por quê

O hash nunca chega ao servidor, então refresh e deep link funcionam sem hack e
sem configuração de servidor. Entre escrever um router próprio e usar o
react-router, a escolha foi pelo segundo: é a única dependência de runtime além
do React, e o custo de manutenção de um router caseiro só apareceria mais tarde,
quando a navegação crescesse.

### Resultado

Uma rota `*` no C00. As cinco áreas entram no C01.

### Nota para o artigo

Restrição de hospedagem (Pages estático) determinando uma escolha de arquitetura
de frontend logo na primeira sessão de desenvolvimento — antes de existir
qualquer conteúdo de aprendizado.

---

## Tema dark-only

### Problema

Suportar claro e escuro dobra o trabalho de ajuste visual e o custo de cada tela
nova, num app de um usuário só.

### Opções consideradas

1. Dark-only.
2. Dark padrão + claro via `prefers-color-scheme`.

### Decisão

Dark-only, com `color-scheme: dark` e tokens em `:root`.

### Por quê

A referência visual do projeto define apenas o dark; um tema claro seria
invenção. As regras do projeto dizem que dark mode não deve virar um projeto em
si. Os tokens estão centralizados em `src/styles/tokens.css`, então um tema claro
é uma adição, não uma reescrita.

### Resultado

Um único conjunto de tokens para manter.

### Nota para o artigo

Exemplo de escopo cortado por evidência ausente: o tema claro só entra se o uso
real (ler no sol, na rua) mostrar que é necessário.

---

## Conteúdo em Markdown versionado no Git, sem CMS

### Problema

O ChatGPT gera um arquivo Markdown por aula. Esse conteúdo precisa chegar ao app.

### Opções consideradas

1. Banco de dados ou CMS headless.
2. Arquivos Markdown commitados no repositório.
3. Conteúdo digitado direto em componentes React.

### Decisão

Arquivos Markdown commitados no repositório como fonte da verdade.

### Por quê

Sem backend, sem conta, sem serviço pago — as três coisas que as regras do
projeto proíbem. O Git passa a ser o histórico do aprendizado, o que também
serve de evidência para o artigo. Conteúdo em componentes tornaria cada aula
nova uma mudança de código.

### Resultado

Revisado em 2026-09-24 (MEMORY.md, DEC-002): a Aula 1 interativa foi escrita
como conteúdo TypeScript tipado; o pipeline de Markdown do ChatGPT fica adiado
até existir o formato real de uma aula gerada. O princípio (conteúdo versionado
no Git, sem CMS) continua valendo.

### Nota para o artigo

O histórico do Git vira, sem esforço extra, o diário do experimento de
aprendizado.
