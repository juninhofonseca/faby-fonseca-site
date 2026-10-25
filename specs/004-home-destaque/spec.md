# Especificação da Funcionalidade: Home com Foto de Destaque e Instagram

**Feature Branch**: `004-home-destaque`

**Created**: 2026-10-25

**Status**: Rascunho

**Input**: Descrição do usuário: "Home com foto de destaque, apresentação e Instagram. Foto de
placeholder agora, trocável pelo Pages CMS; perfil @faby.fonseca.fotografia; home completa e
editável."

## Cenários de Usuário e Testes *(obrigatório)*

### História de Usuário 1 - Conhecer o trabalho e decidir o próximo passo (Prioridade: P1)

Um visitante chega à página inicial, muitas vezes pelo celular e por um link do Instagram. Na
primeira tela ele vê uma fotografia de destaque, entende em uma frase o que a Faby fotografa e
encontra dois caminhos claros: conhecer o portfólio ou pedir um orçamento.

**Por que esta prioridade**: é a primeira impressão do site e o ponto em que a visita se transforma
em interesse comercial. Sem foto e sem chamada clara, o visitante precisa adivinhar o que o site
oferece.

**Teste independente**: abrir `/` em um celular de 360 px e em um desktop de 1280 px, confirmar a
foto, o título, o texto de apresentação e os dois botões, e navegar por cada um deles.

**Cenários de aceite**:

1. **Dado** que o visitante abre a página inicial, **quando** a página carrega, **então** vê uma
   fotografia de destaque com texto alternativo, um título principal e uma frase que resume os
   serviços.
2. **Dado** que o visitante quer ver os trabalhos, **quando** aciona "Ver portfólio", **então** chega
   à página de portfólio.
3. **Dado** que o visitante já quer um orçamento, **quando** aciona "Solicitar orçamento", **então**
   chega à página de contato.
4. **Dado** que o visitante usa apenas o teclado, **quando** percorre a página, **então** alcança os
   dois botões com foco visível e na ordem em que aparecem na tela.

---

### História de Usuário 2 - Descobrir as categorias em destaque (Prioridade: P2)

Depois da primeira dobra, o visitante vê três categorias escolhidas pela Faby. Cada uma mostra nome,
descrição curta e, quando existe, uma foto representativa. O clique abre o portfólio já filtrado
naquela categoria.

**Por que esta prioridade**: encurta o caminho entre o interesse e o trabalho específico que o
visitante procura (casamento, ensaio, família), sem obrigá-lo a percorrer todas as categorias.

**Teste independente**: conferir na home exatamente três categorias em destaque, cada uma com link
para `/portfolio/?categoria=<slug>` e com a categoria correta ativa ao abrir.

**Cenários de aceite**:

1. **Dado** que a home tem três categorias em destaque configuradas, **quando** o visitante as vê,
   **então** cada cartão mostra nome, descrição e um convite para ver os trabalhos.
2. **Dado** que o visitante clica em "Casamentos", **quando** o portfólio abre, **então** a categoria
   Casamentos está selecionada.
3. **Dado** que uma categoria em destaque não tem fotos publicadas, **quando** a home é exibida,
   **então** o cartão continua visível, sem imagem e sem link quebrado.
4. **Dado** que uma categoria em destaque foi desativada ou removida, **quando** o site é publicado,
   **então** a validação de conteúdo falha com uma mensagem clara e a home não aponta para uma
   categoria inexistente.

---

### História de Usuário 3 - Conhecer a Faby e acompanhar o Instagram (Prioridade: P2)

O visitante lê um parágrafo curto de apresentação e encontra o perfil
`@faby.fonseca.fotografia` para continuar acompanhando o trabalho. O mesmo link aparece no rodapé de
todas as páginas.

**Por que esta prioridade**: quem chega pelo Instagram reconhece a continuidade entre os canais, e
quem chega pelo site ganha um motivo para seguir e voltar. Também dá rosto e voz ao portfólio.

**Teste independente**: abrir a home, ler a apresentação e acionar o link do Instagram na home e no
rodapé de `/portfolio/` e `/contato/`, confirmando que levam ao perfil correto.

**Cenários de aceite**:

1. **Dado** que o visitante chega à seção de apresentação, **quando** a lê, **então** encontra um
   texto curto, em primeira pessoa, sem dados inventados sobre a carreira.
2. **Dado** que o visitante quer acompanhar o trabalho, **quando** aciona o link do Instagram,
   **então** o perfil `@faby.fonseca.fotografia` abre em nova aba, sem deixar a home.
3. **Dado** que o visitante está em qualquer página, **quando** chega ao rodapé, **então** encontra o
   mesmo link do Instagram.
