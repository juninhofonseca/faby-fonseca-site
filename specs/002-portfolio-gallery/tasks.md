---

description: "Lista de tarefas executáveis da galeria de portfólio"

---

# Tarefas: Galeria de Portfólio

**Input**: Documentos de design em `/specs/002-portfolio-gallery/`

**Pré-requisitos**: [plan.md](./plan.md) (obrigatório), [spec.md](./spec.md) (histórias),
[research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/) e
[quickstart.md](./quickstart.md)

**Testes**: incluídos porque o plano e a constituição exigem portões automatizados de desempenho,
acessibilidade e aceite. Não é TDD: os testes de cada história cobrem o incremento depois da
implementação.

**Organização**: tarefas agrupadas por história de usuário, na ordem de prioridade da spec
(P1 → P2 → P2 → P3), para que cada incremento seja implementável e testável sozinho.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: história à qual a tarefa pertence (US1, US2, US3, US4)
- Todo caminho de arquivo é relativo à raiz do repositório

## Convenções de caminho

Projeto único Astro: código em `src/`, conteúdo em `content/`, testes em `tests/`, scripts em
`scripts/` e workflows em `.github/workflows/`.

---

## Fase 1: Setup (Infraestrutura compartilhada)

**Propósito**: inicialização do projeto e estrutura básica.

- [X] T001 Inicializar projeto Astro com TypeScript, sem integração de UI, gerando `package.json`, `astro.config.mjs` e `tsconfig.json`
- [X] T002 [P] Criar a árvore de diretórios do plano: `content/categories/`, `content/photos/images/`, `src/components/`, `src/layouts/`, `src/lib/`, `src/pages/`, `src/scripts/`, `src/styles/`, `scripts/`, `tests/e2e/`, `tests/a11y/` e `.github/workflows/`
- [X] T003 [P] Criar `.gitignore` com `node_modules/`, `dist/`, `.astro/`, `playwright-report/`, `test-results/`, `.lhci/` e arquivos de ambiente
- [X] T004 Instalar dependências e criar scripts npm em `package.json`: `dev`, `build`, `preview`, `check`, `check:images`, `test:e2e`, `test:a11y` e `test:lighthouse`
- [X] T005 [P] Configurar `astro.config.mjs` com `site` do domínio de produção, `@astrojs/sitemap` e saída estática padrão
- [X] T006 [P] Configurar `playwright.config.ts` com `webServer` (`npm run preview`), `baseURL`, um projeto mobile de 360 px e um desktop de 1280 px
- [X] T007 [P] Configurar `.lighthouserc.json` com throttling mobile 4G e asserções de `largest-contentful-paint` < 3000 ms, `cumulative-layout-shift` < 0,1 e acessibilidade sem violações críticas
- [X] T008 [P] Criar `src/styles/tokens.css` com variáveis CSS de cor neutra provisória, tipografia, espaçamento, raio e alvos de toque ≥ 44 px
- [X] T009 [P] Criar `src/styles/global.css` com reset, tipografia base, foco visível, link "pular para o conteúdo" e regra de `prefers-reduced-motion`
- [X] T010 [P] Criar `src/layouts/BaseLayout.astro` com `lang="pt-BR"`, metadados, cabeçalho, rodapé, um único `h1` por página e slot de conteúdo

---

## Fase 2: Fundacional (Pré-requisitos bloqueantes)

**Propósito**: schema de conteúdo, dados iniciais, lógica pura e CI — precisa existir antes de
qualquer história.

**CRÍTICO**: nenhuma história começa antes desta fase.

- [X] T011 Definir as coleções em `src/content.config.ts` com `glob()` sobre `content/categories` e `content/photos` e o schema Zod do data-model: categoria com `name` 1–60, `slug` único `^[a-z0-9]+(?:-[a-z0-9]+)*$`, `description` ≤ 160, `order` inteiro ≥ 0 e `active` padrão `true`; foto com `title` 1–80, `alt` 1–160 não vazio, `image()` resolvido de `content/photos/images/`, `category` existente, `order` inteiro ≥ 0, `publishedAt` ISO e `published` padrão `true`
- [X] T012 [P] Criar as categorias iniciais em `content/categories/`: `casamentos.md`, `ensaios.md`, `familia.md`, `newborn.md` e `eventos.md`, com `order` 10, 20, 30, 40 e 50 e `active: true`
- [X] T013 [P] Criar três fotos de exemplo em `content/photos/` (Markdown + imagens em `content/photos/images/`) cobrindo duas categorias, com `alt` descritivo, `order`, `publishedAt` e `published: true`
- [X] T014 [P] Implementar `src/lib/categories.ts`: retornar apenas categorias ativas ordenadas por `order`, resolver `slug` com fallback para a primeira ativa e validar o formato do slug
- [X] T015 [P] Implementar `src/lib/gallery.ts`: agrupar fotos publicadas por categoria, ordenar por `order` e desempatar por `publishedAt` e `title`, além de calcular anterior/próxima em ciclo e o rótulo "Foto N de M"
- [X] T016 [P] Criar `scripts/check-image-budget.mjs`: validar extensões `jpg`, `jpeg`, `png` e `webp` e limite de 10 MB nos originais; extrair `srcset` do HTML em `dist/`, verificar descritores ≤ 960 px e falhar se qualquer variante passar de 300 KB, indicando o arquivo
- [X] T017 [P] Criar `.github/workflows/ci.yml` com instalação, `npm run check:images`, `npm run build`, Playwright, axe e Lighthouse CI
- [X] T018 [P] Criar `.github/workflows/deploy.yml` para publicar `dist/` no GitHub Pages em pushes para `main`, com permissões mínimas

