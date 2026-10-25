# Plano de Implementação: Formulário de Contato com Envio e LGPD

**Branch**: `003-formulario-contato` | **Data**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação em `/specs/003-formulario-contato/spec.md`

## Resumo

Transformar a página de contato em um canal real de orçamento: formulário com nome, telefone,
e-mail, categoria e detalhes do evento, validação acessível, consentimento LGPD explícito e envio
para o e-mail da Faby por meio do Web3Forms, sem backend próprio. O envio acontece por `fetch`
quando há JavaScript e por `POST` nativo quando não há. Uma página `/privacidade/` descreve o
tratamento dos dados e o caminho para correção ou exclusão. Nenhum dado pessoal é armazenado pelo
site.

A implementação preserva a constituição: site estático, Astro como único framework, JavaScript
vanilla restrito ao necessário, hospedagem gratuita e coleta mínima de dados.

## Contexto Técnico

**Linguagem/Versão**: TypeScript (ES2022) no site; Node.js 24 no build; Astro 7 (`>= 22.23.4`).

**Dependências Principais**: nenhuma nova. Astro para build e `srcset`; `@astrojs/sitemap` para a
nova rota. Desenvolvimento: `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`.

**Serviço externo**: Web3Forms (`https://api.web3forms.com/submit`), plano gratuito, chamado por
HTTP do navegador. Sem SDK, sem script de terceiros na página, sem cookie.

**Configuração**: `PUBLIC_WEB3FORMS_KEY` no build (`.env` local; variável de repositório
`WEB3FORMS_KEY` no GitHub Actions). Ausente ⇒ modo de contato direto.

**Armazenamento**: nenhum. Os dados existem no corpo da requisição e no e-mail entregue.

**Testes**: Playwright com interceptação de `api.web3forms.com` (sucesso, erro e falha de rede),
teste sem JavaScript, axe-core em `/contato/` e `/privacidade/`, Lighthouse CI nas duas rotas.

**Plataforma-Alvo**: GitHub Pages via Actions; navegadores modernos (últimas 2 versões de Chrome,
Firefox, Safari e Edge; iOS Safari 16+).

**Metas de Desempenho**: LCP < 3 s em 4G; CLS < 0,1; nenhum script de terceiros bloqueante;
JavaScript adicional abaixo de 10 KB (gzip).

**Restrições**: sem backend, sem banco, sem captcha com interação nesta versão; conteúdo em pt-BR;
nenhuma chave real versionada; identidade visual ainda provisória (tokens CSS).

**Escala/Escopo**: até 250 pedidos/mês (limite do plano gratuito); uma destinatária; 5 categorias.

## Constitution Check

*PORTÃO: deve passar antes da Fase 0. Reavaliado após a Fase 1.*

| Princípio | Status | Evidência / decisão do plano |
|-----------|--------|------------------------------|
| I. Idioma e Conteúdo em pt-BR | PASSA | Rótulos, erros, política, e-mail e mensagens em pt-BR; nomes de código em inglês. |
| II. Mobile First | PASSA | Campos em coluna única a partir de 360 px, alvos de toque ≥ 44 px, `inputmode` correto para telefone e e-mail. |
| III. Desempenho | PASSA | Nenhum script de terceiros; ~4 KB de JS adicional; formulário em HTML estático; Lighthouse CI nas rotas novas. |
| IV. Acessibilidade | PASSA | Rótulos associados, `aria-describedby`, `aria-invalid`, `role="status"`/`"alert"`, foco gerenciado, teste axe em duas páginas e fluxo por teclado. |
| V. Simplicidade e Dependências | PASSA | Nenhuma dependência nova; validação em TypeScript puro; Web3Forms é HTTP sem SDK. |
| VI. Custo e Hospedagem | PASSA | Plano gratuito do Web3Forms (250/mês), GitHub Pages, sem backend. |
| VII. Privacidade e LGPD | PASSA | Coleta exatamente os cinco campos da constituição; consentimento explícito e versionado; política em `/privacidade/`; nenhum dado no repositório; serviço declarado. |
| VIII. Identidade de Marca | PASSA (provisório) | Formulário usa os tokens neutros existentes; nenhuma decisão visual definitiva. |

