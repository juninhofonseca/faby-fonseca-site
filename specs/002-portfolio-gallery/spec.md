# Especificação da Funcionalidade: Galeria de Portfólio

**Feature Branch**: `002-portfolio-gallery`

**Created**: 2026-10-25

**Status**: Rascunho

**Input**: Descrição do usuário: "Permitir que visitantes naveguem pelos trabalhos da fotógrafa, organizados por categoria, e vejam as fotos em tamanho ampliado; a fotógrafa quer adicionar e remover fotos sem depender de programação."

## Cenários de Usuário e Testes *(obrigatório)*

### História de Usuário 1 - Explorar o portfólio por categoria (Prioridade: P1)

Um visitante que chegou ao site por um link do Instagram abre a página de portfólio, vê as
categorias de trabalho disponíveis (Casamentos, Ensaios, Família, Newborn e Eventos) e seleciona
a que corresponde ao que procura. A galeria passa a exibir somente as fotos daquela categoria,
em uma grade que se adapta ao tamanho da tela.

**Por que esta prioridade**: é o núcleo da funcionalidade. Sem conseguir filtrar por categoria e
ver as fotos, o portfólio não cumpre o objetivo comercial de gerar orçamentos.

**Teste independente**: abrir a página de portfólio, selecionar uma categoria e confirmar que
apenas as fotos daquela categoria aparecem, em uma grade utilizável no celular.

**Cenários de aceite**:

1. **Dado** que o visitante está na página de portfólio, **quando** seleciona "Casamentos",
   **então** a grade exibe apenas fotos de casamentos e a categoria ativa fica evidente.
2. **Dado** que a grade está exibida, **quando** o visitante acessa pelo celular, tablet ou
   desktop, **então** a grade se reorganiza sem rolagem horizontal e sem cortar fotos.
3. **Dado** que uma categoria ainda não possui fotos publicadas, **quando** o visitante a
   seleciona, **então** vê uma mensagem clara de "em breve" e continua podendo navegar para as
   demais categorias.

---

### História de Usuário 2 - Ampliar uma foto e navegar entre elas (Prioridade: P2)

Ao clicar ou tocar em uma foto da grade, o visitante a vê em tamanho ampliado, com a opção de
passar para a foto anterior ou seguinte dentro da mesma categoria, e fechar a visualização por um
botão ou pela tecla Esc.

**Por que esta prioridade**: a ampliação é o que permite avaliar a qualidade técnica e artística
do trabalho, principal argumento de venda da fotógrafa. Depende da História 1 para existir.

**Teste independente**: a partir de uma categoria com fotos, abrir uma foto, navegar para a
anterior e a seguinte, fechar com o botão e repetir fechando com Esc.

**Cenários de aceite**:

1. **Dado** que a grade de uma categoria está exibida, **quando** o visitante clica em uma foto,
   **então** a mesma foto é exibida em tamanho ampliado com a categoria e a posição atual
   identificadas.
2. **Dado** que a visualização ampliada está aberta, **quando** o visitante aciona "próxima" ou
   "anterior", **então** a foto correspondente é exibida, em ciclo contínuo dentro da categoria.
3. **Dado** que a visualização ampliada está aberta, **quando** o visitante pressiona Esc ou
   aciona o botão de fechar, **então** retorna à grade com o foco na foto de origem.
4. **Dado** que a visualização ampliada está aberta, **quando** o visitante usa apenas o teclado,
   **então** consegue navegar entre as fotos, fechar e retornar à grade sem usar o mouse.

---

### História de Usuário 3 - Solicitar orçamento a partir da categoria (Prioridade: P3)

Depois de explorar uma categoria, o visitante aciona o botão "Quero um orçamento desta categoria"
e chega à página de contato com aquela categoria já selecionada no formulário.

**Por que esta prioridade**: converte o interesse despertado pela galeria em uma solicitação
comercial, reduzindo o esforço do visitante. Depende da página de contato.

**Teste independente**: em qualquer categoria, acionar o botão e confirmar que a página de
contato abre com a categoria correta pré-selecionada.

**Cenários de aceite**:

1. **Dado** que uma categoria está ativa, **quando** o visitante aciona "Quero um orçamento desta
   categoria", **então** chega à página de contato com a categoria correspondente já selecionada.
2. **Dado** que a página de contato abriu com a categoria pré-selecionada, **quando** o visitante
   revisa o formulário, **então** consegue alterar a categoria antes de enviar.
