# Contrato de Páginas — Identidade Visual e Portfólio

**Feature**: `005-tema-identidade` | **Data**: 2026-10-25

Define rotas, estrutura de cada página, ganchos de teste, comportamento com e sem JavaScript,
acessibilidade e metadados. O conteúdo que alimenta as páginas está em
[content.md](./content.md).

## Rotas

| Rota | Arquivo | `og:type` | Indexável | Situação |
|---|---|---|---|---|
| `/` | `src/pages/index.astro` | `website` | sim | mantida, redesenhada |
| `/portfolio/` | `src/pages/portfolio.astro` | `website` | sim | mantida, mosaico + filtro |
| `/contato/` | `src/pages/contato.astro` | `website` | sim | mantida, novo visual |
| `/contato/enviado/` | `src/pages/contato/enviado.astro` | `website` | não (`noindex`) | mantida |
| `/privacidade/` | `src/pages/privacidade.astro` | `article` | sim | mantida, texto atualizado |
| `/sobre/` | `src/pages/sobre.astro` | `article` | sim | **nova** |

Todas as rotas usam `withBase()` para links internos e funcionam na raiz do domínio ou na URL de
projeto do GitHub Pages.

## Estrutura compartilhada (`BaseLayout.astro`)

```
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header" data-site-header>
  <a class="site-logo" href="/" data-site-logo>
    <span class="site-logo__name">Faby Fonseca</span>
    <span class="site-logo__role">Fotografia</span>
  </a>
  <nav aria-label="Navegação principal">
    <a href="/" data-nav-link="inicio">Início</a>
    <a href="/portfolio/" data-nav-link="portfolio">Portfólio</a>
    <a href="/contato/" data-nav-link="contato">Contato</a>
  </nav>
  <a class="button button--ghost" href="/contato/" data-header-cta>Solicitar orçamento</a>
</header>
<main id="conteudo">…</main>
<footer class="site-footer" data-site-footer>
  <a href="https://www.instagram.com/faby.fonseca.fotografia/" data-footer-instagram>@faby.fonseca.fotografia</a>
  <a href="/sobre/" data-footer-link="sobre">Sobre</a>
  <a href="/privacidade/" data-footer-link="privacidade">Política de Privacidade</a>
</footer>
```

Regras:

- O logo é texto; “Faby Fonseca” em `--font-display` e “Fotografia” em `--font-body`, dentro de um
  único link para `/`.
- O item de menu da página atual recebe `aria-current="page"` e indicador visual (borda inferior),
  nunca apenas cor.
- O CTA do cabeçalho tem no mínimo 44 × 44 px, borda `1px solid var(--color-accent)` e fundo
  transparente.
- Em 360 px, logo, menu e CTA quebram em linhas sem rolagem horizontal; nenhum item é escondido.
- O rodapé mostra Instagram, e-mail e WhatsApp, além de Sobre e Política de Privacidade.
- `theme-color` = `#F7F3EE`.
- Preload dos dois WOFF2 `latin`; nenhuma requisição a domínio de fonte externo.

### Metadados por página

| Página | `title` | `description` |
|---|---|---|
| `/` | `Faby Fonseca Fotografia` | Fotografia de casamentos, ensaios, família, newborn e eventos por Faby Fonseca. |
| `/portfolio/` | `Portfólio \| Faby Fonseca Fotografia` | Galeria de casamentos, ensaios, família, newborn e eventos. |
| `/sobre/` | `Sobre \| Faby Fonseca Fotografia` | Conheça Faby Fonseca e sua forma de fotografar histórias. |
| `/contato/` | `Contato \| Faby Fonseca Fotografia` | Solicite um orçamento para casamentos, ensaios, família, newborn ou eventos. |
| `/privacidade/` | `Política de Privacidade \| Faby Fonseca Fotografia` | Como os dados do formulário são coletados, usados, compartilhados e excluídos. |
| `/contato/enviado/` | `Pedido enviado \| Faby Fonseca Fotografia` | Confirmação do envio do pedido de orçamento. |

Todas as páginas públicas têm `canonical` absoluto, `og:title`, `og:description`, `og:image`,
`og:url`, `og:type` e `twitter:card=summary_large_image`. `/contato/enviado/` recebe
`<meta name="robots" content="noindex">`.

## `/` — Início

Ordem visual:

1. **Hero** (`data-home-hero`): `h1` com `heroTitle`, parágrafo com `heroText`, dois CTAs
   (`data-home-cta="portfolio"` → `/portfolio/`, `data-home-cta="orcamento"` → `/contato/`) e a foto
   real em retrato (`heroImage`, `heroAlt`).
2. **Categorias em destaque**: três cartões (`data-home-category="<slug>"`) com foto publicada da
   categoria, nome, descrição e link para `/portfolio/?categoria=<slug>`.