**Reavaliação pós-Fase 1**: todos os portões continuam atendidos. Dois pontos ficam registrados:

- **Chave no cliente**: `PUBLIC_WEB3FORMS_KEY` fica visível no HTML por natureza do serviço (é uma
  chave de envio, não uma credencial de acesso). Mitigações: nenhuma chave no repositório,
  restrição de domínio no painel e rotação fácil. A ausência da chave desliga o formulário em vez
  de expor um envio quebrado.
- **Consentimento sem banco**: o registro do consentimento vive no e-mail recebido
  (`consent`, `consent_version`, `consent_at`), única cópia dos dados. A política declara esse
  modelo e o prazo de retenção.

**Resultado do portão**: PASSA, sem violações que exijam a tabela de complexidade.

## Checklist de Privacidade e LGPD

Exigido pelo Princípio VII para funcionalidades que coletam dados pessoais.

| # | Item | Como é atendido | Verificação |
|---|---|---|---|
| P1 | Coleta mínima | Apenas nome, telefone, e-mail, categoria e detalhes do evento (FR-001) | Revisão do `data-model.md` e do DOM |
| P2 | Finalidade declarada | Bloco de consentimento antes do botão, com link para a política (FR-009) | Teste E2E e inspeção |
| P3 | Base legal | Consentimento (art. 7º, I) descrito na política | Revisão do texto |
| P4 | Consentimento registrado | `consent`, `consent_version` e `consent_at` no payload (FR-010) | Teste de payload |
| P5 | Consentimento não pré-marcado | `checked` ausente no HTML; `required` presente | Teste E2E |
| P6 | Política acessível | Rota `/privacidade/`, link no rodapé de todas as páginas e no formulário (FR-012, FR-013) | Teste de navegação |
| P7 | Compartilhamento declarado | Web3Forms e provedor de e-mail nomeados na política | Revisão do texto |
| P8 | Retenção definida | 12 meses após o último contato; exclusão em 15 dias | Revisão do texto |
| P9 | Direitos do titular | Seção de direitos + canal de e-mail e WhatsApp | Teste de links |
| P10 | Sem dados no repositório | Nenhum dado real em fixtures, testes ou conteúdo | Busca no repositório |
| P11 | Sem dados no cliente | Nada em URL, `localStorage`, `sessionStorage`, cookies ou logs | Teste E2E |
| P12 | Sem rastreamento | Nenhum analytics, pixel ou cookie; declarado na política | Inspeção de rede no teste |
| P13 | Segurança do canal | HTTPS no GitHub Pages; acesso ao e-mail restrito à Faby | Configuração de deploy |
| P14 | Serviço adequado | Web3Forms usado como operador, com domínio restrito no painel | Configuração manual (quickstart) |
| P15 | Dados de teste | Envios de teste usam dados fictícios e são apagados | Quickstart, cenário 5 |

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/003-formulario-contato/
├── plan.md                        # Este arquivo
├── research.md                    # Fase 0 — decisões técnicas
├── data-model.md                  # Fase 1 — entidades, validações e payload
├── quickstart.md                  # Fase 1 — configuração e validação manual
├── contracts/
│   ├── form-submission.md         # DOM, payload, estados e modo sem chave
│   └── privacy-policy.md          # seções, links e versionamento
└── tasks.md                       # Fase 2 — criado por /speckit.tasks
```

### Código-fonte (alterações)

```text
.env.example                       # NOVO — nome das variáveis, sem valores
.github/workflows/
├── ci.yml                         # build de teste + Playwright + Lighthouse
└── deploy.yml                     # injeta PUBLIC_WEB3FORMS_KEY do repositório

scripts/
└── build-test.mjs                 # NOVO — build com chave fictícia para os testes

