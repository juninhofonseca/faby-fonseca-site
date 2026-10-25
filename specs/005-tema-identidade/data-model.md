# Modelo de Dados: Identidade Visual e Portfólio Centrado na Galeria

**Feature**: `005-tema-identidade` | **Data**: 2026-10-25

Descreve as entidades editáveis, os dados fixos de identidade e as regras verificadas no build. Os
formatos de arquivo estão em [contracts/content.md](./contracts/content.md); o comportamento das
páginas está em [contracts/pages.md](./contracts/pages.md).

## Visão geral

```
content/
  portfolio/
    <slug>/
      index.md          ← categoria + lista de fotos
      imagens/          ← imagens daquela categoria
  home/
    index.md            ← hero + resumo + destaques
    images/
  sobre/
    index.md            ← texto completo da apresentação
public/
  fonts/                ← Cormorant Garamond + Inter (WOFF2)
  og/default.jpg        ← imagem padrão de compartilhamento
src/styles/tokens.css   ← identidade visual (não editável pelo painel)
src/lib/contact.ts      ← canais de contato (não editável pelo painel)
```

Cinco categorias fixas nesta versão: `casamentos`, `ensaios`, `familia`, `newborn`, `eventos`.

## Entidade: Categoria

Arquivo: `content/portfolio/<slug>/index.md` (coleção Astro `categories`, uma entrada por pasta).

| Campo | Tipo | Obrigatório | Regra | Uso |
|---|---|---|---|---|
| `name` | texto | sim | 1–60 caracteres | `h2` da seção e cartão da home |
| `slug` | texto | sim | `^[a-z0-9]+(?:-[a-z0-9]+)*$`; igual ao nome da pasta; único | filtro `?categoria=` |
| `description` | texto | sim | 1–160 caracteres | descrição curta sob o `h2` |
| `order` | inteiro | sim | ≥ 0; único na prática | ordem das seções e do menu |
| `active` | booleano | sim | padrão `true` | categoria publicada ou oculta |
| `photos` | lista de Foto | não (padrão `[]`) | pode ser vazia | mosaico da categoria |

Regras:

- O `slug` não pode ser alterado depois de publicado (quebra links e mídia).
- `active: false` remove a categoria do portfólio, da home e do formulário de contato, sem apagar as
  fotos.
- Categoria sem fotos aparece com nome, descrição e mensagem “Em breve novas fotos nesta categoria.”,
  nunca como área vazia.
- A ordem de exibição é `order`, desempatada por `name` (`pt-BR`).

## Entidade: Foto (embutida na categoria)

Item da lista `photos[]` no frontmatter da categoria. Não é uma entrada independente.

| Campo | Tipo | Obrigatório | Regra | Uso |
|---|---|---|---|---|
| `title` | texto | sim | 1–80 caracteres | título interno e `figcaption` do lightbox |
| `alt` | texto | sim | 1–160 caracteres, não vazio | `alt` da imagem e do lightbox |
| `image` | imagem | sim | `imagens/<arquivo>`; JPG, PNG ou WebP; ≤ 10 MB | original processado pelo Astro |
| `order` | inteiro | sim | ≥ 0; único dentro da categoria | ordem no mosaico |
| `published` | booleano | sim | padrão `true` | foto publicada ou rascunho |
| `publishedAt` | data | não | ISO `AAAA-MM-DD` | desempate de ordem e histórico |

Regras:

- `image` resolve relativo ao `index.md` da categoria; o arquivo precisa existir.
- Toda foto publicada tem `alt`; foto sem `alt` bloqueia o build (FR-009/FR-022).
- A ordem de exibição é `order`, desempatada por `publishedAt` e `title`.
- A listagem usa no máximo 300 KB por variante (FR-010); o original pode ter até 10 MB.
- O mosaico não recorta a imagem: a proporção original é preservada.

## Entidade: Conteúdo da home

Arquivo: `content/home/index.md` (coleção Astro `home`, entrada `index`).

