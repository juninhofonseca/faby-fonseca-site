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
| P14 | Serviço adequado | ✅ | Web3Forms atua só como operador de envio; a restrição de domínio é recurso PRO e não está disponível no plano gratuito — mitigada por honeypot, tempo mínimo e rotação de chave |
| P15 | Dados de teste | ✅ | Envio real com dados fictícios recebido e conferido; mensagem de teste apagada |

P14 e P15 dependiam da chave real e foram verificados manualmente (seção abaixo).

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

## Deploy de produção

- URL publicada: **https://juninhofonseca.github.io/faby-fonseca-site/**
- Commit publicado: `53883ff` (`feat: formulário de contato com envio e LGPD (003)`).
- Workflow **Deploy** (run 40231689659) concluído com sucesso, com a variável de repositório
  `WEB3FORMS_KEY` injetada como `PUBLIC_WEB3FORMS_KEY` no build.
- Verificado no site publicado:
  - `/contato/` responde 200 e renderiza o formulário completo com a chave real no campo oculto
    `access_key`;
  - `/privacidade/` responde 200 com as 11 seções, Web3Forms, ausência de cookies, e-mail e
    WhatsApp;
  - `/contato/enviado/` responde 200 e traz `noindex`;
  - o rodapé das três páginas linka a política de privacidade.
- **Envio real na URL publicada**: dados fictícios ("Teste Deploy Faby", categoria Casamentos),
  resposta HTTP **200** com `success: true`, painel de sucesso visível, sem erros de console.
  Assunto gerado: `Novo pedido de orçamento — Casamentos — Teste Deploy Faby`;
  `consent_at` = `2026-10-25T20:39:11.458Z`.
- As duas mensagens de teste (envio local "Teste Site Faby" e envio de produção
  "Teste Deploy Faby") foram recebidas, conferidas e **apagadas da caixa de entrada**.
- Workflow **CI** (run 40231689658) concluído com sucesso no mesmo commit: conteúdo, testes
  unitários, `build:test`, 70 testes E2E (desktop + mobile, incluindo axe) e Lighthouse.

## Pendências desta feature

Nenhuma pendência bloqueante: a feature está publicada, validada e sem dados de teste residuais.

1. **Restrição de domínio (opcional)** — o recurso **Restrict to Domain** do Web3Forms é exclusivo
   do plano PRO. No plano gratuito, a mitigação é monitorar o painel e rotacionar a chave se houver
   spam. A chave é pública e só envia para o e-mail cadastrado.

---

# Validação — Home com Foto de Destaque e Instagram

**Feature**: `004-home-destaque` | **Data**: 2026-10-25
**Ambiente**: Windows 11, Node.js v24.19.0, npm 11.17.0, Astro 7.4.2, Chromium (Playwright)

Resultados dos cenários de [quickstart.md](../specs/004-home-destaque/quickstart.md) e da suíte
automatizada. A foto de destaque é um placeholder declarado como tal no texto alternativo.

## Resumo

| Verificação | Comando | Resultado |
|---|---|---|
| Conteúdo (categorias, fotos, home, alt, imagens) | `npm run validate:content` | ✅ 5 categorias, 6 fotos e home válidas |
| Regras de conteúdo (unitárias) | `npm run test:content` | ✅ 13/13 (5 casos novos de categorias em destaque) |
| Tipos e Astro | `npm run check` | ✅ 0 erros, 0 avisos, 0 dicas (41 arquivos) |
| Build + orçamento de imagens | `npm run build` | ✅ 5 páginas; 20 variantes de grade ≤ 300 KB |
| E2E + acessibilidade (desktop e mobile) | `npm run test:e2e` | ✅ 94/94 (24 novos: 11 da home × 2 viewports + axe da home × 2) |
| Lighthouse CI (mobile, 4G simulado) | `npm run test:lighthouse` | ✅ 4 rotas aprovadas |

Rotas geradas: `/`, `/portfolio/`, `/contato/`, `/contato/enviado/`, `/privacidade/`.

## Resultados do Lighthouse

| Rota | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 96 | 100 | 0,90 s | 0 | 0 ms |
| `/portfolio/` | 100 | 100 | 96 | 100 | 0,90 s | 0 | 0 ms |
| `/contato/` | 100 | 100 | 96 | 100 | 0,90 s | 0 | 0 ms |
| `/privacidade/` | 100 | 100 | 96 | 100 | 0,90 s | 0 | 0 ms |

