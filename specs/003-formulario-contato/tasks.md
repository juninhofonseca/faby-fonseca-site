---

description: "Lista de tarefas executáveis do formulário de contato com envio e LGPD"

---

# Tarefas: Formulário de Contato com Envio e LGPD

**Input**: Documentos de design em `/specs/003-formulario-contato/`

**Pré-requisitos**: [plan.md](./plan.md) (obrigatório), [spec.md](./spec.md) (histórias),
[research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/) e
[quickstart.md](./quickstart.md)

**Testes**: incluídos porque o plano e a constituição exigem portões de acessibilidade,
desempenho e privacidade. Não é TDD: os testes de cada história cobrem o incremento depois da
implementação.

**Organização**: tarefas agrupadas por história de usuário, na ordem de prioridade da spec
(P1 → P1 → P2 → P3), para que cada incremento seja implementável e testável sozinho.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: história à qual a tarefa pertence (US1, US2, US3, US4)
- Todo caminho de arquivo é relativo à raiz do repositório

## Convenções de caminho

Projeto único Astro: código em `src/`, testes em `tests/`, scripts em `scripts/` e workflows em
`.github/workflows/`.

---

## Fase 1: Setup (Infraestrutura compartilhada)

**Propósito**: preparar configuração de ambiente, build de teste e pipelines.

- [X] T001 [P] Criar `.env.example` com `PUBLIC_WEB3FORMS_KEY=` e comentário explicando que a chave é pública por natureza, vive no `.env` local e na variável `WEB3FORMS_KEY` do GitHub, e nunca deve ser versionada com valor
- [X] T002 [P] Criar `scripts/build-test.mjs` que executa `npm run build` com `PUBLIC_WEB3FORMS_KEY=chave-de-teste-e2e`, sem tocar em `.env`
- [X] T003 Adicionar o script `build:test` em `package.json` apontando para `node scripts/build-test.mjs`
- [X] T004 [P] Atualizar `playwright.config.ts` para o `webServer` executar `npm run build:test` antes de `npm run preview -- --port 4321`, garantindo que os testes sempre encontrem o formulário completo
- [X] T005 [P] Atualizar `.lighthouserc.json` para medir `/portfolio/`, `/contato/` e `/privacidade/` mantendo as asserções atuais de LCP, CLS e acessibilidade
- [X] T006 [P] Adicionar `PUBLIC_WEB3FORMS_KEY: ${{ vars.WEB3FORMS_KEY }}` ao passo de build de `.github/workflows/deploy.yml`
- [X] T007 [P] Trocar o passo de build de `.github/workflows/ci.yml` por `npm run build:test`, mantendo o mesmo passo em ambos os projetos do Playwright

---

## Fase 2: Fundacional (Pré-requisitos bloqueantes)

**Propósito**: constantes de contato, validação pura, estilos e rodapé — precisa existir antes de
qualquer história.

**CRÍTICO**: nenhuma história começa antes desta fase.

- [X] T008 Criar `src/lib/contact.ts` com `CONTACT_EMAIL` (`juninho.fonseca@gmail.com`), `WHATSAPP_NUMBER` (`5511967458235`), `WHATSAPP_MESSAGE`, `PRIVACY_VERSION` (`2026-10-25`), `PRIVACY_EFFECTIVE_AT` (`2026-10-25`), `WEB3FORMS_ENDPOINT` e helpers `buildMailtoHref()`, `buildWhatsappHref()` e `isFormConfigured(key)`
- [X] T009 Criar `src/lib/contact-form.ts` com tipos `FormValues` e `FieldErrors`, funções puras `normalizePhone()`, `validateField()`, `validateForm()` e `buildPayload()`, seguindo as regras e o contrato de payload de `data-model.md`
- [X] T010 [P] Adicionar a `src/styles/global.css` os estilos de formulário: campos em coluna única, `:focus-visible`, estado `[aria-invalid="true"]`, mensagens de erro, contador de caracteres, bloco de consentimento, alvos de toque ≥ 44 px e painéis de sucesso/erro
- [X] T011 [P] Atualizar `src/layouts/BaseLayout.astro` com rodapé contendo link para `withBase('/privacidade/')`, e-mail de contato e link de WhatsApp, sem quebrar o layout em 360 px
- [X] T012 [P] Registrar em `docs/validation.md` a estrutura da seção "Feature 003 — Formulário de contato" que será preenchida nas tarefas de validação

---

## Fase 3: História 1 — Enviar um pedido de orçamento (P1)

**Objetivo**: formulário completo, validação, envio, confirmação e erro, com e sem JavaScript.

**Teste independente**: preencher os campos, enviar com API simulada e receber a confirmação; conferir erros por campo e preservação dos dados em falha.

