# Especificação da Funcionalidade: Identidade Visual e Portfólio Centrado na Galeria

**Feature Branch**: `005-tema-identidade`

**Created**: 2026-10-25

**Status**: Planejada

**Input**: Descrição do usuário: "Reconstruir o site da Faby Fonseca Fotografia usando o tema
DesignPhotographyPortfolio, personalizado com a identidade visual da marca. O texto atual é
mantido. A galeria deve ser o centro da experiência. Remover comentários, seletor de idioma, modo
escuro e conteúdo de demonstração. Paleta quente com destaque terracota, títulos em serifa e texto
em sans-serif. Logo em texto, menu Início/Portfólio/Contato e botão de orçamento. Categorias em
pastas com descrição e fotos. Páginas Início, Portfólio, Contato, Sobre e Política de Privacidade.
Foto real no hero. Nenhuma imagem sem alt, lazy loading e 300 KB por imagem na galeria. WhatsApp,
Instagram e e-mail da Faby. Sem analytics."

## Contexto

O site atual está publicado e funcional, mas a identidade visual é provisória
(`TODO(BRAND_IDENTITY)`) e a home tem peso editorial maior do que fotográfico. A Faby quer um site
com aparência de estúdio fotográfico: a fotografia ocupa o centro, a tipografia é elegante e a
paleta é quente, sem perder o conteúdo, os caminhos de contato e a possibilidade de editar tudo pelo
painel.

O visual é inspirado no tema **DesignPhotographyPortfolio**. Como o repositório do tema não publica
licença, a entrega **recria** a linguagem visual no stack atual, sem copiar código do tema e sem
adicionar um framework de UI. O objetivo é o resultado visual e a experiência de galeria, não a
adoção do código de terceiros.

## Cenários de Usuário e Testes *(obrigatório)*

### História de Usuário 1 - Reconhecer um estúdio fotográfico pela aparência (Prioridade: P1)

Um visitante abre o site e, antes de ler qualquer texto, percebe que se trata de fotografia: fundo
quente, tipografia editorial, fotografias grandes e nenhuma cor destoante. A identidade transmite o
mesmo cuidado que a Faby coloca no trabalho.

**Por que esta prioridade**: a primeira impressão define se o visitante confia no trabalho. A
identidade provisória atual não comunica o posicionamento da marca.

**Teste independente**: abrir `/`, `/portfolio/`, `/contato/` e `/privacidade/` em 360 px, 768 px e
1280 px, conferir a paleta, as duas famílias tipográficas, o contraste e a ausência de roxo. A página
`/sobre/` é validada na US4, quando passa a existir.

**Cenários de aceite**:

1. **Dado** que o visitante abre qualquer página, **quando** ela carrega, **então** vê o fundo
   `#F7F3EE`, o texto `#2B2622`, os textos de apoio `#6B615A`, o destaque de marca `#B5715A` em
   detalhes e o destaque acessível `#8E5238` em links e botões, aplicados de forma consistente.
2. **Dado** que o visitante percorre o site, **quando** compara as páginas, **então** encontra no
   máximo duas famílias de fontes: uma serifada nos títulos e uma sans-serif no texto corrido.
3. **Dado** que o visitante usa qualquer página, **quando** observa botões, links e cabeçalho,
   **então** não encontra nenhuma cor roxa da identidade padrão do tema.
4. **Dado** que o visitante tem baixa visão, **quando** lê textos, botões e legendas, **então** todo
   texto atinge contraste mínimo WCAG AA.
5. **Dado** que o visitante abre o site em um celular de 360 px, **quando** percorre as páginas,
   **então** o layout se adapta sem rolagem horizontal e com alvos de toque de pelo menos 44 × 44 px.

---

### História de Usuário 2 - Explorar as fotos como protagonistas (Prioridade: P1)

O visitante quer ver o trabalho da Faby. A página de portfólio organiza as fotos em um mosaico
contínuo, agrupado por categoria, com uma descrição curta de cada uma. Ele filtra a categoria que
lhe interessa e amplia uma foto sem perder o contexto.

**Por que esta prioridade**: a galeria é o produto do site. Se ela não for o centro da experiência,
o site falha no objetivo comercial.

**Teste independente**: abrir `/portfolio/`, percorrer as cinco categorias, filtrar por uma
categoria, ampliar uma foto, navegar entre fotos e voltar ao ponto de origem usando apenas teclado.

**Cenários de aceite**:

1. **Dado** que o visitante abre o portfólio, **quando** a página carrega, **então** vê as fotos em
   mosaico, agrupadas por categoria, com o nome e a descrição curta de cada categoria.
