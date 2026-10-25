# Faby Fonseca Fotografia

Site estático de portfólio fotográfico, com galeria por categoria, visualização ampliada
acessível e formulário de orçamento com consentimento LGPD.

## Stack

- [Astro](https://astro.build/) com saída estática e pipeline de imagens (`sharp`)
- TypeScript e JavaScript vanilla (sem framework de UI)
- Conteúdo em Markdown versionado no Git, editado pelo [Pages CMS](https://pagescms.org/)
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
com e-mail e WhatsApp, para não prometer um envio que não funciona. O mesmo vale se a variável for
removida do repositório.

### Envio e antispam

- Com JavaScript: `fetch` para `https://api.web3forms.com/submit`, confirmação na própria página,
  botão bloqueado durante o envio e dados preservados em caso de erro.
- Sem JavaScript: `POST` nativo com redirecionamento para `/contato/enviado/`.
- Antispam: campo oculto nativo (`botcheck`), honeypot próprio (`website`) e tempo mínimo de 3
  segundos. Nenhum captcha, cookie ou script de terceiros.
- Limite do plano gratuito: 250 envios por mês.

O fluxo operacional — onde os pedidos chegam, como responder, retenção, exclusão de dados e o que
fazer se o limite estourar — está em [`docs/contato.md`](docs/contato.md).

## Publicação

O deploy é feito pelo workflow `.github/workflows/deploy.yml` a cada push em `main`.

1. Habilite o GitHub Pages em **Settings → Pages → GitHub Actions**.
2. Confirme o domínio em `astro.config.mjs` (`site`).
3. Se usar domínio próprio, configure o DNS e o certificado no GitHub Pages.
4. Cadastre a variável `WEB3FORMS_KEY` (veja [Formulário de contato](#formulário-de-contato)) antes
   do primeiro deploy com o formulário ativo.

Enquanto o domínio próprio não estiver apontado, o workflow compila com `SITE_URL` e `SITE_BASE`
para publicar em `https://juninhofonseca.github.io/faby-fonseca-site/`. Ao ativar o domínio,
remova essas variáveis do workflow e o site passa a usar `https://fabyfonseca.com.br` na raiz.

O repositório precisa ser público para usar o Pages e o Pages CMS no plano gratuito.

## Gestão de conteúdo

A Faby publica e remove fotos pelo Pages CMS, sem editar código. O passo a passo está em
[`docs/admin.md`](docs/admin.md). O dia a dia do formulário de orçamento está em
[`docs/contato.md`](docs/contato.md).

## Limites conhecidos

- O limite de 10 MB por original e o formato suportado são verificados no workflow de publicação,
  não no upload do Pages CMS.
- O plano gratuito do Web3Forms entrega até 250 pedidos por mês; acima disso o visitante vê o
  contato direto.
- A identidade visual está provisória em `src/styles/tokens.css`.
