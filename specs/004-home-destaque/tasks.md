---

description: "Lista de tarefas executáveis da home com foto de destaque e Instagram"

---

# Tarefas: Home com Foto de Destaque e Instagram

**Input**: Documentos de design em `/specs/004-home-destaque/`

**Pré-requisitos**: [plan.md](./plan.md) (obrigatório), [spec.md](./spec.md) (histórias),
[research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/) e
[quickstart.md](./quickstart.md)

**Testes**: incluídos porque a constituição exige portões de acessibilidade, desempenho e
responsividade. Os testes de cada história cobrem o incremento depois da implementação.

**Organização**: tarefas agrupadas por história de usuário, na ordem de prioridade da spec
(P1 → P2 → P2 → P3), para que cada incremento seja implementável e testável sozinho.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: história à qual a tarefa pertence (US1, US2, US3, US4)
- Todo caminho de arquivo é relativo à raiz do repositório

## Convenções de caminho

Projeto único Astro: conteúdo em `content/`, código em `src/`, testes em `tests/`, scripts em
`scripts/` e workflows em `.github/workflows/`.

---

## Fase 1: Setup (Infraestrutura compartilhada)

**Propósito**: preparar mídia, painel e medições antes de escrever a home.

- [X] T001 [P] Copiar `content/photos/images/ana-e-joao-cerimonia.jpg` para `content/home/images/hero-home.jpg`, criando a pasta de mídia isolada da home
- [X] T002 [P] Adicionar a `.pages.yml` a fonte de mídia `home` (`input: content/home/images`, `output: images`, `rename: safe`, extensões de imagem) e o arquivo único `home` (`path: content/home/index.md`, `format: yaml-frontmatter`) com todos os campos de `contracts/home-content.md`
- [X] T003 [P] Adicionar `http://localhost:4322/` à lista de URLs de `.lighthouserc.json`, mantendo as asserções atuais
- [X] T004 [P] Atualizar `scripts/check-image-budget.mjs` para verificar os originais de `content/home/images/` além de `content/photos/images/`

---

## Fase 2: Fundacional (Pré-requisitos bloqueantes)

**Propósito**: esquema, conteúdo inicial, constantes, resolução de categorias, validação e estilos.

**CRÍTICO**: nenhuma história começa antes desta fase.

- [X] T005 Adicionar a `src/content.config.ts` a coleção singleton `home` (glob `index.md` em `./content/home`), com `heroTitle`, `heroText`, `heroImage` (`image()`), `heroAlt`, `featuredCategories` (exatamente 3 slugs distintos), `aboutTitle` e `aboutText`, com os limites de `data-model.md`
- [X] T006 Criar `content/home/index.md` com o conteúdo inicial de `contracts/home-content.md` (Casamentos, Ensaios e Família em destaque)
- [X] T007 [P] Adicionar a `src/lib/contact.ts` as constantes `INSTAGRAM_HANDLE` (`faby.fonseca.fotografia`) e `INSTAGRAM_URL` (`https://www.instagram.com/faby.fonseca.fotografia/`)
- [X] T008 [P] Criar `src/lib/home.ts` com `getHome()` (falha com mensagem clara se a entrada não existir) e `resolveFeaturedCategories(categories, slugs, limit = 3)`, que preserva a ordem, ignora slugs inexistentes/inativos/repetidos e completa com as próximas categorias ativas
- [X] T009 [P] Adicionar `assertFeaturedCategories(featured, activeSlugs)` a `scripts/content-rules.mjs`, recusando quantidade diferente de três, repetição e slug inexistente ou inativo
- [X] T010 Atualizar `scripts/validate-content.mjs` para ler `content/home/index.md`, validar todos os campos textuais, a existência e o formato da foto de destaque, o limite de 10 MB e a coerência das categorias em destaque com as categorias ativas
- [X] T011 [P] Adicionar a `tests/content/invariants.test.mjs` casos para `assertFeaturedCategories`: três válidas, quantidade errada, slug repetido e slug inexistente/inativo
- [X] T012 [P] Adicionar a `src/styles/global.css` os estilos da home (hero em uma coluna no mobile e duas no desktop, seções, lista de três cartões, miniatura, bloco do Instagram, chamada final) e a variante `.button--secondary`, com alvos ≥ 44 px e `prefers-reduced-motion`

