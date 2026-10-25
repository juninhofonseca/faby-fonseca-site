# Pesquisa Técnica — Galeria de Portfólio

**Feature**: `002-portfolio-gallery` | **Data**: 2026-10-25

Este documento registra as decisões que resolvem os pontos em aberto do contexto técnico. Não
restam itens `NEEDS CLARIFICATION`.

## 1. Framework do site

- **Decisão**: Astro (última versão estável), saída totalmente estática, TypeScript e zero
  framework de UI.
- **Racional**: entrega HTML estático por rota (bom para SEO e para o primeiro carregamento),
  não envia JavaScript por padrão e já inclui pipeline de imagens com `sharp` (WebP, `srcset`,
  dimensões e lazy loading). É o "único framework leve" permitido pelo Princípio V da
  constituição.
- **Alternativas consideradas**:
  - HTML/CSS/JS puro com script de build próprio: exigiria escrever geração de páginas,
    variantes de imagem e manifesto — mais código proprietário para manter.
  - Eleventy: ótimo para HTML estático, mas exigiria plugin adicional para o pipeline de imagens.
  - Next.js/Nuxt: runtime e complexidade desproporcionais para três páginas estáticas.

## 2. Painel de administração de conteúdo

- **Decisão**: Pages CMS (`app.pagescms.org`), com backend GitHub e configuração em `.pages.yml`.
- **Racional**: é um CMS hospedado que edita o repositório diretamente, sem banco, sem API e sem
  backend próprio. Oferece editor visual, gerenciador de mídia com arrastar-e-soltar, convite de
  colaboradores por e-mail e restrição de extensões de arquivo. A Faby entra pelo navegador,
  publica e o commit dispara o deploy — atendendo a História 4 e os FR-013/FR-016 sem código de
  autenticação no site.
- **Alternativas consideradas**:
  - Decap CMS embutido no site: exigiria proxy OAuth ou Netlify Identity, adicionando um serviço
    de autenticação e configuração de backend.
  - Sveltia CMS: boa experiência, mas também depende de proxy OAuth para o backend GitHub.
  - Sanity/Contentful: CMS externo com API, mais setup, dependência de runtime e risco de custo
    fora do plano gratuito.
- **Consequência**: o repositório precisa estar no GitHub e a Faby precisa ser convidada no Pages
  CMS. Nenhuma credencial é armazenada no repositório ou no bundle do site.

## 3. Modelo de conteúdo

- **Decisão**: Markdown com frontmatter em `content/categories/` e `content/photos/`, lido pelo
  Astro Content Layer com `glob()` e validado por schema Zod em `src/content.config.ts`.
- **Racional**: formato amigável para o CMS e para revisão em pull request; o schema impede
  publicação com `alt` vazio, categoria inexistente ou data inválida.
- **Alternativas consideradas**: JSON único (pior para edição incremental e resolução de
  conflitos), CMS com banco (contraria simplicidade e hospedagem estática).

## 4. Pipeline de imagens e limite de 300 KB

- **Decisão**: manter os originais em `content/photos/images/` e referenciá-los no frontmatter
  como `images/<arquivo>`. O Astro resolve o caminho relativo ao Markdown e gera variantes WebP
  responsivas via `<Image>`/`getImage()`. A grade usa larguras de 480 px e 960 px com
  `sizes` adequado; o lightbox usa uma variante de 1600 px.
- **Racional**: evita pipeline de imagem customizado e entrega `srcset`, dimensões explícitas
  (sem CLS) e lazy loading nativos. O Astro só publica as variantes otimizadas, não os originais.
- **Verificação do orçamento**: `scripts/check-image-budget.mjs` percorre o HTML gerado, extrai
  as URLs do `srcset` com descritor ≤ 960 px e falha o build se qualquer arquivo passar de
  300 KB. Também valida os originais: extensões aceitas e limite de 10 MB por arquivo.
- **Alternativas consideradas**: Cloudinary/ImageKit (transformação em CDN, mas serviço externo,
  limite gratuito e vendor lock-in), exportação manual de miniaturas (sujeita a erro e não
  verificável), script `sharp` próprio (mais código para manter).
- **Procedimento recomendado para a Faby**: exportar do Lightroom com lado maior de 2400 px e
  qualidade ~80, mantendo cada original abaixo de 10 MB.

## 5. Filtro por categoria com e sem JavaScript

