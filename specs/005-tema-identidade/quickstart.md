# Guia de Validação — Identidade Visual e Portfólio Centrado na Galeria

**Feature**: `005-tema-identidade` | **Data**: 2026-10-25

Guia para provar, de ponta a ponta, que a nova identidade e o portfólio centrado na galeria atendem à
especificação. Os formatos de conteúdo estão em [contracts/content.md](./contracts/content.md); o
comportamento das páginas em [contracts/pages.md](./contracts/pages.md).

## Pré-requisitos

- Node.js 24 LTS e npm 10+.
- Dependências instaladas (`npm install`).
- Playwright com Chromium instalado (`npx playwright install chromium`).
- Acesso ao Pages CMS com o repositório autorizado, para o cenário de edição manual.
- Acesso ao repositório no GitHub, para conferir o deploy.
- **Foto real do hero aprovada**: `content/home/images/hero-home.jpg`, colorida, 4898 × 3266 px, com
  direito de uso confirmado e recorte retrato 3:4 aprovado.

> A foto, o recorte e o texto alternativo foram aprovados em 2026-10-25. O build continua bloqueando
> arquivos com largura ou altura abaixo de 2400 px e placeholders conhecidos; o checklist de release
> registra a aprovação.

## Instalação e execução

```bash
npm install
npm run dev          # http://localhost:4321
```

Build e verificações:

```bash
npm run validate:content   # schema, alt, imagens, hero (largura e altura ≥ 2400 px) e corpo do Sobre
npm run test:content       # regras unitárias (inclui contraste e ausência de roxo)
npm run check              # tipos e Astro
npm run build              # gera dist/ e verifica o orçamento de imagens
npm run preview            # serve o build em http://localhost:4321
```

Testes automatizados:

```bash
npm run test:e2e           # desktop 1280 px + tablet 768 px + mobile 360 px
npm run test:a11y          # axe-core em todas as páginas
npm run test:lighthouse    # /, /portfolio/, /contato/, /sobre/, /privacidade/
```

> Só pode existir um servidor de preview por vez. Se o Playwright reclamar da porta, encerre com
> `npx astro preview stop` antes de repetir.

## Cenário 1 — Identidade reconhecível (História 1)

1. Abrir `/`, `/portfolio/`, `/contato/` e `/privacidade/` em 360 px, 768 px e 1280 px. A página
   `/sobre/` é conferida no cenário 4.
2. Conferir:
   - fundo `#F7F3EE`, texto `#2B2622`, apoio `#6B615A`;
   - `#B5715A` apenas em detalhes, bordas e títulos grandes;
   - `#8E5238` em links, botões e texto pequeno;
   - nenhuma cor roxa;
   - no máximo duas famílias tipográficas (Cormorant Garamond + Inter);
   - `theme-color` = `#F7F3EE`.
3. Desabilitar o carregamento das fontes no DevTools e recarregar: o texto continua visível com
   fallback de sistema, sem sumir nem deslocar o layout de forma perceptível.
4. Rodar `npm run test:content` e confirmar o teste de contraste.

**Evidência**: capturas em 360 px, 768 px e 1280 px das páginas verificadas + saída do teste de
contraste.

## Cenário 2 — Galeria protagonista (História 2)

1. Abrir `/portfolio/` sem query.
   - As cinco categorias aparecem na ordem Casamentos, Ensaios, Família, Newborn, Eventos.
   - Cada uma tem nome, descrição curta e mosaico; “Todos” está ativo.
   - Newborn e Eventos mostram “Em breve novas fotos nesta categoria.”
2. Clicar em **Ensaios**.
   - Só a seção de Ensaios fica visível.
   - A URL passa a `/portfolio/?categoria=ensaios`.
   - O botão voltar do navegador restaura “Todos”.
3. Recarregar diretamente `/portfolio/?categoria=casamentos`.
   - Apenas Casamentos aparece após o carregamento.
4. Abrir uma foto e navegar com as setas; fechar com `Esc`.
   - O foco retorna ao cartão de origem.
5. Repetir com JavaScript desabilitado.
   - Todas as categorias aparecem; os cartões abrem a imagem ampliada.

**Evidência**: `npm run test:e2e` (galeria, lightbox, responsividade).

## Cenário 3 — Caminho para contratar (História 3)

1. Em qualquer página, conferir o cabeçalho:
   - logo “Faby Fonseca” + “Fotografia”;
   - menu Início, Portfólio, Contato;
   - botão “Solicitar orçamento” para `/contato/`.
2. Na home, acionar os dois CTAs do hero, um cartão de categoria e o CTA do rodapé.
3. No `/portfolio/?categoria=newborn`, acionar “Solicitar orçamento” e confirmar que o contato abre
   com Newborn pré-selecionado.
4. Acionar WhatsApp e conferir a mensagem “Olá, Faby! Vim pelo site e gostaria de um orçamento.”.
5. Acionar Instagram e confirmar `@faby.fonseca.fotografia` em nova aba.
6. Enviar o formulário com consentimento e conferir o redirect para `/contato/enviado/`.

**Evidência**: `npm run test:e2e` (home, contact-cta, contato) + captura do WhatsApp aberto.

## Cenário 4 — Página Sobre (História 4)

1. Na home, ler o resumo e acionar “Conhecer a Faby”.
2. Confirmar que `/sobre/` mostra o texto completo de apresentação, em pt-BR, sem dados inventados.
3. Acionar os links para o portfólio e para o orçamento.
4. No rodapé de qualquer página, acionar **Sobre** e **Política de Privacidade**.
5. Confirmar `/sobre/` no `sitemap-index.xml` (ou `sitemap-0.xml`) e que `/contato/enviado/` não
   aparece no sitemap.

