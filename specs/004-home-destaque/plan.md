# Plano de Implementação: Home com Foto de Destaque e Instagram

**Branch**: `004-home-destaque` | **Data**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação em `/specs/004-home-destaque/spec.md`

## Resumo

Transformar a página inicial em uma vitrine completa: foto de destaque com chamada, três categorias
selecionadas pela Faby, apresentação curta e dois caminhos de conversão (portfólio e orçamento). O
link do Instagram passa a existir na home e no rodapé de todas as páginas.

Todo o conteúdo da home sai do código e vira uma entrada única editável no Pages CMS, com mídia
própria para a foto de destaque. A foto inicial é um placeholder isolado, trocável pela foto real
sem alteração de código. A home continua estática, sem JavaScript, sem dependências novas e sem
scripts de terceiros.

## Contexto Técnico

**Linguagem/Versão**: TypeScript (ES2022) no site; Node.js 24 no build; Astro 7 (`>= 22.23.4`).

**Dependências Principais**: nenhuma nova. Astro Content Collections, `astro:assets` (`Image`,
`getImage`), CSS existente. Desenvolvimento: Playwright, axe-core e Lighthouse CI já instalados.

**Conteúdo**: coleção singleton `home` em `content/home/index.md`; mídia em
`content/home/images/`. Categorias e fotos continuam nas coleções existentes.

**Configuração**: `.pages.yml` ganha uma fonte de mídia (`home`) e um arquivo único (`home`). Nenhuma
variável de ambiente nova.

**Armazenamento**: nenhum. A home não coleta dados; o Instagram é um link externo.

**Testes**: E2E da home (conteúdo, links, imagens, Instagram, responsividade, sem JavaScript),
axe-core em `/` e Lighthouse incluindo `/`.

**Plataforma-Alvo**: GitHub Pages via Actions; navegadores modernos (últimas 2 versões de Chrome,
Firefox, Safari e Edge; iOS Safari 16+).

**Metas de Desempenho**: LCP < 3 s em 4G; CLS < 0,1; nenhum JavaScript próprio ou de terceiros na
home; variantes de grade ≤ 300 KB; originais ≤ 10 MB.

**Restrições**: sem backend, sem banco, sem framework de UI, sem embed do Instagram; conteúdo em
pt-BR; identidade visual provisória isolada nos tokens; sem domínio próprio nesta versão.

**Escala/Escopo**: uma home; três categorias em destaque; cinco categorias ativas; seis fotos de
amostra.

## Constitution Check

*PORTÃO: deve passar antes da Fase 0. Reavaliado após a Fase 1.*

| Princípio | Status | Evidência / decisão do plano |
|-----------|--------|------------------------------|
| I. Idioma e Conteúdo em pt-BR | PASSA | Títulos, textos, alt, rótulos do painel e mensagens de validação em pt-BR; identificadores de código em inglês. |
| II. Mobile First | PASSA | Layout desenhado a partir de 360 px, uma coluna no mobile, alvos ≥ 44 px, sem rolagem horizontal em 360/768/1280. |
| III. Desempenho | PASSA | Home estática sem JavaScript; hero WebP responsivo com prioridade; miniaturas lazy; sem scripts de terceiros; Lighthouse mede `/`. |
| IV. Acessibilidade | PASSA | Um `h1`, seções `h2`, cartões `h3`, alt obrigatório, foco visível, contraste AA, teclado, axe em `/`. |
| V. Simplicidade e Dependências | PASSA | Nenhuma dependência nova; conteúdo em Markdown; componentes pequenos; sem biblioteca de UI. |
| VI. Custo e Hospedagem | PASSA | GitHub Pages e Pages CMS gratuitos; nenhum serviço pago; imagens geradas no build. |
| VII. Privacidade e LGPD | PASSA | A home não coleta dados; Instagram é link externo sem iframe, cookie ou pixel; política existente continua correta. |
| VIII. Identidade de Marca | PASSA (provisório) | A fotografia é o elemento principal; tipografia e cores continuam nos tokens provisórios, sem decisão definitiva. |

**Reavaliação pós-Fase 1**: todos os portões continuam atendidos. Dois pontos ficam registrados:

- **Dados duplicados evitados**: as categorias em destaque guardam apenas slugs; nome e descrição vêm
  da coleção de categorias. O Instagram vive em uma constante única, consumida por home e rodapé.
- **Fallback silencioso x validação**: a home tolera uma categoria indisponível em tempo de
  renderização, mas o build falha na validação. A tolerância evita página quebrada em produção; a
  falha garante que o problema seja corrigido na origem.

**Resultado do portão**: PASSA, sem violações que exijam a tabela de complexidade.

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/004-home-destaque/
├── spec.md                        # histórias, requisitos e critérios
├── plan.md                        # este arquivo
├── research.md                    # decisões técnicas
├── data-model.md                  # campos, relações e invariantes
├── quickstart.md                  # validação manual e automatizada
├── checklists/
│   └── requirements.md            # qualidade da especificação
├── contracts/
│   ├── home-content.md            # schema, CMS e mídia
│   └── home-page.md               # DOM, seletores, links e acessibilidade
└── tasks.md                       # tarefas executáveis
```

### Código-fonte (alterações)

```text
content/
├── home/
│   ├── index.md                   # NOVO — conteúdo editável da home
│   └── images/hero-home.jpg       # NOVO — placeholder isolado
├── categories/                    # inalterado
└── photos/                        # inalterado

