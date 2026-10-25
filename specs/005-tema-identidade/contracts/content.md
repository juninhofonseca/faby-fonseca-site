# Contrato de Conteúdo — Identidade Visual e Portfólio

**Feature**: `005-tema-identidade` | **Data**: 2026-10-25

Define o formato que a Faby edita no Pages CMS e que o site consome no build. Qualquer mudança aqui
exige atualização de `src/content.config.ts`, `.pages.yml`, `scripts/validate-content.mjs`,
`scripts/check-image-budget.mjs` e deste documento.

## Árvore de conteúdo

```
content/
  portfolio/
    casamentos/
      index.md
      imagens/
        ana-e-joao-cerimonia.jpg
        detalhe-aliancas.jpg
        festa-primeira-danca.jpg
    ensaios/
      index.md
      imagens/
        ensaio-luz-natural.jpg
        ensaio-urbano.jpg
    familia/
      index.md
      imagens/
        familia-praia.jpg
    newborn/
      index.md
      imagens/            ← vazia nesta versão
    eventos/
      index.md
      imagens/            ← vazia nesta versão
  home/
    index.md
    images/
      hero-home.jpg       ← foto real aprovada (≥ 2400 px)
  sobre/
    index.md
    images/             ← opcional; criada se houver retrato
```

- O nome da pasta é o `slug` da categoria.
- A pasta `imagens/` pode existir vazia; o Git não versiona pastas vazias, então a implementação
  deve criar um `.gitkeep` ou aceitar a ausência até a primeira foto.
- Nenhuma imagem é referenciada fora da pasta da própria categoria.

## Frontmatter da categoria

Arquivo: `content/portfolio/casamentos/index.md`

```markdown
---
name: Casamentos
slug: casamentos
description: Cobertura completa do casamento, do making of à festa.
order: 10
active: true
photos:
  - title: Ana e João — cerimônia
    alt: Noivos caminhando de mãos dadas após a cerimônia, ao ar livre.
    image: imagens/ana-e-joao-cerimonia.jpg
    order: 10
    publishedAt: 2026-09-12
    published: true
  - title: Detalhe das alianças
    alt: Alianças de ouro apoiadas sobre tecido claro, em foto de detalhe.
    image: imagens/detalhe-aliancas.jpg
    order: 20
    publishedAt: 2026-09-12
    published: true
---
```

O corpo do Markdown não é usado. O arquivo existe para que o painel trate a categoria como uma
entrada única e para manter a mídia ao lado do conteúdo.

| Campo | Tipo | Obrigatório | Contrato |
|---|---|---|---|
| `name` | string | sim | 1–60 caracteres |
| `slug` | string | sim | igual ao nome da pasta; `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| `description` | string | sim | 1–160 caracteres |
| `order` | number | sim | inteiro ≥ 0 |
| `active` | boolean | sim | padrão `true` |
| `photos` | object[] | não | padrão `[]`; pode ser vazia; itens conforme abaixo |
| `photos[].title` | string | sim | 1–80 caracteres |
| `photos[].alt` | string | sim | 1–160 caracteres, não vazio |
| `photos[].image` | image | sim | `imagens/<arquivo>` relativo ao `index.md` |
| `photos[].order` | number | sim | inteiro ≥ 0, único na categoria |
| `photos[].published` | boolean | sim | padrão `true` |
| `photos[].publishedAt` | date | não | ISO `AAAA-MM-DD` |

## Frontmatter da home

Arquivo: `content/home/index.md`

```markdown
---
heroTitle: Histórias reais, registradas com sensibilidade
heroText: Casamentos, ensaios, família, newborn e eventos. Cada encontro é acompanhado com calma,
  atenção e olhar atento aos detalhes que fazem parte da sua história.
heroImage: images/hero-home.jpg
heroAlt: Retrato colorido de Faby Fonseca ao ar livre, com cabelos escuros cacheados e óculos de sol.
featuredCategories:
  - casamentos
  - ensaios
  - familia
