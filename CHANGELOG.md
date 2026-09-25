# Changelog

Mudanças relevantes para quem usa o app. Detalhes internos ficam no histórico do
Git, em [`MEMORY.md`](./MEMORY.md) e em [`docs/DECISIONS.md`](./docs/DECISIONS.md).

## [0.1.0] — não publicado ainda

### Adicionado

- Aula 1 — « Bonjour, je m'appelle Matheus »: 12 frases, dicas de pronúncia
  para falante de português, áudio em francês pelo navegador, reconhecimento,
  recuperação digitada, falar em voz alta, cenas na boulangerie e numa escola de esqui,
  recap com autoavaliação e frases difíceis.
- Home com status, aula atual, aulas concluídas e Começar / Continuar / Rever.
- Progresso salvo no aparelho: refresh e reabrir o app retomam no mesmo passo.
- Notas da aula em Markdown para o Obsidian: copiar, baixar `.md`, compartilhar.
- Instalável na tela de início do iPhone; reabre offline após a primeira visita.
- Rodapé e notas mostram a versão com o commit do build (ex.: `0.1.0+741c253`).

- Backup do progresso em .json: salvo ao concluir a aula (no iPhone, pela
  folha de compartilhar → Salvar em Arquivos) e importável na Home para
  continuar em outro aparelho. Vale o mais recente de cada aula.

### Alterado

- O app passa a se chamar “Learning French”. Progresso salvo em versões
  anteriores publicadas não é carregado (a chave de armazenamento mudou).

### Corrigido

- Aula 1: regras de pronúncia corrigidas — o “r” e o “l” finais são
  pronunciados (bonjour, s'il); sílabas de peso quase igual em vez de “força na
  última”; avisos contra hábitos do português (engolir o “r” final, “l” virando
  “u”, nasais terminando em “u”/“i”).
- Aula 1: Bonjour também é “boa tarde”; horário do Bonsoir ajustado para o
  inverno; cena da escola de esqui com falas mais naturais
  (“C'est à quel nom ?”).
- Offline: uma página de erro ou de login de Wi-Fi não pode mais substituir o
  app guardado no aparelho; versões antigas deixam de ocupar espaço.

## Fundação (C00)

- React, TypeScript estrito, Vite, Vitest e lint.
- App shell inicial com a identidade visual do projeto (tema escuro,
  mobile-first).