3. **Dado** que o visitante acessa a página de contato diretamente, sem passar pela galeria,
   **então** o formulário funciona normalmente, sem categoria pré-selecionada.

---

### História de Usuário 4 - Manter a galeria atualizada (Prioridade: P2)

A Faby precisa adicionar, remover e reordenar fotos e categorias sem depender de programação,
por meio de um painel de administração no navegador, mantendo textos alternativos e a ordem de
exibição sob seu controle.

**Por que esta prioridade**: a galeria perde valor se cada atualização exigir um desenvolvedor.
É, porém, uma necessidade operacional e não bloqueia a primeira entrega ao visitante.

**Teste independente**: adicionar uma foto a uma categoria, confirmar que ela aparece na posição
desejada, remover outra foto e confirmar que deixa de ser exibida.

**Cenários de aceite**:

1. **Dado** que a Faby tem acesso ao painel de administração, **quando** adiciona uma foto com
   descrição e categoria, **então** ela passa a aparecer na galeria na posição definida.
2. **Dado** que uma foto publicada é removida, **quando** a galeria é recarregada, **então** ela
   deixa de ser exibida e não gera erro para o visitante.
3. **Dado** que a Faby reordena as fotos de uma categoria, **quando** a galeria é recarregada,
   **então** a nova ordem é respeitada.

---

### Casos Limite

- Categoria sem fotos publicadas: exibir mensagem de "em breve" sem quebrar o layout nem esconder
  as demais categorias.
- Falha ao carregar uma imagem: o espaço reservado e o texto alternativo permanecem visíveis, e
  as demais fotos continuam navegáveis.
- Categoria com muitas fotos: a grade permanece utilizável em conexão lenta, carregando as fotos
  conforme entram na tela.
- Foto removida enquanto a visualização ampliada está aberta: a visualização se ajusta à foto
  vizinha ou fecha, sem erro.
- Navegação por teclado na visualização ampliada: o foco não escapa para o conteúdo atrás da
  sobreposição.
- Textos alternativos longos ou zoom do navegador em 200%: o layout não perde conteúdo nem cria
  rolagem horizontal.
- Visitante sem JavaScript: a galeria ainda permite ao menos visualizar as categorias e as fotos
  em seu tamanho normal (degradação aceitável, a detalhar no plano).
- Upload de arquivo em formato não suportado ou acima do limite: o painel informa o motivo e não
  publica a foto.
- Sessão do painel expirada: o acesso é negado com mensagem clara, sem publicação parcial.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **FR-001**: A página de portfólio deve exibir as categorias de trabalho ativas, iniciando por
  Casamentos, Ensaios, Família, Newborn e Eventos, ajustáveis conforme o trabalho real da Faby.
- **FR-002**: O visitante deve poder selecionar uma categoria e ver a grade filtrada sem
  recarregar a página.
- **FR-003**: A grade deve ser responsiva, passando de uma coluna em telas pequenas para múltiplas
  colunas em telas maiores, sem rolagem horizontal entre 360 px e 1920 px.
- **FR-004**: Cada foto da grade deve ser exibida em versão otimizada com no máximo 300 KB.
- **FR-005**: As imagens da grade devem carregar de forma preguiçosa, priorizando as primeiras
  fotos visíveis para não atrasar a percepção de carregamento.
- **FR-006**: Toda foto deve ter texto alternativo descritivo, fornecido no cadastro da foto;
  imagens puramente decorativas devem ser evitadas na galeria.
- **FR-007**: O visitante deve poder abrir qualquer foto da grade em visualização ampliada por
  clique, toque ou teclado.
- **FR-008**: A visualização ampliada deve permitir navegar para a foto anterior e a seguinte
  dentro da categoria ativa, em ciclo contínuo, exibindo a posição atual.
- **FR-009**: A visualização ampliada deve poder ser fechada por botão visível e pela tecla Esc,
  devolvendo o foco à foto de origem.
- **FR-010**: Toda a funcionalidade deve ser operável apenas pelo teclado, com foco visível e
  ordem de foco lógica.
- **FR-011**: Cada categoria deve oferecer o botão "Quero um orçamento desta categoria", que leva
  à página de contato com a categoria pré-selecionada.
- **FR-012**: A página de contato deve aceitar a categoria pré-selecionada e permitir que o
  visitante a altere antes de enviar.
