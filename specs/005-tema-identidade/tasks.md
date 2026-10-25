---

description: "Lista de tarefas executáveis da identidade visual e do portfólio centrado na galeria"

---

# Tarefas: Identidade Visual e Portfólio Centrado na Galeria

**Input**: Documentos de design em `/specs/005-tema-identidade/`

**Pré-requisitos**: [plan.md](./plan.md) (obrigatório), [spec.md](./spec.md) (histórias),
[research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/) e
[quickstart.md](./quickstart.md)

**Testes**: incluídos porque a constituição exige portões de acessibilidade, desempenho e
responsividade. Os testes de cada história cobrem o incremento depois da implementação.

**Organização**: tarefas agrupadas por história de usuário, na ordem de prioridade da spec
(US1 P1 → US2 P1 → US3 P2 → US4 P2 → US5 P3). As duas histórias P1 formam o MVP.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: história à qual a tarefa pertence (US1–US5)
- Todo caminho de arquivo é relativo à raiz do repositório

## Convenções de caminho

Projeto único Astro: conteúdo em `content/`, código em `src/`, testes em `tests/`, scripts em
`scripts/`, workflows em `.github/workflows/` e documentação em `docs/`.

---

## Fase 1: Setup (Infraestrutura compartilhada)

**Propósito**: preparar fontes, imagem de compartilhamento e medições antes de mexer no layout.

- [ ] T001 [P] Baixar e versionar Cormorant Garamond e Inter (variáveis, subsets latin e latin-ext, WOFF2) em `public/fonts/`, junto das licenças OFL, e registrar versões e origem em `docs/validation.md`
- [ ] T002 [P] Confirmar que `content/home/images/hero-home.jpg` aprovado (4898 × 3266 px, 817 KB) está versionado e registrar dimensões, hash e aprovação em `docs/validation.md`
- [ ] T003 [P] Criar `scripts/generate-og.mjs` com `sharp` e gerar `public/og/default.jpg` (1200 × 630) usando a foto aprovada e a identidade da marca; documentar o comando no `README.md`
- [ ] T004 [P] Adicionar o projeto `tablet` (768 × 1024) ao `playwright.config.ts`, mantendo desktop (1280 × 800) e mobile (360 × 740)

---

## Fase 2: Fundacional (Pré-requisitos bloqueantes)

**Propósito**: migrar o modelo de conteúdo, atualizar bibliotecas, CMS e validação para que todas as
histórias possam ser implementadas sem quebrar o build.

**CRÍTICO**: nenhuma história começa antes desta fase.

