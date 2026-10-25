# Contrato da Página Inicial

**Feature**: `004-home-destaque` | **Data**: 2026-10-25

Define a estrutura entregue ao navegador, os seletores usados nos testes e as garantias de
acessibilidade e responsividade. Não há JavaScript próprio na home.

## Estrutura semântica

```text
<main>
  <section data-home-hero aria-labelledby="home-hero-title">
    <div>
      <h1 id="home-hero-title">{heroTitle}</h1>
      <p>{heroText}</p>
      <a data-home-cta="portfolio" href="{base}/portfolio/">Ver portfólio</a>
      <a data-home-cta="orcamento" href="{base}/contato/">Solicitar orçamento</a>
    </div>
    <figure data-home-hero-media>
      <img alt="{heroAlt}" ... />
    </figure>
  </section>

  <section data-home-categories aria-labelledby="home-categories-title">
    <h2 id="home-categories-title">Categorias em destaque</h2>
    <ul>
      <li>
        <a data-home-category="{slug}" href="{base}/portfolio/?categoria={slug}">
          [<img alt="{alt da foto}" ... />]
          <h3>{name}</h3>
          <p>{description}</p>
          <span>Ver trabalhos</span>
        </a>
      </li>
      <!-- exatamente 3 cartões -->
    </ul>
  </section>

  <section data-home-about aria-labelledby="home-about-title">
    <h2 id="home-about-title">{aboutTitle}</h2>
    <p>...</p>
    <p data-home-instagram>
      Acompanhe no Instagram
      <a data-instagram-link href="{INSTAGRAM_URL}"
         target="_blank" rel="noopener noreferrer">@{INSTAGRAM_HANDLE}</a>
    </p>
  </section>

  <section data-home-final aria-labelledby="home-cta-title">
    <h2 id="home-cta-title">Vamos registrar a sua história?</h2>
    <p>...</p>
    <a class="button" data-home-cta="orcamento-final" href="{base}/contato/">Solicitar orçamento</a>
  </section>
</main>
```

O rodapé de todas as páginas inclui:

```html
<a data-footer-instagram href="{INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">
  Instagram
</a>
```

## Seletores estáveis para teste

| Seletor | O que representa | Garantia |
|---|---|---|
| `[data-home-hero]` | seção de destaque | contém o único `h1` |
| `[data-home-hero-media] img` | foto de destaque | `alt` não vazio, `width`/`height`, `loading="eager"`, `fetchpriority="high"`, `srcset` com 480w |
| `[data-home-cta="portfolio"]` | CTA primário | `href` termina em `/portfolio/` |
| `[data-home-cta="orcamento"]` | CTA secundário | `href` termina em `/contato/` |
| `[data-home-category]` | cartão de categoria | exatamente 3, na ordem de `featuredCategories` |
| `[data-home-about]` | seção sobre a Faby | contém `aboutTitle` e `aboutText` |
| `[data-instagram-link]` | Instagram na home | `href` canônico, `target="_blank"`, `rel` com `noopener` |
| `[data-footer-instagram]` | Instagram no rodapé | presente em todas as páginas |
| `[data-home-cta="orcamento-final"]` | chamada final | `href` termina em `/contato/` |

## Links e destinos

| Elemento | Destino | Regra |
|---|---|---|
| Ver portfólio | `/portfolio/` | prefixado com `withBase()` |
| Solicitar orçamento | `/contato/` | prefixado com `withBase()` |
| Cartão de categoria | `/portfolio/?categoria=<slug>` | slug existente e ativo |
| Instagram | `https://www.instagram.com/faby.fonseca.fotografia/` | nova aba, `noopener noreferrer` |
| Contato do rodapé | e-mail e WhatsApp | inalterado em relação à feature 003 |
| Política de privacidade | `/privacidade/` | inalterado no rodapé |

Nenhum link da home leva a uma categoria inativa. A resolução usa apenas categorias ativas.

## Imagens

### Foto de destaque

| Atributo | Valor |
|---|---|
| Formato | WebP gerado pelo Astro |
| Larguras | 480, 800, 1200 e 1600 px |
| `sizes` | `(max-width: 899px) 100vw, 58vw` |
| `loading` | `eager` |
| `fetchpriority` | `high` |
| `quality` | 80 |
| Dimensões | `width` e `height` explícitos (evita CLS) |
| `alt` | `heroAlt`, nunca vazio |

### Miniaturas de categoria

| Atributo | Valor |
|---|---|
| Formato | WebP gerado pelo Astro |
| Larguras | 400 e 800 px |
| `sizes` | `(max-width: 767px) 100vw, 33vw` |
| `loading` | `lazy` |
| `alt` | `alt` da foto escolhida |
| Ausência de foto | nenhum `<img>`; cartão só com texto |

## Layout responsivo

| Largura | Destaque | Categorias | Sobre |
|---|---|---|---|
| 360 px | uma coluna: texto e depois foto | uma coluna | uma coluna |
| 768 px | uma coluna | três colunas | uma coluna |
| 1280 px | duas colunas (texto + foto) | três colunas | texto limitado a 46rem |

Requisitos:

- largura mínima suportada: 360 px;
- nenhuma rolagem horizontal em 360, 768 e 1280 px;
- alvos de toque ≥ 44 × 44 px;
- espaçamento consistente com os tokens existentes;
- nenhuma animação obrigatória; transições desativadas em `prefers-reduced-motion`.

## Acessibilidade

- Um único `h1`; seções com `h2`; cartões com `h3`.
- O cartão inteiro é um link; não há link aninhado nem botão dentro do cartão.
- Foco visível herdado de `:focus-visible`, com contraste AA.
- Botão primário e secundário com contraste ≥ 4,5:1.
- Texto do Instagram inclui o identificador, não apenas um ícone.
- Nenhuma informação essencial depende de cor.
- axe-core (WCAG 2.1 AA) sem violações em `/`.

## Comportamento sem JavaScript

A home é HTML estático. Com JavaScript desabilitado, título, foto, categorias, apresentação,
Instagram e chamadas continuam visíveis e navegáveis. Nenhum elemento essencial usa `hidden` ou
depende de script para aparecer.