| Campo | Tipo | Obrigatório | Regra | Uso |
|---|---|---|---|---|
| `heroTitle` | texto | sim | 1–80 caracteres | único `h1` da home |
| `heroText` | texto | sim | 1–240 caracteres | frase de apresentação |
| `heroImage` | imagem | sim | `images/<arquivo>`; lado maior ≥ 2400 px e altura ≥ 2400 px; ≤ 10 MB | foto real aprovada da Faby |
| `heroAlt` | texto | sim | 1–160 caracteres | descreve a foto atual |
| `featuredCategories` | lista de slugs | sim | exatamente 3, distintos, ativos | cartões de categoria |
| `aboutTitle` | texto | sim | 1–60 caracteres | `h2` do resumo |
| `aboutSummary` | texto | sim | 1–400 caracteres | resumo da apresentação |

Regras:

- O texto completo da apresentação **não** fica na home; mora em `/sobre/` (FR-011).
- O link “Conhecer a Faby” aponta para `/sobre/` e existe mesmo sem JavaScript.
- `heroImage` é o único candidato a LCP; recebe `loading="eager"`, `fetchpriority="high"` e
  dimensões explícitas.
- Enquanto o arquivo tiver lado maior < 2400 px, altura < 2400 px ou o hash for de um placeholder
  conhecido, o build falha (FR-005/SC-009). A aprovação editorial da foto e do recorte é registrada no
  checklist de release. A exibição é retrato 3:4 com recorte que preserva o assunto; a amostra de
  640 × 960 citada na spec é referência histórica de enquadramento, não conteúdo publicável.

## Entidade: Página Sobre

Arquivo: `content/sobre/index.md` (coleção Astro `sobre`, entrada `index`).

| Campo | Tipo | Obrigatório | Regra | Uso |
|---|---|---|---|---|
| `title` | texto | sim | 1–80 caracteres | `h1` da página |
| `intro` | texto | sim | 1–240 caracteres | parágrafo de abertura |
| `body` | Markdown | sim | 1–4000 caracteres | texto completo da apresentação |
| `image` | imagem | não | `images/<arquivo>`; ≤ 10 MB | retrato opcional |
| `imageAlt` | texto | condicional | obrigatório se `image` existir; 1–160 caracteres | `alt` do retrato |
| `updatedAt` | data | não | ISO `AAAA-MM-DD` | exibida como “Atualizado em” |

Regras:

- O texto é o mesmo já publicado no site atual, em pt-BR, sem dados inventados.
- A página termina com links para `/portfolio/` e `/contato/` (FR-011).
- Se `image` existir, `imageAlt` é obrigatório; o retrato é opcional para não bloquear a entrega.

## Entidade: Identidade visual

Não é editável pelo painel: vive em `src/styles/tokens.css` e é um contrato de design.

| Token | Valor | Restrição de uso |
|---|---|---|
| `--color-bg` | `#F7F3EE` | fundo e `theme-color` |
| `--color-surface` | `#EFE8DE` | faixas e cartões |
| `--color-text` | `#2B2622` | texto principal |
| `--color-muted` | `#6B615A` | texto de apoio |
| `--color-brand` | `#B5715A` | detalhes, bordas, títulos grandes; nunca texto pequeno |
| `--color-accent` | `#8E5238` | links, botões e texto pequeno |
| `--color-accent-contrast` | `#FFFFFF` | texto sobre `--color-accent` |
| `--color-border` | `#D9CFC3` | divisórias decorativas |
| `--color-border-strong` | `#8A7B6E` | bordas de campos e controles |
| `--color-focus` | `#2B2622` | anel de foco |
| `--font-display` | Cormorant Garamond | títulos |
| `--font-body` | Inter | texto corrido |

Regras:

- No máximo duas famílias tipográficas em todo o site.
- `#B5715A` sobre `#F7F3EE` = 3,47:1; só é permitido em texto grande (≥ 24 px, ou ≥ 18,66 px em
  negrito) e em elementos decorativos.
- `#8E5238` sobre `#F7F3EE` = 5,57:1; branco sobre `#8E5238` = 6,15:1.
- Nenhuma cor roxa da identidade padrão do tema é usada.

## Entidade: Perfil e canais de contato

Arquivo: `src/lib/contact.ts` (constantes). Não é conteúdo editorial.

| Constante | Valor | Uso |
|---|---|---|
| `CONTACT_EMAIL` | `juninho.fonseca@gmail.com` | rodapé, contato, política, confirmação |
| `WHATSAPP_NUMBER` | `5511967458235` | links de WhatsApp |
| `WHATSAPP_MESSAGE` | `Olá, Faby! Vim pelo site e gostaria de um orçamento.` | mensagem pré-preenchida |
| `INSTAGRAM_HANDLE` | `faby.fonseca.fotografia` | texto e link |
| `INSTAGRAM_URL` | `https://www.instagram.com/faby.fonseca.fotografia/` | rodapé e contato |
| `PRIVACY_VERSION` | ISO da data de vigência | consentimento LGPD |
| `PRIVACY_EFFECTIVE_AT` | ISO da data de vigência | política |
| `WEB3FORMS_KEY` | variável de ambiente | envio do formulário; nunca versionada |