---

## Fase 3: História 1 — Primeira impressão e conversão (P1)

**Objetivo**: destaque com foto, título, frase e os dois caminhos de conversão.

**Teste independente**: abrir `/` em 360, 768 e 1280 px, conferir foto, texto e botões, e navegar por cada destino.

- [X] T013 [US1] Reescrever `src/pages/index.astro` para ler `getHome()`, renderizar o destaque (`h1`, `heroText`, `Image` com `widths`, `sizes`, `loading="eager"`, `fetchpriority="high"`, `heroAlt`) e os CTAs "Ver portfólio" e "Solicitar orçamento", além da chamada final de orçamento, com metadados próprios
- [X] T014 [US1] Criar `tests/e2e/home.spec.ts` cobrindo o destaque (título, texto, imagem com alt, dimensões, `eager`, `fetchpriority`, `srcset`), os dois CTAs e a chamada final

**Checkpoint**: a home já apresenta o trabalho e leva ao portfólio ou ao orçamento.

---

## Fase 4: História 2 — Categorias em destaque (P2)

**Objetivo**: três cartões com nome, descrição, miniatura opcional e link filtrado.

**Teste independente**: contar três cartões na home e abrir cada link, confirmando a categoria ativa no portfólio.

- [X] T015 [P] [US2] Criar `src/components/HomeCategoryCard.astro` recebendo categoria e foto opcional, com link único para `/portfolio/?categoria=<slug>`, `h3`, descrição, miniatura `lazy` (`400w`/`800w`) e fallback sem imagem
- [X] T016 [US2] Inserir em `src/pages/index.astro` a seção "Categorias em destaque" entre o hero e a chamada final, usando `getActiveCategories()`, `getPhotosByCategory()` e `resolveFeaturedCategories()`
- [X] T017 [US2] Ampliar `tests/e2e/home.spec.ts` para contar exatamente três cartões, conferir a ordem, os hrefs, a descrição, a miniatura e o fallback de uma categoria sem foto

**Checkpoint**: o visitante encontra o trabalho específico em um clique.

---

## Fase 5: História 3 — Apresentação e Instagram (P2)

**Objetivo**: texto sobre a Faby e link do Instagram na home e no rodapé.

**Teste independente**: ler a apresentação e acionar o Instagram na home e no rodapé de `/portfolio/` e `/contato/`.

- [X] T018 [US3] Inserir em `src/pages/index.astro` a seção sobre a Faby (`aboutTitle`, parágrafos de `aboutText`) com o link do Instagram usando `INSTAGRAM_HANDLE` e `INSTAGRAM_URL`
- [X] T019 [P] [US3] Adicionar a `src/layouts/BaseLayout.astro` o link do Instagram no rodapé, com `target="_blank"`, `rel="noopener noreferrer"` e `data-footer-instagram`
- [X] T020 [US3] Ampliar `tests/e2e/home.spec.ts` para a apresentação, o link do Instagram na home e no rodapé de todas as páginas, `target`, `rel` e ausência de iframe/script do Instagram

**Checkpoint**: a apresentação dá voz à marca e o Instagram conecta os canais.

---

## Fase 6: História 4 — Atualizar a home sem programar (P3)

**Objetivo**: documentar e validar a edição pelo Pages CMS.

**Teste independente**: alterar foto, textos e categorias no painel, publicar e conferir a home após o deploy.

- [X] T021 [P] [US4] Adicionar a `docs/admin.md` a seção "Editar a página inicial", com o passo a passo de foto, texto alternativo, textos e três categorias, além das mensagens de erro comuns
- [X] T022 [P] [US4] Atualizar `README.md` com a nova estrutura de `content/`, a home editável, o Instagram e a referência ao contrato da feature 004
- [ ] T023 [US4] Executar o cenário 4 de `quickstart.md` no Pages CMS real (foto, textos e ordem das categorias), confirmar o deploy e registrar o resultado em `docs/validation.md`; reverter a foto de teste ao final