- **FR-013**: A Faby deve poder adicionar, remover e reordenar fotos e categorias sem escrever
  código, por meio de um painel de administração acessível pelo navegador.
- **FR-014**: A ordem das fotos dentro de cada categoria deve ser definida pela Faby e respeitada
  na exibição.
- **FR-015**: O sistema deve registrar a data de publicação de cada foto, para que seja possível
  identificar conteúdo desatualizado.
- **FR-016**: O painel de administração deve ser acessível apenas à Faby ou a um responsável
  autorizado, com autenticação, sem expor credenciais no site público.
- **FR-017**: O painel de administração deve recusar arquivos em formato não suportado ou acima
  do limite definido, informando o motivo e sem publicar a foto.

### Entidades-Chave *(incluir se a funcionalidade envolver dados)*

- **Categoria**: representa um tipo de trabalho fotográfico. Atributos: nome exibido, identificador
  estável, descrição curta, ordem de exibição e situação (ativa ou oculta). Relaciona-se com
  muitas fotos.
- **Foto**: representa uma imagem publicada no portfólio. Atributos: arquivo em versão de grade e
  versão ampliada, texto alternativo, categoria, ordem dentro da categoria, data de publicação e
  situação (publicada ou removida).
- **Seleção de orçamento**: representa a categoria escolhida pelo visitante ao pedir orçamento.
  Atributos: categoria e origem (galeria ou acesso direto). Relaciona-se com o formulário de
  contato.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: Um visitante consegue ir da página de portfólio até a visualização ampliada de uma
  foto em no máximo 3 ações (selecionar categoria, selecionar foto, ampliar).
- **SC-002**: 100% das imagens exibidas na grade têm no máximo 300 KB.
- **SC-003**: A página de portfólio fica utilizável em menos de 3 segundos em conexão 4G simulada,
  em conformidade com a constituição do projeto.
- **SC-004**: 100% das fotos publicadas possuem texto alternativo descritivo.
- **SC-005**: Um visitante consegue percorrer categorias, abrir uma foto, navegar entre fotos e
  fechar a visualização usando apenas o teclado, sem armadilhas de foco.
- **SC-006**: A grade não apresenta rolagem horizontal em nenhuma largura entre 360 px e 1920 px.
- **SC-007**: 100% dos acionamentos de "Quero um orçamento desta categoria" levam à página de
  contato com a categoria correta pré-selecionada.
- **SC-008**: A Faby consegue publicar ou remover uma foto em menos de 10 minutos, sem apoio
  técnico e sem escrever código.
- **SC-009**: Nenhuma credencial ou dado de acesso ao painel de administração é acessível a partir
  do site público.

## Fora de Escopo

- Upload ou envio de fotos por visitantes; a publicação de imagens é feita exclusivamente pela
  Faby por meio do painel de administração descrito em FR-013.
- Comentários, curtidas ou qualquer interação social na galeria.
- Download de imagens pelo visitante (nenhum botão ou fluxo de download será oferecido).
- Edição de imagens (recorte, filtros, correção) dentro do site.
- Busca textual por fotos ou tags.
- Múltiplos idiomas na galeria.
- Paginação da grade nesta versão; todas as fotos da categoria são exibidas com carregamento
  preguiçoso.

## Assunções

- As cinco categorias iniciais são Casamentos, Ensaios, Família, Newborn e Eventos; nomes e
  quantidade podem ser ajustados pela Faby sem mudança de escopo.
- A página de contato com formulário de orçamento será entregue como parte do site (feature
  própria ou já existente); esta funcionalidade apenas envia a categoria pré-selecionada.
- O limite de 300 KB se aplica às imagens da grade. A versão ampliada pode ter resolução maior,
  desde que respeite a meta de carregamento da constituição.
- A navegação da visualização ampliada fica restrita à categoria ativa e é circular nas
  extremidades.
- Não haverá paginação na primeira versão; o carregamento preguiçoso é suficiente para o volume
  esperado de fotos por categoria.
- As fotos e os textos alternativos são fornecidos ou aprovados pela Faby, com direito de uso
  confirmado.
- Todo o conteúdo visível permanece em português do Brasil, conforme a constituição.
- A gestão de fotos será feita por um painel de administração no navegador, acessível apenas à
  Faby, compatível com hospedagem estática de baixo custo e com tratamento de dados conforme a
  LGPD.