4. **Dado** que o visitante usa leitor de tela, **quando** chega ao link, **então** ouve que se trata
   do Instagram da Faby, e não apenas um ícone sem nome.

---

### História de Usuário 4 - Atualizar a home sem programar (Prioridade: P3)

A Faby troca a foto de destaque, ajusta os textos de apresentação e escolhe as três categorias em
destaque pelo Pages CMS. A alteração é publicada no site sem editar código nem pedir ajuda técnica.

**Por que esta prioridade**: a home é a página que mais muda com o trabalho e a identidade da marca.
Se cada troca de foto exigir programação, o site envelhece.

**Teste independente**: editar a foto, o texto e as categorias no Pages CMS, publicar e confirmar as
mudanças na home depois do deploy.

**Cenários de aceite**:

1. **Dado** que a Faby abre a página inicial no Pages CMS, **quando** troca a foto de destaque e o
   texto alternativo, **então** a nova foto aparece na home sem alteração de código.
2. **Dado** que a Faby altera o título, a frase de apresentação ou o texto sobre ela, **quando**
   publica, **então** a home exibe o novo texto.
3. **Dado** que a Faby escolhe três categorias em destaque, **quando** publica, **então** a home
   mostra exatamente essas três, na ordem escolhida.
4. **Dado** que a Faby tenta publicar uma configuração inválida, **quando** o deploy roda, **então**
   recebe uma mensagem que identifica o campo e o que corrigir, e o site anterior continua no ar.

---

### Casos Limite

- **Foto de destaque ausente ou com formato inválido**: a validação do build falha com o caminho do
  arquivo e o motivo; a home anterior continua publicada.
- **Categoria em destaque desativada, removida ou repetida**: a validação falha; em produção, a home
  ignora a categoria inválida e completa as vagas com as próximas categorias ativas, sem link
  quebrado.
- **Categoria sem fotos**: o cartão aparece sem imagem, mantendo nome, descrição e link.
- **Texto muito longo vindo do painel**: os limites de caracteres são verificados no build e o
  layout não cria rolagem horizontal.
- **JavaScript desabilitado**: a home é estática e continua completa; nenhum conteúdo depende de
  script.
- **Rede 4G lenta**: a foto de destaque é a única imagem prioritária; as miniaturas das categorias
  carregam sob demanda.
- **Visitante com `prefers-reduced-motion`**: não há animação obrigatória; qualquer transição é
  desativada.
- **Zoom de 200% e tela de 360 px**: textos, botões e cartões continuam legíveis e sem corte.
- **Instagram indisponível ou bloqueado**: o link continua sendo um link comum; não há feed embutido
  nem script de terceiros que possa quebrar a home.
- **Link compartilhado no WhatsApp/Instagram**: título e descrição continuam vindo do layout base;
  imagem de compartilhamento fica para uma feature futura.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **FR-001**: A página inicial deve exibir uma seção de destaque com título principal, frase de
  apresentação, fotografia e texto alternativo descritivo.
- **FR-002**: A fotografia de destaque deve ser servida em WebP, em tamanhos responsivos, com
  dimensões explícitas e prioridade de carregamento, mantendo LCP abaixo de 3 segundos em 4G.
- **FR-003**: A seção de destaque deve oferecer um caminho primário para o portfólio e um secundário
  para o orçamento.
- **FR-004**: A home deve exibir exatamente três categorias em destaque, na ordem definida no
  conteúdo, cada uma com nome, descrição curta, convite para ver os trabalhos e link para
  `/portfolio/?categoria=<slug>`.
- **FR-005**: As categorias em destaque devem ser categorias ativas e distintas; a validação do
  build deve recusar slug inexistente, inativo, repetido ou quantidade diferente de três.
- **FR-006**: Quando a categoria em destaque tiver fotos publicadas, o cartão deve mostrar a primeira
  foto como miniatura; sem foto, o cartão deve continuar íntegro e sem imagem.
- **FR-007**: A home deve exibir um texto curto de apresentação da Faby, em português do Brasil, sem
  afirmações factuais não fornecidas pela responsável.
- **FR-008**: A home e o rodapé de todas as páginas devem linkar o perfil público do Instagram
  `@faby.fonseca.fotografia`, exibindo o identificador e abrindo em nova aba com
  `rel="noopener noreferrer"`.
- **FR-009**: O identificador e a URL do Instagram devem ser definidos uma única vez em
  `src/lib/contact.ts` e consumidos pela home e pelo rodapé, sem duplicação de configuração.
- **FR-010**: O conteúdo da home deve viver em uma entrada única de conteúdo
  (`content/home/index.md`), editável pelo Pages CMS, incluindo a foto de destaque em mídia própria
  (`content/home/images/`).
