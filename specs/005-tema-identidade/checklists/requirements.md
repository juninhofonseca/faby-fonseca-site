# Checklist de Qualidade da Especificação: Identidade Visual e Portfólio Centrado na Galeria

**Propósito**: validar completude e qualidade da especificação antes do planejamento
**Criado em**: 2026-10-25
**Funcionalidade**: [spec.md](../spec.md)

## Qualidade do Conteúdo

- [x] Sem detalhes de implementação (linguagens, frameworks, APIs)
- [x] Focada no valor para o usuário e nas necessidades do negócio
- [x] Escrita para partes interessadas não técnicas
- [x] Todas as seções obrigatórias preenchidas

## Completude dos Requisitos

- [x] Sem marcadores de esclarecimento pendentes
- [x] Requisitos testáveis e sem ambiguidade
- [x] Critérios de sucesso mensuráveis
- [x] Critérios de sucesso agnósticos de tecnologia
- [x] Todos os cenários de aceite definidos
- [x] Casos limite identificados
- [x] Escopo claramente delimitado
- [x] Dependências e assunções identificadas

## Prontidão da Funcionalidade

- [x] Todos os requisitos funcionais têm critérios de aceite claros
- [x] Cenários de usuário cobrem os fluxos principais
- [x] A funcionalidade atende aos resultados mensuráveis definidos em Critérios de Sucesso
- [x] Nenhum detalhe de implementação vazou para a especificação

## Observações

- **Licença do tema**: o repositório `pysunday/DesignPhotographyPortfolio` não publica arquivo de
  licença (o GitHub retorna `license: null`), ao contrário do que dizia a descrição inicial. Decisão
  registrada com a responsável em 2026-10-25: recriar a linguagem visual no stack atual, sem copiar
  código. Isso elimina a dependência de licença e evita as ~45 dependências do tema (React, HeroUI,
  Tailwind, daisyUI, Alpine, i18n, Giscus).
- **Analytics**: a descrição inicial pedia uma política que descrevesse analytics. A responsável
  confirmou que o site **não** terá analytics; a política passa a afirmar isso explicitamente.
- **E-mail**: mantido `juninho.fonseca@gmail.com`. A troca por um endereço da Faby exige atualizar a
  chave do Web3Forms e a política, e ficou registrada como dependência, não como pendência oculta.
- **Foto do hero**: aprovada em 2026-10-25 — `hero-home.jpg`, colorida, 4898 × 3266 px, com recorte
  retrato 3:4. O placeholder provisório não permanece na versão final (FR-005, SC-009).
- **Modelo de conteúdo**: a descrição inicial pede cada categoria como pasta com fotos e descrição.
  A especificação trata isso como organização do conteúdo no painel (FR-021), deixando o formato
  técnico para o plano.
- **Endereços preservados**: os endereços atuais entram como requisito (FR-016), não como suposição,
  para que a reconstrução não quebre links divulgados.
- **Modo escuro e idioma**: removidos por decisão registrada; a especificação não deixa a decisão em
  aberto.
- Nenhum item pendente: a especificação está pronta para `/speckit.plan`.

## Clarificações de 2026-10-25

- **Contraste**: `#B5715A` fica restrito a detalhes, bordas e títulos grandes; links, botões e textos
  pequenos usam `#8E5238` (5,57:1 no fundo e 6,15:1 com texto branco), preservando AA.
- **Foto do hero**: real e aprovada (`hero-home.jpg`, 4898 × 3266 px, colorida), exibida em recorte
  retrato 3:4 que preserva o assunto; o placeholder não pode permanecer no site publicado. A
  referência P&B de 640 × 960 px serviu apenas de enquadramento.
- **Home e Sobre**: a home exibe um resumo curto com link "Conhecer a Faby"; `/sobre/` recebe o texto
  completo de apresentação.
- **Filtro do portfólio**: exibe apenas a categoria escolhida, esconde as demais e preserva
  `?categoria=<slug>` e o botão voltar.
- **Tipografia**: Cormorant Garamond nos títulos e Inter no texto corrido, servidas pelo próprio site.
