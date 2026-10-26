# Pesquisa Técnica: Identidade Visual e Portfólio Centrado na Galeria

**Feature**: `005-tema-identidade` | **Data**: 2026-10-25

Decisões tomadas para atender à [spec.md](./spec.md) sem contrariar a constituição do projeto. Cada
decisão registra o que foi escolhido, o que foi descartado e como será verificado.

## D1. Recriar a linguagem visual sem copiar o tema

**Decisão**: implementar a linguagem visual do tema **DesignPhotographyPortfolio** diretamente em
Astro, CSS e JavaScript vanilla, sem importar código, marcação, imagens ou nomes de classes do tema.

**Motivo**: o repositório do tema não publica arquivo de licença (`license: null`), então não há
autorização explícita para reutilizar o código. A spec também fixa que a entrega é a experiência
visual, não a adoção do tema.

**Alternativas descartadas**:

- **Copiar o tema e adaptar**: risco jurídico por ausência de licença e obrigação de manter uma
  base desconhecida (o tema usa outro stack).
- **Adicionar um framework de UI ou um tema de terceiros**: contraria o FR-020 e o Princípio V
  (simplicidade e dependências).
- **Contratar/aplicar um tema pago**: custo recorrente sem necessidade; o site é pequeno e já tem
  uma base estática funcionando.

**Verificação**: revisão de código registra que nenhum arquivo foi copiado; o diff não adiciona
dependências em `package.json`.

## D2. Tokens de identidade centralizados

**Decisão**: substituir os tokens provisórios de `src/styles/tokens.css` pela paleta aprovada e
manter todos os componentes consumindo variáveis.

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#F7F3EE` | fundo principal e `theme-color` |
| `--color-surface` | `#EFE8DE` | faixas, cartões e estados |
| `--color-text` | `#2B2622` | texto principal |
| `--color-muted` | `#6B615A` | textos de apoio (5,46:1 no fundo) |
| `--color-brand` | `#B5715A` | detalhes, bordas e títulos grandes (≥ 24 px ou 18,66 px bold) |
| `--color-accent` | `#8E5238` | links, botões e texto pequeno (5,57:1 no fundo; 6,15:1 com branco) |
| `--color-accent-contrast` | `#FFFFFF` | texto sobre botão |
| `--color-border` | `#D9CFC3` | divisórias decorativas |
| `--color-border-strong` | `#8A7B6E` | bordas de campos e controles (3,70:1) |
| `--color-focus` | `#2B2622` | anel de foco com contraste sobre os dois fundos |
| `--color-danger` | `#A3231C` | erros de formulário (6,75:1) |
| `--color-success` | `#1A6136` | confirmações (6,77:1) |

**Regra de contraste**: `#B5715A` nunca é usado como cor de texto pequeno nem como fundo de botão
com texto branco. A variação `#8E5238` existe exatamente para esses casos. A distinção fica
documentada no próprio CSS com um comentário curto.

**Alternativas descartadas**:

- **Usar só `#B5715A`**: reprova em AA para texto pequeno (3,47:1) e com branco (3,84:1).
- **Escurecer `#B5715A` até passar em AA**: descaracteriza a cor de marca aprovada.
- **Deixar a paleta editável no painel**: contraria a assunção da spec de que o token é código; a
  paleta é um contrato de design, não conteúdo editorial.

**Verificação**: teste unitário lê `tokens.css` e calcula contraste dos pares usados; teste de
conteúdo garante ausência de roxo (`#7C3AED`, `#8B5CF6`, `#A855F7`, `#6D28D9`, `#5B21B6`, `#4C1D95`,
`#9333EA`, `#C084FC`) em CSS e HTML publicado.

## D3. Tipografia: Cormorant Garamond + Inter, auto-hospedadas

**Decisão**: usar **Cormorant Garamond** (títulos) e **Inter** (texto corrido), ambas variáveis, em
WOFF2 com subset latin + latin-ext, versionadas em `public/fonts/`. Carregar com `@font-face`,
`font-display: swap`, `font-weight` variável e fallback de sistema equivalente.

Arquivos previstos (4):