2. **Dado** que o visitante escolhe "Casamentos", **quando** aciona o filtro, **então** vê apenas as
   fotos daquela categoria e o endereço da página reflete a escolha.
3. **Dado** que o visitante abre uma foto, **quando** a visualiza ampliada, **então** consegue
   avançar, voltar e fechar pelo teclado, e o foco retorna à foto de origem.
4. **Dado** que uma categoria ainda não tem fotos, **quando** o visitante a seleciona, **então** vê
   uma mensagem clara, sem área vazia quebrada.
5. **Dado** que o visitante usa leitor de tela, **quando** percorre a galeria, **então** toda foto
   tem texto alternativo descritivo e a ordem de leitura acompanha a ordem visual.

---

### História de Usuário 3 - Encontrar o caminho para contratar (Prioridade: P2)

O visitante entende quem é a Faby, conhece as categorias em destaque na home e chega ao contato
com um clique: WhatsApp com mensagem pronta, Instagram ou e-mail. O cabeçalho mantém um botão
discreto de orçamento em todas as páginas.

**Por que esta prioridade**: a identidade e a galeria só geram negócio se o próximo passo for
óbvio. O contato já existe; precisa continuar funcionando dentro do novo visual.

**Teste independente**: na home, acionar "Solicitar orçamento" no cabeçalho, os dois botões do hero,
um cartão de categoria e os contatos do rodapé; confirmar os destinos e a mensagem pré-preenchida do
WhatsApp.

**Cenários de aceite**:

1. **Dado** que o visitante está em qualquer página, **quando** olha o cabeçalho, **então** encontra
   o logo em texto "Faby Fonseca" com "Fotografia" abaixo, o menu Início, Portfólio e Contato e um
   botão discreto "Solicitar orçamento".
2. **Dado** que o visitante aciona o WhatsApp, **quando** o aplicativo abre, **então** a mensagem já
   está preenchida com o pedido de orçamento.
3. **Dado** que o visitante prefere Instagram, **quando** aciona o link, **então** chega ao perfil
   `@faby.fonseca.fotografia` em uma nova aba.
4. **Dado** que o visitante quer explicar o evento com detalhes, **quando** abre `/contato/`,
   **então** encontra o formulário atual, com consentimento LGPD, funcionando.

---

### História de Usuário 4 - Conhecer a Faby em uma página própria (Prioridade: P2)

O visitante que se interessou pelo trabalho quer saber quem está por trás das fotos. A página Sobre
apresenta o texto completo de apresentação que hoje aparece na home, com respiro e tipografia
editorial, e leva ao portfólio ou ao orçamento. A home guarda apenas um resumo e o convite para
conhecer a página.

**Por que esta prioridade**: a confiança pessoal fecha contratos de fotografia. A apresentação
condensada na home não dá espaço para isso.

**Teste independente**: abrir `/sobre/` pela home e pelo rodapé, ler o texto, e seguir para o
portfólio e para o orçamento.

**Cenários de aceite**:

1. **Dado** que o visitante está na home, **quando** termina de ler o resumo da apresentação,
   **então** encontra o link "Conhecer a Faby" para `/sobre/`.
2. **Dado** que o visitante abre `/sobre/`, **quando** lê a página, **então** encontra o texto
   completo de apresentação do site atual, em português do Brasil, sem dados inventados.
3. **Dado** que o visitante termina de ler, **quando** procura o próximo passo, **então** encontra
   links para o portfólio e para solicitar orçamento.
4. **Dado** que o visitante acessa qualquer página, **quando** chega ao rodapé, **então** encontra o
   link para Sobre e para a Política de Privacidade.

---

### História de Usuário 5 - Manter o site sem programar (Prioridade: P3)

A Faby publica fotos, ajusta a descrição de uma categoria e edita os textos da home e da página
Sobre pelo Pages CMS. A nova estrutura organiza cada categoria como uma pasta com a descrição e as
fotos, para que publicar seja feito no lugar óbvio.

**Por que esta prioridade**: o site precisa envelhecer bem. Se cada foto exigir programação, a
galeria fica desatualizada.

**Teste independente**: publicar uma foto em uma categoria, alterar a descrição curta e editar o
texto da home no painel; conferir o resultado depois do deploy.

**Cenários de aceite**:

1. **Dado** que a Faby abre o painel, **quando** procura uma categoria, **então** encontra uma pasta
   com a descrição curta e as fotos daquela categoria.
2. **Dado** que a Faby publica uma foto nova, **quando** o deploy termina, **então** a foto aparece no
   mosaico da categoria, com o texto alternativo informado.
