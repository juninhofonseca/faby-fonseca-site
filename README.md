# Faby Fonseca Fotografia

Site estático de portfólio fotográfico com identidade editorial, galeria em mosaico por categoria,
página Sobre, formulário de orçamento com consentimento LGPD e edição de conteúdo pelo Pages CMS.

## Stack

- [Astro](https://astro.build/) com saída estática e pipeline de imagens (`sharp`)
- TypeScript e JavaScript vanilla (sem framework de UI)
- Conteúdo em Markdown versionado no Git, editado pelo [Pages CMS](https://pagescms.org/)
- Fontes Cormorant Garamond e Inter auto-hospedadas em `public/fonts/`
- [Web3Forms](https://web3forms.com/) para entregar os pedidos de orçamento por e-mail
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
| `npm run build:test` | Build com chave fictícia do Web3Forms, usado pelos testes |
| `npm run preview` | Serve o build localmente |
| `npm run generate:og` | Gera `public/og/default.jpg` a partir da foto do hero |
| `npm run check` | Verificação de tipos e Astro |
| `npm run validate:content` | Valida categorias, fotos, home, Sobre e a foto do hero |
| `npm run check:images` | Valida originais e variantes de grade |
| `npm run test:content` | Testes das regras de conteúdo e da identidade |
| `npm run test:e2e` | Playwright em desktop 1280, tablet 768 e mobile 360 |
| `npm run test:a11y` | Apenas os testes de acessibilidade |
| `npm run test:lighthouse` | Lighthouse CI com metas de desempenho |

## Estrutura do conteúdo

```text
content/
├── portfolio/
│   └── <slug>/
│       ├── index.md          # nome, slug, descrição, ordem, active e photos[]
│       └── imagens/          # originais daquela categoria
├── home/
│   ├── index.md              # hero, três categorias em destaque e resumo
│   └── images/               # foto de destaque
└── sobre/
    ├── index.md              # título, introdução e corpo Markdown completo
    └── images/               # retrato opcional
```

As cinco categorias são fixas nesta versão: `casamentos`, `ensaios`, `familia`, `newborn` e
`eventos`. Cada foto é um item da lista `photos[]` do `index.md` da própria categoria, com imagem em
`imagens/`. As regras completas estão em
[`specs/005-tema-identidade/contracts/content.md`](specs/005-tema-identidade/contracts/content.md).

## Identidade visual

A paleta e a tipografia vivem em `src/styles/tokens.css` e não são editáveis pelo painel:

- fundo `#F7F3EE`, superfície `#EFE8DE`, texto `#2B2622`, apoio `#6B615A`;
- marca `#B5715A` em detalhes, bordas e títulos grandes;
- links, botões e texto pequeno usam o contraste acessível `#8E5238`;
- títulos em Cormorant Garamond e corpo em Inter, servidas pelo próprio site.

A imagem padrão de compartilhamento (`public/og/default.jpg`, 1200 × 630) é gerada localmente com
`npm run generate:og` e versionada.

## Página inicial, portfólio e Sobre

- A home lê `content/home/index.md`: título e frase do destaque, foto real, texto alternativo, três
  categorias em destaque, resumo da Faby e link para `/sobre/`.
- O portfólio abre em “Todos” e permite filtrar por `?categoria=<slug>` sem recarregar a página,
  preservando o botão voltar. O mosaico usa CSS columns, sem biblioteca de terceiros.
- `/sobre/` exibe o texto completo de apresentação, editável no Pages CMS, com caminhos para o
  portfólio e o orçamento.

O passo a passo da administradora está em [`docs/admin.md`](docs/admin.md).

## Formulário de contato

A página `/contato/` envia pedidos de orçamento por meio do **Web3Forms**, sem backend próprio. A
política de privacidade exigida pela LGPD fica em `/privacidade/`.

### Configurar a chave

A chave de acesso do Web3Forms é injetada no build pela variável `PUBLIC_WEB3FORMS_KEY`.

**Localmente**, crie `.env` na raiz (já ignorado pelo Git):

```text
PUBLIC_WEB3FORMS_KEY=sua-chave-aqui
```

**Em produção**, cadastre a variável de repositório `WEB3FORMS_KEY` em
**Settings → Secrets and variables → Actions → Variables → New repository variable**. O workflow
`.github/workflows/deploy.yml` mapeia essa variável para `PUBLIC_WEB3FORMS_KEY` no build.

O `.env.example` documenta o nome da variável. A chave é pública por natureza — ela aparece no HTML
de qualquer site que usa o serviço e só permite enviar mensagens para o endereço cadastrado —, mas
não deve ser versionada com valor.

### Comportamento sem chave

Sem `PUBLIC_WEB3FORMS_KEY` no build, a página de contato **não** exibe o formulário: mostra um painel
com e-mail e WhatsApp, para não prometer um envio que não funciona.

### Envio e antispam

- Com JavaScript: `fetch` para `https://api.web3forms.com/submit`, confirmação na própria página,
  botão bloqueado durante o envio e dados preservados em caso de erro.
- Sem JavaScript: `POST` nativo com redirecionamento para `/contato/enviado/`.
- Antispam: campo oculto nativo (`botcheck`), honeypot próprio (`website`) e tempo mínimo de 3
  segundos. Nenhum captcha, cookie ou script de terceiros.

O fluxo operacional está em [`docs/contato.md`](docs/contato.md).

## Publicação

O deploy é feito pelo workflow `.github/workflows/deploy.yml` a cada push em `main`.

1. Habilite o GitHub Pages em **Settings → Pages → GitHub Actions**.
2. Confirme o domínio em `astro.config.mjs` (`site`).
3. Se usar domínio próprio, configure o DNS e o certificado no GitHub Pages.
4. Cadastre a variável `WEB3FORMS_KEY` antes do primeiro deploy com o formulário ativo.

Enquanto o domínio próprio não estiver apontado, o workflow compila com `SITE_URL` e `SITE_BASE`
para publicar em `https://juninhofonseca.github.io/faby-fonseca-site/`. Ao ativar o domínio, remova
essas variáveis do workflow e o site passa a usar `https://fabyfonseca.com.br` na raiz.

O repositório precisa ser público para usar o Pages e o Pages CMS no plano gratuito.

## Gestão de conteúdo

A Faby publica e remove fotos, edita a descrição das categorias e atualiza a home e a página Sobre
pelo Pages CMS, sem editar código. O passo a passo está em [`docs/admin.md`](docs/admin.md) e o dia
a dia do formulário em [`docs/contato.md`](docs/contato.md).

## Limites conhecidos

- As cinco categorias são fixas nesta versão; criar uma sexta exige alteração de código.
- O limite de 10 MB por original e o formato suportado são verificados no workflow de publicação.
- O hero precisa ter largura e altura de pelo menos 2400 px e não pode ser o placeholder antigo.
- As seis fotos atuais do portfólio são amostras; a foto do hero é a foto real aprovada.
- O site continua na URL de projeto do GitHub Pages até a migração para o domínio próprio.