| Arquivo | Família | Subset | Peso |
|---|---|---|---|
| `cormorant-garamond-latin.woff2` | Cormorant Garamond | latin | 300–700 |
| `cormorant-garamond-latin-ext.woff2` | Cormorant Garamond | latin-ext | 300–700 |
| `inter-latin.woff2` | Inter | latin | 100–900 |
| `inter-latin-ext.woff2` | Inter | latin-ext | 100–900 |

Preload apenas dos dois subsets `latin` (os usados na primeira dobra), com `crossorigin`.

**Fallbacks**: `Georgia, 'Times New Roman', serif` para títulos e `system-ui, -apple-system,
'Segoe UI', Roboto, Arial, sans-serif` para texto. `size-adjust` não é usado na primeira versão para
não introduzir números arbitrários; o CLS é medido no Lighthouse.

**Licenças**: Cormorant é distribuída sob SIL Open Font License 1.1 (repositório
`CatharsisFonts/Cormorant`); Inter também é OFL 1.1. Os arquivos de licença serão copiados para
`public/fonts/` ou referenciados em `docs/`.

**Alternativas descartadas**:

- **Google Fonts em runtime**: requisição a terceiro, risco de privacidade/LGPD e bloqueio de
  renderização; contraria o FR-002.
- **Fontes de sistema apenas**: não entrega a identidade editorial pedida.
- **Uma única família**: a spec exige serifada nos títulos e sans no corpo.

**Verificação**: teste E2E intercepta requisições de fonte e garante que nenhuma sai do domínio;
Lighthouse confirma CLS < 0,1.

## D4. Cabeçalho: logo em texto, menu curto e CTA discreto

**Decisão**: montar o cabeçalho em `BaseLayout.astro`:

- Logo em texto: “Faby Fonseca” em Cormorant Garamond e “Fotografia” em Inter, maiúsculas pequenas
  e `letter-spacing`, ambos dentro de um único link para `/`.
- Menu: **Início**, **Portfólio**, **Contato**; item atual com `aria-current="page"` e indicador
  visual (borda inferior), não apenas cor.
- CTA: link “Solicitar orçamento” para `/contato/`, com borda `1px` em `--color-accent`, fundo
  transparente e altura mínima de 44 px. No mobile ele permanece visível, sem menu hambúrguer.
- O menu e o CTA quebram em duas linhas quando necessário, sem rolagem horizontal em 360 px.

**Alternativas descartadas**:

- **Menu hambúrguer**: adiciona JavaScript e esconde navegação no mobile; com três itens não se
  justifica.
- **Logo como imagem**: a spec define logo em texto nesta versão.
- **CTA preenchido em terracota**: competiria com as fotos e reprovaria contraste com branco em
  `#B5715A`.

**Verificação**: teste E2E confere textos, destinos, `aria-current` e alvo de toque ≥ 44 px em 360 px.

## D5. Modelo de conteúdo: categoria como pasta com fotos embutidas

**Decisão**: substituir as coleções `categories` e `photos` por uma coleção `categories` em que cada
entrada é uma pasta:

```
content/portfolio/<slug>/index.md
content/portfolio/<slug>/imagens/<arquivo>
```

O frontmatter traz os dados da categoria e uma lista `photos[]`; cada item tem `title`, `alt`,
`image`, `order` e `published`.

**Motivo**: atende ao FR-021 (“cada categoria organizada como uma pasta que reúne sua descrição e
suas fotos”) e elimina o risco de uma foto apontar para uma categoria inexistente. Também reduz o
número de entradas no painel: cinco pastas em vez de cinco categorias + N fotos soltas.

**Alternativas descartadas**:

- **Manter coleções separadas**: funciona, mas não corresponde à pasta pedida e mantém a validação
  de categoria órfã.
- **Uma coleção por categoria**: cinco coleções fixas impedem criar/renomear categoria pelo painel
  e duplicam configuração no Astro e no CMS.
- **Fotos como arquivos Markdown dentro da pasta**: permitiria imagens ao lado, mas o painel
  mostraria uma coleção por categoria; a lista de objetos é mais simples para a administradora.

**Verificação**: `npm run check` valida o schema; `npm run validate:content` valida o frontmatter e
os arquivos; teste de conteúdo garante que toda imagem referenciada existe.