3. **Sobre**: `h2` (`aboutTitle`), resumo (`aboutSummary`), link “Conhecer a Faby” para `/sobre/`
   (`data-home-sobre-link`).
4. **CTA final**: “Solicitar orçamento” (`data-home-cta="orcamento-final"` → `/contato/`).

Regras:

- A foto do hero é a única imagem `loading="eager"` + `fetchpriority="high"`; as demais são lazy.
- O hero usa `width`/`height` reais para reservar espaço (CLS 0).
- A foto é exibida em retrato 3:4 com `object-fit: cover` e `object-position` ajustado para preservar
  o assunto; ponto de partida `object-position: 72% center`, validado visualmente em 360 px e 1280 px,
  sem cortar o rosto ou as mãos.
- O cartão de categoria sem foto publicada mostra um fundo `--color-surface` com o nome, sem imagem
  quebrada.

## `/portfolio/` — Portfólio

Estrutura:

```
<h1>Portfólio</h1>
<nav aria-label="Filtrar por categoria">
  <a href="/portfolio/" data-category-link="todos" aria-current="page">Todos</a>
  <a href="/portfolio/?categoria=casamentos" data-category-link="casamentos">Casamentos</a>
  … (ensaios, familia, newborn, eventos)
</nav>
<section data-gallery-section="casamentos" aria-labelledby="categoria-casamentos">
  <h2 id="categoria-casamentos">Casamentos</h2>
  <p>descrição curta</p>
  <ul class="gallery-grid" role="list">
    <li><a data-photo-card data-full-src="…" data-alt="…" data-title="…">…</a></li>
  </ul>
</section>
… demais categorias
<Lightbox label="Fotos do portfólio" />
```

Regras:

- **Sem query string**, todas as seções ficam visíveis e “Todos” recebe `aria-current="page"`.
- **Com `?categoria=<slug>` válido**, apenas a seção correspondente fica visível; as outras recebem
  `hidden`. Categoria inválida cai em “Todos”.
- O clique no filtro atualiza a URL com `history.pushState`; o botão voltar dispara `popstate` e
  restaura a visão anterior. A página não recarrega.
- O filtro é progressivo: o HTML sai com todas as seções para funcionar sem JavaScript; um script
  curto aplica o `hidden` ao carregar quando há query.
- O mosaico usa CSS columns (1 / 2 / 3 colunas em 360 / 640 / 1024 px), `break-inside: avoid`, sem
  recorte e sem rolagem horizontal.
- Cada seção mantém `h2` e descrição; categoria vazia mostra “Em breve novas fotos nesta categoria.”
- O CTA de orçamento (`data-budget-cta`) aponta para `/contato/?categoria=<slug>` da categoria
  visível; sem filtro, aponta para `/contato/`.
- O lightbox considera apenas os cartões da seção visível, na ordem do DOM.
- A ordem do DOM é a ordem definida (`order`), mesmo que o CSS columns mude a posição visual.

### Lightbox (`Lightbox.astro` + `lightbox.client.ts`)

- Abre ao clicar/ativar um `[data-photo-card]`; exibe a variante ampliada, `alt` e título.
- `Esc` fecha; setas esquerda/direita navegam em ciclo; os botões “Anterior” e “Próxima” são
  operáveis por teclado.
- O foco fica preso no diálogo enquanto aberto e retorna ao cartão de origem ao fechar.
- `[data-lightbox-position]` anuncia “Foto N de M” com `aria-live="polite"`.
- Sem JavaScript, cada cartão continua sendo um link direto para a imagem ampliada
  (`href={data-full-src}`), então a foto permanece acessível.

## `/sobre/` — Sobre

```
<article data-about-page>
  <h1>{title}</h1>
  <p class="page-intro">{intro}</p>
  [retrato opcional com alt]
  {body em Markdown}
  <p><a data-about-cta="portfolio" href="/portfolio/">Ver o portfólio</a></p>
  <p><a data-about-cta="orcamento" href="/contato/">Solicitar orçamento</a></p>
</article>
```

Regras:

- O texto completo é o mesmo do site atual, em pt-BR, sem dados inventados.
- A página é alcançável pelo link “Conhecer a Faby” na home e por “Sobre” no rodapé de todas as
  páginas.
- `updatedAt`, quando presente, aparece como “Atualizado em dd/mm/aaaa”.
- O retrato é opcional; se existir, tem `alt` obrigatório.

## `/contato/` — Contato

Mantém o comportamento atual, com o novo visual:

- `h1` “Contato”, introdução, WhatsApp com mensagem pré-preenchida (`data-contact-whatsapp`),
  Instagram (`data-contact-instagram`) e e-mail (`data-contact-email`).