aboutTitle: Sobre a Faby
aboutSummary: A fotografia é a minha forma de guardar o que passa rápido. Acompanho cada história
  com calma e atenção para que as imagens continuem fazendo sentido daqui a muitos anos.
---
```

| Campo | Tipo | Obrigatório | Contrato |
|---|---|---|---|
| `heroTitle` | string | sim | 1–80 caracteres; único `h1` da home |
| `heroText` | string | sim | 1–240 caracteres |
| `heroImage` | image | sim | `images/<arquivo>`; **lado maior e altura ≥ 2400 px**; ≤ 10 MB |
| `heroAlt` | string | sim | 1–160 caracteres; descreve a imagem atual |
| `featuredCategories` | string[] | sim | exatamente 3 slugs distintos, todos ativos |
| `aboutTitle` | string | sim | 1–60 caracteres |
| `aboutSummary` | string | sim | 1–400 caracteres |

`heroImage` aceita `jpg`, `jpeg`, `png` e `webp`. A exibição é retrato 3:4 com recorte que preserva o
assunto. A foto atual (`hero-home.jpg`, 4898 × 3266 px) está aprovada; o recorte e o `alt` também.
Qualquer arquivo abaixo de 2400 px **não** passa na validação.

## Frontmatter da página Sobre

Arquivo: `content/sobre/index.md`

```markdown
---
title: Sobre a Faby
intro: Fotógrafa de casamentos, ensaios, família, newborn e eventos.
updatedAt: 2026-10-25
---

A fotografia é a minha forma de guardar o que passa rápido: o abraço antes da cerimônia, o riso
solto, a mão que procura a outra.

Meu trabalho é acompanhar cada história com calma e atenção, para que as imagens continuem fazendo
sentido daqui a muitos anos.
```

| Campo | Tipo | Obrigatório | Contrato |
|---|---|---|---|
| `title` | string | sim | 1–80 caracteres; `h1` |
| `intro` | string | sim | 1–240 caracteres |
| `body` | markdown | sim | 1–4000 caracteres |
| `image` | image | não | `images/<arquivo>`; ≤ 10 MB |
| `imageAlt` | string | condicional | obrigatório se `image` existir; 1–160 caracteres |
| `updatedAt` | date | não | ISO `AAAA-MM-DD` |

O texto completo vem do conteúdo atual do site e não pode ser reescrito nem inventado nesta feature.

## Configuração do Pages CMS (`.pages.yml`)

### Mídia

```yaml
media:
  - name: portfolio-casamentos
    label: Fotos — Casamentos
    input: content/portfolio/casamentos/imagens
    output: imagens
    rename: safe
    extensions: [jpg, jpeg, png, webp]
  - name: portfolio-ensaios
    label: Fotos — Ensaios
    input: content/portfolio/ensaios/imagens
    output: imagens
    rename: safe
    extensions: [jpg, jpeg, png, webp]
  # ... familia, newborn, eventos com o mesmo formato

  - name: home
    label: Foto da página inicial
    input: content/home/images
    output: images
    rename: safe
    extensions: [jpg, jpeg, png, webp]

  - name: sobre
    label: Foto da página Sobre
    input: content/sobre/images
    output: images
    rename: safe
    extensions: [jpg, jpeg, png, webp]
```

### Conteúdo

```yaml
content:
  - name: portfolio
    label: Portfólio
    type: group
    items:
      - name: casamentos
        label: Casamentos
        type: file
        path: content/portfolio/casamentos/index.md
        format: yaml-frontmatter
        fields:
          - name: name
            label: Nome
            type: string
          - name: slug
            label: Slug
            type: string
            description: Não altere depois de publicado.
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
            type: object
            list: true
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
                  media: portfolio-casamentos
              - name: order
                label: Ordem
                type: number
              - name: published
                label: Publicada
                type: boolean
              - name: publishedAt
                label: Data
                type: date
      # ... ensaios, familia, newborn, eventos com o mesmo formato
      # e a mídia correspondente em `options.media`

  - name: home
    label: Página inicial
    type: file
    path: content/home/index.md
    format: yaml-frontmatter
    fields:
      # heroTitle, heroText, heroImage (media: home), heroAlt,
      # featuredCategories, aboutTitle, aboutSummary

  - name: sobre
    label: Sobre
    type: file
    path: content/sobre/index.md
    format: yaml-frontmatter
    fields:
      # title, intro, image (media: sobre), imageAlt, updatedAt, body