Regras:

- WhatsApp abre em nova aba com `rel="noopener noreferrer"` e mensagem já preenchida.
- Instagram abre em nova aba e exibe `@faby.fonseca.fotografia`.
- E-mail usa `mailto:` com assunto de orçamento.
- Alterar qualquer canal exige atualizar a política de privacidade no mesmo commit.

## Entidade: Metadados de compartilhamento

Derivados por página em `BaseLayout.astro`.

| Campo | Origem | Regra |
|---|---|---|
| `title` | prop da página | único por página; sufixo “| Faby Fonseca Fotografia” |
| `description` | prop da página | 1–160 caracteres, específica |
| `canonical` | `Astro.site` + `Astro.url.pathname` | absoluto; respeita `base` |
| `og:type` | prop | `website` (padrão) ou `article` |
| `og:image` | prop ou padrão | absoluto; `/og/default.jpg` como fallback |
| `og:url` | canônico | igual ao `canonical` |
| `twitter:card` | fixo | `summary_large_image` |
| `theme-color` | fixo | `#F7F3EE` |

Regras:

- Nenhuma página fica sem `og:image`; o fallback é a imagem padrão da marca.
- `/contato/enviado/` continua `noindex`.
- Todas as páginas públicas constam no sitemap, incluindo `/sobre/`.

## Relações

- Categoria 1 — N Foto (embutida).
- Home N — 3 Categoria (por `slug`, na ordem de `featuredCategories`).
- Contato N — N Categoria (o formulário lista categorias ativas; o link do portfólio pré-seleciona).
- Página Sobre é independente; não referencia categoria.
- Identidade visual é global e não tem relação com conteúdo.

## Migração do modelo atual

| Antes | Depois |
|---|---|
| `content/categories/<slug>.md` | `content/portfolio/<slug>/index.md` (campos da categoria) |
| `content/photos/<arquivo>.md` | item em `photos[]` do `index.md` da categoria |
| `content/photos/images/<arquivo>` | `content/portfolio/<slug>/imagens/<arquivo>` |
| `content/home/index.md` com `aboutText` completo | `aboutSummary` curto + `content/sobre/index.md` com o texto completo |
| Coleções `categories` e `photos` | coleção única `categories` com fotos embutidas; nova coleção `sobre` |

Preservar em cada foto: `title`, `alt`, `order`, `publishedAt`, `published` e o conteúdo binário da
imagem. Preservar em cada categoria: `name`, `slug`, `description`, `order`, `active`.

## Invariantes verificadas no build

1. Existem exatamente cinco categorias ativas com slugs únicos e iguais ao nome da pasta.
2. Todo `slug` em `featuredCategories` existe, está ativo e não se repete; são exatamente três.
3. Toda foto publicada tem `alt` não vazio (≤ 160 caracteres) e `image` existente.
4. Toda imagem tem extensão suportada e original ≤ 10 MB.
5. Nenhuma variante de listagem passa de 300 KB.
6. O hero existe, tem lado maior e altura ≥ 2400 px, é exibido em retrato 3:4 preservando o assunto
   e tem `alt` descritivo.
7. `/sobre/` tem `title`, `intro` e `body` não vazios; `imageAlt` existe se houver `image`.
8. Todos os pares de cor usados atingem o contraste mínimo (AA; 3:1 para texto grande e bordas).
9. Nenhuma cor roxa da identidade padrão aparece em CSS ou HTML publicado.
10. Nenhum texto, imagem ou classe de demonstração do tema é publicado.
11. As URLs `/`, `/portfolio/`, `/contato/`, `/contato/enviado/`, `/privacidade/`, `/sobre/` e
    `/portfolio/?categoria=<slug>` respondem.
12. Nenhuma página pública fica sem `title`, `description`, canônico e `og:image`.

Falha em qualquer invariante interrompe o build com o arquivo e o campo responsáveis na mensagem. O
deploy não acontece e o site anterior continua no ar.