**Checkpoint**: schema, dados iniciais, lógica e CI prontos; as histórias podem começar.

---

## Fase 3: História 1 — Explorar o portfólio por categoria (P1) — MVP

**Objetivo**: listar categorias, filtrar a grade sem recarregar e manter a URL compartilhável.

**Teste independente**: abrir `/portfolio/`, selecionar "Casamentos", confirmar filtro, URL
`?categoria=casamentos` e ausência de rolagem horizontal em 360, 768 e 1280 px; repetir sem
JavaScript.

### Testes da História 1

- [X] T019 [P] [US1] Criar `tests/e2e/gallery.spec.ts` cobrindo ordem das categorias, filtro sem recarregar, atualização da URL, fallback para slug inválido, link direto e ausência de rolagem horizontal em 360/768/1280 px
- [X] T020 [P] [US1] Criar `tests/a11y/portfolio.spec.ts` com axe-core na página de portfólio, exigindo zero violações críticas

### Implementação da História 1

- [X] T021 [P] [US1] Criar `src/components/CategoryNav.astro` com links reais `href="/portfolio/?categoria=<slug>"`, `aria-current="page"` na ativa e alvos de toque ≥ 44 px
- [X] T022 [P] [US1] Criar `src/components/PhotoCard.astro` usando `<Image>` do Astro com larguras 480 e 960 px, `sizes` responsivo, `alt` obrigatório, `width`/`height` explícitos, `loading="lazy"` e `fetchpriority="high"` apenas nas primeiras posições
- [X] T023 [US1] Criar `src/components/GalleryGrid.astro` renderizando a grade da categoria ativa, com estado vazio "Em breve novas fotos nesta categoria" e atributos `data-*` para o filtro no cliente
- [X] T024 [US1] Implementar `src/scripts/gallery.client.ts` para interceptar cliques, trocar a grade a partir do conteúdo embutido, atualizar `aria-current` e usar `history.pushState` sem recarregar
- [X] T025 [US1] Implementar `src/pages/portfolio.astro` lendo `?categoria=`, resolvendo a categoria ativa no servidor, renderizando `CategoryNav`, `GalleryGrid` e o script, com estado vazio quando não há categorias ativas
- [X] T026 [US1] Adicionar em `src/styles/global.css` a grade responsiva de 1 coluna a partir de 360 px, 2 colunas a partir de 640 px e 3 colunas a partir de 1024 px, com `aspect-ratio` e sem `overflow-x`

**Checkpoint**: a História 1 funciona isolada e é o MVP demonstrável.

---

## Fase 4: História 2 — Ampliar e navegar entre fotos (P2)

**Objetivo**: abrir a foto em `<dialog>`, navegar em ciclo, fechar por botão/Esc e devolver o foco.

**Teste independente**: abrir a segunda foto de uma categoria com três ou mais fotos, navegar
com as setas até dar a volta, fechar com Esc e com o botão, confirmando o retorno de foco; repetir
usando apenas teclado.

### Testes da História 2

- [X] T027 [P] [US2] Criar `tests/e2e/lightbox.spec.ts` cobrindo abertura na foto correta, ciclo com `ArrowRight`/`ArrowLeft`, fechamento por Esc e botão, contenção de `Tab` e retorno de foco

### Implementação da História 2

