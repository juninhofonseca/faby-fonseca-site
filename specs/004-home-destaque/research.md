# Pesquisa Técnica: Home com Foto de Destaque e Instagram

**Feature**: `004-home-destaque` | **Data**: 2026-10-25

Decisões tomadas para atender à [spec.md](./spec.md) sem contrariar a constituição do projeto.

## D1. Conteúdo da home como entrada única (singleton)

**Decisão**: criar a coleção `home` com o arquivo `content/home/index.md`, carregada pelo `glob`
loader do Astro e editada como **arquivo único** (`type: file`) no Pages CMS.

**Alternativas descartadas**:

- **Texto fixo em `index.astro`**: exigiria programação para cada troca de foto ou frase,
  contrariando o FR-010 e a expectativa de autonomia da responsável.
- **Coleção com várias entradas**: não há várias homes; uma coleção comum permitiria criar entradas
  duplicadas e escolher a errada.
- **`content/home.md` na raiz de `content/`**: funciona, mas separa o Markdown da pasta de mídia e
  deixa `content/home.md` ao lado de `content/home/`. A pasta própria com `index.md` mantém conteúdo
  e imagens juntos e o caminho relativo da imagem fica igual ao do portfólio (`images/<arquivo>`).

**Consequência**: `getEntry('home', 'index')` é a única leitura; a ausência da entrada deve falhar
no build com mensagem clara, nunca renderizar uma home vazia.

## D2. Foto de destaque isolada do portfólio

**Decisão**: guardar a foto em `content/home/images/hero-home.jpg`, com uma fonte de mídia própria
no Pages CMS (`name: home`, `input: content/home/images`, `output: images`). O campo `heroImage`
aponta para `images/hero-home.jpg`, resolvido em relação a `content/home/index.md`.

**Por que não reutilizar uma foto do portfólio**: a foto de destaque é editorial e pode ser trocada
sem alterar a galeria. Compartilhar o arquivo faria a exclusão de uma foto do portfólio quebrar a
home. O placeholder é uma cópia da amostra `ana-e-joao-cerimonia.jpg`, mantendo o custo de imagem
baixo.

**Consequência**: `scripts/check-image-budget.mjs` passa a validar os originais das duas pastas de
mídia. O Pages CMS grava o caminho relativo `images/<arquivo>`, como já ocorre nas fotos.

## D3. Composição da home e ordem no mobile

**Decisão**: home estática, sem JavaScript, com quatro blocos:

1. destaque: título `h1`, frase, botões e foto;
2. categorias em destaque: `h2` e três cartões `h3`;
3. sobre a Faby: `h2`, parágrafos e link do Instagram;
4. chamada final: `h2`, frase e botão de orçamento.

No mobile, o texto vem antes da foto no DOM e na tela. A foto entra logo abaixo da primeira dobra
curta, com `aspect-ratio` fixo e `loading="eager"`. No desktop, texto e foto ficam lado a lado com
`grid`, sem alterar a ordem do DOM.

**Alternativa descartada**: texto sobre a foto. Exigiria véu escuro ou tratamento por imagem para
garantir contraste AA, encareceria a manutenção e poderia esconder parte da fotografia — o oposto do
Princípio VIII.

## D4. Categorias em destaque sem duplicar conteúdo

**Decisão**: armazenar três slugs no campo `featuredCategories` (referência múltipla do Pages CMS,
valor `{fields.slug}`). A home resolve os slugs contra as categorias ativas e usa os dados da
própria categoria (nome, descrição). A validação do build exige exatamente três slugs distintos e
todos ativos.

**Resiliência em produção**: se, apesar da validação, uma categoria estiver indisponível no momento
da renderização, a home a ignora e completa as vagas com as próximas categorias ativas, na ordem do
portfólio. Isso evita cartão vazio ou link quebrado, sem esconder o problema — o CI continua
falhando na validação.