3. **Dado** que a Faby altera os textos da home ou da página Sobre, **quando** publica, **então** o
   site exibe o novo texto sem alteração de código.
4. **Dado** que a Faby envia uma imagem sem texto alternativo, **quando** o deploy roda, **então**
   recebe uma mensagem clara e o site anterior continua no ar.

---

### Casos Limite

- **Foto real do hero não entregue**: a publicação fica bloqueada até a foto ser fornecida; o site
  atual continua no ar, sem placeholder novo.
- **Foto real em resolução ou formato inadequado**: a validação recusa a publicação com mensagem
  clara sobre o arquivo e o limite, e a versão anterior continua publicada.
- **Foto muito alta ou muito larga no mosaico**: a imagem se ajusta à coluna sem estourar a largura,
  sem rolagem horizontal e sem corte do assunto principal.
- **Categoria sem fotos**: aparece com nome, descrição e mensagem de "em breve", sem cartão vazio.
- **Rede 4G lenta**: a primeira imagem recebe prioridade; as demais carregam sob demanda, e o texto
  permanece legível antes das fotos.
- **Fonte não carrega**: o texto usa a serifada ou a sans-serif de sistema equivalente, sem texto
  invisível e sem deslocamento perceptível do layout.
- **Contraste do destaque sobre o fundo**: o terracota `#B5715A` nunca é usado como texto pequeno; a
  variação `#8E5238` garante AA nos dois fundos e em texto branco sobre o botão.
- **Link antigo compartilhado**: endereços atuais continuam respondendo, incluindo
  `/portfolio/?categoria=<slug>`.
- **Imagem de compartilhamento ausente**: usa-se a imagem padrão da marca; nenhum link compartilhado
  fica sem imagem ou com imagem quebrada.
- **JavaScript desabilitado**: galeria, categorias, textos e contatos continuam acessíveis.
- **Zoom de 200% e tela de 360 px**: títulos, botões e legendas continuam legíveis e sem corte.
- **Visitante com `prefers-reduced-motion`**: nenhuma transição ou animação é obrigatória.

## Clarifications

### Session 2026-10-25

- Q: Como resolver o conflito entre o destaque `#B5715A` e o requisito de contraste AA? → A: Manter
  `#B5715A` como cor de marca em detalhes, bordas e títulos grandes; links, botões e textos pequenos
  usam a variação acessível `#8E5238` (5,57:1 no fundo e 6,15:1 com texto branco).
- Q: A foto real do hero já existe? → A: Sim. A foto aprovada é
  `content/home/images/hero-home.jpg` (4898 × 3266 px, colorida), exibida em recorte retrato 3:4 que
  preserva o assunto. Uma referência anterior em preto e branco, de 640 × 960 px, serviu apenas de
  enquadramento. O placeholder provisório não pode permanecer na versão publicada.
- Q: O texto de apresentação aparece na home e em `/sobre/`; como evitar duplicação? → A: A home
  mantém um resumo curto com link "Conhecer a Faby"; `/sobre/` recebe o texto completo.
- Q: Como o filtro deve se comportar no mosaico contínuo do portfólio? → A: O filtro exibe apenas a
  categoria escolhida e esconde as demais, mantendo `?categoria=<slug>` e o botão voltar.
- Q: Qual par tipográfico devemos fixar? → A: Cormorant Garamond nos títulos e Inter no texto
  corrido.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **FR-001**: Todas as páginas devem usar a paleta aprovada — fundo `#F7F3EE`, fundo alternativo
  `#EFE8DE`, texto `#2B2622`, texto secundário `#6B615A`, destaque de marca `#B5715A` e destaque
  acessível `#8E5238` — sem nenhuma cor roxa da identidade padrão do tema. `#B5715A` fica restrito a
  detalhes, bordas e títulos grandes; links, botões e textos pequenos usam `#8E5238`. A meta tag
  `theme-color` deve usar `#F7F3EE`.
- **FR-002**: O site inteiro deve usar no máximo duas famílias tipográficas — Cormorant Garamond nos
  títulos e Inter no texto corrido — servidas pelo próprio site, com fallback de sistema e sem
  requisição a serviços de terceiros.
- **FR-003**: O cabeçalho deve exibir o logo em texto "Faby Fonseca" em serifa, com "Fotografia"
  menor abaixo, o menu Início, Portfólio e Contato, e um botão discreto "Solicitar orçamento",
  operável por teclado e com alvo de toque de pelo menos 44 × 44 px.
- **FR-004**: A home deve manter o conteúdo atual — hero com título, frase de apresentação e foto,
  as três categorias em destaque (Casamentos, Ensaios e Família), um resumo curto da apresentação
  da Faby com link para `/sobre/` e as chamadas para portfólio e orçamento — com a nova identidade
  visual.