**Risco**: `image()` dentro de `z.array(z.object(...))` precisa resolver o caminho relativo ao
Markdown. A implementação do Astro (`createImage` → `pluginContext.resolve(imagePath,
entryFilePath)`) confirma que a transformação recebe o arquivo da entrada, então o caminho
`imagens/<arquivo>` funciona também dentro da lista. A tarefa de implementação deve cobrir isso com
um teste de build antes de migrar as seis fotos.

## D6. Pages CMS: cinco arquivos + cinco fontes de mídia

**Decisão**: no `.pages.yml`:

- `content`: cinco entradas `type: file` agrupadas em “Portfólio” (Casamentos, Ensaios, Família,
  Newborn, Eventos), cada uma apontando para `content/portfolio/<slug>/index.md`.
- Cada entrada tem os campos da categoria e uma lista `type: object` com `photos`, cujo campo de
  imagem usa `options.media: portfolio-<slug>`.
- `media`: cinco fontes nomeadas (`portfolio-casamentos`, etc.) com `input:
  content/portfolio/<slug>/imagens`, `output: imagens`, `rename: safe`, extensões de imagem.
- Home e Sobre continuam como arquivos únicos (`type: file`), com mídia própria para o hero.
- `featuredCategories` da home usa `select` múltiplo com as cinco categorias fixas; `reference` foi
  descartado porque a coleção `categories` deixou de existir.

**Motivo**: o Pages CMS permite listas de objetos com campo de imagem e permite escolher a fonte de
mídia por campo, mas **não** escolhe a fonte dinamicamente pelo valor de outro campo. Uma fonte por
categoria é o que mantém a foto nova caindo na pasta certa.

**Alternativas descartadas**:

- **Uma fonte única `portfolio`**: mais simples, mas todas as imagens cairiam em uma pasta comum,
  contrariando a pasta por categoria.
- **`type: tree` / `subfolders`**: organiza arquivos, mas não resolve a seleção de mídia por
  categoria e complica o schema.
- **Referência a uma coleção de fotos**: volta ao modelo de coleções separadas descartado em D5.

**Verificação**: revisão manual no Pages CMS (cenário da História 5) + `validate:content` no CI. O
guia `docs/admin.md` será reescrito com o novo fluxo.

## D7. Mosaico com CSS multi-column, sem JavaScript

**Decisão**: renderizar o mosaico com `columns` + `break-inside: avoid`:

```css
.gallery-grid {
  columns: 1;
  column-gap: var(--space-3);
}
@media (min-width: 640px) { .gallery-grid { columns: 2; } }
@media (min-width: 1024px) { .gallery-grid { columns: 3; } }
.gallery-grid > li { break-inside: avoid; margin-block-end: var(--space-3); }
```

Larguras responsivas por `srcset`/`sizes`; a imagem ocupa 100% da coluna e mantém a proporção
original, sem recorte.

**Motivo**: `grid-template-rows: masonry` / `display: grid-lanes` ainda é “limited availability”
(MDN, 2026): Safari 26.4 suporta, Chrome ainda depende de flag. O mosaico precisa funcionar em
qualquer navegador e sem JavaScript (FR-019). CSS columns é estável, progressivo e não exige
biblioteca.

**Alternativas descartadas**:

- **Masonry nativo**: melhora a ordem visual, mas não é Baseline e criaria layout diferente por
  navegador.
- **Biblioteca JS (Masonry, Isotope)**: peso, dependência e conteúdo essencial dependente de script.
- **Grid uniforme com `aspect-ratio` fixo**: recorta o assunto (caso limite da spec) ou deixa
  buracos grandes.

**Trade-off aceito**: CSS columns preenche de cima para baixo e depois à direita, então a ordem de
leitura visual não é exatamente linha a linha. Para preservar a ordem de leitura do leitor de tela,
o DOM permanece na ordem definida (`order`) e cada item tem `alt` descritivo; a ordem visual é
secundária e o layout é declarado como mosaico. O lightbox usa a ordem do DOM.

**Verificação**: E2E em 360/768/1280 px confere ausência de rolagem horizontal e largura das
imagens; inspeção visual confirma ausência de corte.

## D8. Portfólio: “Todos” por padrão, filtro por `?categoria=`