- [ ] T005 Reescrever `src/content.config.ts` com a coleção `categories` (glob `**/index.md` em `./content/portfolio`, fotos embutidas com `image()`), a coleção `home` com `heroTitle`, `heroText`, `heroImage`, `heroAlt`, `featuredCategories`, `aboutTitle` e `aboutSummary`, e a coleção singleton `sobre` com `title`, `intro`, `body`, `image`, `imageAlt` e `updatedAt`
- [ ] T006 [P] Criar `content/portfolio/casamentos/index.md` com os dados e as três fotos migradas de `content/photos/`, usando `imagens/<arquivo>` e preservando título, alt, ordem, data e situação
- [ ] T007 [P] Criar `content/portfolio/ensaios/index.md` com os dados e as duas fotos migradas de `content/photos/`, usando `imagens/<arquivo>` e preservando título, alt, ordem, data e situação
- [ ] T008 [P] Criar `content/portfolio/familia/index.md` com os dados e a foto migrada de `content/photos/`, usando `imagens/<arquivo>` e preservando título, alt, ordem, data e situação
- [ ] T009 [P] Criar `content/portfolio/newborn/index.md` e `content/portfolio/eventos/index.md` com nome, slug, descrição, ordem, `active: true` e `photos: []`
- [ ] T010 Mover as seis imagens de `content/photos/images/` para `content/portfolio/<slug>/imagens/`, conforme a categoria de cada foto, e remover `content/categories/` e `content/photos/`
- [ ] T011 Atualizar `content/home/index.md` para `heroAlt` da foto aprovada, `aboutSummary` curto, três categorias em destaque e remoção do texto completo da apresentação
- [ ] T012 Criar `content/sobre/index.md` com o texto completo de apresentação que hoje está em `content/home/index.md`, `title`, `intro` e `updatedAt`, sem reescrever o conteúdo
- [ ] T013 [P] Atualizar `src/lib/categories.ts` para o novo modelo, mantendo ordenação por `order`/nome, verificação de slugs únicos e uma resolução de filtro em que ausência ou slug inválido significa “Todos” (não a primeira categoria)
- [ ] T014 [P] Atualizar `src/lib/gallery.ts` para ler as fotos embutidas em `category.data.photos`, filtrar `published` e ordenar por `order`, `publishedAt` e `title`
- [ ] T015 [P] Atualizar `src/lib/home.ts` para os novos campos `aboutSummary` e para a validação de que `featuredCategories` tem três slugs ativos e distintos
- [ ] T016 [P] Criar `src/lib/sobre.ts` com `getSobre()`, que falha com mensagem clara se `content/sobre/index.md` não existir
- [ ] T017 [P] Atualizar `src/components/PhotoCard.astro` e `src/components/HomeCategoryCard.astro` para o novo tipo de foto embutida, mantendo `alt`, `data-photo-card`, `data-full-src`, `data-alt` e `data-title`
- [ ] T018 Atualizar `src/components/GalleryGrid.astro` e `src/components/CategoryNav.astro` para o novo modelo, incluindo o link “Todos” e o estado ativo por `aria-current`
- [ ] T019 Reescrever `.pages.yml` com cinco fontes de mídia (`portfolio-casamentos`, `portfolio-ensaios`, `portfolio-familia`, `portfolio-newborn`, `portfolio-eventos`), as fontes `home` e `sobre`, o grupo “Portfólio” com cinco arquivos e as entradas `home` e `sobre`, conforme `contracts/content.md`
- [ ] T020 [P] Atualizar `scripts/content-rules.mjs` com as regras do novo modelo: alt obrigatório, slug de categoria, fotos publicadas, `featuredCategories`, dimensões do hero (lado maior e altura ≥ 2400 px) e hash de placeholder
- [ ] T021 [P] Atualizar `scripts/validate-content.mjs` para validar `content/portfolio/*/index.md`, `content/home/index.md` e `content/sobre/index.md`, incluindo existência de imagens, formatos, limite de 10 MB, alt, hero e categorias em destaque
- [ ] T022 [P] Atualizar `scripts/check-image-budget.mjs` para varrer `content/portfolio/*/imagens/` e `content/home/images/`, mantendo o limite de 300 KB por variante de listagem
- [ ] T023 [P] Atualizar `tests/content/invariants.test.mjs` para as novas regras: alt vazio, categoria inexistente, hero pequeno, placeholder, `featuredCategories` inválidas e caminho de imagem
- [ ] T024 Atualizar `src/pages/index.astro`, `src/pages/portfolio.astro` e `src/pages/contato.astro` para consumir o novo modelo sem alterar ainda o visual, garantindo que o build continue verde
- [ ] T025 Rodar `npm run validate:content`, `npm run test:content`, `npm run check` e `npm run build`, corrigindo erros de schema, caminhos e tipos antes de iniciar as histórias

**Checkpoint**: modelo de conteúdo migrado, CMS e validação alinhados, build verde.

---

## Fase 3: História 1 — Identidade reconhecível (P1) 🎯 MVP

**Objetivo**: todas as páginas usam a paleta, as duas famílias tipográficas, o logo em texto e o
cabeçalho/rodapé da marca.

**Teste independente**: abrir `/`, `/portfolio/`, `/contato/`, `/sobre/` e `/privacidade/` em 360 px e
1280 px e conferir paleta, tipografia, contraste e ausência de roxo.

### Implementação

- [ ] T026 [US1] Substituir os tokens provisórios de `src/styles/tokens.css` pela paleta aprovada, pela variação acessível `#8E5238`, pelas bordas e pelo par tipográfico, com comentário curto sobre o uso restrito de `#B5715A`
- [ ] T027 [US1] Atualizar `src/styles/global.css` com a base da identidade: fundo, texto, títulos em Cormorant Garamond, corpo em Inter, links, botões, foco visível, formulários, contêiner, seções e utilitários, sem roxo e sem modo escuro
- [ ] T028 [US1] Criar `src/components/SiteHeader.astro` e `src/components/SiteFooter.astro` com logo em texto “Faby Fonseca”/“Fotografia”, menu Início/Portfólio/Contato, links de contato e links Sobre/Política de Privacidade
- [ ] T029 [US1] Atualizar `src/layouts/BaseLayout.astro` para usar `SiteHeader`/`SiteFooter`, carregar as fontes com `@font-face`/preload, definir `theme-color` `#F7F3EE`, canônico, Open Graph com imagem padrão e `twitter:card`
- [ ] T030 [US1] Aplicar a nova estrutura visual às páginas `src/pages/index.astro`, `src/pages/portfolio.astro`, `src/pages/contato.astro`, `src/pages/privacidade.astro` e `src/pages/contato/enviado.astro`, mantendo textos e URLs
- [ ] T031 [P] [US1] Criar `tests/content/identity.test.mjs` calculando contraste dos pares usados e verificando ausência de cores roxas em `src/styles/`
- [ ] T032 [US1] Criar `tests/e2e/identity.spec.ts` verificando `theme-color`, família tipográfica aplicada, cores computadas principais, ausência de roxo e ausência de rolagem horizontal em 360 px

