# Validação — Galeria de Portfólio

**Feature**: `002-portfolio-gallery` | **Data**: 2026-10-25
**Ambiente**: Windows 11, Node.js v24.19.0, npm 11.17.0, Astro 7.4.2, Chromium (Playwright)

Resultados dos cenários de [quickstart.md](../specs/002-portfolio-gallery/quickstart.md) e da
suíte automatizada. Reproduza com os comandos indicados em cada seção.

## Resumo

| Verificação | Comando | Resultado |
|---|---|---|
| Conteúdo (categorias, fotos, alt, imagens) | `npm run validate:content` | ✅ 5 categorias e 6 fotos válidas |
| Regras de conteúdo (unitárias) | `npm run test:content` | ✅ 8/8 |
| Tipos e Astro | `npm run check` | ✅ 0 erros, 0 avisos, 0 dicas |
| Build + orçamento de imagens | `npm run build` | ✅ 3 páginas; 12 variantes de grade ≤ 300 KB |
| E2E (galeria, lightbox, CTA, responsividade) | `npm run test:e2e` | ✅ 32/32 (desktop 1280 px + mobile 360 px) |
| Acessibilidade (axe-core, WCAG 2.1 AA) | `npm run test:a11y` | ✅ 0 violações |
| Lighthouse CI (mobile, 4G simulado) | `npm run test:lighthouse` | ✅ Performance 100, A11y 100, SEO 100, Boas práticas 96 |

Métricas do Lighthouse (última execução em `dist/` via `npm run preview`):

| Métrica | Valor | Meta |
|---|---|---|
| LCP | 0,91 s | < 3 s |
| FCP | 0,76 s | — |
| CLS | 0 | < 0,1 |
| TBT | 0 ms | — |

## Cenário 1 — Navegar por categoria

- Categorias exibidas na ordem definida: Casamentos, Ensaios, Família, Newborn, Eventos
  (`gallery.spec.ts` › "lista as categorias na ordem definida").
- Clique em "Ensaios" filtra sem recarregar, atualiza `aria-current` e a URL para
  `?categoria=ensaios` (`filtra sem recarregar e atualiza a URL`).
- Link direto com `?categoria=ensaios` abre a categoria correta e o botão voltar do navegador
  restaura a categoria anterior (`link direto abre a categoria pedida`, `popstate`).
- Slug inválido cai na primeira categoria ativa (`slug inválido cai na primeira categoria`).
- Sem rolagem horizontal em 360, 768 e 1280 px (`não cria rolagem horizontal...`).
- Categoria vazia mostra "Em breve novas fotos nesta categoria".

**Resultado**: ✅ aprovado.

### Limite conhecido da hospedagem estática

O build do Astro não recebe a query string, então a categoria pedida na URL é resolvida no cliente
no primeiro carregamento. Sem JavaScript, todas as categorias são exibidas em sequência (regra
`noscript` que desfaz `[hidden]`), preservando o acesso ao conteúdo de links compartilhados, como
exige o FR de acesso sem JavaScript. Detalhes em
[research.md §5](../specs/002-portfolio-gallery/research.md) e
[contracts/navigation.md](../specs/002-portfolio-gallery/contracts/navigation.md).

## Cenário 2 — Visualizar e navegar entre fotos

- Abrir a segunda foto de Casamentos mostra a mesma imagem ampliada e anuncia "Foto 2 de 3".
- `ArrowRight` avança em ciclo (2 → 3 → 1); `ArrowLeft` retrocede (1 → 3).
- `Esc` e o botão "Fechar" fecham o diálogo; o foco volta ao cartão de origem.
- `Tab` permanece contido nos controles do diálogo.
- O lightbox respeita `prefers-reduced-motion` e mantém o `alt` em todas as trocas.

**Resultado**: ✅ aprovado (`tests/e2e/lightbox.spec.ts`, 4 testes × 2 viewports).

## Cenário 3 — Solicitar orçamento da categoria

- Em `?categoria=newborn`, o CTA aponta para `/contato/?categoria=newborn`.
- A página de contato abre com "Newborn" selecionado e permite trocar a categoria.
- Parâmetro inválido ou acesso direto a `/contato/` abre sem seleção.
- Nenhum dado pessoal é transportado na URL.

**Resultado**: ✅ aprovado (`tests/e2e/contact-cta.spec.ts`). O envio do formulário e o
consentimento LGPD pertencem à feature de contato.