**Decisão**:

- Sem query string, todas as cinco categorias aparecem, na ordem `order`, cada uma com `h2`, descrição
  curta e mosaico.
- Com `?categoria=<slug>` válido, apenas a seção correspondente fica visível; as demais recebem
  `hidden`. O link ativo recebe `aria-current="page"` e estilo de borda.
- A troca de categoria no cliente atualiza a URL com `history.pushState`; o botão voltar restaura a
  visão anterior via `popstate`.
- Categoria inválida cai em “Todos” (sem erro visível).
- O lightbox considera apenas os cartões da seção visível.
- Sem JavaScript, todos os links de categoria são âncoras reais (`/portfolio/?categoria=<slug>`); o
  servidor estático não lê a query, então o HTML sai com todas as seções e um script mínimo aplica o
  filtro ao carregar. Com JS desabilitado, o visitante vê todas as categorias — conteúdo completo,
  sem quebra (FR-019).

**Alternativas descartadas**:

- **Página por categoria (`/portfolio/<slug>/`)**: muda URLs e amplia o escopo; a spec pede uma
  página com filtro.
- **Filtro apenas client-side sem URL**: perde compartilhamento e o botão voltar.
- **Renderizar só a categoria no build**: o build é estático e não recebe a query.

**Verificação**: E2E cobre carga direta com query, clique sem reload, `popstate` e categoria
inexistente; axe-core cobre a seção oculta.

## D9. Página `/sobre/` e divisão do texto

**Decisão**:

- Criar `content/sobre/index.md` (coleção `sobre`, entrada única) com `title`, `intro`, corpo Markdown
  (`body`, chave especial do CMS) e `image`/`imageAlt` opcionais.
- `src/pages/sobre.astro` renderiza o texto completo em `<article>`, com links para `/portfolio/` e
  `/contato/`.
- A home mantém `aboutTitle`, `aboutSummary` (até 400 caracteres) e um link “Conhecer a Faby” para
  `/sobre/`; o texto completo sai da home.
- O rodapé ganha **Sobre** ao lado de **Política de Privacidade**.

**Motivo**: atende ao FR-011 e à clarificação de evitar duplicação. O texto completo atual tem dois
parágrafos; a home passa a exibir um resumo curto derivado dele, sem inventar conteúdo.

**Alternativas descartadas**:

- **Duplicar o texto completo na home e em `/sobre/`**: conteúdo duplicado e home longa.
- **Página Sobre fixa em código**: contraria a possibilidade de edição pelo painel (FR-021) e o
  precedente da home.
- **Página Sobre com Markdown no corpo da home**: mistura duas páginas em um arquivo.

**Verificação**: E2E confere link na home e no rodapé, texto e CTAs; teste de conteúdo garante que o
resumo da home existe e que `/sobre/` não está vazio.

## D10. Foto real do hero: portão de publicação

**Decisão**: validar o hero no build com regras explícitas:

- Arquivo existe, extensão `jpg`, `jpeg`, `png` ou `webp`, ≤ 10 MB.
- Largura ≥ 2400 px **e** altura ≥ 2400 px, com recorte que preserve o assunto na exibição em
  retrato 3:4.
- `alt` obrigatório, 1–160 caracteres, descrevendo a imagem **publicada**.
- O build falha se o arquivo não atender às dimensões, se faltar `alt` ou se o hash corresponder a um
  placeholder conhecido. A aprovação editorial da foto (é a Faby? o recorte preserva o assunto?) é
  registrada no checklist de release, porque não é verificável por código.

Placeholder conhecido nunca é publicado: além das dimensões, o hash do arquivo é comparado com os
placeholders já usados no repositório.

**Estado atual**: `content/home/images/hero-home.jpg` (4898 × 3266 px, colorido, 817 KB) está aprovado
em 2026-10-25 pela responsável para uso no hero, com recorte retrato 3:4 (2449 × 3266) que preserva a
pessoa à direita. O texto alternativo deve descrever a imagem publicada. A referência anterior de
640 × 960 em preto e branco citada na spec permanece como histórico da conversa, não como arquivo no
repositório.

**Motivo**: FR-005 e SC-009 não admitem placeholder na versão publicada; a falha precisa acontecer
antes do deploy, não na revisão visual.