**Checkpoint**: o site inteiro já se parece com a marca, antes de refinar galeria e contato.

---

## Fase 4: História 2 — Galeria protagonista (P1) 🎯 MVP

**Objetivo**: portfólio em mosaico contínuo com cinco categorias, filtro por URL e lightbox acessível.

**Teste independente**: percorrer as cinco categorias, filtrar, ampliar uma foto, navegar por teclado
e voltar ao ponto de origem.

### Implementação

- [ ] T033 [US2] Implementar o mosaico em `src/components/GalleryGrid.astro` e `src/components/PhotoCard.astro` com CSS columns (1/2/3), `break-inside: avoid`, `widths`/`sizes` adequados, `loading="lazy"` e sem recorte do assunto
- [ ] T034 [US2] Atualizar `src/components/CategoryNav.astro` para “Todos” + cinco categorias, com `aria-current`, estado visual por borda e alvo de toque ≥ 44 px
- [ ] T035 [US2] Reescrever `src/scripts/gallery.client.ts` para: partir de “Todos”, aplicar `?categoria=<slug>` ao carregar, filtrar sem recarregar, atualizar a URL com `pushState` e restaurar com `popstate`
- [ ] T036 [US2] Atualizar `src/components/Lightbox.astro` e `src/scripts/lightbox.client.ts` para escopo na seção visível, ciclo com setas, `Esc`, foco preso e retorno ao cartão de origem
- [ ] T037 [US2] Completar `src/pages/portfolio.astro` com as cinco seções na ordem, nome, descrição curta, mensagem “Em breve novas fotos nesta categoria.”, CTA de orçamento da categoria visível e fallback sem JavaScript
- [ ] T038 [US2] Atualizar `tests/e2e/gallery.spec.ts` para “Todos” por padrão, carga direta com query, clique sem reload, `popstate`, categoria inválida e categoria vazia
- [ ] T039 [US2] Atualizar `tests/e2e/lightbox.spec.ts` para escopo por categoria, navegação circular, `Esc` e retorno de foco
- [ ] T040 [US2] Adicionar a `tests/e2e/gallery.spec.ts` um caso com JavaScript desabilitado confirmando que todas as categorias e fotos continuam acessíveis
- [ ] T041 [US2] Atualizar `tests/a11y/portfolio.spec.ts` para o novo mosaico, filtro e lightbox

**Checkpoint**: identidade + galeria formam o MVP publicável.

---

## Fase 5: História 3 — Caminho para contratar (P2)

**Objetivo**: cabeçalho com CTA, home com hero e categorias, contato com WhatsApp/Instagram/e-mail e
formulário LGPD funcionando no novo visual.

**Teste independente**: acionar o CTA do cabeçalho, os CTAs da home, um cartão de categoria, o
WhatsApp, o Instagram e enviar o formulário.

### Implementação

- [ ] T042 [US3] Adicionar ao `src/components/SiteHeader.astro` o CTA “Solicitar orçamento” para `/contato/`, com borda, altura ≥ 44 px, foco visível e destaque do item atual do menu
- [ ] T043 [US3] Atualizar `src/pages/index.astro` com hero (foto aprovada em retrato 3:4, `loading="eager"`, `fetchpriority="high"`, dimensões explícitas), três cartões de categoria, resumo da Faby e CTA final, mantendo os ganchos `data-home-*`
- [ ] T044 [US3] Atualizar `src/components/BudgetCta.astro` e `src/pages/portfolio.astro` para o CTA apontar para `/contato/?categoria=<slug>` quando houver filtro e para `/contato/` em “Todos”
- [ ] T045 [US3] Atualizar `src/pages/contato.astro` com introdução, WhatsApp pré-preenchido, Instagram `@faby.fonseca.fotografia`, e-mail e links acessíveis no novo visual
- [ ] T046 [US3] Atualizar `src/components/ContactForm.astro` para a identidade, mantendo campos, consentimento LGPD, validação, estados de erro/sucesso e envio sem JavaScript
- [ ] T047 [US3] Atualizar `src/components/SiteFooter.astro` com e-mail, WhatsApp, Instagram, Sobre e Política de Privacidade, preservando `data-footer-instagram`
- [ ] T048 [US3] Atualizar `tests/e2e/home.spec.ts` para hero, CTAs, três categorias, resumo e link “Conhecer a Faby”
- [ ] T049 [US3] Atualizar `tests/e2e/contact-cta.spec.ts` e `tests/e2e/contact.spec.ts` para pré-seleção de categoria, WhatsApp, Instagram, e-mail e envio do formulário
- [ ] T050 [US3] Atualizar `tests/a11y/contato.spec.ts` para o novo visual e os estados do formulário

