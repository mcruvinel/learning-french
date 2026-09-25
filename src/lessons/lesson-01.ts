import type { Lesson } from './types'

/**
 * Aula 1 — from absolute zero to basic social interaction.
 *
 * Deliberately small: 12 phrases in three blocks. Each block is followed by
 * recognition, then retrieval, then speaking aloud; two micro scenarios close
 * the lesson. Pronunciation tips describe sounds relative to Brazilian
 * Portuguese instead of respelling French in Portuguese letters.
 */
export const lesson01: Lesson = {
  id: 'lesson-01',
  number: 1,
  title: "Bonjour, je m'appelle Matheus",
  subtitle: 'Cumprimentar, agradecer e se apresentar',
  estimatedMinutes: 20,
  objectives: [
    'Cumprimentar de dia e à noite, e se despedir',
    'Dizer por favor, obrigado, sim, não e com licença',
    'Dizer seu nome e que você é brasileiro',
    'Avisar que fala pouco francês e perguntar se a pessoa fala inglês',
  ],
  phrases: [
    {
      id: 'bonjour',
      fr: 'Bonjour',
      pt: 'Bom dia / Olá',
      tip: "O “on” é nasal, perto do “om” de “bom”, mas sem fechar os lábios no fim. O “j” é o de “já”. O “ou” soa como “u”. O “r” final vem do fundo da garganta, bem suave.",
      ipa: 'bɔ̃.ʒuʁ',
      note: 'Serve do começo do dia até o fim da tarde. Na França, dizer Bonjour ao entrar numa loja é praticamente obrigatório.',
    },
    {
      id: 'bonsoir',
      fr: 'Bonsoir',
      pt: 'Boa noite (ao chegar)',
      tip: '“oi” em francês soa como “uá”. O começo é o mesmo “bon” nasal de Bonjour.',
      ipa: 'bɔ̃.swaʁ',
      note: 'Para chegar, não para ir dormir. No inverno escurece cedo: você vai usar muito.',
    },
    {
      id: 'au-revoir',
      fr: 'Au revoir',
      pt: 'Tchau / Até logo',
      tip: '“au” soa como “ô”. O “e” de “re” é curto e fraco, quase engolido. “oir” de novo é “uár”.',
      ipa: 'o ʁə.vwaʁ',
    },
    {
      id: 'merci',
      fr: 'Merci',
      pt: 'Obrigado',
      tip: '“e” aberto, como “é”. Força na última sílaba: mer-CI.',
      ipa: 'mɛʁ.si',
      note: 'Merci beaucoup = muito obrigado.',
    },
    {
      id: 's-il-vous-plait',
      fr: "S'il vous plaît",
      pt: 'Por favor',
      tip: '“ou” = “u”. “aî” = “é”. O “t” final não é pronunciado.',
      ipa: 'sil vu plɛ',
      note: 'Forma educada, para desconhecidos. Em cardápios e placas aparece como SVP.',
    },
    {
      id: 'oui',
      fr: 'Oui',
      pt: 'Sim',
      tip: 'Uma sílaba só: o “ou” desliza direto para o “i”.',
      ipa: 'wi',
    },
    {
      id: 'non',
      fr: 'Non',
      pt: 'Não',
      tip: 'Vogal nasal, a mesma de Bonjour. O “n” final não soa como consoante separada.',
      ipa: 'nɔ̃',
    },
    {
      id: 'excusez-moi',
      fr: 'Excusez-moi',
      pt: 'Com licença / Desculpe',
      tip: 'O “u” francês não existe em português: diga “i” e, sem mexer a língua, arredonde os lábios como para “u”. “-ez” soa como “ê”. “moi” = “muá”.',
      ipa: 'ɛk.sky.ze mwa',
      note: 'Para pedir licença ou chamar a atenção de alguém antes de uma pergunta.',
    },
    {
      id: 'je-m-appelle',
      fr: "Je m'appelle Matheus.",
      pt: 'Meu nome é Matheus.',
      tip: '“je” tem um “e” curto e fraco. “appelle” termina em “él”: o último “e” não é pronunciado. Diga seu nome do jeito que você diz em português.',
      ipa: 'ʒə ma.pɛl',
      note: 'Literalmente: “eu me chamo”.',
    },
    {
      id: 'je-suis-bresilien',
      fr: 'Je suis brésilien.',
      pt: 'Sou brasileiro.',
      tip: '“suis” é uma sílaba: o “u” francês deslizando rápido para “i”. O “ien” final é nasal, perto do “em” de “bem”, com a boca um pouco mais aberta.',
      ipa: 'ʒə sɥi bʁe.zi.ljɛ̃',
      note: 'No feminino: Je suis brésilienne (termina em “én”, sem nasal).',
    },
    {
      id: 'je-parle-un-peu',
      fr: 'Je parle un peu français.',
      pt: 'Falo um pouco de francês.',
      tip: '“parle” termina em “l”: o “e” final some. “peu”: diga “ê” arredondando os lábios. Em “français”, o “an” é nasal como em “maçã” e o “s” final é mudo.',
      ipa: 'ʒə paʁl ɛ̃ pø fʁɑ̃.sɛ',
    },
    {
      id: 'parlez-vous-anglais',
      fr: 'Parlez-vous anglais ?',
      pt: 'Você fala inglês?',
      tip: '“-ez” = “ê”. O “s” de “vous” se liga ao “a” de “anglais” e vira som de “z”. A voz sobe no fim, como em qualquer pergunta.',
      ipa: 'paʁ.le vu.z‿ɑ̃.ɡlɛ',
      note: 'Forma educada. Na rua também se ouve: Vous parlez anglais ?',
    },
  ],
  pronunciationNotes: [
    'A força cai na última sílaba: mer-CI, bon-JOUR, au re-VOIR.',
    'Consoantes finais normalmente não são pronunciadas: plaî(t), françai(s), vou(s).',
    'O “r” francês vem do fundo da garganta, com voz. Não é o “r” de “caro” nem o “r” enrolado.',
    '“oi” = “uá”, “ou” = “u”, “au” = “ô”. O “u” francês é um “i” com lábios de “u”.',
  ],
  nextLesson:
    'Sugestão, a confirmar no currículo do ChatGPT: números de 1 a 20, entender preços (“un euro vingt”) e pedir algo simples na boulangerie.',
  steps: [
    {
      kind: 'intro',
      id: 'intro',
      title: 'Hoje: sobreviver aos primeiros 30 segundos',
      paragraphs: [
        'Toda interação na França começa e termina do mesmo jeito: cumprimento, pedido educado, agradecimento, despedida. Com 12 frases você já cobre isso.',
        'O ritmo é sempre o mesmo: ouvir, reconhecer, lembrar sem olhar e falar em voz alta. Fale de verdade, mesmo que baixinho.',
      ],
    },
    {
      kind: 'phrases',
      id: 'block-courtesy',
      title: 'Cortesia básica',
      lead: 'Ouça cada frase e repita em voz alta antes de seguir.',
      phraseIds: ['bonjour', 'bonsoir', 'au-revoir', 'merci', 's-il-vous-plait'],
    },
    {
      kind: 'note',
      id: 'note-pronunciation',
      title: 'Quatro regras de pronúncia para hoje',
      paragraphs: [
        'A força cai na última sílaba: mer-CI, bon-JOUR. Nada de “MÉR-ci”.',
        'Consoantes finais normalmente ficam mudas: o “t” de plaît e o “s” de vous não soam.',
        'O “r” francês vem do fundo da garganta, com voz. Não é o “r” de “caro” nem o “r” enrolado.',
        '“oi” soa “uá”, “ou” soa “u”, “au” soa “ô”.',
      ],
    },
    {
      kind: 'choice',
      id: 'rec-bonjour',
      instruction: 'O que significa?',
      prompt: 'Bonjour',
      promptLang: 'fr',
      promptPhraseId: 'bonjour',
      options: ['Bom dia / Olá', 'Tchau', 'Obrigado', 'Por favor'],
      answerIndex: 0,
    },
    {
      kind: 'choice',
      id: 'rec-merci',
      instruction: 'O que significa?',
      prompt: 'Merci',
      promptLang: 'fr',
      promptPhraseId: 'merci',
      options: ['Por favor', 'Obrigado', 'Com licença', 'Boa noite'],
      answerIndex: 1,
    },
    {
      kind: 'choice',
      id: 'rec-please',
      instruction: 'Como se diz em francês?',
      prompt: 'Por favor',
      promptLang: 'pt',
      options: ['Merci', 'Au revoir', "S'il vous plaît", 'Bonsoir'],
      answerIndex: 2,
    },
    {
      kind: 'choice',
      id: 'rec-bonsoir',
      instruction: 'São 19h e você entra num restaurante. Como cumprimenta?',
      prompt: '19h · restaurante',
      promptLang: 'pt',
      options: ['Au revoir', 'Bonsoir', 'Merci', "S'il vous plaît"],
      answerIndex: 1,
      explanation:
        'À noite, ao chegar: Bonsoir. Bonjour à noite não é um erro grave, mas Bonsoir é o natural.',
    },
    {
      kind: 'phrases',
      id: 'block-basics',
      title: 'Sim, não, com licença',
      lead: 'Três palavras curtas que resolvem muita coisa.',
      phraseIds: ['oui', 'non', 'excusez-moi'],
    },
    {
      kind: 'choice',
      id: 'rec-excusez',
      instruction: 'O que significa?',
      prompt: 'Excusez-moi',
      promptLang: 'fr',
      promptPhraseId: 'excusez-moi',
      options: ['Obrigado', 'Com licença / Desculpe', 'Sim', 'Até logo'],
      answerIndex: 1,
    },
    {
      kind: 'recall',
      id: 'recall-merci',
      promptPt: 'Obrigado',
      phraseId: 'merci',
    },
    {
      kind: 'recall',
      id: 'recall-please',
      promptPt: 'Por favor',
      phraseId: 's-il-vous-plait',
      hint: 'Três palavras. A primeira tem apóstrofo.',
    },
    {
      kind: 'recall',
      id: 'recall-goodbye',
      promptPt: 'Tchau / Até logo',
      phraseId: 'au-revoir',
      hint: 'Duas palavras.',
    },
    {
      kind: 'speak',
      id: 'speak-courtesy',
      title: 'Agora em voz alta',
      instruction:
        'Ouça, depois diga cada frase em voz alta duas vezes. Marque quando tiver falado de verdade.',
      phraseIds: ['bonjour', 'merci', 's-il-vous-plait', 'excusez-moi', 'au-revoir'],
    },
    {
      kind: 'note',
      id: 'note-culture',
      title: 'Bonjour primeiro, sempre',
      paragraphs: [
        'Na França, entrar numa loja, padaria ou recepção sem dizer Bonjour soa rude, mesmo que o resto do pedido seja perfeito.',
        'O roteiro padrão é: Bonjour → pedido com s’il vous plaît → Merci → Au revoir. Você acabou de aprender o roteiro inteiro.',
      ],
    },
    {
      kind: 'phrases',
      id: 'block-intro',
      title: 'Apresentar-se',
      lead: 'Frases inteiras. Não traduza palavra por palavra: aprenda cada uma como um bloco.',
      phraseIds: ['je-m-appelle', 'je-suis-bresilien', 'je-parle-un-peu', 'parlez-vous-anglais'],
    },
    {
      kind: 'choice',
      id: 'rec-un-peu',
      instruction: 'O que significa?',
      prompt: 'Je parle un peu français.',
      promptLang: 'fr',
      promptPhraseId: 'je-parle-un-peu',
      options: [
        'Não falo francês.',
        'Você fala francês?',
        'Falo um pouco de francês.',
        'Falo francês muito bem.',
      ],
      answerIndex: 2,
    },
    {
      kind: 'choice',
      id: 'rec-anglais',
      instruction: 'Você quer saber se a pessoa fala inglês. O que você diz?',
      prompt: 'Você fala inglês?',
      promptLang: 'pt',
      options: [
        'Je suis brésilien.',
        'Parlez-vous anglais ?',
        'Je parle un peu français.',
        'Excusez-moi.',
      ],
      answerIndex: 1,
      explanation: 'Dica prática: Excusez-moi… Parlez-vous anglais ? é mais educado do que só a pergunta.',
    },
    {
      kind: 'recall',
      id: 'recall-name',
      promptPt: 'Meu nome é Matheus.',
      phraseId: 'je-m-appelle',
      hint: 'Começa com “Je m’…”.',
    },
    {
      kind: 'recall',
      id: 'recall-brazilian',
      promptPt: 'Sou brasileiro.',
      phraseId: 'je-suis-bresilien',
    },
    {
      kind: 'recall',
      id: 'recall-english',
      promptPt: 'Você fala inglês?',
      phraseId: 'parlez-vous-anglais',
      alsoAccept: ['Vous parlez anglais ?'],
    },
    {
      kind: 'speak',
      id: 'speak-intro',
      title: 'Apresente-se em voz alta',
      instruction:
        'Diga as quatro frases em sequência, como se estivesse se apresentando a alguém. Repita até sair sem travar.',
      phraseIds: ['je-m-appelle', 'je-suis-bresilien', 'je-parle-un-peu', 'parlez-vous-anglais'],
    },
    {
      kind: 'scenario',
      id: 'scenario-boulangerie',
      title: 'Na boulangerie',
      setting:
        'Paris, 8h. Você entra numa boulangerie. A vendedora olha para você. Você ainda não sabe pedir comida em francês — mas dá para se virar.',
      turns: [
        {
          who: 'you',
          situation: 'Você acabou de entrar.',
          options: [
            { fr: 'Au revoir !', correct: false, feedback: 'Au revoir é para sair, não para chegar.' },
            {
              fr: 'Bonjour !',
              correct: true,
              feedback: 'Isso. Numa loja francesa, a primeira palavra é sempre Bonjour.',
            },
            {
              fr: 'Merci !',
              correct: false,
              feedback: 'Ainda não há o que agradecer. Comece cumprimentando.',
            },
          ],
        },
        {
          who: 'them',
          speaker: 'Vendedora',
          fr: "Bonjour monsieur ! Qu'est-ce que je vous sers ?",
          pt: 'Bom dia, senhor! O que vai querer?',
        },
        {
          who: 'you',
          situation: 'Você aponta para um croissant na vitrine e diz…',
          options: [
            {
              fr: "S'il vous plaît.",
              correct: true,
              feedback: 'Apontar + s’il vous plaît resolve. Pedir pelo nome fica para uma próxima aula.',
            },
            {
              fr: 'Bonsoir.',
              correct: false,
              feedback: 'São 8h da manhã, e você já cumprimentou.',
            },
            {
              fr: 'Non.',
              correct: false,
              feedback: 'Ela não fez uma pergunta de sim ou não. Aponte e peça com educação.',
            },
          ],
        },
        {
          who: 'them',
          speaker: 'Vendedora',
          fr: 'Un croissant ?',
          pt: 'Um croissant?',
        },
        {
          who: 'you',
          situation: 'É isso mesmo.',
          options: [
            {
              fr: 'Excusez-moi.',
              correct: false,
              feedback: 'Excusez-moi é para pedir licença ou chamar atenção.',
            },
            { fr: 'Non.', correct: false, feedback: 'Non diria que não é o croissant.' },
            { fr: 'Oui.', correct: true, feedback: 'Oui. Curto e certo.' },
          ],
        },
        {
          who: 'them',
          speaker: 'Vendedora',
          fr: "Voilà. Un euro vingt, s'il vous plaît.",
          pt: 'Aqui está. Um euro e vinte, por favor.',
        },
        {
          who: 'you',
          situation: 'Você paga e pega o croissant.',
          options: [
            { fr: 'Merci !', correct: true, feedback: 'Merci. Sempre.' },
            {
              fr: "S'il vous plaît.",
              correct: false,
              feedback: 'Você já recebeu. Agora é hora de agradecer.',
            },
            { fr: 'Bonjour !', correct: false, feedback: 'Você já cumprimentou quando entrou.' },
          ],
        },
        {
          who: 'them',
          speaker: 'Vendedora',
          fr: 'Merci à vous. Bonne journée !',
          pt: 'Obrigada a você. Tenha um bom dia!',
        },
        {
          who: 'you',
          situation: 'Você está saindo.',
          options: [
            {
              fr: 'Parlez-vous anglais ?',
              correct: false,
              feedback: 'A conversa já acabou. Hora de se despedir.',
            },
            {
              fr: 'Merci, au revoir !',
              correct: true,
              feedback: 'Perfeito: Merci + Au revoir é a saída padrão.',
            },
            { fr: 'Bonjour !', correct: false, feedback: 'Bonjour é para chegar, não para sair.' },
          ],
        },
      ],
    },
    {
      kind: 'scenario',
      id: 'scenario-chamonix',
      title: 'Na escola de esqui em Chamonix',
      setting:
        'Chamonix, 18h. Já está escuro. Você chega ao balcão da escola de esqui para confirmar a aula de amanhã.',
      turns: [
        {
          who: 'you',
          situation: 'Você chega ao balcão.',
          options: [
            { fr: 'Oui !', correct: false, feedback: 'Ninguém perguntou nada ainda. Cumprimente.' },
            { fr: 'Bonsoir !', correct: true, feedback: 'Já está escuro: Bonsoir.' },
            { fr: 'Au revoir !', correct: false, feedback: 'Você acabou de chegar.' },
          ],
        },
        {
          who: 'them',
          speaker: 'Recepcionista',
          fr: 'Bonsoir ! Vous vous appelez comment ?',
          pt: 'Boa noite! Qual é o seu nome?',
        },
        {
          who: 'you',
          situation: 'Diga seu nome.',
          options: [
            {
              fr: 'Je suis brésilien.',
              correct: false,
              feedback: 'Isso diz de onde você é, não o seu nome.',
            },
            { fr: 'Merci.', correct: false, feedback: 'Ela perguntou o seu nome.' },
            { fr: "Je m'appelle Matheus.", correct: true, feedback: 'Isso.' },
          ],
        },
        {
          who: 'them',
          speaker: 'Recepcionista',
          fr: "Enchantée ! Vous êtes d'où ?",
          pt: 'Muito prazer! O senhor é de onde?',
        },
        {
          who: 'you',
          situation: 'Diga que é brasileiro.',
          options: [
            { fr: 'Je suis brésilien.', correct: true, feedback: 'Isso.' },
            {
              fr: 'Je parle un peu français.',
              correct: false,
              feedback: 'Isso fala do seu francês. Ela perguntou de onde você é.',
            },
            { fr: 'Non.', correct: false, feedback: 'Ela perguntou de onde você é.' },
          ],
        },
        {
          who: 'them',
          speaker: 'Recepcionista',
          fr: 'Ah, le Brésil ! Vous parlez bien français !',
          pt: 'Ah, o Brasil! O senhor fala bem francês!',
        },
        {
          who: 'you',
          situation: 'Agradeça e seja honesto: você fala só um pouco.',
          options: [
            {
              fr: 'Merci ! Je parle un peu français.',
              correct: true,
              feedback: 'Resposta honesta e educada. E ela vai falar mais devagar.',
            },
            { fr: 'Au revoir !', correct: false, feedback: 'A conversa ainda não acabou.' },
            { fr: 'Bonjour !', correct: false, feedback: 'Vocês já se cumprimentaram.' },
          ],
        },
        {
          who: 'them',
          speaker: 'Recepcionista',
          fr: 'Pas de problème. Demain, cours à neuf heures. Bonne soirée !',
          pt: 'Sem problema. Amanhã, aula às nove horas. Boa noite!',
        },
        {
          who: 'you',
          situation: 'Agradeça bastante e despeça-se.',
          options: [
            { fr: 'Excusez-moi !', correct: false, feedback: 'Não há do que pedir licença. Agradeça.' },
            {
              fr: 'Merci beaucoup ! Au revoir !',
              correct: true,
              feedback: 'Merci beaucoup = muito obrigado. Aula 1 aplicada.',
            },
            { fr: 'Oui.', correct: false, feedback: 'Ela se despediu. Responda com a despedida.' },
          ],
        },
      ],
    },
    {
      kind: 'recap',
      id: 'recap',
      title: 'Recapitulando',
    },
  ],
}
