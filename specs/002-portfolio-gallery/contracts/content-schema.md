# Contrato de Conteúdo — Pages CMS ↔ Site

**Feature**: `002-portfolio-gallery` | **Data**: 2026-10-25

Define o formato que a Faby edita no Pages CMS e que o site consome no build. Qualquer mudança
aqui exige atualização de `src/content.config.ts`, de `.pages.yml` e deste documento.

## Configuração do Pages CMS (`.pages.yml`)

```yaml
media:
  - name: photos
    label: Fotos do portfólio
    input: content/photos/images
    output: images
    rename: safe
    extensions: [jpg, jpeg, png, webp]

content:
  - name: categories
    label: Categorias
    type: collection
    path: content/categories
    filename: "{fields.slug}.md"
    fields:
      - name: name
        label: Nome
        type: string
      - name: slug
        label: Slug
        type: string
      - name: description
        label: Descrição curta
        type: text
      - name: order
        label: Ordem
        type: number
      - name: active
        label: Ativa
        type: boolean

  - name: photos
    label: Fotos
    type: collection
    path: content/photos
    filename: "{fields.title}.md"
    fields:
      - name: title
        label: Título interno
        type: string
      - name: alt
        label: Texto alternativo
        type: string
      - name: image
        label: Imagem
        type: image
        options:
          media: photos
      - name: category
        label: Categoria
        type: reference
        options:
          collection: categories
          value: slug
      - name: order
        label: Ordem na categoria
        type: number
      - name: publishedAt
        label: Data de publicação
        type: date
      - name: published
        label: Publicada
        type: boolean
```

**Contrato de autenticação**: o acesso é feito pelo aplicativo hospedado do Pages CMS com o
backend GitHub. A Faby é convidada por e-mail e autoriza o aplicativo no repositório. Nenhum
token, senha ou chave é gravado no repositório, no `.pages.yml` ou no bundle do site.

## Frontmatter de categoria

Arquivo: `content/categories/<slug>.md`

```markdown
---
name: Casamentos
slug: casamentos
description: Cobertura completa do casamento, do making of à festa.
order: 10
active: true
---
```

| Campo | Tipo | Obrigatório | Contrato |
|-------|------|-------------|----------|
| `name` | string | sim | 1–60 caracteres, exibido como está |
| `slug` | string | sim | `^[a-z0-9]+(?:-[a-z0-9]+)*$`, único, imutável após publicação |
| `description` | string | não | ≤ 160 caracteres |
| `order` | number | sim | inteiro ≥ 0 |
| `active` | boolean | sim | padrão `true` |

## Frontmatter de foto

Arquivo: `content/photos/<slug-da-foto>.md`

```markdown
---
title: Ana e João — cerimônia
alt: Noivos caminhando de mãos dadas após a cerimônia, ao ar livre.
image: images/ana-e-joao-cerimonia.jpg
category: casamentos
order: 20
publishedAt: 2026-10-25
published: true
---
```

| Campo | Tipo | Obrigatório | Contrato |
|-------|------|-------------|----------|
| `title` | string | sim | 1–80 caracteres; uso interno no CMS |
| `alt` | string | sim | 1–160 caracteres; não pode ser vazio nem começar com "imagem de" |
| `image` | string | sim | `images/<arquivo>`; resolve para `content/photos/images/<arquivo>` |
| `category` | string | sim | deve existir em `content/categories/<slug>.md` |
| `order` | number | sim | inteiro ≥ 0; ordena dentro da categoria |
| `publishedAt` | string | sim | `YYYY-MM-DD` |
| `published` | boolean | sim | padrão `true` |

## Contrato de mídia

- Diretório de origem: `content/photos/images/`.
- Caminho público escrito no frontmatter: `images/<arquivo>` (relativo ao Markdown).
- Formatos aceitos: `jpg`, `jpeg`, `png`, `webp`.
- Limite do original: 10 MB.
- Nome do arquivo: slug seguro, sem espaços nem acentos (`rename: safe` no CMS).
- Exportação recomendada: lado maior de 2400 px, qualidade ~80.
- O site nunca publica o original; apenas as variantes WebP geradas no build.

## Invariantes verificadas no build

1. Todo `alt` é não vazio.
2. Toda `category` referencia um `slug` existente.
3. Todo `image` existe e tem extensão permitida.
4. Nenhum original passa de 10 MB.
5. Nenhuma variante usada na grade passa de 300 KB.
6. Nenhum `slug` de categoria se repete.
7. Nenhuma foto com `published: false` aparece em rota pública.

Falha em qualquer invariante interrompe o build com o arquivo e o campo responsáveis na
mensagem. O deploy não acontece até a correção.