```

`featuredCategories` continua como `reference` para a coleção `categories`, com `multiple: true`,
`min: 3`, `max: 3`, `value: "{fields.slug}"` e `label: "{fields.name}"`.

### Por que cinco entradas de arquivo

O Pages CMS seleciona a fonte de mídia por campo (`options.media`), mas não escolhe a fonte a partir
do valor de outro campo. Com uma entrada por categoria, a foto nova cai automaticamente na pasta
certa. Alternativas (fonte única, `type: tree`, referência a outra coleção) foram descartadas em
[research.md](../research.md) (D5 e D6).

## Contrato de mídia

- Formatos aceitos: `jpg`, `jpeg`, `png`, `webp`.
- Limite do original: 10 MB.
- Nome do arquivo: slug seguro, sem espaços nem acentos (`rename: safe` no CMS).
- Exportação recomendada para a galeria: lado maior de 2400 px, qualidade ~80.
- Hero: lado maior e altura ≥ 2400 px; exibição em retrato 3:4 com recorte que preserva o assunto.
- Variante de listagem: ≤ 300 KB (WebP, larguras 480/960/1440 conforme o breakpoint).
- Toda imagem tem `alt` descritivo em português do Brasil, sem “imagem de...” redundante.

## Migração

1. Criar as cinco pastas em `content/portfolio/` com `index.md`.
2. Mover as seis imagens para a pasta da categoria correspondente.
3. Converter cada foto em item de `photos[]`, preservando título, alt, ordem, data e situação.
4. Criar `content/sobre/index.md` com o texto completo que hoje está em `aboutText`.
5. Reduzir a home a `aboutSummary` + link.
6. Remover `content/categories/` e `content/photos/` no mesmo commit.
7. Atualizar schema, CMS, scripts e testes.

Nenhum texto é reescrito na migração.

## Invariantes verificadas no build

1. As cinco pastas existem e o `slug` de cada frontmatter é igual ao nome da pasta.
2. Não há slugs duplicados nem categorias ativas fora das cinco previstas.
3. Todo `alt` publicado é não vazio e ≤ 160 caracteres.
4. Toda `image` referenciada existe, tem extensão suportada e original ≤ 10 MB.
5. Toda variante de listagem ≤ 300 KB.
6. O hero tem lado maior e altura ≥ 2400 px, é exibido em retrato 3:4 preservando o assunto e tem
   `alt` descritivo.
7. `featuredCategories` tem exatamente três slugs ativos e distintos.
8. A página Sobre tem `title`, `intro` e `body` não vazios; `imageAlt` existe se houver `image`.
9. Nenhum arquivo de demonstração do tema é publicado.

A aprovação editorial da foto do hero (identidade, recorte e `alt`) é registrada no checklist de
release, porque não é verificável por código.

Falha em qualquer invariante interrompe o build com o arquivo e o campo responsáveis na mensagem. O
deploy não acontece até a correção; o site anterior continua no ar.

## Edição pelo painel

1. Abrir **Portfólio** e escolher a categoria.
2. Para publicar uma foto: adicionar um item em **Fotos**, enviar a imagem, preencher título, texto
   alternativo, ordem e marcar **Publicada**.
3. Para alterar a descrição: editar **Descrição curta** e publicar.
4. Para editar a home: abrir **Página inicial**, alterar textos ou trocar a foto de destaque e o
   respectivo texto alternativo.
5. Para editar a apresentação: abrir **Sobre** e alterar o texto.
6. Publicar e aguardar o workflow **Deploy**.

O passo a passo voltado para a administradora será atualizado em `docs/admin.md` na implementação.