- **FR-005**: A home deve exibir uma fotografia real da Faby no hero, fornecida pela responsável, com
  largura e altura de pelo menos 2400 px, exibida em orientação retrato sem recorte que remova o
  assunto, e texto alternativo descrevendo a imagem atual; o placeholder provisório não pode
  permanecer na versão publicada.
- **FR-006**: A página de portfólio deve apresentar as cinco categorias (Casamentos, Ensaios,
  Família, Newborn e Eventos) em mosaico contínuo, na ordem definida, cada uma com nome, descrição
  curta e suas fotos.
- **FR-007**: O visitante deve poder filtrar o portfólio por categoria; o filtro exibe apenas a
  categoria escolhida, escondendo as demais, reflete a escolha no endereço da página
  (`?categoria=<slug>`) e preserva o botão voltar do navegador.
- **FR-008**: O visitante deve poder ampliar uma foto e navegar entre as fotos da categoria por
  teclado, fechando com `Esc` e retornando o foco ao ponto de origem.
- **FR-009**: Toda imagem deve ter texto alternativo descritivo, obrigatório na publicação; nenhuma
  imagem pode ser publicada sem `alt`.
- **FR-010**: Todas as imagens fora da primeira dobra devem carregar sob demanda, e nenhuma variante
  de imagem usada na listagem da galeria pode passar de 300 KB.
- **FR-011**: O site deve oferecer a página `/sobre/` com o texto de apresentação completo usado hoje
  na home, acessível a partir do resumo da home e do rodapé, com caminhos para o portfólio e para o
  orçamento.
- **FR-012**: O contato deve manter o botão de WhatsApp com mensagem pré-preenchida, o link do
  Instagram `@faby.fonseca.fotografia`, o e-mail `juninho.fonseca@gmail.com`, os textos orientativos
  atuais e o formulário com consentimento LGPD.
- **FR-013**: A Política de Privacidade deve descrever os dados coletados pelo formulário, o serviço
  de envio, os direitos do titular e afirmar que o site não usa analytics, cookies ou rastreadores;
  a data de vigência deve ser atualizada.
- **FR-014**: O site não deve exibir comentários, seletor de idioma, modo escuro, textos, nomes ou
  imagens de demonstração do tema.
- **FR-015**: Todas as páginas indexáveis devem ter título e descrição próprios, canônicos, Open Graph
  (título, descrição, imagem e tipo) e constar no sitemap; `/contato/enviado/`, por ser `noindex`, fica
  fora do sitemap; deve existir uma imagem padrão de compartilhamento com a identidade da marca.
- **FR-016**: Os endereços atuais devem continuar funcionando — `/`, `/portfolio/`, `/contato/`,
  `/contato/enviado/`, `/privacidade/` e `/portfolio/?categoria=<slug>` — e `/sobre/` deve ser
  adicionado sem quebrar links existentes.
- **FR-017**: Todo o site deve funcionar a partir de 360 px, sem rolagem horizontal em 360, 768 e
  1280 px, com navegação por teclado e foco visível.
- **FR-018**: Todo texto deve atingir contraste mínimo WCAG AA, incluindo textos de apoio, botões e
  legendas.
- **FR-019**: A galeria e o restante do conteúdo devem continuar funcionando sem JavaScript, e
  nenhum conteúdo essencial pode depender de script.
- **FR-020**: Nenhuma dependência de framework de UI pode ser adicionada; a implementação usa Astro,
  HTML e CSS já existentes.
- **FR-021**: A edição pelo Pages CMS deve continuar disponível para categorias, fotos e textos da
  home e da página Sobre, agora com cada categoria organizada como uma pasta que reúne sua descrição
  curta e suas fotos.
- **FR-022**: A validação de conteúdo deve continuar bloqueando publicação inválida: imagem sem
  `alt`, categoria inexistente ou fora das cinco, arquivo ausente, formato não suportado, original
  acima de 10 MB, variante de listagem acima de 300 KB, hero com largura ou altura abaixo de
  2400 px ou placeholder conhecido, corpo do Sobre vazio ou acima de 4000 caracteres e
  `featuredCategories` inválidas.

### Entidades-Chave *(incluir se a funcionalidade envolver dados)*

- **Identidade visual**: paleta de cinco cores e uma variação acessível do destaque, duas famílias
  tipográficas (Cormorant Garamond e Inter), logo em texto e regras de uso do destaque; centralizada
  para permitir ajuste com a Faby sem reescrever páginas.