As asserções de `.lighthouserc.json` (acessibilidade 100, LCP < 3 s, CLS < 0,1) passaram nas quatro
rotas. A home não carrega JavaScript próprio nem de terceiros.

## Cenário 1 — Primeira impressão e conversão

- A home apresenta um único `h1` com o título do destaque, a frase de apresentação e a foto com
  `alt` ("Foto provisória...").
- A foto usa `loading="eager"`, `fetchpriority="high"`, dimensões explícitas e `srcset` com 480, 800,
  1200 e 1600 px; no desktop de 1280 px ela renderiza 591 × 394 px ao lado do texto, sem CLS.
- "Ver portfólio" leva a `/portfolio/` e "Solicitar orçamento" a `/contato/`; a chamada final repete
  o caminho de orçamento.
- `title` e `description` são próprios da home e não repetem o texto do portfólio.

**Resultado**: ✅ aprovado (`tests/e2e/home.spec.ts`).

## Cenário 2 — Categorias em destaque

- Exatamente três cartões, na ordem do conteúdo: Casamentos, Ensaios e Família.
- Hrefs corretos: `/portfolio/?categoria=casamentos`, `=ensaios` e `=familia`; ao clicar, a categoria
  abre já ativa (`aria-current="page"`).
- Cada cartão é um link único, com `h3`, descrição e "Ver trabalhos".
- As miniaturas usam a primeira foto publicada de cada categoria, com `loading="lazy"`, `srcset` de
  400 e 800 px e o `alt` cadastrado na foto.
- Categoria sem fotos renderiza o cartão apenas com texto (coberto por `gallery.spec.ts` e pelo
  fallback de `resolveFeaturedCategories`).

**Resultado**: ✅ aprovado.

## Cenário 3 — Apresentação e Instagram

- A seção "Sobre a Faby" lê `aboutTitle` e `aboutText` do conteúdo e divide o texto em dois
  parágrafos pelas linhas em branco.
- O link `@faby.fonseca.fotografia` abre `https://www.instagram.com/faby.fonseca.fotografia/` em nova
  aba com `rel="noopener noreferrer"`.
- O mesmo link aparece no rodapé de `/`, `/portfolio/` e `/contato/`.
- Não há `iframe` nem `script` do Instagram na página (verificado no E2E).

**Resultado**: ✅ aprovado.

## Cenário 4 — Editar a home pelo Pages CMS

- `.pages.yml` ganhou a fonte de mídia `home` (`content/home/images` → `images`, `rename: safe`,
  extensões de imagem) e o arquivo único `home` (`content/home/index.md`, `yaml-frontmatter`) com os
  sete campos do contrato, rótulos em português e `reference` múltipla para as categorias.
- O contrato está em
  [`contracts/home-content.md`](../specs/004-home-destaque/contracts/home-content.md) e o passo a
  passo em [admin.md](./admin.md).
- **Pendência manual**: a edição real no painel (trocar foto, textos e ordem das categorias,
  publicar e conferir o deploy) depende de acesso ao Pages CMS e não foi executada nesta sessão. A
  configuração foi validada por build local com o mesmo formato que o painel grava.

**Resultado**: ⏳ configuração validada; verificação no painel pendente (T023).

## Cenário 5 — Desempenho e orçamento de imagens

- `npm run build` gera 5 páginas e `check-image-budget` verifica os originais de
  `content/photos/images/` **e** de `content/home/images/`, além de 20 variantes de grade (480, 800,
  1200 e 1600 px do destaque; 400 e 800 px das três miniaturas) abaixo de 300 KB.
- O placeholder tem 23 KB, bem abaixo do limite de 10 MB por original.
- Lighthouse mobile com throttling 4G: LCP 0,9 s, CLS 0, TBT 0 ms, Performance 100.
- A foto de destaque é a única imagem prioritária; as miniaturas carregam sob demanda.

**Resultado**: ✅ aprovado.

## Cenário 6 — Acessibilidade e responsividade

- axe-core (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) em `/`, desktop e mobile: 0 violações.
- Hierarquia: um `h1`, três `h2` de seção e `h3` nos cartões.
- Ordem de foco conferida manualmente a 360 px: link "Pular para o conteúdo" → marca → navegação
  (Início, Portfólio, Contato) → "Ver portfólio" → "Solicitar orçamento" → três cartões → Instagram
  → "Solicitar orçamento" final → links do rodapé.