**Alternativa descartada**: derivar sempre as três primeiras categorias por `order`. Seria mais
simples, mas tira da Faby o controle editorial sobre o que aparece na home.

## D5. Miniatura das categorias

**Decisão**: usar a primeira foto publicada de cada categoria em destaque, na ordem já definida em
`src/lib/gallery.ts`. A imagem é `lazy`, com `srcset` de 400 px e 800 px, e usa o `alt` cadastrado na
foto. Categoria sem foto renderiza apenas texto.

**Alternativas descartadas**:

- **Novo campo de imagem por categoria**: duplicaria a curadoria e permitiria uma imagem diferente da
  mostrada no portfólio.
- **Cartões só com texto**: mais leve, porém fraco para um site cujo produto é a fotografia.

**Custo**: três imagens abaixo da dobra, carregadas sob demanda. Não competem com o LCP.

## D6. Instagram como constante pública, sem embed

**Decisão**: `INSTAGRAM_HANDLE` e `INSTAGRAM_URL` em `src/lib/contact.ts`, ao lado de e-mail e
WhatsApp. A home exibe o `@` e o rodapé exibe o link em todas as páginas. O link abre em nova aba com
`rel="noopener noreferrer"`.

**Alternativas descartadas**:

- **Campo no Pages CMS**: criaria duas fontes para o mesmo dado (home e rodapé) e risco de divergência.
- **Feed embutido**: adiciona script de terceiros, cookies, peso e dependência de disponibilidade,
  violando os Princípios III, IV e VII. Um link simples entrega o mesmo objetivo.

**Privacidade**: o link não envia dados do visitante para o Instagram antes do clique; não há iframe,
pixel ou script. A política de privacidade atual continua válida.

## D7. Estratégia de imagens e desempenho

**Decisão**: usar o componente `Image` do Astro para gerar WebP responsivo com dimensões explícitas.
A foto de destaque usa `widths={[480, 800, 1200, 1600]}`, `sizes` equivalente a 100vw no mobile e
~58vw no desktop, `loading="eager"`, `fetchpriority="high"` e `quality={80}`. As miniaturas usam
`widths={[400, 800]}`, `sizes` de um terço da tela e `loading="lazy"`.

**Metas**: LCP < 3 s em 4G, CLS < 0,1, nenhuma imagem de grade acima de 300 KB. A home não carrega
JavaScript próprio nem de terceiros.

## D8. Acessibilidade

**Decisão**:

- um único `h1` (título do destaque);
- cada seção com `h2` e `id` para `aria-labelledby`;
- cartões de categoria como link único com `h3` dentro, evitando dois destinos para o mesmo cartão;
- `alt` obrigatório na foto de destaque e nas miniaturas;
- foco visível herdado de `:focus-visible` e alvos de toque de 44 px;
- nenhuma informação transmitida apenas por cor;
- contraste AA nos botões primário e secundário.

## D9. Validação e testes

**Decisão**:

- esquema Zod em `src/content.config.ts` para tipos, limites e unicidade dos três slugs;
- `scripts/validate-content.mjs` verifica a home, a existência da imagem, o formato e a coerência
  com categorias ativas;
- `assertFeaturedCategories` em `scripts/content-rules.mjs`, com testes unitários;
- E2E cobre conteúdo, links, imagens, Instagram, responsividade e ausência de JavaScript;
- axe-core cobre `/`;
- Lighthouse passa a medir `/`.

**Alternativa descartada**: confiar apenas no esquema Zod. Ele não enxerga o estado `active` de outra
coleção nem o arquivo de imagem no disco.

## D10. Placeholder e troca futura

**Decisão**: a amostra atual é aceita como placeholder e o `alt` declara isso
("Foto provisória..."). O guia da administradora explica como trocar a imagem e o texto alternativo.
Quando a foto real chegar, nenhum código muda.

**Risco**: esquecer de atualizar o `alt` junto com a foto. Mitigação: o campo é obrigatório e o guia
destaca que ele descreve a nova imagem, não a antiga.