**Checkpoint**: o visitante encontra a Faby, vê o trabalho e chega ao contato.

---

## Fase 6: História 4 — Conhecer a Faby (P2)

**Objetivo**: página `/sobre/` com o texto completo, alcançável pela home e pelo rodapé, com caminhos
para portfólio e orçamento.

**Teste independente**: abrir `/sobre/` pela home e pelo rodapé, ler o texto e seguir para portfólio e
orçamento.

### Implementação

- [ ] T051 [US4] Criar `src/pages/sobre.astro` renderizando `title`, `intro`, Markdown de `body`, retrato opcional com `imageAlt` e CTAs para `/portfolio/` e `/contato/`
- [ ] T052 [US4] Atualizar `src/pages/index.astro` para exibir `aboutTitle`, `aboutSummary` e o link “Conhecer a Faby” para `/sobre/`
- [ ] T053 [US4] Adicionar “Sobre” ao `src/components/SiteFooter.astro` e confirmar o link em todas as páginas
- [ ] T054 [US4] Criar `tests/e2e/sobre.spec.ts` cobrindo texto completo, link da home, link do rodapé, CTAs e presença no sitemap
- [ ] T055 [US4] Criar `tests/a11y/sobre.spec.ts` com axe-core nas tags WCAG 2.1 AA

**Checkpoint**: a apresentação completa tem uma página própria e o caminho de confiança está fechado.

---

## Fase 7: História 5 — Manter o site sem programar (P3)

**Objetivo**: documentar e validar a edição de categorias, fotos, home e Sobre pelo Pages CMS.

**Teste independente**: publicar uma foto em uma categoria, alterar a descrição e editar home/Sobre
pelo painel; conferir o deploy e o bloqueio de uma publicação inválida.

### Implementação

- [ ] T056 [US5] Reescrever `docs/admin.md` para o fluxo “Portfólio → categoria → Fotos”, com upload, alt, ordem, publicação, home, Sobre e mensagens de erro comuns
- [ ] T057 [US5] Atualizar `README.md` com a nova árvore de `content/`, o modelo de pastas, os comandos de validação e a referência aos contratos da feature 005
- [ ] T058 [US5] Executar o cenário 5 de `quickstart.md` no Pages CMS real (foto de teste, descrição, textos da home/Sobre), confirmar o deploy, reverter a foto de teste e registrar em `docs/validation.md`
- [ ] T059 [US5] Executar os cenários negativos de validação (foto sem alt, hero abaixo de 2400 px, variante acima de 300 KB, categoria inexistente) em cópia local descartável e registrar as mensagens em `docs/validation.md`

**Checkpoint**: a Faby mantém o site sem código e recebe erro claro quando algo está inválido.

---

## Fase 8: Polimento e Validação

**Propósito**: fechar privacidade, qualidade, medições, documentação e publicação.

- [ ] T060 [P] Atualizar `src/pages/privacidade.astro` e `src/lib/contact.ts` com a data de vigência atual, o texto de consentimento e a declaração explícita de ausência de analytics, cookies e rastreadores
- [ ] T061 [P] Adicionar `http://localhost:4322/sobre/` à lista de URLs de `.lighthouserc.json`, mantendo as asserções atuais
- [ ] T062 Rodar `npm run validate:content`, `npm run test:content`, `npm run check` e `npm run build` e corrigir qualquer erro
- [ ] T063 Rodar `npm run test:e2e` completo (desktop 1280, tablet 768 e mobile 360, incluindo axe e sem JavaScript) e corrigir falhas
- [ ] T064 Rodar `npm run test:lighthouse` e confirmar desempenho ≥ 90, acessibilidade 100, LCP < 3 s e CLS < 0,1 em `/`, `/portfolio/`, `/contato/`, `/sobre/` e `/privacidade/`
- [ ] T065 Verificar manualmente 360, 768 e 1280 px, navegação por teclado, zoom de 200%, foco visível, alvos ≥ 44 px, contraste e ausência de rolagem horizontal
- [ ] T066 Procurar em `dist/` por `giscus`, `prefers-color-scheme`, `dark`, `lang-switch`, `i18n`, `analytics`, `gtag`, `plausible`, `umami`, `#7C3AED`, `#8B5CF6`, `#A855F7` e confirmar zero ocorrências
- [ ] T067 Atualizar `docs/validation.md` com a seção da feature 005: resultados, métricas, cobertura automatizada, aprovação da foto do hero e pendências
- [ ] T068 Fazer commit, push em `main`, acompanhar os workflows **CI** e **Deploy** e verificar `/`, `/portfolio/`, `/contato/`, `/sobre/` e `/privacidade/` na URL publicada
- [ ] T069 Confirmar no site publicado que o hero é a foto aprovada, que `/sobre/` está no sitemap, que o OG responde e que nenhum placeholder do tema aparece