- Alvos de toque: os links do rodapé foram ajustados para `inline-flex` com
  `min-height: var(--target-min)`, corrigindo a altura de 20 px observada na inspeção.
- Nenhuma rolagem horizontal em 360, 768 e 1280 px (teste E2E com medição de `scrollWidth`).
- A página funciona com JavaScript desabilitado: título, foto, três categorias, apresentação,
  Instagram e chamadas continuam visíveis.

**Resultado**: ✅ aprovado nos testes automatizados e na inspeção manual de foco; leitor de tela e
dispositivo físico seguem como verificação manual recomendada.

## Recusas de validação comprovadas

Testes descartáveis com o conteúdo editado e restaurado em seguida (`validate:content` voltou a
passar):

| Alteração | Mensagem |
|---|---|
| Slug de destaque inexistente (`nao-existe`) | `Categoria em destaque inexistente ou inativa: "nao-existe".` |
| Foto de destaque apontando para arquivo ausente | `content\home\images\nao-existe.jpg: arquivo de imagem não encontrado.` |

Ambas interrompem o build com `exit=1`, portanto o deploy não publica uma home inválida e o site
anterior continua no ar.

## Cobertura automatizada da home

`tests/e2e/home.spec.ts` (11 casos × desktop e mobile) e `tests/a11y/home.spec.ts`:

- Destaque com `h1`, frase, metadados e os três CTAs.
- Foto com `alt`, dimensões, `loading="eager"`, `fetchpriority="high"` e `srcset` de 480w.
- Exatamente três cartões, na ordem, com hrefs, `h3`, descrição e "Ver trabalhos".
- Navegação do cartão para a categoria correta já ativa no portfólio.
- Miniaturas `lazy` com `alt` preenchido.
- Seção sobre a Faby com dois parágrafos.
- Instagram na home e no rodapé de três rotas, com `target` e `rel` corretos.
- Ausência de `iframe` e de script do Instagram.
- Hierarquia de títulos e todas as imagens do `main` com `alt`.
- Sem rolagem horizontal em 360, 768 e 1280 px.
- Funcionamento sem JavaScript.
- axe-core sem violações em `/`.

## Deploy de produção

- URL publicada: **https://juninhofonseca.github.io/faby-fonseca-site/**
- Commit publicado: `ca6ad75` (`feat: home com foto de destaque e Instagram (004)`).
- Workflow **Deploy** (run 13, 40238861773) concluído com sucesso; **CI** (run 13, 40238861789) com
  conteúdo, testes unitários, `build:test`, 94 testes E2E (desktop + mobile, incluindo axe) e
  Lighthouse.
- Verificado no site publicado:
  - `/` responde 200 com o `h1` "Histórias reais, registradas com sensibilidade", a seção sobre a
    Faby e as três categorias (Casamentos, Ensaios, Família) na ordem;
  - a foto de destaque é servida em WebP com `srcset` de 480, 800, 1200 e 1600 px sob o prefixo
    `/faby-fonseca-site/`, e os links de portfólio, orçamento e categoria também usam o prefixo;
  - o Instagram aparece na home e no rodapé de `/`, `/portfolio/`, `/contato/` e `/privacidade/`,
    sempre com a URL canônica do perfil;
  - a home publicada não tem `<script src>` nem `iframe`: nenhum JavaScript próprio ou de terceiros.

## Pendências desta feature

1. **Edição real pelo Pages CMS (T023)** — executar o cenário 4 do quickstart quando houver acesso ao
   painel: trocar a foto e o texto alternativo, ajustar textos, reordenar as três categorias,
   publicar, conferir o deploy e reverter a foto de teste.
2. **Foto definitiva da Faby** — o placeholder atual (amostra da cerimônia) deve ser substituído pela
   foto real pelo painel, atualizando o texto alternativo junto.
3. **Identidade visual e domínio próprio** — continuam provisórios, como nas features anteriores.

---

# Validação — Identidade Visual e Portfólio Centrado na Galeria

**Feature**: `005-tema-identidade` | **Data**: 2026-10-25
**Ambiente**: Windows 11, Node.js v24.19.0, npm 11.17.0, Astro 7.4.2, Chromium (Playwright)

Resultados dos cenários de [quickstart.md](../specs/005-tema-identidade/quickstart.md) e da suíte
automatizada. A foto do hero é a foto real aprovada, não o placeholder.

## Resumo

