# Modelo de Dados: Home com Foto de Destaque e Instagram

**Feature**: `004-home-destaque` | **Data**: 2026-10-25

Descreve os dados editáveis, as relações com o portfólio e as regras verificadas no build. A
implementação correspondente está em [contracts/home-content.md](./contracts/home-content.md).

## Entidade: Conteúdo da home

Arquivo único: `content/home/index.md` (coleção Astro `home`, entrada `index`).

| Campo | Tipo | Obrigatório | Regra | Uso |
|---|---|---|---|---|
| `heroTitle` | texto | sim | 1–80 caracteres | `h1` da home |
| `heroText` | texto | sim | 1–240 caracteres | frase de apresentação sob o `h1` |
| `heroImage` | imagem | sim | `images/<arquivo>`; JPG, PNG ou WebP; ≤ 10 MB | foto de destaque |
| `heroAlt` | texto | sim | 1–160 caracteres, não vazio | texto alternativo da foto de destaque |
| `featuredCategories` | lista de slugs | sim | exatamente 3, distintos, todos ativos | categorias em destaque, na ordem |
| `aboutTitle` | texto | sim | 1–60 caracteres | `h2` da seção sobre a Faby |
| `aboutText` | texto longo | sim | 1–600 caracteres; parágrafos separados por linha em branco | apresentação da Faby |

**Invariantes**:

1. A entrada `home` existe e é única; o build falha se estiver ausente.
2. `heroImage` resolve para um arquivo existente em `content/home/images/`.
3. `heroAlt` nunca é vazio e descreve a imagem atual.
4. `featuredCategories` tem exatamente três slugs, sem repetição.
5. Todo slug de `featuredCategories` existe em `content/categories/` e está com `active: true`.
6. Os limites de caracteres são iguais aos do esquema Zod e do validador de conteúdo.

## Relação com categorias

A home não copia nome nem descrição das categorias: guarda apenas os slugs e resolve os dados na
renderização.

```text
content/home/index.md
  featuredCategories: [casamentos, ensaios, familia]
        │
        ├──▶ content/categories/casamentos.md  → name, description, slug
        ├──▶ content/categories/ensaios.md     → name, description, slug
        └──▶ content/categories/familia.md     → name, description, slug
```

**Resolução**:

1. `getActiveCategories()` devolve as categorias ativas ordenadas por `order`.
2. `resolveFeaturedCategories()` mantém a ordem dos slugs, remove inexistentes/inativas/repetidas e
   completa as vagas restantes com as próximas categorias ativas.
3. Se houver menos de três categorias ativas, a home exibe quantas existirem, sem quebrar.

## Relação com fotos

Para cada categoria em destaque, a home usa a primeira foto publicada, na ordem de
`src/lib/gallery.ts`.

| Situação | Resultado no cartão |
|---|---|
| Categoria com fotos publicadas | miniatura + nome + descrição + convite |
| Categoria sem fotos publicadas | nome + descrição + convite, sem imagem |
| Categoria inexistente/inativa | ignorada e substituída por outra ativa |

A miniatura não cria vínculo novo: usa `photo.data.image` e `photo.data.alt` já validados pela
feature 002.

## Entidade: Perfil do Instagram

Constantes públicas em `src/lib/contact.ts`:

| Constante | Valor | Uso |
|---|---|---|
| `INSTAGRAM_HANDLE` | `faby.fonseca.fotografia` | texto exibido na home |
| `INSTAGRAM_URL` | `https://www.instagram.com/faby.fonseca.fotografia/` | `href` na home e no rodapé |

Não é conteúdo editável no painel: é um dado público, único e compartilhado por home e rodapé. Para
mudar o perfil, altera-se a constante em um único lugar.

## Entidade: Foto de destaque (mídia)

| Item | Onde fica | Versionado? |
|---|---|---|
| Original da foto | `content/home/images/hero-home.jpg` | Sim |
| Caminho no frontmatter | `images/hero-home.jpg` | Sim |
| Variantes WebP | `dist/_astro/` geradas no build | Não |
| Texto alternativo | `heroAlt` em `content/home/index.md` | Sim |

A foto é isolada das fotos do portfólio para que a curadoria da galeria não interfira na home.

## Regras de validação no build

| Regra | Onde é verificada | Mensagem esperada |
|---|---|---|
| Entrada da home existe | `validate-content.mjs` | `content/home/index.md: arquivo não encontrado` |
| Campos textuais e limites | Zod + `validate-content.mjs` | campo e faixa de caracteres |
| Imagem existe e tem formato permitido | `validate-content.mjs` | caminho e formato |
| Original ≤ 10 MB | `validate-content.mjs` + `check-image-budget.mjs` | tamanho encontrado |
| Três slugs distintos | Zod + `assertFeaturedCategories` | quantidade/repetição |
| Slugs existem e estão ativos | `assertFeaturedCategories` | slug e motivo |

## Dados pessoais

A home não coleta nem armazena dados de visitantes. O Instagram é um link externo e o contato
profissional (e-mail/WhatsApp) já é público. Nenhuma alteração no checklist LGPD da feature 003 é
necessária; a política de privacidade continua correta.
