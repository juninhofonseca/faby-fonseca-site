# Plano de Implementação: Galeria de Portfólio

**Branch**: `002-portfolio-gallery` | **Data**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação em `/specs/002-portfolio-gallery/spec.md`

## Resumo

Entregar a galeria de portfólio como um site estático em Astro, com conteúdo em Markdown
versionado no Git e editado pela Faby por meio do Pages CMS. A página de portfólio lista as
categorias ativas, filtra as fotos sem recarregar a página e abre cada foto em uma visualização
ampliada acessível baseada no elemento nativo `<dialog>`. As imagens são otimizadas no build
(WebP, tamanhos responsivos e lazy loading) e um verificador de orçamento garante o limite de
300 KB na grade. Cada categoria envia a categoria selecionada para a página de contato via
parâmetro de URL.

A abordagem preserva os princípios da constituição: nenhum backend, nenhum banco de dados,
JavaScript mínimo (vanilla), um único framework leve (Astro) e hospedagem gratuita no GitHub
Pages.

## Contexto Técnico

**Linguagem/Versão**: TypeScript (ES2022) no código do site; Node.js 22 LTS no build; Astro na
última versão estável no início da implementação, fixada no `package-lock.json`.

**Dependências Principais**: `astro` (build estático e pipeline de imagens com `sharp`);
`@astrojs/sitemap` (SEO). Desenvolvimento: `@playwright/test`, `@axe-core/playwright`,
`@lhci/cli`. Nenhum framework de UI ou de CSS.

**Armazenamento**: arquivos versionados no Git — Markdown com frontmatter em `content/` e
imagens originais em `content/photos/images/`. Sem banco de dados e sem API de conteúdo em tempo
de execução.

**Testes**: Playwright para fluxos E2E, responsividade e teclado; axe-core para acessibilidade;
Lighthouse CI para desempenho; script Node para o orçamento de imagens (≤ 300 KB) e validação dos
originais.

**Plataforma-Alvo**: site estático publicado no GitHub Pages via GitHub Actions; navegadores
modernos (últimas 2 versões de Chrome, Firefox, Safari e Edge; iOS Safari 16+).

**Tipo de Projeto**: aplicação web estática, projeto único (single project).

**Metas de Desempenho**: LCP < 3 s em 4G simulado; CLS < 0,1; nenhuma imagem da grade acima de
300 KB; nenhuma rolagem horizontal entre 360 px e 1920 px; JavaScript da galeria restrito ao
necessário para filtro, lightbox e atualização de URL.

**Restrições**: hospedagem estática gratuita; sem backend próprio; conteúdo e interface em
português do Brasil; nenhuma credencial no site público; identidade visual ainda provisória
(tokens CSS); formulário de contato e tratamento LGPD pertencem à feature de contato.

**Escala/Escopo**: aproximadamente 5 categorias, até ~200 fotos publicadas e 1 administradora
(Faby), com colaboração eventual por convite no Pages CMS.

## Constitution Check

*PORTÃO: deve passar antes da Fase 0. Reavaliado após a Fase 1.*

| Princípio | Status | Evidência / decisão do plano |
|-----------|--------|------------------------------|
| I. Idioma e Conteúdo em pt-BR | PASSA | Interface, categorias, textos alternativos e mensagens em pt-BR; identificadores de código em inglês. |
| II. Mobile First | PASSA | Layout desenhado a partir de 360 px, com breakpoints progressivos e alvos de toque ≥ 44 px. |
| III. Desempenho | PASSA | Astro gera WebP com `srcset` e lazy loading; verificador falha o build se alguma variante da grade passar de 300 KB; Lighthouse CI mede LCP < 3 s em 4G. |
| IV. Acessibilidade | PASSA | Texto alternativo obrigatório no schema; `<dialog>` nativo com foco preso, Esc, setas e retorno de foco; testes axe-core e de teclado. |
| V. Simplicidade e Dependências | PASSA | Um único framework (Astro), sem framework de UI/CSS; interações em TypeScript vanilla; Pages CMS é serviço externo sem dependência em tempo de execução. |
| VI. Custo e Hospedagem | PASSA | Repositório público + GitHub Pages + Pages CMS no plano gratuito; sem serviços com cobrança variável. |
| VII. Privacidade e LGPD | PASSA (com ressalva) | A galeria não coleta dados; o CTA transporta apenas o slug da categoria. O formulário de contato e o consentimento LGPD ficam na feature de contato. |
| VIII. Identidade de Marca | PASSA (provisório) | Cores e tipografia em variáveis CSS com paleta neutra provisória; a identidade final continua pendente na constituição (`TODO(BRAND_IDENTITY)`). |