- **Decisão**: renderizar todas as categorias no HTML estático, com a primeira ativa por padrão, e
  usar links reais (`<a href="/portfolio/?categoria=...">`). Um script vanilla resolve
  `?categoria=<slug>` no primeiro carregamento, intercepta o clique, troca a grade e atualiza a URL
  com `history.pushState`, sem recarregar.
- **Racional**: funciona em hospedagem estática (o build não lê query string), é indexável,
  suporta compartilhamento e o botão voltar do navegador.
- **Limite conhecido**: sem JavaScript não há como o servidor estático escolher a categoria da
  query string. Todas as categorias são exibidas (regra `noscript` que desfaz `[hidden]`), o que
  mantém o conteúdo acessível em links compartilhados e atende ao FR de acesso sem JS.
- **Alternativas consideradas**: buscar JSON no cliente e renderizar tudo via JS (pior SEO e
  dependência total de JS); SPA ou SSR (complexidade e custo desnecessários para hospedagem
  estática gratuita).

## 6. Visualização ampliada (lightbox)

- **Decisão**: elemento nativo `<dialog>` aberto com `showModal()`, controlado por TypeScript
  vanilla. Esc fecha nativamente; setas esquerda/direita navegam em ciclo; o foco é preso ao
  diálogo e devolvido ao card de origem ao fechar.
- **Racional**: `<dialog>` entrega foco preso, inércia do conteúdo de fundo e semântica de
  diálogo sem biblioteca. Menos dependências e menos JavaScript.
- **Alternativas consideradas**: bibliotecas de lightbox (peso e CSS adicionais), `<div>`
  customizado com `role="dialog"` (exige reimplementar foco e inércia, com risco de falhas de
  acessibilidade).

## 7. Pré-seleção de categoria no contato

- **Decisão**: o CTA aponta para `/contato/?categoria=<slug>`. A página de contato lê o parâmetro,
  valida contra as categorias ativas e marca a opção no `<select>`. Como o build é estático, a
  marcação acontece no cliente por um script pequeno; parâmetro inválido deixa o formulário sem
  seleção.
- **Racional**: contrato simples, sem estado no servidor e sem armazenamento no navegador.
- **Limite de escopo**: o envio do formulário, consentimento e tratamento LGPD pertencem à
  feature de contato; esta feature entrega apenas a pré-seleção e a possibilidade de alteração.

## 8. Hospedagem e entrega

- **Decisão**: GitHub Pages com deploy por GitHub Actions; repositório público e domínio próprio
  com HTTPS.
- **Racional**: custo zero, integração natural com o backend GitHub do Pages CMS e HTTPS
  automático. Cada commit do CMS dispara o workflow de deploy.
- **Alternativas consideradas**: Netlify (free tier, mas outro provedor e possível dependência de
  Identity), Cloudflare Pages (free tier, também viável, porém sem vantagem sobre o Pages para
  este caso).

## 9. Testes e portões de qualidade

- **Decisão**: Playwright para E2E (filtro, responsividade, lightbox, teclado, CTA), axe-core
  integrado ao Playwright para acessibilidade e Lighthouse CI para desempenho. O orçamento de
  imagens é um script Node executado no build.
- **Racional**: cobre os critérios de aceite da spec e os princípios III e IV da constituição com
  verificações automatizadas no CI.
- **Metas verificadas**: LCP < 3 s em 4G; CLS < 0,1; acessibilidade sem violações críticas;
  nenhuma imagem de grade > 300 KB; nenhuma rolagem horizontal em 360, 768 e 1280 px.

## 10. Privacidade e analytics

- **Decisão**: nenhuma ferramenta de analytics ou cookie na v1.
- **Racional**: reduz superfície LGPD, peso de página e dependências. Se analytics for necessário
  no futuro, deve ser privacy-friendly e informado na política de privacidade, conforme o
  Princípio VII.

## 11. Limite de upload (FR-017)

- **Decisão**: restringir extensões no Pages CMS (`jpg`, `jpeg`, `png`, `webp`) e validar tamanho
  (10 MB) e formato no pipeline antes do build/deploy, com mensagem de erro indicando o arquivo e
  o limite.
- **Racional**: o Pages CMS não oferece validação de tamanho no momento do upload. A barreira no
  pipeline impede que um arquivo inválido chegue ao site publicado, que é o efeito exigido pelo
  requisito.
- **Risco residual**: a Faby descobre o excesso de tamanho após o envio, pelo status do workflow,
  e não imediatamente no painel. Mitigação: orientação no guia de uso e mensagem de erro clara.