## Cenário 4 — Publicar conteúdo pelo painel

- `.pages.yml` está alinhado ao contrato: mídia em `content/photos/images` com `output: images`,
  `rename: safe` e extensões `jpg`, `jpeg`, `png`, `webp`; coleções `categories` e `photos` com
  todos os campos, rótulos em português e `reference` para a categoria.
- As invariantes do fluxo (alt obrigatório, categoria existente, extensão suportada, original
  ≤ 10 MB, variante de grade ≤ 300 KB) são verificadas por `validate:content`, `test:content` e
  `check:image-budget` no CI e no deploy — rodaram com sucesso nesta validação.
- O passo a passo da administradora está em [admin.md](./admin.md).

**Resultado**: ✅ **aprovado no Pages CMS real** (2026-10-25).

- Publicação: commits `994f434` (imagem `img3370.jpg`) e `57f24eb`
  (`content/photos/teste-de-publicacao.md`), criados pelo painel com frontmatter correto
  (`image: images/img3370.jpg`, `category: ensaios`, `order: 99`, `publishedAt`, `published`).
  O deploy concluiu com sucesso e a foto apareceu na última posição de Ensaios, com o `alt`
  informado e variante WebP de 58 KB.
- Remoção: commit `150f72f` (via Pages CMS); deploy concluído e a seção Ensaios voltou a 2 fotos,
  sem vestígios do título ou do arquivo no HTML publicado.
- O painel criou um `.pages.yml` vazio ao conectar o repositório; a versão completa deste
  repositório o substituiu e é a que está em produção.
- Observação: excluir a entrada **não** remove o original de `content/photos/images/`
  (`img3370.jpg`, 3,2 MB, removido depois manualmente). O arquivo órfão não entra no site, mas
  pode ser apagado pela seção de mídia do painel.
- As recusas de `.gif` e de original acima de 10 MB são garantidas pela configuração de mídia do
  painel e pelo script de build, respectivamente; não foram provocadas no `main` para não derrubar
  o deploy de produção.

## Cenário 5 — Desempenho e orçamento de imagens

- `npm run build` gera o site e `check-image-budget` confirma 12 variantes de grade (480 px e
  960 px) abaixo de 300 KB; originais abaixo de 10 MB.
- Lighthouse mobile com throttling 4G: LCP 0,91 s, CLS 0, TBT 0 ms, Performance 100.
- As duas primeiras fotos da categoria ativa usam `eager` + `fetchpriority="high"`; as demais são
  `lazy`.

**Resultado**: ✅ aprovado.

## Cenário 6 — Acessibilidade

- axe-core (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) na página de portfólio, em desktop e
  mobile: 0 violações.
- Navegação por teclado coberta pelos testes de lightbox (Tab preso ao diálogo, setas, Esc,
  retorno de foco).
- Contraste AA verificado pelo axe; alvos de toque ≥ 44 px definidos em `tokens.css`; link "Pular
  para o conteúdo" e foco visível em `global.css`.
- Toda foto tem `alt` descritivo validado por `validate:content` e pelo schema Zod.

**Resultado**: ✅ aprovado nos testes automatizados. A inspeção visual em zoom de 200% e em
dispositivo físico permanece como verificação manual recomendada antes do anúncio público.

## Deploy de produção

- URL publicada: **https://juninhofonseca.github.io/faby-fonseca-site/**
- Workflow `Deploy` (run 40227000547) concluído com sucesso: build, orçamento de imagens, upload e
  publicação no GitHub Pages.
- Workflow `CI` (run 40227000571) concluído com sucesso: conteúdo, build, E2E, acessibilidade e
  Lighthouse.
- Verificado no site publicado: `/`, `/portfolio/`, `/contato/` e `sitemap-index.xml` respondem
  200; CSS e imagens WebP carregam; link direto `?categoria=ensaios` ativa a categoria; o CTA leva
  a `/contato/?categoria=ensaios` com a opção marcada.
- O build usa `SITE_URL` e `SITE_BASE` no workflow para publicar na URL de projeto do Pages. Ao
  ativar o domínio próprio, essas variáveis devem ser removidas de
  `.github/workflows/deploy.yml` e o DNS configurado no GitHub Pages.

## Pendências antes do anúncio público

1. **Domínio próprio** — apontar `fabyfonseca.com.br` no DNS, configurar o domínio no GitHub Pages,
   ativar HTTPS e remover `SITE_URL`/`SITE_BASE` do workflow para publicar na raiz do domínio.