- [X] T013 [P] [US1] Criar `src/components/ContactForm.astro` com os campos nome, telefone, e-mail, categoria, detalhes, contador de caracteres, bloco de consentimento, região `[data-form-status]`, região `[data-form-error]`, botão `[data-submit]` e os ganchos de `contracts/form-submission.md`
- [X] T014 [US1] Renderizar `ContactForm` em `src/pages/contato.astro`, mantendo a pré-seleção por `?categoria=`, o texto da nota e o `h1` único
- [X] T015 [US1] Implementar em `src/pages/contato.astro` o redirecionamento do envio sem JavaScript para a página estática `/contato/enviado/`, com foco no título e nenhum dado pessoal na URL
- [X] T016 [US1] Implementar em `src/pages/contato.astro` o modo de contato direto quando `PUBLIC_WEB3FORMS_KEY` estiver ausente, exibindo e-mail e WhatsApp em vez do formulário
- [X] T017 [US1] Reescrever `src/scripts/contact.client.ts` para: manter a nota da categoria, validar no `submit`, focar o primeiro campo inválido, exibir erros por campo, controlar os estados ocioso/enviando/sucesso/erro, limpar o formulário no sucesso e preservar os dados no erro
- [X] T018 [US1] Adicionar ao script o `fetch` para `WEB3FORMS_ENDPOINT` com `AbortController` de 15 s, tratamento de HTTP não-200, mensagem de fallback com e-mail e WhatsApp, e bloqueio de envio duplicado
- [X] T019 [US1] Garantir no script que nenhum dado seja gravado em `localStorage`, `sessionStorage`, cookies ou URL após o envio
- [X] T020 [US1] Criar `tests/e2e/contact-form.spec.ts` cobrindo envio válido com rota interceptada, payload com `consent_version` e `consent_at`, confirmação, limpeza do formulário e armazenamento vazio
- [X] T021 [US1] Ampliar `tests/e2e/contact-form.spec.ts` com os casos de campo vazio, e-mail inválido, ausência de consentimento, erro HTTP 500 e falha de rede, verificando mensagens, foco e preservação dos dados
- [X] T022 [US1] Adicionar a `tests/e2e/contact-form.spec.ts` um teste com `javaScriptEnabled: false` que confere `method`, `action`, os campos ocultos e a página de confirmação `/contato/enviado/`
- [X] T023 [US1] Atualizar `tests/e2e/contact-cta.spec.ts` para o formulário completo, mantendo os quatro cenários de pré-seleção existentes
- [X] T024 [P] [US1] Criar `tests/a11y/contact.spec.ts` com axe-core em `/contato/` (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) e verificação de foco no primeiro erro

**Checkpoint**: a página de contato envia, valida, confirma e falha com dignidade, com e sem JS.

---

## Fase 4: História 2 — Entender e consentir com o uso dos dados (P1)

**Objetivo**: política de privacidade pública, consentimento versionado e caminho de direitos.

**Teste independente**: abrir a política pelo rodapé e pelo formulário, conferir as 11 seções, o consentimento não pré-marcado e a versão no pedido enviado.

- [X] T025 [US2] Criar `src/pages/privacidade.astro` com as 11 seções de `contracts/privacy-policy.md`, um único `h1`, títulos `h2` e a versão/data de vigência vindas de `src/lib/contact.ts`
- [X] T026 [US2] Revisar o bloco de consentimento em `ContactForm.astro` para declarar a finalidade, linkar `withBase('/privacidade/')`, nunca vir marcado e informar que os dados não são usados para marketing
- [X] T027 [US2] Enviar `consent_version` e `consent_at` no payload, preenchendo a data no envio e mantendo o campo oculto vazio quando não houver JavaScript
- [X] T028 [US2] Exibir no formulário o resumo do aviso com a data de vigência, alinhado às constantes de `contact.ts`
- [X] T029 [US2] Criar `tests/e2e/privacy.spec.ts` verificando `/privacidade/` acessível pelo rodapé de `/`, `/portfolio/` e `/contato/`, presença das seções, e-mail de contato, menção ao Web3Forms e ausência de cookies
- [X] T030 [P] [US2] Criar `tests/a11y/privacy.spec.ts` com axe-core em `/privacidade/`
- [X] T031 [US2] Adicionar a `tests/e2e/contact-form.spec.ts` o caso de consentimento não marcado: bloqueio, foco no checkbox e nenhuma chamada de rede

**Checkpoint**: o visitante entende a finalidade, consente de forma explícita e encontra a política em qualquer página.

---

## Fase 5: História 3 — Receber e responder o pedido (P2)

**Objetivo**: e-mail legível, assunto útil, resposta direta ao visitante e documentação de uso.

**Teste independente**: enviar um pedido de teste e conferir no e-mail recebido os cinco campos, o consentimento, a versão, a data/hora e o endereço de resposta.