src/
├── components/
│   └── ContactForm.astro          # NOVO — formulário, consentimento, estados
├── lib/
│   ├── contact.ts                 # NOVO — contato público, versão da política, chave
│   └── contact-form.ts            # NOVO — validação pura e montagem do payload
├── pages/
│   ├── contato.astro              # reescrito — formulário, modo direto
│   ├── contato/enviado.astro      # NOVO — confirmação do envio sem JavaScript
│   └── privacidade.astro          # NOVO — política de privacidade
├── scripts/
│   └── contact.client.ts          # reescrito — pré-seleção, validação, envio, estados
├── layouts/
│   └── BaseLayout.astro           # rodapé com política e contato
└── styles/
    └── global.css                 # estilos de campos, erros e painéis

tests/
├── e2e/
│   ├── contact-cta.spec.ts        # ajustado — formulário completo
│   └── contact-form.spec.ts       # NOVO — envio, validação, antispam, falhas
└── a11y/
    ├── contact.spec.ts            # NOVO
    └── privacy.spec.ts            # NOVO

playwright.config.ts               # build de teste antes do preview
.lighthouserc.json                 # rotas /contato/ e /privacidade/
README.md                          # configuração da chave e do Web3Forms
docs/validation.md                 # registro da validação
```

**Decisão de estrutura**: a lógica de validação e o payload ficam em `src/lib/contact-form.ts`
(funções puras, sem DOM), o componente cuida da marcação e o script apenas orquestra DOM e rede.
Isso mantém a regra testável de forma isolada e evita duplicação entre o fluxo com e sem
JavaScript.

## Fluxo de Envio

```text
[contato.astro]
  └─ lê a chave no build
      └─ ContactForm.astro
          ├─ chave presente  → formulário completo
          └─ chave ausente   → painel de contato direto (e-mail + WhatsApp)

[contact.client.ts]
  on load  → marca instante inicial, lê ?categoria= e ajusta a nota
  on submit → valida campos → descarta antispam → fetch Web3Forms
                  ├─ 200 success → painel de sucesso, formulário limpo, foco no painel
                  └─ erro/timeout → painel de erro, dados preservados, contato direto
```

## Rastreabilidade dos Requisitos

> Seção de apoio ao `/speckit.tasks`; não substitui a especificação.

| Requisito | Onde é atendido |
|-----------|-----------------|
| FR-001 a FR-003 | `ContactForm.astro`, `contact-form.ts`, `contact.client.ts` |
| FR-004, FR-005 | `contact.client.ts`, `src/lib/contact.ts`, `.env.example`, workflows |
| FR-006, FR-007, FR-008 | Painéis `[data-form-status]`/`[data-form-error]`, `form.reset()`, contato direto |
| FR-009, FR-010, FR-011 | Bloco de consentimento, `consent_version`/`consent_at`, `replyto` + `subject` |
| FR-012, FR-013 | `privacidade.astro`, `BaseLayout.astro`, link no formulário |
| FR-014 | Ausência de armazenamento; teste de `localStorage`/cookies; `.gitignore` |
| FR-015 | `botcheck`, honeypot `website`, tempo mínimo de 3 s |
| FR-016 | `method="post"` + `action` + `redirect` + página `/contato/enviado/` |
| FR-017, FR-018 | Rótulos, `aria-describedby`, `aria-invalid`, foco, teste axe |
| FR-019 | Nenhum script de terceiros; Lighthouse CI |
| FR-020 | `src/lib/contact.ts` + ramo de contato direto em `contato.astro` |

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Limite de 250 envios/mês atingido | Pedidos perdidos no fim do mês | Mensagem de erro com contato direto; monitorar pelo painel; upgrade só se necessário |
| Spam apesar do honeypot | Caixa poluída | Tempo mínimo, `botcheck`, restrição de domínio; hCaptcha fica como alternativa documentada |
| Chave exposta e usada por terceiros | Spam com o domínio da Faby | Restrição de domínio no painel e rotação da chave |
| E-mail entregue em spam | Pedido não visto | `from_name` identificável, `replyto` correto; orientação para marcar como confiável |
| Visitante sem JS e redirecionamento falha | Acha que não enviou | `redirect` para `/contato/enviado/` no mesmo domínio (exigência do plano gratuito) |
| Mensagem longa quebra o e-mail | Dificulta a leitura | Limite de 1000 caracteres com contador visível |

## Complexity Tracking

Nenhuma violação constitucional identificada. A tabela de justificativa de complexidade não se
aplica.