2. **Inspeção visual manual** — zoom 200%, leitor de tela e dispositivos reais.
3. **Conteúdo real e identidade visual** — as 6 fotos são amostras geradas e a paleta é provisória
   (`TODO(BRAND_IDENTITY)` em `src/styles/tokens.css`).

---

# Validação — Formulário de Contato e LGPD

**Feature**: `003-formulario-contato` | **Data**: 2026-10-25
**Ambiente**: Windows 11, Node.js v24.19.0, npm 11.17.0, Astro 7.4.2, Chromium (Playwright)

Resultados dos cenários de [quickstart.md](../specs/003-formulario-contato/quickstart.md) e da
suíte automatizada. Os testes usam a chave fictícia `chave-de-teste-e2e` e interceptam
`https://api.web3forms.com/submit`; nenhum envio real depende do CI.

## Resumo

| Verificação | Comando | Resultado |
|---|---|---|
| Conteúdo (categorias, fotos, alt, imagens) | `npm run validate:content` | ✅ 5 categorias e 6 fotos válidas |
| Regras de conteúdo (unitárias) | `npm run test:content` | ✅ 8/8 |
| Tipos e Astro | `npm run check` | ✅ 0 erros, 0 avisos, 0 dicas (37 arquivos) |
| Build de teste + orçamento de imagens | `npm run build:test` | ✅ 5 páginas; 12 variantes de grade ≤ 300 KB |
| E2E + acessibilidade (desktop e mobile) | `npm run test:e2e` | ✅ 70/70 |
| Lighthouse CI (mobile, 4G simulado) | `npm run test:lighthouse` | ✅ 3 rotas aprovadas |

Rotas geradas: `/`, `/portfolio/`, `/contato/`, `/contato/enviado/`, `/privacidade/`.

## Resultados do Lighthouse

Execução em `dist/` (build de teste) via `npm run preview -- --port 4322`:

| Rota | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/portfolio/` | 100 | 100 | 96 | 100 | 0,91 s | 0 | 0 ms |
| `/contato/` | 100 | 100 | 96 | 100 | 0,90 s | 0 | 0 ms |
| `/privacidade/` | 100 | 100 | 96 | 100 | 0,91 s | 0 | 0 ms |

As asserções de `.lighthouserc.json` (acessibilidade 100, LCP < 3 s, CLS < 0,1) passaram nas três
rotas. Nenhum script de terceiros é carregado: o envio do Web3Forms é uma chamada `fetch` feita
apenas no momento do submit.

## Cobertura automatizada do formulário

`tests/e2e/contact-form.spec.ts` (10 casos × desktop e mobile) e `tests/e2e/privacy.spec.ts`
(4 casos × desktop e mobile), além dos testes de acessibilidade:

- Envio válido com payload completo: `name`, `phone`, `email`, `category`, `details`, `consent`,
  `consent_version`, `consent_at`, `from_name`, `source` e assunto com categoria e nome.
- Confirmação visível, foco no título do painel e formulário limpo após o envio.
- `localStorage`, `sessionStorage`, cookies e URL vazios após o envio (FR-007, FR-014).
- Envio vazio bloqueado com foco no primeiro campo inválido.
- E-mail inválido recusado sem chamada de rede.
- Consentimento ausente bloqueia o envio e foca a caixa de autorização.
- Erro HTTP 500 mantém os dados e mostra e-mail e WhatsApp como alternativa.
- Falha de rede tratada como erro recuperável, com dados preservados.
- Honeypot `website` preenchido: nenhuma requisição, sem revelar a proteção.
- Envio em menos de 3 s recusado com pedido de nova tentativa e sem requisição.
- Pré-seleção da categoria por `?categoria=` e troca com atualização da nota.
- Limite de 1000 caracteres no campo de detalhes e contador sincronizado.
- Sem JavaScript: `method="post"`, `action` correto, chave e `redirect` presentes, consentimento
  desmarcado, e confirmação em `/contato/enviado/`.
- Política acessível pelo rodapé de `/`, `/portfolio/` e `/contato/`, com as 11 seções, menção ao
  Web3Forms, ausência de cookies, e-mail de contato e versão/data corretas.
- axe-core sem violações em `/contato/` (inclusive com erros visíveis) e `/privacidade/`.

## Checklist de Privacidade e LGPD

Revisão item por item do checklist de [plan.md](../specs/003-formulario-contato/plan.md).

| # | Item | Resultado | Evidência |
|---|---|---|---|
| P1 | Coleta mínima | ✅ | Formulário tem só nome, telefone, e-mail, categoria, detalhes; nenhum campo extra no DOM |
| P2 | Finalidade declarada | ✅ | Bloco de consentimento antes do botão, com link para a política |
| P3 | Base legal | ✅ | Seção 4 da política cita consentimento (art. 7º, I, da LGPD) |
| P4 | Consentimento registrado | ✅ | Teste de payload confirma `consent`, `consent_version` e `consent_at` |
| P5 | Consentimento não pré-marcado | ✅ | HTML gerado sem `checked`; teste confirma `not.toBeChecked()` |
| P6 | Política acessível | ✅ | `/privacidade/` ligada no rodapé das 3 páginas e no formulário |
| P7 | Compartilhamento declarado | ✅ | Seção 5 nomeia Web3Forms (operador) e o provedor de e-mail |
| P8 | Retenção definida | ✅ | Seção 6: 12 meses após o último contato; exclusão em 15 dias |
| P9 | Direitos do titular | ✅ | Seção 7 lista os direitos; seção 8 dá e-mail e WhatsApp |
| P10 | Sem dados no repositório | ✅ | Busca em `src`, `tests`, `specs`, `docs` só encontra dados fictícios e a chave de teste |
| P11 | Sem dados no cliente | ✅ | Teste E2E verifica `localStorage`, `sessionStorage`, cookies e URL vazios |
| P12 | Sem rastreamento | ✅ | Nenhum analytics, pixel, cookie ou script externo no `dist/` |
| P13 | Segurança do canal | ✅ | GitHub Pages força HTTPS; acesso à caixa restrito à responsável |
| P14 | Serviço adequado | ⏳ | Depende de restringir o domínio no painel do Web3Forms (passo manual) |
| P15 | Dados de teste | ✅ | Envio real com dados fictícios recebido e conferido; mensagem de teste apagada |

Itens P14 e P15 são manuais e dependem da chave real; o resultado é registrado na seção de
validação manual abaixo.

## Verificação de dados sensíveis

- `.env` não existe no repositório e está no `.gitignore` (com exceção para `.env.example`, que não
  tem valor).
- Apenas a chave fictícia `chave-de-teste-e2e` aparece em `scripts/build-test.mjs` e nos testes.
- Nenhuma chave real, token ou dado de visitante em `git status`, `git diff` ou arquivos
  versionados.
- O e-mail e o WhatsApp em `src/lib/contact.ts` são dados públicos divulgados de propósito.

## Validação manual com a chave real

Build com `PUBLIC_WEB3FORMS_KEY` no `.env` local e `npm run preview -- --port 4399`:

- `/contato/` renderizou o formulário completo com a chave real no campo oculto `access_key`
  (prefixo `e337df76`, 36 caracteres).
- Envio preenchido com dados fictícios: nome "Teste Site Faby", telefone "(11) 90000-0000",
  e-mail `teste.site@exemplo.com`, categoria "Ensaios" e detalhes marcados como teste.
- Resposta HTTP **200** de `https://api.web3forms.com/submit`; painel de sucesso exibido, botão
  "Pedido enviado" e formulário limpo.
- O assunto gerado foi `Novo pedido de orçamento — Ensaios — Teste Site Faby` e `consent_at`
  recebeu `2026-10-25T20:32:31.793Z`.
- Nenhum e-mail foi gerado nas tentativas anteriores que falharam antes de chegar à API.

**Observação de teste**: o Web3Forms recusa o preflight CORS quando o `User-Agent` contém
`HeadlessChrome`. A validação real exigiu sobrescrever o UA do Playwright para um Chrome comum. Isso
não afeta visitantes reais; qualquer automação futura que envie de verdade precisa do mesmo ajuste.

**Resultado**: ✅ mensagem recebida e conferida em 2026-10-25 — cinco campos presentes,
`consentimento: sim`, versão `2026-10-25`, data/hora e "Responder" para `teste.site@exemplo.com`.
A mensagem de teste foi apagada da caixa.

## Pendências desta feature

1. **Restrição de domínio no Web3Forms** — autorizar `juninhofonseca.github.io` no painel.
2. **Variável de deploy** — cadastrar `WEB3FORMS_KEY` no repositório e validar o envio na URL
   publicada.