- [X] T032 [US3] Configurar no formulário `subject` com categoria e nome (atualizado pelo script) e `from_name` "Site Faby Fonseca", garantindo assunto útil também no envio sem JavaScript
- [X] T033 [US3] Enviar o campo `source` (`galeria:<slug>` ou `direto`) para identificar a origem do pedido no e-mail
- [X] T034 [US3] Confirmar que o `replyto` é derivado do campo `email` e documentar a limitação caso o visitante informe um endereço inválido
- [X] T035 [US3] Criar `docs/contato.md` com o fluxo da Faby: onde os pedidos chegam, como responder, prazo de retenção, como atender pedido de exclusão e o que fazer se o limite mensal for atingido
- [X] T036 [US3] Executar o envio real descrito no cenário 3 de `quickstart.md` com dados fictícios, confirmar a chegada, apagar a mensagem e registrar o resultado em `docs/validation.md`

**Checkpoint**: a Faby recebe e responde o pedido sem abrir painel nem consultar banco.

---

## Fase 6: História 4 — Evitar spam sem atrapalhar visitantes (P3)

**Objetivo**: barreiras invisíveis contra robôs.

**Teste independente**: preencher o campo oculto e enviar rápido demais; nenhum e-mail é gerado e o envio humano continua funcionando.

- [X] T037 [US4] Adicionar ao formulário o campo nativo `botcheck` (checkbox oculto) e o honeypot `website` com `tabindex="-1"`, `aria-hidden="true"` e `autocomplete="off"`
- [X] T038 [US4] Implementar no script o descarte por honeypot (sem chamada de rede e com aparência de sucesso) e por tempo mínimo de 3 s desde o carregamento (com pedido de nova tentativa)
- [X] T039 [US4] Adicionar a `tests/e2e/contact-form.spec.ts` os casos de honeypot preenchido e envio rápido, verificando ausência de requisição e preservação dos dados
- [X] T040 [US4] Documentar em `docs/contato.md` como o antispam funciona e quando considerar hCaptcha

**Checkpoint**: robôs são descartados sem etapa extra para pessoas.

---

## Fase 7: Polimento e Validação

**Propósito**: fechar qualidade, configuração de produção e registro.

- [X] T041 [P] Atualizar `README.md` com a configuração da chave (`WEB3FORMS_KEY`), o comportamento sem chave, o fluxo de deploy e o link para `docs/contato.md`
- [X] T042 [P] Atualizar `.gitignore` se necessário para garantir `.env` e `.env.*` fora do versionamento
- [X] T043 Rodar `npm run validate:content`, `npm run test:content` e `npm run check` e corrigir qualquer erro
- [X] T044 Rodar `npm run test:e2e` completo (desktop e mobile), incluindo axe, e corrigir falhas
- [X] T045 Rodar `npm run test:lighthouse` e confirmar desempenho ≥ 90 e acessibilidade 100 em `/contato/` e `/privacidade/`
- [X] T046 Revisar o Checklist de Privacidade e LGPD de `plan.md` item por item e registrar o resultado em `docs/validation.md`
- [X] T047 Confirmar que nenhum dado pessoal, chave ou token aparece em `git status`, `git diff` ou nos arquivos versionados
- [X] T048 Configurar a variável `WEB3FORMS_KEY` no repositório, rodar o deploy e validar um envio real na URL publicada
- [X] T049 Registrar em `docs/validation.md` os resultados da suíte automatizada, do envio real e do deploy, e listar o que ficou pendente

---

## Dependências e Ordem de Execução

```text
Fase 1 (T001–T007)
    └─▶ Fase 2 (T008–T012)
            ├─▶ Fase 3 / US1 (T013–T024)
            │       ├─▶ Fase 4 / US2 (T025–T031)
            │       ├─▶ Fase 5 / US3 (T032–T036)
            │       └─▶ Fase 6 / US4 (T037–T040)
            └─▶ Fase 7 (T041–T049)
```

- T013 depende de T008, T009 e T010.
- T017 depende de T009 e T013.
- T025 pode rodar em paralelo com T013–T017, mas T026 depende de T025.
- T032 depende de T017.
- T037 depende de T008 e T013.
- T048 depende de T036 e só pode ser feita com a chave em mãos.

## Oportunidades de Paralelismo

- T001, T002, T004, T005, T006 e T007 em paralelo.
- T010, T011 e T012 em paralelo.
- T024, T030 e T040 são independentes entre si.
- T041 e T042 em paralelo.

## Estratégia de Implementação

1. **MVP (US1)**: formulário funcional com validação, envio e estados. Já entrega valor comercial, ainda com consentimento mínimo.
2. **Conformidade (US2)**: política publicada e consentimento versionado. Fecha o requisito legal antes de divulgar o site.
3. **Operação (US3)**: e-mail pronto para resposta e documentação para a Faby.
4. **Robustez (US4)**: antispam.

## Notas

- Os testes nunca usam a chave real: `scripts/build-test.mjs` injeta uma chave fictícia e o
  Playwright intercepta a API.
- Nenhuma tarefa cria banco de dados, painel de pedidos ou resposta automática.
- T048 e T049 exigem acesso ao GitHub e à caixa de e-mail; ficam pendentes se a chave não estiver
  configurada, e o site permanece em modo de contato direto nesse intervalo.