| Verificação | Comando | Resultado |
|---|---|---|
| Conteúdo (5 categorias, fotos, home, Sobre, hero) | `npm run validate:content` | ✅ 5 categorias, 6 fotos, home e Sobre |
| Regras de conteúdo e identidade (unitárias) | `npm run test:content` | ✅ 26/26 |
| Tipos e Astro | `npm run check` | ✅ 0 erros, 0 avisos, 0 dicas (51 arquivos) |
| Build + orçamento de imagens | `npm run build` | ✅ 6 páginas; 20 variantes de grade ≤ 300 KB |
| E2E + acessibilidade (desktop, tablet e mobile) | `npm run test:e2e` | ✅ 204/204 |
| Lighthouse CI (mobile, 4G simulado) | `npm run test:lighthouse` | ✅ 5 rotas aprovadas |

Rotas geradas: `/`, `/portfolio/`, `/sobre/`, `/contato/`, `/contato/enviado/`, `/privacidade/`.

## Resultados do Lighthouse

| Rota | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 96 | 100 | 1,7 s | 0 | 0 ms |
| `/portfolio/` | 100 | 100 | 96 | 100 | 1,7 s | 0 | 0 ms |
| `/contato/` | 100 | 100 | 96 | 100 | 1,5 s | 0 | 0 ms |
| `/sobre/` | 100 | 100 | 96 | 100 | 1,5 s | 0 | 0 ms |
| `/privacidade/` | 100 | 100 | 96 | 100 | 1,5 s | 0 | 0 ms |

As asserções de `.lighthouserc.json` (acessibilidade 100, desempenho ≥ 90, LCP < 3 s, CLS < 0,1)
passaram nas cinco rotas. Nenhum script de terceiros é carregado.

## Cenário 1 — Identidade reconhecível

- Paleta `#F7F3EE`, `#EFE8DE`, `#2B2622`, `#6B615A`, `#B5715A` e `#8E5238` aplicada em tokens e
  componentes; `#B5715A` restrito a detalhes, bordas e títulos grandes.
- Cormorant Garamond nos títulos e Inter no corpo, ambas auto-hospedadas em `public/fonts/` com
  `@font-face`, `font-display: swap` e preload de dois arquivos latin.
- `theme-color` `#F7F3EE`, contraste AA verificado por teste unitário e axe, zero roxo no CSS
  publicado e zero rolagem horizontal em 360, 640, 768 e 1280 px. A largura de 640 px cobre o
  equivalente ao zoom de 200% em uma janela de 1280 px.

**Resultado**: ✅ aprovado (`tests/content/identity.test.mjs`, `tests/e2e/identity.spec.ts` e axe).

## Cenário 2 — Galeria protagonista

- `/portfolio/` abre em “Todos”, com as cinco seções visíveis na ordem Casamentos, Ensaios, Família,
  Newborn e Eventos.
- O filtro atualiza a URL com `pushState`, esconde as demais seções, preserva o botão voltar e volta
  a “Todos” quando o slug é inválido ou quando “Todos” é acionado.
- O mosaico usa CSS columns (1/2/3 colunas), sem recorte e sem biblioteca de terceiros.
- O lightbox percorre todas as fotos visíveis em “Todos” e apenas a categoria filtrada quando há
  `?categoria=`, com ciclo por setas, `Esc` e retorno de foco.
- Sem JavaScript, todas as seções continuam visíveis e os cartões abrem a imagem ampliada.

**Resultado**: ✅ aprovado (`gallery.spec.ts` e `lightbox.spec.ts`).

## Cenário 3 — Caminho para contratar

- Cabeçalho com logo em texto, menu Início/Portfólio/Contato e CTA “Solicitar orçamento” com alvo
  ≥ 44 px.
- WhatsApp com mensagem pré-preenchida, Instagram `@faby.fonseca.fotografia` e e-mail
  `juninho.fonseca@gmail.com` no contato e no rodapé.
- CTA de orçamento do portfólio aponta para `/contato/?categoria=<slug>` com a categoria
  pré-selecionada; em “Todos”, aponta para `/contato/`.
- Formulário mantém consentimento LGPD, validação, estados de erro/sucesso e envio sem JavaScript.

**Resultado**: ✅ aprovado (`home.spec.ts`, `contact-cta.spec.ts` e `contact-form.spec.ts`).

## Cenário 4 — Página Sobre

- `/sobre/` exibe título, introdução, o corpo Markdown completo renderizado e a data “Atualizado em”.
- A página é alcançável pelo link “Conhecer a Faby” na home e pelo link “Sobre” no rodapé de todas as
  páginas.