.pages.yml                         # mídia "home" + arquivo "home"
.lighthouserc.json                 # adiciona a rota "/"

scripts/
├── content-rules.mjs              # NOVO assertFeaturedCategories
├── validate-content.mjs           # valida a home e a coerência das categorias
└── check-image-budget.mjs         # inclui content/home/images

src/
├── content.config.ts              # NOVA coleção "home"
├── lib/
│   ├── contact.ts                 # INSTAGRAM_HANDLE e INSTAGRAM_URL
│   └── home.ts                    # NOVO — leitura e resolução das categorias
├── components/
│   └── HomeCategoryCard.astro     # NOVO — cartão de categoria
├── pages/
│   └── index.astro                # reescrito — home completa
├── layouts/
│   └── BaseLayout.astro           # rodapé com Instagram
└── styles/
    └── global.css                 # estilos da home e botão secundário

tests/
├── content/invariants.test.mjs    # casos de assertFeaturedCategories
├── e2e/home.spec.ts               # NOVO
└── a11y/home.spec.ts              # NOVO

docs/
├── admin.md                       # como editar a home no painel
└── validation.md                  # registro da feature 004

README.md                          # estrutura do conteúdo e Instagram
```

**Decisão de estrutura**: `src/lib/home.ts` concentra a leitura da entrada e a resolução das
categorias em destaque, mantendo a página focada em marcação. `HomeCategoryCard.astro` isola a
lógica de miniatura/ausência de foto. Não há script de cliente: a home inteira é HTML e CSS.

## Fluxo de Renderização

```text
[content/home/index.md] ──▶ getEntry('home','index')
                                 │
                                 ├── hero: título, texto, imagem, alt
                                 ├── featuredCategories: 3 slugs
                                 └── about: título e parágrafos

[content/categories/*.md] ──▶ getActiveCategories()
                                 │
                                 └── resolveFeaturedCategories(slugs, ativas)
                                          │
                                          ├── categoria encontrada → cartão
                                          └── ausente/inativa → completa com próxima ativa

[content/photos/*.md] ──▶ getPhotosByCategory(destacadas)
                                 │
                                 └── primeira foto publicada → miniatura (lazy)

[index.astro] ──▶ BaseLayout (título, descrição, rodapé com Instagram)
```

## Rastreabilidade dos Requisitos

> Seção de apoio ao `/speckit.tasks`; não substitui a especificação.

| Requisito | Onde é atendido |
|-----------|-----------------|
| FR-001, FR-002 | `index.astro` (hero + `Image`), `global.css` |
| FR-003 | `[data-home-cta]` no hero e na chamada final |
| FR-004, FR-005, FR-006 | `HomeCategoryCard.astro`, `src/lib/home.ts`, `validate-content.mjs` |
| FR-007 | `aboutTitle`/`aboutText` em `content/home/index.md` |
| FR-008, FR-009 | `src/lib/contact.ts`, `index.astro`, `BaseLayout.astro` |
| FR-010, FR-011 | `content/home/index.md`, `.pages.yml`, `content/home/images/` |
| FR-012, FR-013, FR-014 | `index.astro`, `global.css`, `tests/a11y/home.spec.ts`, E2E |
| FR-015 | Home estática; teste com `javaScriptEnabled: false` |
| FR-016 | Nenhum `<script>` na home; nenhum iframe/embed |
| FR-017 | Nenhuma alteração em `package.json` |
| FR-018 | `src/content.config.ts`, `validate-content.mjs`, `content-rules.mjs` |
| FR-019 | `check-image-budget.mjs` |
| FR-020 | `BaseLayout` + metadados em `index.astro` |

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Foto real muito pesada | LCP acima de 3 s | Astro gera WebP responsivo; hero com prioridade; validação de original ≤ 10 MB |
| Texto alternativo esquecido ao trocar a foto | Acessibilidade e SEO | Campo obrigatório, guia da administradora e validação no build |
| Categoria em destaque desativada | Home com link quebrado | Validação falha; fallback para outra categoria ativa em produção |
| Categoria sem fotos | Cartão vazio | Cartão só com texto; layout preparado para ausência de imagem |
| Textos longos no painel | Layout quebrado | Limites no Zod e no validador; 600 caracteres no texto sobre |
| Cliente sem JavaScript | Conteúdo ausente | Home 100% estática; teste dedicado |
| Link do Instagram divergente | Duas fontes de verdade | Constante única em `src/lib/contact.ts` |
| Placeholder confundido com foto real | Expectativa errada | `heroAlt` declara "Foto provisória"; troca documentada no guia |
| Edição pelo painel não validada | Publicação falha para a Faby | Contrato detalhado + verificação manual no quickstart |

## Complexity Tracking

Nenhuma violação constitucional identificada. A tabela de justificativa de complexidade não se
aplica.