**Checkpoint**: a Faby atualiza a home sem código e recebe erro claro quando a configuração é inválida.

---

## Fase 7: Polimento e Validação

**Propósito**: fechar qualidade, medições e registro.

- [X] T024 [P] Criar `tests/a11y/home.spec.ts` com axe-core em `/` (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`)
- [X] T025 Rodar `npm run validate:content`, `npm run test:content` e `npm run check` e corrigir qualquer erro
- [X] T026 Rodar `npm run test:e2e` completo (desktop e mobile, incluindo axe e sem JavaScript) e corrigir falhas
- [X] T027 Rodar `npm run test:lighthouse` e confirmar desempenho ≥ 90, acessibilidade 100 e LCP < 3 s em `/`
- [X] T028 Registrar em `docs/validation.md` a seção da feature 004 com resultados, métricas, cobertura automatizada e pendências
- [X] T029 Verificar manualmente 360, 768 e 1280 px, navegação por teclado, zoom de 200%, textos alternativos e ausência de rolagem horizontal
- [X] T030 Confirmar que nenhum dado pessoal, chave ou token novo aparece em `git status`, `git diff` ou arquivos versionados
- [ ] T031 Fazer commit, push em `main`, acompanhar os workflows **Deploy** e **CI** e verificar a home na URL publicada
- [X] T032 Confirmar que a validação de conteúdo bloqueia uma categoria em destaque inativa e uma imagem ausente (teste local descartável, sem publicar configuração inválida) e registrar o resultado em `docs/validation.md`

---

## Dependências e Ordem de Execução

```text
Fase 1 (T001–T004)
    └─▶ Fase 2 (T005–T012)
            ├─▶ Fase 3 / US1 (T013–T014)
            │       ├─▶ Fase 4 / US2 (T015–T017)
            │       ├─▶ Fase 5 / US3 (T018–T020)
            │       └─▶ Fase 6 / US4 (T021–T023)
            └─▶ Fase 7 (T024–T032)
```

- T006 depende de T005 e T001.
- T010 depende de T005, T006 e T009.
- T013 depende de T005, T006, T007, T008 e T012.
- T015 depende de T005 e T008.
- T016 depende de T013, T015 e T008.
- T018 depende de T013 e T007.
- T019 depende de T007.
- T023 depende de T002, T006, T021 e de um deploy com a home publicada.
- T027 depende de T026.
- T031 depende de T028, T029 e T030.

## Oportunidades de Paralelismo

- T001, T002, T003 e T004 em paralelo.
- T005, T007 e T009 em paralelo.
- T008 pode rodar após T005; T011 e T012 em paralelo com T008 e T010.
- T015 e T019 em paralelo.
- T021 e T022 em paralelo com T018–T020.
- T024 e T013–T020 podem avançar em arquivos diferentes; T024 só passa depois que a home estiver completa.

## Estratégia de Implementação

1. **MVP (US1)**: destaque com foto e conversão. Já transforma a primeira impressão do site.
2. **Descoberta (US2)**: três categorias em destaque, com validação de integridade.
3. **Marca e canais (US3)**: apresentação e Instagram na home e no rodapé.
4. **Autonomia (US4)**: edição pelo painel documentada e validada.
5. **Fechamento**: acessibilidade, desempenho, responsividade, registro e deploy.

## Notas

- A home não ganha JavaScript próprio; qualquer tarefa que introduza script deve ser justificada no
  plano antes de executar.
- A foto de teste do cenário 4 não pode permanecer no repositório nem no site publicado.
- T023 depende de acesso ao Pages CMS; se o acesso não estiver disponível, a tarefa fica pendente e
  a entrega é registrada com essa ressalva em `docs/validation.md`.
- T032 usa uma cópia local do conteúdo: a configuração inválida nunca é commitada.