- Metadados próprios (`title`, `description`, canônico, Open Graph `article` e imagem padrão).
- `/sobre/` consta no sitemap e `/contato/enviado/` não consta.

**Resultado**: ✅ aprovado (`sobre.spec.ts` e `a11y/sobre.spec.ts`).

## Cenário 5 — Edição sem programar

- `.pages.yml` tem cinco fontes de mídia, o grupo **Portfólio** com cinco arquivos, a home e a Sobre;
  `featuredCategories` é um `select` fixo de três categorias; `active` é somente leitura.
- A Sobre usa a chave especial `body` como `rich-text` (`format: markdown`, `media: false`,
  `required: true`), gravada abaixo do frontmatter.
- O formato foi validado por build local com o mesmo formato que o painel grava.

**Resultado**: ⏳ configuração validada; execução no Pages CMS real pendente (T058).

## Cenário 6 — Portão do hero

- `content/home/images/hero-home.jpg`: 4898 × 3266 px, 817.590 bytes, SHA-256
  `be633aa29f0addad9b95a0c3f2373a7e8547f6e8ac1d8edaa73f3740b29b37c0`.
- `validate:content` lê as dimensões com `sharp`, exige largura e altura ≥ 2400 px, rejeita o hash do
  placeholder antigo e exige `heroAlt` que não descreva a foto provisória.
- A home exibe a foto em retrato 3:4 com `object-position: 72% center`, `loading="eager"`,
  `fetchpriority="high"` e dimensões explícitas.

**Resultado**: ✅ aprovado.

## Cenário 7 — Privacidade e remoções

- A política mantém as 11 seções e afirma explicitamente que o site não usa analytics, cookies de
  medição ou rastreadores.
- Busca no `dist/` por `giscus`, `prefers-color-scheme`, `dark`, `lang-switch`, `i18n`, `gtag`,
  `plausible`, `umami` e os oito hexadecimais roxos: zero ocorrências.
- A única ocorrência da palavra “analytics” está na própria declaração de ausência da política.

**Resultado**: ✅ aprovado.

## Recusas de validação comprovadas

Testes em cópia descartável de `content/` e `scripts/`, restaurada em seguida:

| Alteração | Mensagem |
|---|---|
| Foto sem `alt` | `O texto alternativo é obrigatório.` |
| Categoria com `active: false` | `"active" deve ser sempre true nesta versão.` e `Esperadas exatamente 5 categorias ativas, encontradas 4.` |
| `heroAlt` descrevendo a foto provisória | `"heroAlt" ainda descreve a foto provisória.` |
| `featuredCategories` com slug inexistente | `Categoria em destaque inexistente ou inativa: "nao-existe".` |
| Hero com 1200 × 800 px | `A foto do hero precisa ter largura e altura de pelo menos 2400 px (atual: 1200 × 800).` |

A variante de grade acima de 300 KB é coberta por `tests/content/invariants.test.mjs` e pelo
`check-image-budget.mjs` no build.

## Deploy de produção

- URL publicada: **https://juninhofonseca.github.io/faby-fonseca-site/**
- Commit publicado: `d86cd06` (`feat: identidade visual e portfólio centrado na galeria (005)`).
- Workflow **Deploy** (run 40250881932) e **CI** (run 40250881933) concluídos com sucesso.
- Verificado no site publicado:
  - `/`, `/portfolio/`, `/contato/`, `/contato/enviado/`, `/privacidade/` e `/sobre/` respondem 200;
  - `/sitemap-0.xml` contém `/sobre/` e não contém `/contato/enviado/`; a confirmação tem `noindex`;
  - `/og/default.jpg` responde 200 como imagem e o `og:image` usa a URL absoluta com o prefixo do
    projeto;
  - o hero publicado é a foto real aprovada, com o texto alternativo novo e variantes sob
    `/faby-fonseca-site/_astro/`;
  - as fontes carregam de `/faby-fonseca-site/fonts/`, sem domínio externo;
  - o CSS publicado não contém roxo, `prefers-color-scheme` nem scripts de analytics.

## Pendências desta feature

1. **Execução no Pages CMS real (T058)** — publicar uma foto de teste, editar descrição, home e o
   corpo da Sobre, conferir o deploy, tentar publicar foto sem `alt` e reverter a foto de teste.
2. **Domínio próprio** — dívida aceita; a migração é feita por `SITE_URL`/`SITE_BASE`.