**Alternativas descartadas**:

- **Aceitar e ampliar uma amostra pequena**: 640 px não chega a 2400 px sem perda; reprovaria o
  requisito.
- **Aviso em vez de erro**: o site iria ao ar com a imagem errada.
- **Validação só manual**: não impede publicação acidental.

**Verificação**: teste unitário da regra de dimensão e de hash com fixtures; `npm run build` falha
enquanto o arquivo for pequeno ou um placeholder conhecido; checklist de release registra a aprovação,
o recorte e o `alt`.

## D11. Imagem padrão de compartilhamento (OG)

**Decisão**: gerar uma imagem 1200 × 630 com a identidade da marca (fundo `#F7F3EE`, logo em texto,
faixa `#B5715A`, uma foto de amostra), usando `sharp` já instalado, por um script versionado
(`scripts/generate-og.mjs`). O resultado é commitado em `public/og/default.jpg`, para que o build não
dependa da geração.

- `BaseLayout.astro` recebe `ogImage` opcional; usa `public/og/default.jpg` como fallback.
- Metadados: `og:title`, `og:description`, `og:image` (URL absoluta), `og:type` (`website` ou
  `article`), `og:url` canônico, `twitter:card`.
- Como o site pode rodar em `base` de projeto, a URL absoluta é montada com `Astro.site` +
  `withBase('/og/default.jpg')`.

**Alternativas descartadas**:

- **Gerar no build**: adiciona etapa e tempo de build sem ganho; a imagem muda raramente.
- **Serviço externo de OG**: dependência e privacidade.
- **Sem imagem**: reprova o caso limite “imagem de compartilhamento ausente”.

**Verificação**: teste E2E confere `og:image` absoluto e status 200; Lighthouse SEO.

## D12. Remoções: comentários, idioma, modo escuro e demonstração

**Decisão**: não existe nada a remover no código atual (o site nunca teve Giscus, seletor de idioma
ou dark mode), mas o plano fixa a proibição:

- Nenhum bloco de comentários, script de terceiros ou widget de idioma é adicionado.
- Nenhum `@media (prefers-color-scheme: dark)` nem `color-scheme: dark`.
- Nenhum texto, nome, imagem ou placeholder do tema é copiado; todo conteúdo vem de
  `content/` ou das constantes de contato.
- A política de privacidade afirma que não há analytics, cookies ou rastreadores.

**Verificação**: busca no código e no `dist/` por `giscus`, `dark`, `prefers-color-scheme`,
`lang-switch`, `i18n`, `analytics`, `gtag`, `plausible`, `umami`; teste E2E confere ausência de
elementos de demonstração.

## D13. Contraste e acessibilidade como teste automatizado

**Decisão**: manter axe-core + Lighthouse e adicionar um teste unitário de contraste que lê os
tokens de `tokens.css` e verifica os pares realmente usados:

| Par | Mínimo | Resultado |
|---|---|---|
| `#2B2622` sobre `#F7F3EE` | 4,5:1 | 13,55:1 |
| `#6B615A` sobre `#F7F3EE` | 4,5:1 | 5,46:1 |
| `#6B615A` sobre `#EFE8DE` | 4,5:1 | 4,96:1 |
| `#8E5238` sobre `#F7F3EE` | 4,5:1 | 5,57:1 |
| `#8E5238` sobre `#EFE8DE` | 4,5:1 | 5,06:1 |
| `#FFFFFF` sobre `#8E5238` | 4,5:1 | 6,15:1 |
| `#B5715A` sobre `#F7F3EE` | 3:1 (texto grande) | 3,47:1 |
| `#8A7B6E` sobre `#F7F3EE` | 3:1 (borda de campo) | 3,70:1 |

O teste falha se um par ficar abaixo do mínimo, se `#B5715A` for usado como `color` em seletor de
texto pequeno (heurística por declaração) ou se uma cor roxa aparecer.

**Alternativas descartadas**:

- **Confiar só no axe**: axe não calcula todos os pares nem entende uso pretendido (texto grande vs.
  pequeno).
- **Revisão manual apenas**: regride sem aviso.

**Verificação**: `npm run test:content` + `npm run test:a11y` + Lighthouse acessibilidade 100.

