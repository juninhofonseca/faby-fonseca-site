# Modelo de Dados — Galeria de Portfólio

**Feature**: `002-portfolio-gallery` | **Data**: 2026-10-25

Todos os dados são arquivos versionados no Git. Não há banco de dados, migrações ou estado no
servidor. O schema canônico é definido em `src/content.config.ts` (Zod); este documento descreve
as entidades, regras e relações que o schema deve garantir.

## Categoria

Representa um tipo de trabalho fotográfico exibido na navegação.

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `name` | texto | sim | 1–60 caracteres; exibido na interface em pt-BR |
| `slug` | texto | sim | único; `[a-z0-9-]+`; derivado do nome; usado na URL |
| `description` | texto | não | até 160 caracteres; apoio à navegação e ao SEO |
| `order` | inteiro | sim | ≥ 0; ordena as categorias na navegação (menor primeiro) |
| `active` | booleano | sim | padrão `true`; `false` oculta a categoria do site |

**Arquivo**: `content/categories/<slug>.md`

**Invariantes**

- `slug` é único entre categorias e não muda depois de publicada (links antigos continuam válidos).
- Apenas categorias com `active: true` aparecem na navegação, na galeria e no seletor de contato.
- Se nenhuma categoria estiver ativa, a página de portfólio exibe estado vazio explicativo.

## Foto

Representa uma imagem publicada no portfólio.

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `title` | texto | sim | 1–80 caracteres; identificação interna no CMS |
| `alt` | texto | sim | 1–160 caracteres; descritivo, sem "imagem de" |
| `image` | caminho | sim | `images/<arquivo>`; resolve para `content/photos/images/` |
| `category` | referência | sim | deve corresponder ao `slug` de uma categoria existente |
| `order` | inteiro | sim | ≥ 0; ordena as fotos dentro da categoria (menor primeiro) |
| `publishedAt` | data | sim | ISO `YYYY-MM-DD`; data de publicação |
| `published` | booleano | sim | padrão `true`; `false` mantém a foto em rascunho |

**Arquivo**: `content/photos/<slug-da-foto>.md`

**Invariantes**

- `alt` nunca é vazio; uma foto sem descrição não pode ser publicada.
- `category` precisa existir; fotos órfãs falham o build com mensagem apontando o arquivo.
- `image` precisa existir e ter extensão em `jpg`, `jpeg`, `png` ou `webp`.
- Original ≤ 10 MB (limite de publicação; validado no CI).
- `order` duplicado não quebra a página; o desempate é por `publishedAt` e depois por `title`.
- Foto com `published: false` não é renderizada em nenhuma rota.
- A remoção é feita apagando o arquivo Markdown (e, opcionalmente, o original).

## Seleção de Orçamento

Estado transitório do visitante; não é persistido.

| Campo | Tipo | Regra |
|-------|------|-------|
| `categorySlug` | texto | slug de categoria ativa; validado na página de contato |
| `source` | enum | `gallery` quando vem do CTA; `direct` em acesso direto |

**Transporte**: parâmetro de URL `?categoria=<slug>`.

**Invariantes**

- Slug inválido ou de categoria inativa é ignorado; o formulário abre sem seleção.
- Nenhum dado pessoal é coletado ou armazenado pela galeria.

## Relações

```text
Categoria 1 ──── N Foto
     │                 │
     │                 └── 1 ──── N VariantesGeradas (build, não persistidas)
     │
     └── 0..1 SeleçãoDeOrçamento (transitória, via URL)
```

- Uma categoria agrupa zero ou muitas fotos.
- Uma foto pertence a exatamente uma categoria.
- Cada foto origina variantes WebP de 480, 960 e 1600 px (artefatos de build).
- A seleção de orçamento referencia no máximo uma categoria.

## Regras derivadas dos requisitos

| Regra | Origem |
|-------|--------|
| Ordenar categorias por `order` e ocultar `active: false` | FR-001 |
| Agrupar e ordenar fotos por categoria e `order` | FR-002, FR-008, FR-014 |
| Gerar variantes de grade ≤ 300 KB | FR-004, SC-002 |
| Exigir `alt` não vazio | FR-006, SC-004 |
| Navegação circular restrita à categoria ativa | FR-008 |
| Preservar `slug` para links de orçamento | FR-011, FR-012 |
| Registrar `publishedAt` | FR-015 |
| Aceitar apenas formatos suportados e limitar tamanho | FR-017 |

## Transições de estado

**Foto**

```text
rascunho (published: false)
    │ publicar
    ▼
publicada (published: true)
    │ remover
    ▼
removida (arquivo excluído)
```

- Rascunho não aparece em nenhuma listagem pública.
- Republicar uma foto removida exige novo arquivo Markdown e novo original.

**Categoria**

```text
ativa (active: true) ⇄ oculta (active: false)
```

- Ocultar uma categoria remove suas fotos da navegação e do contato, mas preserva os arquivos.
- Categoria oculta com fotos publicadas não gera erro; as fotos ficam inacessíveis até a
  reativação.

## Validação executada no build

1. Frontmatter válido contra o schema Zod (tipos, obrigatoriedade, limites de texto).
2. Unicidade de `slug` de categoria e existência da categoria referenciada pela foto.
3. Existência e extensão do arquivo de imagem.
4. Tamanho do original ≤ 10 MB.
5. Variantes de grade ≤ 300 KB (script `check-image-budget.mjs`).
6. Nenhuma foto publicada sem `alt`.