- [X] T028 [P] [US2] Criar `src/components/Lightbox.astro` com `<dialog>`, `aria-labelledby`, botão fechar, botões anterior/próxima, região `aria-live="polite"` para "Foto N de M" e imagem ampliada de 1600 px
- [X] T029 [US2] Implementar `src/scripts/lightbox.client.ts` com `showModal()`, estado do índice, setas esquerda/direita em ciclo, `Esc` nativo, fechamento por botão e clique no fundo, foco inicial no botão fechar e retorno ao card de origem
- [X] T030 [US2] Adicionar a `src/components/PhotoCard.astro` os atributos `data-index`, `data-full-src` e `data-alt` para alimentar o lightbox sem duplicar a imagem ampliada no carregamento inicial
- [X] T031 [US2] Carregar a variante ampliada somente ao abrir e pré-carregar as vizinhas em `src/scripts/lightbox.client.ts`, mantendo o `alt` em todas as trocas
- [X] T032 [US2] Tratar em `src/scripts/lightbox.client.ts` falha de carregamento e foto removida: exibir o `alt`, pular para a vizinha disponível ou fechar sem erro no console
- [X] T033 [US2] Integrar `Lightbox` e o script em `src/pages/portfolio.astro`, garantindo que o link do card abra a imagem diretamente quando o JavaScript estiver desabilitado

**Checkpoint**: Histórias 1 e 2 funcionam juntas e isoladamente.

---

## Fase 5: História 4 — Manter a galeria atualizada (P2)

**Objetivo**: a Faby publica, remove e reordena fotos e categorias pelo Pages CMS, sem editar
código, com validação no build.

**Teste independente**: publicar uma foto com `alt`, categoria e ordem; confirmar na galeria;
remover e confirmar que desaparece; tentar `.gif` e original acima de 10 MB e confirmar a recusa.

### Testes da História 4

- [X] T034 [P] [US4] Criar `tests/content/invariants.test.mjs` com `node:test` cobrindo `alt` vazio, categoria inexistente, extensão inválida, original acima de 10 MB e variante de grade acima de 300 KB
- [X] T035 [US4] Adicionar o script `test:content` em `package.json` e executá-lo em `.github/workflows/ci.yml` antes do build

### Implementação da História 4

- [X] T036 [US4] Criar `.pages.yml` conforme `contracts/content-schema.md`: mídia em `content/photos/images` com saída `images`, `rename: safe` e extensões `jpg`, `jpeg`, `png`, `webp`; coleções `categories` e `photos` com todos os campos, rótulos em português e `reference` para categoria
- [X] T037 [US4] Adicionar mensagens de erro acionáveis em `src/content.config.ts` e `scripts/check-image-budget.mjs`, indicando arquivo, campo e limite violado
- [X] T038 [US4] Criar `docs/admin.md` com o passo a passo da Faby: convite no Pages CMS, autorização no GitHub, criação de categoria, envio de foto, ordem, publicação, remoção e o que fazer quando o workflow falhar
- [ ] T039 [US4] Executar o Cenário 4 de `quickstart.md` no Pages CMS real e registrar o resultado e eventuais ajustes em `docs/admin.md` — **pendente**: exige conta autorizada no Pages CMS e deploy real (ver `docs/validation.md`)

**Checkpoint**: o conteúdo é gerenciável sem código e as invariantes são verificadas no CI.

---

## Fase 6: História 3 — Solicitar orçamento da categoria (P3)

**Objetivo**: encaminhar a categoria ativa ao contato, pré-selecionada e editável.

**Teste independente**: selecionar "Newborn", acionar o CTA, confirmar
`/contato/?categoria=newborn` com a opção marcada; trocar a categoria; acessar `/contato/`
diretamente e confirmar que nenhuma opção vem marcada.

### Testes da História 3

- [X] T040 [P] [US3] Criar `tests/e2e/contact-cta.spec.ts` cobrindo o `href` do CTA, a pré-seleção, a troca de categoria, o parâmetro inválido e o acesso direto

### Implementação da História 3

- [X] T041 [P] [US3] Criar `src/components/BudgetCta.astro` como link real para `/contato/?categoria=<slug>` com o texto "Quero um orçamento desta categoria"
- [X] T042 [US3] Implementar `src/pages/contato.astro` lendo e validando `?categoria=`, renderizando o `<select>` com as categorias ativas, a opção marcada e a possibilidade de troca, sem transportar dados pessoais na URL
- [X] T043 [US3] Integrar `BudgetCta` em `src/pages/portfolio.astro` abaixo da grade da categoria ativa
- [X] T044 [US3] Adicionar em `src/layouts/BaseLayout.astro` o link de navegação para `/contato/` funcionando também sem parâmetro

**Checkpoint**: todas as histórias funcionam de forma independente.

---

## Fase 7: Polimento e Preocupações Transversais

**Propósito**: qualidade, documentação e validação final.