**Reavaliação pós-Fase 1**: todos os portões continuam atendidos. O desenho de dados e contratos
não introduziu backend, banco ou dependência de runtime. Dois pontos ficam explicitamente
registrados:

- **FR-017 (recusa de upload inválido)**: o Pages CMS restringe extensões de arquivo, mas não
  expõe validação de tamanho no upload. O limite de 10 MB por original e o formato suportado são
  verificados no pipeline de publicação, que falha com mensagem acionável antes do deploy. A
  recusa, portanto, é aplicada no fluxo de publicação, não na interface do painel.
- **Identidade visual**: até a definição da marca, a UI usa apenas tokens neutros, sem decisões
  visuais definitivas.

**Resultado do portão**: PASSA, sem violações que exijam a tabela de complexidade.

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/002-portfolio-gallery/
├── plan.md              # Este arquivo
├── research.md          # Fase 0 — decisões técnicas
├── data-model.md        # Fase 1 — entidades e validações
├── quickstart.md        # Fase 1 — guia de validação
├── contracts/
│   ├── content-schema.md    # Contrato de conteúdo entre Pages CMS e o site
│   └── navigation.md        # Rotas, parâmetros, teclado e ARIA
└── tasks.md             # Fase 2 — criado por /speckit.tasks
```

### Código-fonte (raiz do repositório)

```text
.github/
└── workflows/
    ├── ci.yml                    # build, orçamento de imagens, Playwright, axe, Lighthouse
    └── deploy.yml                # publicação no GitHub Pages

content/
├── categories/                   # uma entrada Markdown por categoria
│   ├── casamentos.md
│   ├── ensaios.md
│   ├── familia.md
│   ├── newborn.md
│   └── eventos.md
└── photos/
    ├── images/                   # originais enviados pela Faby (JPG/PNG/WebP)
    └── <slug-da-foto>.md         # frontmatter: alt, categoria, ordem, data

public/
└── favicon.svg

scripts/
└── check-image-budget.mjs        # valida originais e variantes geradas (≤ 300 KB na grade)

src/
├── components/
│   ├── BudgetCta.astro
│   ├── CategoryNav.astro
│   ├── GalleryGrid.astro
│   ├── Lightbox.astro
│   └── PhotoCard.astro
├── content.config.ts             # coleções categories e photos + schema Zod
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   ├── categories.ts             # leitura, ordenação, resolução de slug
│   └── gallery.ts                # agrupamento por categoria e navegação circular
├── pages/
│   ├── contato.astro             # recebe ?categoria= e pré-seleciona
│   ├── index.astro
│   └── portfolio.astro
├── scripts/
│   ├── gallery.client.ts         # filtro sem recarregar + atualização da URL
│   └── lightbox.client.ts        # abertura, setas, Esc e foco
└── styles/
    ├── tokens.css
    └── global.css

tests/
├── a11y/
│   └── portfolio.spec.ts
└── e2e/
    ├── contact-cta.spec.ts
    ├── gallery.spec.ts
    └── lightbox.spec.ts

.pages.yml                       # configuração do Pages CMS
.gitignore
astro.config.mjs
package.json
tsconfig.json
```

**Decisão de estrutura**: projeto único Astro, sem separação frontend/backend. O diretório
`content/` fica na raiz (fora de `src/`) para que o Pages CMS edite Markdown e imagens sem
conhecer a estrutura interna do framework. `src/pages/` expõe três rotas estáticas; `src/lib/`
concentra lógica pura testável; `src/scripts/` contém apenas os aprimoramentos de navegador.

## Rastreabilidade dos Requisitos

> Seção de apoio ao `/speckit.tasks`; não substitui a especificação.

| Requisito | Onde é atendido |
|-----------|-----------------|
| FR-001, FR-002, FR-003 | `CategoryNav`, `GalleryGrid`, `portfolio.astro`, `gallery.client.ts` |
| FR-004, FR-005, FR-006 | Pipeline de imagens do Astro + `PhotoCard` + schema com `alt` obrigatório + `check-image-budget.mjs` |
| FR-007 a FR-010 | `Lightbox.astro`, `lightbox.client.ts`, `<dialog>` nativo |
| FR-011, FR-012 | `BudgetCta`, `contato.astro`, contrato de URL |
| FR-013, FR-014, FR-016 | `.pages.yml`, coleções `categories` e `photos`, autenticação do Pages CMS |
| FR-015, FR-017 | Campo `publishedAt`; restrição de extensões no Pages CMS + validação no CI |

## Complexity Tracking

Nenhuma violação constitucional identificada; a tabela de justificativa de complexidade não se
aplica. O único desvio de implementação em relação ao texto literal da spec está registrado na
reavaliação do portão (FR-017 aplicado no pipeline de publicação).