- **Categoria**: nome, slug, descrição curta, ordem, situação (sempre publicada nesta versão) e o
  conjunto de fotos daquela categoria.
- **Foto**: imagem original, texto alternativo, título interno, categoria, ordem e data de publicação.
- **Página institucional**: conteúdo editável da home e da página Sobre (títulos, textos, foto de
  destaque e categorias em destaque).
- **Perfil e canais de contato**: Instagram, WhatsApp, e-mail e formulário, definidos uma única vez e
  reutilizados em todas as páginas.
- **Metadados de compartilhamento**: título, descrição, imagem padrão e endereço canônico por página.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: 0 ocorrências da cor roxa padrão do tema em qualquer página ou folha de estilo
  publicada; a paleta aprovada aparece em 100% dos componentes visíveis.
- **SC-002**: 100% dos textos, botões e legendas atingem contraste WCAG AA, inclusive o destaque
  acessível `#8E5238` sobre os dois fundos, verificado por auditoria automatizada e inspeção manual.
- **SC-003**: A home atinge LCP abaixo de 3 segundos em 4G simulada e CLS abaixo de 0,1; a auditoria
  Lighthouse fica com desempenho igual ou superior a 90 e acessibilidade 100.
- **SC-004**: 0 imagens publicadas sem texto alternativo e 0 variantes de listagem acima de 300 KB.
- **SC-005**: As cinco categorias aparecem no portfólio e 100% dos filtros abrem a categoria correta.
- **SC-006**: 100% dos endereços atuais continuam respondendo e nenhum link interno quebra; a página
  Sobre responde em `/sobre/` e consta no sitemap, e `/contato/enviado/` não consta no sitemap.
- **SC-007**: 0 elementos de demonstração do tema, comentários, seletor de idioma ou modo escuro
  aparecem no site publicado.
- **SC-008**: O site funciona em 360, 768 e 1280 px sem rolagem horizontal e com alvos de toque de
  pelo menos 44 × 44 px.
- **SC-009**: A foto do hero é uma fotografia real da Faby, com largura e altura de pelo menos 2400 px
  e texto alternativo que a descreve; o placeholder provisório não aparece no site publicado.
- **SC-010**: A Política de Privacidade descreve o formulário, o serviço de envio, os direitos do
  titular e a ausência de analytics, cookies e rastreadores, com data de vigência atualizada.

## Fora de Escopo

- Formulário de agendamento (terá especificação própria).
- Área administrativa própria; a edição continua no Pages CMS.
- Modo escuro com paleta própria.
- Analytics, cookies de medição, pixel ou teste A/B.
- Comentários, newsletter e feed do Instagram embutido.
- Seletor de idioma e conteúdo em outros idiomas.
- Cópia do código-fonte do tema DesignPhotographyPortfolio.
- Domínio próprio, imagem de marca definitiva (o logo é em texto) e banco de imagens real além da
  foto do hero.
- Reescrita dos textos institucionais: o conteúdo atual é mantido.

## Assunções

- O tema é referência visual e estrutural; como o repositório não publica licença, nenhum código é
  copiado e a implementação permanece no stack atual (Astro + CSS).
- A paleta é um ponto de partida ajustável com a Faby, mas não é um campo do painel: vive nos tokens
  de estilo para manter consistência. `#B5715A` permanece como cor de marca e `#8E5238` é a variação
  acessível usada em texto pequeno, links e botões.
- A foto do hero está aprovada: `content/home/images/hero-home.jpg`, colorida, 4898 × 3266 px
  (largura e altura ≥ 2400 px), com exibição em recorte retrato 3:4 que preserva o assunto. O
  placeholder anterior não é aceito na versão final. A referência em preto e branco de 640 × 960 px
  serviu apenas de enquadramento.
- O e-mail de contato continua `juninho.fonseca@gmail.com`; a troca para um endereço da Faby exige
  atualizar também a chave do Web3Forms e a política.
- Não haverá analytics; a política afirma isso de forma explícita.
- O modo escuro e o seletor de idioma são removidos, não adaptados.
- Cormorant Garamond e Inter são servidas pelo próprio site, sem Google Fonts ou outro serviço
  externo, com fallback de sistema.
- O logo é apenas texto; não há arquivo de imagem de marca nesta versão.
- A imagem padrão de compartilhamento usa uma fotografia de amostra com a identidade aplicada e pode
  ser substituída depois sem mudança de código.
- O site continua publicado em `https://juninhofonseca.github.io/faby-fonseca-site/`, sem domínio
  próprio nesta versão.
- O formulário atual, a chave do Web3Forms e o fluxo de confirmação continuam válidos.