---

## Dependências e Ordem de Execução

```text
Fase 1 (T001–T004)
    └─▶ Fase 2 (T005–T025)
            ├─▶ Fase 3 / US1 (T026–T032)
            │       ├─▶ Fase 4 / US2 (T033–T041)
            │       ├─▶ Fase 5 / US3 (T042–T050)
            │       ├─▶ Fase 6 / US4 (T051–T055)
            │       └─▶ Fase 7 / US5 (T056–T059)
            └─▶ Fase 8 (T060–T069)
```

- T005 depende de T002 (hero aprovado) e define o schema usado por T006–T017.
- T006–T009 são independentes entre si; T010 depende delas e da existência das pastas de imagem.
- T011 e T012 dependem de T005.
- T013–T017 dependem de T005 e T006–T010.
- T018 depende de T013–T017.
- T019 depende de T005 e T006–T012.
- T020–T023 dependem de T005.
- T024 depende de T013–T019.
- T025 depende de T005–T024.
- T026–T032 dependem de T025.
- T033–T041 dependem de T025, T026–T028 e T018.
- T042–T050 dependem de T025, T026–T028 e T013–T017.
- T051–T055 dependem de T012, T016, T025 e T026–T028.
- T056–T059 dependem de T019–T023 e de um deploy com a nova estrutura.
- T060–T069 dependem de todas as histórias concluídas.

## Oportunidades de Paralelismo

- T001–T004 em paralelo.
- T006–T009 em paralelo.
- T013–T017 em paralelo, depois de T005–T010.
- T020–T023 em paralelo entre si.
- T031 e T032 depois de T026–T030.
- US2, US3 e US4 podem avançar em paralelo depois de US1, pois mexem principalmente em
  `portfolio.astro`, `contato.astro` e `sobre.astro`; `index.astro` é compartilhado por US3 e US4 e
  deve ser editado em sequência.
- T056 e T057 em paralelo com US2–US4.
- T060 e T061 em paralelo.

## Estratégia de Implementação

1. **Fundação**: migrar conteúdo, schema, bibliotecas, CMS e validação sem mudar o visual.
2. **MVP (US1 + US2)**: aplicar a identidade e entregar o mosaico com filtro e lightbox. É o incremento
   que já muda a percepção do site e valoriza o trabalho.
3. **Conversão (US3)**: cabeçalho com CTA, home completa, contato e rodapé.
4. **Confiança (US4)**: página Sobre e caminhos a partir da home e do rodapé.
5. **Autonomia (US5)**: documentar e validar a edição pelo Pages CMS.
6. **Fechamento**: privacidade, acessibilidade, desempenho, documentação e deploy.

## Notas

- A foto do hero está aprovada, mas precisa estar commitada em `content/home/images/hero-home.jpg`;
  sem ela, T002 e T011 não podem ser concluídas.
- O build deve falhar de propósito para hero abaixo de 2400 px, placeholder conhecido ou alt ausente.
  A configuração inválida do cenário T059 nunca é commitada.
- Nenhum script de terceiros, analytics, comentário, seletor de idioma ou modo escuro pode ser
  introduzido por qualquer tarefa.
- A ordem visual do mosaico usa CSS columns; a ordem do DOM permanece a ordem editorial e o lightbox
  segue o DOM.
- T058 depende de acesso ao Pages CMS. Se o acesso não estiver disponível, a tarefa fica pendente e a
  entrega é registrada com essa ressalva em `docs/validation.md`.
- Commits devem ser feitos por bloco lógico (fundação, US1, US2, US3, US4, US5, polimento), com o
  build verde antes de avançar.
