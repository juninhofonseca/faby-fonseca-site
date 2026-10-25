# Faby Fonseca Fotografia

Site estático de portfólio fotográfico, com galeria por categoria, visualização ampliada
acessível e encaminhamento para orçamento.

## Stack

- [Astro](https://astro.build/) com saída estática e pipeline de imagens (`sharp`)
- TypeScript e JavaScript vanilla (sem framework de UI)
- Conteúdo em Markdown versionado no Git, editado pelo [Pages CMS](https://pagescms.org/)
- GitHub Pages para publicação
- Playwright, axe-core e Lighthouse CI para qualidade

## Requisitos

- Node.js 24 LTS ou superior (Astro 7 exige `>= 22.23.4`)
- npm 10 ou superior

## Instalação

```bash
npm install
npm run dev
```

O servidor local fica em `http://localhost:4321`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera `dist/` e verifica o orçamento de imagens |
| `npm run preview` | Serve o build localmente |
| `npm run check` | Verificação de tipos e Astro |
| `npm run validate:content` | Valida o Markdown de categorias e fotos |
| `npm run check:images` | Valida originais e variantes de grade |
| `npm run test:content` | Testes das regras de conteúdo |
| `npm run test:e2e` | Playwright (galeria, lightbox, contato e acessibilidade) |
| `npm run test:a11y` | Apenas os testes de acessibilidade |
| `npm run test:lighthouse` | Lighthouse CI com metas de desempenho |

## Estrutura do conteúdo

```text
content/
├── categories/<slug>.md      # nome, slug, descrição, ordem, ativa
└── photos/
    ├── <slug>.md             # título, alt, imagem, categoria, ordem, data
    └── images/<arquivo>      # originais enviados pela Faby
```

As regras completas estão em
[`specs/002-portfolio-gallery/contracts/content-schema.md`](specs/002-portfolio-gallery/contracts/content-schema.md).

## Publicação

O deploy é feito pelo workflow `.github/workflows/deploy.yml` a cada push em `main`.

1. Habilite o GitHub Pages em **Settings → Pages → GitHub Actions**.
2. Confirme o domínio em `astro.config.mjs` (`site`).
3. Se usar domínio próprio, configure o DNS e o certificado no GitHub Pages.

Enquanto o domínio próprio não estiver apontado, o workflow compila com `SITE_URL` e `SITE_BASE`
para publicar em `https://juninhofonseca.github.io/faby-fonseca-site/`. Ao ativar o domínio,
remova essas variáveis do workflow e o site passa a usar `https://fabyfonseca.com.br` na raiz.

O repositório precisa ser público para usar o Pages e o Pages CMS no plano gratuito.

## Gestão de conteúdo

A Faby publica e remove fotos pelo Pages CMS, sem editar código. O passo a passo está em
[`docs/admin.md`](docs/admin.md).

## Limites conhecidos

- O limite de 10 MB por original e o formato suportado são verificados no workflow de publicação,
  não no upload do Pages CMS.
- O formulário de contato ainda não envia solicitações; esta feature entrega a pré-seleção da
  categoria. O envio e o consentimento LGPD pertencem à feature de contato.
- A identidade visual está provisória em `src/styles/tokens.css`.