- **FR-011**: A foto de destaque inicial deve ser um placeholder isolado do portfólio, substituível
  pela foto real apenas pelo painel, sem alteração de código.
- **FR-012**: A home deve ter uma hierarquia semântica correta: um único `h1`, seções com `h2` e
  cartões com `h3`, em ordem lógica.
- **FR-013**: Todos os links e botões devem ser operáveis por teclado, com foco visível e alvos de
  toque de no mínimo 44 × 44 px.
- **FR-014**: A home não deve criar rolagem horizontal em 360 px, 768 px e 1280 px.
- **FR-015**: A home deve funcionar sem JavaScript; nenhum conteúdo essencial pode depender de
  script.
- **FR-016**: A home não deve carregar scripts de terceiros, feed embutido do Instagram, cookies ou
  rastreadores.
- **FR-017**: Nenhuma dependência nova pode ser adicionada; a implementação usa Astro, CSS e HTML
  existentes.
- **FR-018**: A validação de conteúdo deve verificar os campos da home, a existência e o formato da
  foto de destaque e a coerência das categorias em destaque com as categorias ativas.
- **FR-019**: O orçamento de imagens deve incluir os originais de `content/home/images/` e as
  variantes de grade geradas a partir deles.
- **FR-020**: Os metadados da home (`title` e `description`) devem descrever o trabalho da Faby em
  português do Brasil, sem duplicar o texto da página de portfólio.

### Entidades-Chave *(incluir se a funcionalidade envolver dados)*

- **Conteúdo da home**: entrada única com título do destaque, frase de apresentação, foto e texto
  alternativo, três categorias em destaque, título e texto da seção sobre a Faby.
- **Categoria**: entidade já existente no portfólio; a home usa nome, descrição, slug e a primeira
  foto publicada de cada categoria selecionada.
- **Perfil do Instagram**: identificador público (`faby.fonseca.fotografia`) e URL canônica,
  mantidos como constantes públicas do site.
- **Foto de destaque**: imagem original em `content/home/images/`, isolada das fotos do portfólio,
  com texto alternativo editável.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: Um visitante identifica, na primeira tela, o que a Faby fotografa e encontra o caminho
  para o portfólio e para o orçamento, em uma única visita à home.
- **SC-002**: A home atinge LCP abaixo de 3 segundos em 4G simulada e CLS abaixo de 0,1.
- **SC-003**: A auditoria Lighthouse da home atinge acessibilidade 100 e desempenho igual ou superior
  a 90.
- **SC-004**: A home não apresenta rolagem horizontal em 360 px, 768 px e 1280 px.
- **SC-005**: Exatamente três categorias em destaque aparecem na home e 100% dos links abrem a
  categoria correta no portfólio.
- **SC-006**: O link do Instagram está presente na home e no rodapé de todas as páginas e aponta
  para o perfil correto.
- **SC-007**: A troca da foto, dos textos e das categorias em destaque é feita pelo Pages CMS e
  publicada sem alteração de código.
- **SC-008**: Nenhuma imagem da home fica sem texto alternativo; a auditoria axe-core não encontra
  violações WCAG 2.1 AA.
- **SC-009**: Todo o conteúdo visível entregue ao visitante está em português do Brasil.

## Fora de Escopo

- Feed embutido, carrossel ou widget do Instagram.
- Depoimentos de clientes.
- Formulário de newsletter ou captura de e-mail na home.
- Múltiplos modelos de home, variações por campanha ou personalização por visitante.
- Imagem de compartilhamento (`og:image`), favicon, `robots.txt` e página 404 própria — candidatos a
  uma feature futura de compartilhamento e SEO técnico.
- Analytics, rastreamento de conversão ou teste A/B.
- Textos definitivos de identidade de marca; a paleta e a tipografia continuam provisórias.
- Fotos reais: a entrega usa uma imagem de amostra até a Faby enviar a definitiva pelo painel.
- Domínio próprio.

## Assunções

- O perfil público do Instagram é `@faby.fonseca.fotografia` e a URL canônica é
  `https://www.instagram.com/faby.fonseca.fotografia/`.
- A foto de destaque inicial é uma cópia de uma imagem de amostra existente, guardada em
  `content/home/images/` para não se misturar às fotos do portfólio.
- As três categorias em destaque iniciais são Casamentos, Ensaios e Família, escolhidas por terem
  fotos publicadas.
- O texto "Sobre a Faby" é um rascunho editorial sem dados inventados, sujeito a revisão e troca
  pela responsável no painel.
- O Instagram é um link público: não há incorporação de conteúdo, script de terceiros nem coleta de
  dados de visitantes.
- O site continua publicado na URL de projeto do GitHub Pages, sem domínio próprio nesta versão.
- A identidade visual permanece provisória e isolada nos tokens existentes.
