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

**Resultado**: ⏳ **pendente de execução manual** no Pages CMS real. Depende de conta com o
aplicativo autorizado no repositório `juninhofonseca/faby-fonseca-site`, de um commit real pelo
painel e do workflow de deploy concluído. Repetir os passos 1–8 do Cenário 4 e registrar aqui o
resultado (categoria criada, foto publicada/removida, recusa de `.gif` e de original > 10 MB).

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

1. **Cenário 4 no Pages CMS real** (T039) — depende de publicar/remover uma foto pela interface e
   confirmar o deploy. O Pages CMS já criou o `.pages.yml` inicial no repositório, mas o fluxo
   completo ainda não foi executado.
2. **Domínio próprio** — apontar `fabyfonseca.com.br` no DNS, configurar o domínio no GitHub Pages,
   ativar HTTPS e remover `SITE_URL`/`SITE_BASE` do workflow para publicar na raiz do domínio.
3. **Inspeção visual manual** — zoom 200%, leitor de tela e dispositivos reais.
4. **Conteúdo real e identidade visual** — as 6 fotos são amostras geradas e a paleta é provisória
   (`TODO(BRAND_IDENTITY)` em `src/styles/tokens.css`).