**Evidência**: `npm run test:e2e` (sobre) + captura das duas páginas.

## Cenário 5 — Edição sem programar (História 5)

1. No Pages CMS, abrir **Portfólio → Casamentos**.
2. Publicar uma foto de teste com título, texto alternativo e ordem; confirmar que a imagem é gravada
   em `content/portfolio/casamentos/imagens/`.
3. Alterar a descrição curta da categoria e publicar.
4. Alterar um texto da home e o texto completo da página Sobre (campo **Texto de apresentação**);
   publicar.
5. Aguardar o workflow **Deploy** e conferir o site.
6. Remover a foto de teste depois da conferência.
7. Tentar publicar uma foto sem texto alternativo e confirmar que o workflow **CI/Deploy** falha com
   mensagem clara; o site anterior continua no ar.

**Evidência**: capturas do painel + execução do workflow.

## Cenário 6 — Portão do hero (FR-005 / SC-009)

1. Conferir `content/home/images/hero-home.jpg` (foto aprovada: 4898 × 3266 px, 817 KB).
   - O arquivo tem resolução suficiente para o recorte retrato 3:4.
   - A foto, o recorte e o `alt` estão registrados como aprovados no checklist de release.
2. Rodar `npm run validate:content`.
   - Deve passar nas dimensões e no `alt`; o hash não pode ser de um placeholder conhecido.
3. Atualizar `heroAlt` para descrever a imagem publicada e rodar de novo.
   - Deve passar.
4. Rodar `npm run build` e abrir `/`.
   - O hero é a foto real, exibido em retrato 3:4, com o assunto preservado.
5. Confirmar no HTML que o hero tem `loading="eager"`, `fetchpriority="high"`, `width`/`height` e
   `alt` descritivo.
6. Repetir com uma imagem com largura ou altura abaixo de 2400 px para confirmar que o build falha com mensagem clara.

**Evidência**: log da falha e do sucesso + captura do hero em 360 px, 768 px e 1280 px.

## Cenário 7 — Privacidade e remoções (FR-013/FR-014)

1. Abrir `/privacidade/` e conferir as 11 seções, a data de vigência atualizada e a frase de que não
   há analytics, cookies ou rastreadores.
2. Buscar no build publicado por `giscus`, `dark`, `prefers-color-scheme`, `lang-switch`, `i18n`,
   `analytics`, `gtag`, `plausible`, `umami`.
   - Nenhum resultado.
3. Confirmar que não há seletor de idioma, modo escuro, comentários ou conteúdo de demonstração.

**Evidência**: `npm run test:e2e` (privacy) + busca no `dist/`.

## Cenário 8 — Qualidade e desempenho

```bash
npm run validate:content
npm run test:content
npm run check
npm run build
npm run test:e2e
npm run test:a11y
npm run test:lighthouse
```

Metas:

| Métrica | Meta |
|---|---|
| Lighthouse Performance (home) | ≥ 90 |
| Lighthouse Accessibility (todas) | 100 |
| LCP em 4G simulada | < 3 s |
| CLS | < 0,1 |
| axe-core | 0 violações |
| Variante de listagem | ≤ 300 KB |
| Rolagem horizontal | nenhuma em 360/768/1280 px |
| Alvos de toque | ≥ 44 × 44 px |

## Checklist de release

- [ ] Foto real do hero aprovada, largura e altura ≥ 2400 px, recorte retrato 3:4
      preservando o assunto, direito de uso confirmado.
- [ ] `heroAlt` descreve a foto publicada.
- [ ] `npm run validate:content` verde.
- [ ] `npm run test:content` verde.
- [ ] `npm run check` sem erros.
- [ ] `npm run build` verde e orçamento de imagens respeitado.
- [ ] `npm run test:e2e` verde em desktop, tablet e mobile.
- [ ] `npm run test:a11y` verde.
- [ ] `npm run test:lighthouse` verde com `/sobre/` incluído e desempenho ≥ 90.
- [ ] Nenhuma cor roxa, comentário, seletor de idioma ou modo escuro no `dist/`.
- [ ] `/sobre/` no sitemap, `/contato/enviado/` fora dele, e a página acessível pela home e pelo rodapé.
- [ ] Política de privacidade com data atualizada e ausência de analytics declarada.
- [ ] Deploy do GitHub Pages concluído e site publicado conferido.

## Solução de problemas

| Sintoma | Causa provável | Correção |
|---|---|---|
| Build falha com “largura ou altura < 2400 px” | foto do hero pequena ou substituída | restaurar a foto aprovada em alta resolução |
| Build falha com “imagem não existe” | caminho fora de `imagens/` ou arquivo não versionado | conferir o caminho relativo ao `index.md` e o commit da imagem |
| Variante acima de 300 KB | exportação muito pesada | reduzir qualidade/largura ou reexportar em WebP |
| Fonte não carrega | caminho em `public/fonts/` ou `base` errado | conferir `@font-face` e `withBase()` |
| Filtro não esconde a categoria | query inválida ou script não carregado | conferir `data-gallery-section`, `data-category-link` e o console |
| Lighthouse mede a página errada | preview antigo na porta 4322 | encerrar com `npx astro preview stop` e repetir |
| Sobre fora do sitemap | integração não regenerou | rodar `npm run build` novamente e conferir `dist/sitemap-*.xml` |
| `/contato/enviado/` no sitemap | filtro do `@astrojs/sitemap` ausente | conferir `astro.config.mjs` e rebuildar |

## Dívida conhecida

O site continua em `https://juninhofonseca.github.io/faby-fonseca-site/`, sem domínio próprio, como
registrado na spec e no plano. `SITE_URL`/`SITE_BASE` permitem a migração futura sem mudança de
código.