- [X] T045 [P] Criar `README.md` com requisitos, instalação, scripts, deploy, estrutura de conteúdo e link para `docs/admin.md`
- [X] T046 [P] Adicionar SEO em `src/layouts/BaseLayout.astro` e `src/pages/portfolio.astro`: `title` e `description` por categoria, canonical, Open Graph e sitemap já configurado
- [X] T047 [P] Revisar desempenho em `src/components/PhotoCard.astro` e `src/scripts/`: primeiras imagens `eager`/`fetchpriority`, demais `lazy`, e confirmar JavaScript da galeria restrito a filtro e lightbox
- [X] T048 [P] Revisar acessibilidade em `src/styles/global.css` e componentes: contraste AA, foco visível, alvos ≥ 44 px, ordem de foco e zoom em 200%
- [X] T049 Executar todos os cenários de `quickstart.md` e registrar os resultados em `docs/validation.md`
- [X] T050 Rodar a suíte completa (`test:content`, `check:images`, `build`, `test:e2e`, `test:a11y`, `test:lighthouse`), corrigir falhas, registrar o resultado em `docs/validation.md` e confirmar o deploy de produção no GitHub Pages — **concluída**: suíte registrada e deploy confirmado em https://juninhofonseca.github.io/faby-fonseca-site/ (domínio próprio pendente de DNS)

---

## Dependências e Ordem de Execução

### Dependências entre fases

- **Setup (Fase 1)**: sem dependências; começa imediatamente
- **Fundacional (Fase 2)**: depende do Setup; **bloqueia** todas as histórias
- **Histórias (Fases 3–6)**: dependem da Fase 2; podem rodar em paralelo se houver equipe
- **Polimento (Fase 7)**: depende das histórias desejadas

### Dependências entre histórias

- **US1 (P1)**: começa após a Fase 2; sem dependência de outras histórias — **MVP**
- **US2 (P2)**: começa após a Fase 2; integra com US1, mas o lightbox é testável com dados fixos
- **US4 (P2)**: começa após a Fase 2; independente do front-end, depende apenas do schema e do CI
- **US3 (P3)**: começa após a Fase 2; o CTA precisa da US1 para exibir a categoria ativa

### Dentro de cada história

1. Testes (quando incluídos) descrevem o aceite antes do ajuste final
2. Componentes e lógica pura antes da integração na página
3. Integração antes do polimento da história

### Oportunidades de paralelismo

- T002–T003 e T005–T010 em paralelo após T001/T004
- T012–T016 em paralelo após T011
- T017 e T018 em paralelo
- T019 e T020 em paralelo; T021 e T022 em paralelo
- T027 e T028 em paralelo
- T034 e T036 em paralelo
- T040 e T041 em paralelo
- T045–T048 em paralelo

---

## Exemplo de execução paralela: US1

```bash
# Testes da US1 em paralelo
Task: "Criar tests/e2e/gallery.spec.ts (T019)"
Task: "Criar tests/a11y/portfolio.spec.ts (T020)"

# Componentes independentes em paralelo
Task: "Criar src/components/CategoryNav.astro (T021)"
Task: "Criar src/components/PhotoCard.astro (T022)"
```

## Exemplo de execução paralela: US2 e US4

```bash
# Front-end do lightbox e conteúdo/admin evoluem sem conflito de arquivos
Task: "Criar src/components/Lightbox.astro (T028)"
Task: "Criar .pages.yml (T036)"
Task: "Criar tests/content/invariants.test.mjs (T034)"
```

---

## Estratégia de Implementação

### MVP primeiro (somente US1)

1. Concluir a Fase 1 (Setup)
2. Concluir a Fase 2 (Fundacional) — **bloqueante**
3. Concluir a Fase 3 (US1)
4. **PARAR e VALIDAR** a US1 com `tests/e2e/gallery.spec.ts` e `tests/a11y/portfolio.spec.ts`
5. Publicar a demonstração se estiver pronta

### Entrega incremental

1. Setup + Fundacional → base pronta
2. US1 → validar → publicar (MVP)
3. US2 → validar → publicar (lightbox)
4. US4 → validar → publicar (gestão de conteúdo)
5. US3 → validar → publicar (conversão para orçamento)
6. Polimento → validação final e deploy

### Estratégia com equipe

1. Equipe conclui Setup + Fundacional junta
2. Depois: pessoa A em US1, pessoa B em US2, pessoa C em US4
3. US3 entra após a US1; polimento ao final

---

## Notas

- `[P]` indica arquivos diferentes e ausência de dependência entre si
- O rótulo `[Story]` mantém a rastreabilidade com a spec
- Cada história termina em um checkpoint testável
- Verificar o build e o orçamento de imagens antes de cada commit de conteúdo
- Evitar tarefas vagas e conflito no mesmo arquivo
