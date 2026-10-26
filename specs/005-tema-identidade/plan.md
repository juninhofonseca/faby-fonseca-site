# Plano de Implementação: Identidade Visual e Portfólio Centrado na Galeria

**Branch**: `005-tema-identidade` | **Data**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação em `/specs/005-tema-identidade/spec.md`

## Resumo

Substituir a identidade visual provisória por uma identidade editorial e quente — fundo
`#F7F3EE`, texto `#2B2622`, destaque de marca `#B5715A` e destaque acessível `#8E5238`, títulos em
Cormorant Garamond e corpo em Inter — e reorganizar o site em torno da fotografia: mosaico contínuo
por categoria no portfólio, home com hero real e três categorias em destaque, página `/sobre/` com o
texto completo e cabeçalho com logo em texto, menu curto e CTA discreto de orçamento.

A entrega mantém Astro + TypeScript, saída estática, zero dependências novas e todo o conteúdo
editável no Pages CMS. O modelo de conteúdo passa a ser **uma pasta por categoria**, com descrição e
fotos juntas. Comentários, seletor de idioma, modo escuro e conteúdo de demonstração não são
adicionados; a política de privacidade passa a declarar a ausência de analytics, cookies e
rastreadores.

A feature é publicada com a **foto real do hero aprovada**: `content/home/images/hero-home.jpg`,
colorida, 4898 × 3266 px, exibida em recorte retrato 3:4 que preserva o assunto. O build bloqueia
arquivos com largura ou altura abaixo de 2400 px e placeholders conhecidos; a aprovação editorial da
foto, do recorte e do texto alternativo fica registrada no checklist de release.

## Contexto Técnico

**Linguagem/Versão**: TypeScript (ES2022) no site; Node.js 24 no build; Astro 7 (`>= 22.23.4`).

**Dependências Principais**: nenhuma nova. Astro Content Collections, `astro:assets` (`Image`,
`getImage`), `sharp` já instalado, CSS e JavaScript vanilla. Fontes auto-hospedadas em WOFF2.

**Tipo de Projeto**: site estático (Astro), projeto único, sem backend próprio e sem banco de dados.

**Armazenamento**: arquivos Markdown e imagens versionados no Git, editados pelo Pages CMS. Sem banco
de dados e sem backend próprio.

**Testes**: Node test (regras de conteúdo e contraste), `astro check` (tipos), Playwright (E2E em
360, 768 e 1280 px), axe-core (WCAG 2.1 AA) e Lighthouse CI (4G simulada).

**Plataforma-alvo**: navegadores modernos em celular (360 px+), tablet e desktop; site estático em
GitHub Pages, com HTTPS. Sem suporte a modo escuro, i18n ou comentários.

**Metas de desempenho**: LCP < 3 s em 4G simulada na home; CLS < 0,1; Lighthouse Performance ≥ 90 e
Acessibilidade 100; nenhuma variante de listagem acima de 300 KB.

**Restrições**: conteúdo em pt-BR; WCAG 2.1 AA; alvos de toque ≥ 44 × 44 px; sem analytics; sem
framework de UI; sem requisição a Google Fonts; URLs atuais preservadas; LGPD mantida.

**Escopo**: 6 rotas, 5 categorias, 6 fotos de amostra no portfólio, 1 foto real no hero, 2 páginas
institucionais editáveis (`home` e `sobre`), 2 famílias tipográficas, 1 imagem de compartilhamento.

## Constitution Check

*Portão aplicado antes da pesquisa e reavaliado após o desenho.*

| Princípio | Situação | Como o plano atende |
|---|---|---|
| I. Português do Brasil | ✅ | Todo texto visível, `alt`, metadados e mensagens em pt-BR; o texto atual é preservado. |
| II. Mobile First | ✅ | Layout desenhado em 360 px, breakpoints progressivos em 640/1024 px, alvos ≥ 44 px, menu completo no celular. |
| III. Desempenho | ✅ | Hero único `eager` + `fetchpriority=high`, demais imagens lazy, WebP responsivo, dimensões explícitas, sem dependência nova, fontes com `swap` e preload de 2 arquivos. |
| IV. Acessibilidade | ✅ | Um `h1` por página, landmarks, skip link, foco visível, contraste verificado por teste, lightbox com foco preso e retorno, `alt` obrigatório. |
| V. Simplicidade e Dependências | ✅ | Nenhuma dependência adicionada; CSS columns em vez de biblioteca de masonry; JS apenas para filtro e lightbox progressivos. |
| VI. Custo e Hospedagem | ⚠️ dívida aceita | GitHub Pages gratuito e HTTPS, mas em URL de projeto (`/faby-fonseca-site/`), não em domínio próprio. A spec declara domínio próprio fora de escopo; `SITE_URL`/`SITE_BASE` permitem a migração sem mudança de código. Registrado em Complexity Tracking. |
| VII. Privacidade e LGPD | ✅ | Formulário e consentimento mantidos; política atualizada; nenhuma chave versionada; nenhum analytics, cookie de medição ou rastreador. |
| VIII. Identidade de Marca | ✅ | Paleta e tipografia formalizadas em tokens; fotografia como elemento principal; logo em texto aprovado; identidade consistente nas 6 rotas. |
| Fluxo Spec Kit | ✅ | Especificação, checklist, pesquisa, modelo, contratos, quickstart e este plano antes de `/speckit.tasks`. |
| Portões de qualidade | ✅ | Validação em 360/768/1280 px, teclado, contraste, alt, Lighthouse e CI bloqueante. |