## D14. Migração de conteúdo e preservação de URLs

**Decisão**: migrar os arquivos atuais sem alterar textos:

1. Criar `content/portfolio/<slug>/index.md` para as cinco categorias, copiando `name`, `slug`,
   `description`, `order`, `active`.
2. Mover as seis imagens de `content/photos/images/` para `content/portfolio/<slug>/imagens/`.
3. Converter cada foto em item de `photos[]`, preservando `title`, `alt`, `order`, `publishedAt` e
   `published`; a imagem vira `imagens/<arquivo>`.
4. Criar `content/sobre/index.md` com o texto completo da apresentação; reduzir `aboutText` da home a
   `aboutSummary` + link.
5. Remover `content/categories/` e `content/photos/` depois da migração.
6. Atualizar `content.config.ts`, `.pages.yml`, scripts e testes no mesmo commit.

URLs preservadas: `/`, `/portfolio/`, `/contato/`, `/contato/enviado/`, `/privacidade/`,
`/portfolio/?categoria=<slug>`; adicionada `/sobre/`. Nenhum redirect é necessário.

**Alternativas descartadas**:

- **Converter URLs para `/portfolio/<slug>/`**: quebraria links compartilhados (FR-016).
- **Manter as duas estruturas durante a transição**: conteúdo duplicado e validação ambígua.

**Verificação**: `npm run build` + teste E2E de links internos + sitemap contendo `/sobre/`.

## D15. Dívida conhecida: domínio próprio

**Decisão**: manter a publicação em `https://juninhofonseca.github.io/faby-fonseca-site/` nesta
versão e registrar a divergência do Princípio VI (domínio próprio) como dívida explícita, já aceita
na feature 004.

**Motivo**: a spec de 005 declara o domínio próprio fora de escopo; trocar de hospedagem/domínio
agora adicionaria risco sem relação com a identidade visual.

**Mitigação**: `SITE_URL`/`SITE_BASE` continuam parametrizados; canônicos, OG e sitemap usam essas
variáveis, então a migração futura é uma mudança de configuração. A dívida está registrada no
`plan.md` e no `README.md`.

## D16. Estratégia de testes

**Decisão**:

| Camada | Ferramenta | Cobertura nova |
|---|---|---|
| Conteúdo | Node test + scripts | schema da categoria, `photos[]`, hero ≥ 2400 px, contraste, ausência de roxo |
| Build | Astro check + build | tipos, imagens, orçamento de 300 KB |
| E2E | Playwright (desktop 1280 + tablet 768 + mobile 360) | header/CTA, home, `/sobre/`, mosaico, filtro, lightbox, contato, privacidade |
| A11y | axe-core | todas as páginas, incluindo `/sobre/` |
| Performance | Lighthouse CI | `/`, `/portfolio/`, `/contato/`, `/sobre/`, `/privacidade/` em 4G |

O Lighthouse passa a incluir `/sobre/`; o CI continua rodando `build:test` com a chave falsa do
Web3Forms e o mock do Playwright.

**Verificação**: todos os comandos do `quickstart.md` verdes antes do merge; release bloqueado até a
foto real do hero.

## Fontes consultadas

- Pages CMS — configuração de mídia, conteúdo, campos de imagem/objeto e listas:
  <https://pagescms.org/docs/configuration/media/>,
  <https://pagescms.org/docs/configuration/content/>,
  <https://pagescms.org/docs/configuration/content/list/>,
  <https://pagescms.org/docs/configuration/fields/image/>,
  <https://pagescms.org/docs/configuration/fields/object/>.
- MDN — Grid lanes / masonry, “Limited availability” (consultado em 2026-10-25):
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Grid_lanes>.
- Astro — imagens em content collections e `image()`:
  <https://docs.astro.build/en/guides/images/>.
- Cormorant (Catharsis Fonts) — SIL Open Font License 1.1:
  <https://github.com/CatharsisFonts/Cormorant>.
- Inter — SIL Open Font License 1.1: <https://github.com/rsms/inter>.
- WCAG 2.1 — contraste mínimo (1.4.3) e texto grande: <https://www.w3.org/TR/WCAG21/#contrast-minimum>.