- Formulário (`data-contact-form`) com nome, telefone/WhatsApp, e-mail, categoria
  (`data-category-select`), data, detalhes e consentimento LGPD.
- Categoria pré-selecionada por `?categoria=<slug>` com aviso (`data-category-note`).
- Botão de envio e estados de erro/sucesso com `role="status"`/`role="alert"` e associação por
  `aria-describedby`.
- Link para `/privacidade/` e versão do consentimento.
- Sem JavaScript, o formulário envia por `POST` para o Web3Forms e redireciona para
  `/contato/enviado/`.

## `/privacidade/` — Política de Privacidade

- Mantém as 11 seções e a estrutura LGPD atuais.
- Atualiza a data de vigência (`PRIVACY_VERSION`/`PRIVACY_EFFECTIVE_AT`) e o texto de
  consentimento.
- Afirma explicitamente que o site **não usa analytics, cookies de medição ou rastreadores**.
- Lista o Web3Forms como operador do envio, os dados coletados, a finalidade, o prazo de retenção e
  os direitos do titular.
- `og:type=article`; link para e-mail e WhatsApp.

## `/contato/enviado/` — Confirmação

- Mantém o texto de confirmação, o prazo de resposta e os caminhos de contato.
- `noindex` e fora do sitemap.
- Link de volta ao portfólio.

## Comportamento sem JavaScript

| Recurso | Sem JS |
|---|---|
| Navegação e conteúdo | completo |
| Filtro do portfólio | todas as categorias visíveis; links `?categoria=` recarregam a página e o servidor estático entrega todas as seções |
| Mosaico | completo (CSS) |
| Lightbox | cada cartão abre a imagem ampliada em nova página |
| Formulário | envio POST nativo + redirect para `/contato/enviado/` |
| Fontes | fallback de sistema, texto visível |

Nenhum conteúdo essencial depende de script (FR-019).

## Acessibilidade

- Um único `h1` por página; hierarquia `h1 → h2 → h3` sem saltos.
- Landmarks: `header`, `nav` com rótulo, `main#conteudo`, `footer`.
- Skip link visível ao receber foco.
- Foco visível em todos os elementos interativos (`outline: 3px solid var(--color-focus)`).
- Alvos de toque ≥ 44 × 44 px, inclusive no menu e no filtro.
- Contraste AA em texto, botões, legendas e bordas de campo (ver `data-model.md`).
- `prefers-reduced-motion`: transições desativadas; nenhuma animação é obrigatória.
- Imagens sempre com `alt`; imagens decorativas com `alt=""` e `aria-hidden="true"` quando não
  acrescentam informação.
- Zoom de 200% e 360 px sem corte de texto ou rolagem horizontal.

## Ganchos de teste preservados

| Gancho | Onde | Uso |
|---|---|---|
| `data-home-hero` | home | hero |
| `data-home-cta` | home | CTAs (`portfolio`, `orcamento`, `orcamento-final`) |
| `data-home-category` | home | cartão de categoria |
| `data-home-sobre-link` | home | link para `/sobre/` |
| `data-category-link` | portfólio | filtro (inclui `todos`) |
| `data-gallery-section` | portfólio | seção por categoria |
| `data-photo-card` | portfólio | cartão de foto |
| `data-lightbox*` | portfólio | diálogo e controles |
| `data-budget-cta` | portfólio | CTA de orçamento da categoria |
| `data-contact-*` | contato | campos, canais e estados |
| `data-category-select` / `data-category-note` | contato | pré-seleção |
| `data-footer-instagram` | rodapé | Instagram |
| `data-footer-link` | rodapé | Sobre e Privacidade |
| `data-site-header` / `data-header-cta` | cabeçalho | identidade e CTA |
| `data-about-page` / `data-about-cta` | sobre | página e CTAs |

Os testes existentes que assumem exatamente cinco links de categoria ou o filtro escondendo uma
categoria por vez serão atualizados para o comportamento “Todos + filtro” descrito acima.

## Critérios de aceite por página

| Página | Aceite |
|---|---|
| `/` | paleta e tipografia aplicadas; hero real; três categorias; resumo + “Conhecer a Faby”; LCP < 3 s |
| `/portfolio/` | cinco seções na ordem; “Todos” padrão; filtro com URL e voltar; mosaico sem corte; lightbox com foco |
| `/sobre/` | texto completo; links para portfólio e orçamento; alcançável pela home e rodapé |
| `/contato/` | WhatsApp pré-preenchido; Instagram e e-mail corretos; formulário LGPD funcional |
| `/privacidade/` | 11 seções; data atualizada; ausência de analytics declarada |
| `/contato/enviado/` | confirmação; `noindex`; caminhos de contato |