**Conclusão**: o plano passa, com uma dívida explícita (domínio próprio) já registrada e aprovada no
escopo da feature. Nenhuma violação nova.

## Checklist de Privacidade e LGPD

Exigido pelo Princípio VII da constituição para features que coletam dados pessoais.

- [x] **Dados coletados**: nome, telefone/WhatsApp, e-mail, categoria, data e detalhes do evento,
  enviados voluntariamente pelo formulário.
- [x] **Finalidade**: responder ao pedido de orçamento; base legal no consentimento do titular.
- [x] **Operador**: Web3Forms, declarado na política; nenhum outro terceiro recebe os dados.
- [x] **Retenção**: prazo informado na política; exclusão mediante solicitação do titular.
- [x] **Direitos do titular**: acesso, correção, exclusão e revogação do consentimento, com canal por
  e-mail.
- [x] **Consentimento**: checkbox obrigatório com link para `/privacidade/` e versão vigente.
- [x] **Sem rastreamento**: nenhum analytics, cookie de medição ou script de terceiros.
- [x] **Segredos**: nenhuma chave versionada; `PUBLIC_WEB3FORMS_KEY` vem de variável de ambiente.
- [ ] **Verificação**: política e `tests/e2e/privacy.spec.ts` atualizados na mesma entrega (T060).

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/005-tema-identidade/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
├── contracts/
│   ├── content.md
│   └── pages.md
└── tasks.md            # criado por /speckit.tasks
```

### Código (raiz do repositório)

```text
content/
├── portfolio/
│   ├── casamentos/
│   │   ├── index.md
│   │   └── imagens/
│   ├── ensaios/
│   │   ├── index.md
│   │   └── imagens/
│   ├── familia/
│   │   ├── index.md
│   │   └── imagens/
│   ├── newborn/
│   │   ├── index.md
│   │   └── imagens/
│   └── eventos/
│       ├── index.md
│       └── imagens/
├── home/
│   ├── index.md
│   └── images/
└── sobre/
    └── index.md

public/
├── fonts/                  # 4 WOFF2 + licenças OFL
└── og/
    └── default.jpg         # 1200 × 630

scripts/
├── build-test.mjs
├── check-image-budget.mjs
├── content-rules.mjs
├── generate-og.mjs         # novo: gera a imagem OG com sharp
└── validate-content.mjs

src/
├── components/
│   ├── BudgetCta.astro
│   ├── CategoryNav.astro
│   ├── ContactForm.astro
│   ├── GalleryGrid.astro
│   ├── HomeCategoryCard.astro
│   ├── Lightbox.astro
│   ├── PhotoCard.astro
│   └── SiteHeader.astro / SiteFooter.astro   # extraídos do layout
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   ├── categories.ts
│   ├── contact.ts
│   ├── contact-form.ts
│   ├── gallery.ts
│   ├── home.ts
│   ├── sobre.ts
│   └── urls.ts
├── pages/
│   ├── index.astro
│   ├── portfolio.astro
│   ├── sobre.astro         # novo
│   ├── contato.astro
│   ├── contato/enviado.astro
│   └── privacidade.astro
├── scripts/
│   ├── gallery.client.ts
│   └── lightbox.client.ts
├── styles/
│   ├── tokens.css
│   └── global.css
└── content.config.ts

tests/
├── content/
│   ├── invariants.test.mjs
│   └── identity.test.mjs   # novo: contraste e ausência de roxo
├── e2e/
│   ├── home.spec.ts
│   ├── gallery.spec.ts
│   ├── lightbox.spec.ts
│   ├── contact-cta.spec.ts
│   ├── contact-form.spec.ts
│   ├── privacy.spec.ts
│   ├── sobre.spec.ts       # novo
│   └── identity.spec.ts    # novo: header, fontes, paleta
└── a11y/
    ├── home.spec.ts
    ├── portfolio.spec.ts
    ├── contact.spec.ts
    ├── privacy.spec.ts
    └── sobre.spec.ts       # novo
```

**Decisão de estrutura**: projeto único Astro, sem separação frontend/backend. O conteúdo vive em
`content/`; a lógica de leitura em `src/lib/`; a apresentação em `src/components/` e `src/pages/`; a
identidade em `src/styles/tokens.css`. O CMS é configuração (`.pages.yml`), não código.

## Fluxo de Renderização e Dados

1. **Build** lê `content/portfolio/*/index.md`, `content/home/index.md` e `content/sobre/index.md`.
2. `getActiveCategories()` valida slugs únicos, ordena por `order` e devolve categorias com fotos
   publicadas ordenadas.
3. `/portfolio/` renderiza todas as seções; o script aplica `hidden` conforme `?categoria=` e mantém
   a URL sincronizada.
4. `/` resolve três categorias em destaque, a primeira foto publicada de cada uma e o hero.
5. `/sobre/` renderiza o Markdown completo e os CTAs.
6. `BaseLayout` injeta metadados, fontes, header, footer e `theme-color`.
7. `validate-content.mjs` roda antes do build no CI e no deploy; `check-image-budget.mjs` roda depois
   do build.
8. O Pages CMS edita os mesmos arquivos; cada categoria tem sua própria fonte de mídia.

## Fases de Implementação

### Fase 0 — Pesquisa (concluída)

- [x] Licença do tema e decisão de recriar sem copiar.
- [x] Contraste da paleta e variação acessível.
- [x] Licenças e formato das fontes.
- [x] Suporte a CSS masonry e escolha de CSS columns.
- [x] Modelo de conteúdo e limitações do Pages CMS.
- [x] Geração da imagem OG com `sharp`.

Saída: [research.md](./research.md).

### Fase 1 — Desenho (concluída)

- [x] Modelo de dados, migração e invariantes.
- [x] Contrato de conteúdo e mapeamento do CMS.
- [x] Contrato de páginas, ganchos, comportamento e acessibilidade.
- [x] Guia de validação e portão do hero.

Saída: [data-model.md](./data-model.md), [contracts/content.md](./contracts/content.md),
[contracts/pages.md](./contracts/pages.md), [quickstart.md](./quickstart.md).

### Fase 2 — Tarefas (`/speckit.tasks`)

Dividir em blocos verificáveis:

1. **Fundação**: conteúdo, schema, bibliotecas, CMS, validação e projeto de testes; sem mudar o
   visual.
2. **Identidade (US1)**: tokens, fontes, header/footer, layout e metadados.
3. **Galeria (US2)**: mosaico, filtro, lightbox e estados vazios.
4. **Conversão e confiança (US3/US4)**: home, contato, rodapé, Sobre e privacidade.
5. **Autonomia (US5)**: documentação e validação do Pages CMS.
6. **Fechamento**: E2E, a11y, Lighthouse, documentação e deploy.
7. **Release**: conferir a foto aprovada do hero, deploy e conferência publicada.

### Fase 3 — Implementação (`/speckit.implement`)

Cada bloco termina com `npm run check`, `npm run test:content` e o teste específico verde. O build de
produção só é considerado publicável com o portão do hero satisfeito.

## Rastreabilidade de Requisitos

| Requisito | Onde é atendido | Verificação |
|---|---|---|
| FR-001 paleta e `theme-color` | `tokens.css`, `BaseLayout.astro` | teste de contraste + `identity.spec.ts` |
| FR-002 duas famílias auto-hospedadas | `public/fonts/`, `@font-face` | E2E de requisições + Lighthouse |
| FR-003 cabeçalho e CTA | `SiteHeader.astro` | `identity.spec.ts` (logo/menu) + `home.spec.ts` (CTA) |
| FR-004 home atual com novo visual | `index.astro`, `home/index.md` | `home.spec.ts` |
| FR-005 hero real ≥ 2400 px | `home/index.md`, `validate-content.mjs` | portão de build + `quickstart` cenário 6 |
| FR-006 cinco categorias em mosaico | `portfolio.astro`, `GalleryGrid.astro` | `gallery.spec.ts` |
| FR-007 filtro com URL e voltar | `gallery.client.ts` | `gallery.spec.ts` |
| FR-008 lightbox por teclado | `Lightbox.astro`, `lightbox.client.ts` | `lightbox.spec.ts` |
| FR-009 alt obrigatório | schema + `validate-content.mjs` | `invariants.test.mjs` |
| FR-010 lazy e ≤ 300 KB | `PhotoCard.astro`, `check-image-budget.mjs` | build + `check:images` |
| FR-011 `/sobre/` e caminhos | `sobre.astro`, `sobre/index.md` | `sobre.spec.ts` |
| FR-012 contato mantido | `contact.ts`, `ContactForm.astro` | `contact-form.spec.ts`, `contact-cta.spec.ts` |
| FR-013 política sem analytics | `privacidade.astro`, `contact.ts` | `privacy.spec.ts` |
| FR-014 sem demonstração/idioma/dark | CSS, componentes, conteúdo | busca no `dist/` + `identity.spec.ts` |
| FR-015 metadados e OG | `BaseLayout.astro`, `public/og/`, `astro.config.mjs` | E2E de metadados por página + sitemap sem `/contato/enviado/` + Lighthouse SEO |
| FR-016 URLs preservadas + `/sobre/` | `astro.config.mjs`, páginas | E2E de links + sitemap |
| FR-017 360 px e teclado | `global.css` | E2E 360/768/1280 + axe |
| FR-018 contraste AA | `tokens.css` | `identity.test.mjs` + axe |
| FR-019 sem JavaScript | HTML/CSS + progressão | E2E com JS desabilitado |
| FR-020 sem framework de UI | `package.json` | conferência de dependências + busca no `dist/` |
| FR-021 CMS em pastas, home e Sobre | `.pages.yml`, `content/portfolio/`, `content/sobre/` | cenário 5 do quickstart |
| FR-022 validação bloqueante | scripts + CI | jobs de CI |
| SC-001 sem roxo | tokens e CSS | busca + teste |
| SC-002 contraste | tokens | teste + axe |
| SC-003 LCP/CLS/Lighthouse | hero e imagens | Lighthouse CI com performance ≥ 90 |
| SC-004 alt e 300 KB | validação + build | CI |
| SC-005 cinco categorias e filtros | portfólio | `gallery.spec.ts` |
| SC-006 URLs e sitemap | rotas | E2E + sitemap |
| SC-007 zero demonstração | conteúdo e CSS | busca + revisão |
| SC-008 360/768/1280 sem overflow | CSS | E2E |
| SC-009 hero real | portão de build | quickstart cenário 6 |
| SC-010 política atualizada | `privacidade.astro` | `privacy.spec.ts` |

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Foto do hero substituída por arquivo inadequado | bloqueia o release | portão de build (dimensões e hash de placeholder); foto e recorte atuais aprovados; site atual permanece em caso de falha |
| `image()` em lista de objetos não resolver o caminho | migração falha | teste de build com uma categoria antes de migrar as seis fotos; fallback é usar `import.meta.glob` ou caminho absoluto |
| CSS columns alterar a ordem visual | leitura menos linear | DOM na ordem correta; `alt` descritivo; lightbox segue o DOM; ordem visual é secundária |
| Fonte auto-hospedada aumentar o LCP | piora desempenho | subset latin/latin-ext, WOFF2, `swap`, preload de 2 arquivos, fallback de sistema |
| Pages CMS não gravar na pasta certa | foto some do build | uma fonte de mídia por categoria; cenário 5 do quickstart valida |
| Regressão de contraste ao ajustar o visual | reprova AA | teste unitário de contraste no CI + axe em todas as páginas |
| Lighthouse medir preview antigo | falso negativo/positivo | encerrar preview antes de rodar; CI sobe servidor próprio na 4322 |
| Textos migrados com encoding errado | conteúdo quebrado | migração via Git, revisão de diff e `validate:content` |
| Aumento de escopo visual | atrasa a entrega | fora de escopo explícito: agendamento, admin próprio, dark mode, analytics, i18n, banco de imagens real |

## Dívidas e Decisões Registradas

- **Domínio próprio (Princípio VI)**: mantido o GitHub Pages em URL de projeto nesta versão, conforme
  a spec. `SITE_URL`/`SITE_BASE` isolam a mudança futura. Dívida aceita e registrada.
- **Masonry nativo**: preterido por não ser Baseline; CSS columns é a escolha consciente, com
  trade-off de ordem visual documentado.
- **Uma fonte de mídia por categoria no CMS**: consequência da limitação do Pages CMS em escolher
  mídia dinamicamente; cinco fontes nomeadas resolvem sem código.
- **Logo em texto**: não há arquivo de marca nesta versão; a troca futura é isolada no header.
- **Imagem OG estática**: gerada localmente e commitada; troca futura não exige código.
- **E-mail `juninho.fonseca@gmail.com`**: mantido; troca exige atualizar Web3Forms e política.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Publicação em URL de projeto do GitHub Pages, sem domínio próprio (Princípio VI) | O domínio próprio está fora do escopo da feature 005 e a publicação atual já funciona; trocar agora adicionaria risco e custo sem relação com a identidade visual. | Publicar em domínio próprio exigiria registro/transferência, DNS e novo fluxo de deploy; a spec declara a URL de projeto como aceita nesta versão. A migração futura é só configuração (`SITE_URL`/`SITE_BASE`). |

Nenhuma outra violação à constituição foi identificada.
