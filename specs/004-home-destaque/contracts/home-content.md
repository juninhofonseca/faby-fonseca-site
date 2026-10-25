# Contrato de Conteúdo — Home Editável

**Feature**: `004-home-destaque` | **Data**: 2026-10-25

Define o formato que a Faby edita no Pages CMS e que o site consome no build. Qualquer mudança aqui
exige atualização de `src/content.config.ts`, `.pages.yml`, `scripts/validate-content.mjs` e deste
documento.

## Configuração do Pages CMS (`.pages.yml`)

Adições ao arquivo existente:

```yaml
media:
  # ... fonte "photos" já existente
  - name: home
    label: Foto da página inicial
    input: content/home/images
    output: images
    rename: safe
    extensions: [jpg, jpeg, png, webp]

content:
  # ... coleções "categories" e "photos" já existentes
  - name: home
    label: Página inicial
    type: file
    path: content/home/index.md
    format: yaml-frontmatter
    fields:
      - name: heroTitle
        label: Título do destaque
        type: string
        description: Aparece como título principal da home. Até 80 caracteres.
      - name: heroText
        label: Frase de apresentação
        type: text
        description: Resume o trabalho em uma ou duas frases. Até 240 caracteres.
      - name: heroImage
        label: Foto de destaque
        type: image
        options:
          media: home
      - name: heroAlt
        label: Texto alternativo da foto
        type: string
        description: Descreva a foto para quem não pode vê-la. Até 160 caracteres.
      - name: featuredCategories
        label: Categorias em destaque
        type: reference
        options:
          collection: categories
          multiple: true
          min: 3
          max: 3
          value: "{fields.slug}"
          label: "{fields.name}"
          search: "fields.name"
        description: Escolha exatamente três categorias ativas, na ordem em que devem aparecer.
      - name: aboutTitle
        label: Título da seção sobre a Faby
        type: string
        description: Até 60 caracteres.
      - name: aboutText
        label: Texto sobre a Faby
        type: text
        description: Até 600 caracteres. Deixe uma linha em branco entre parágrafos.
```

## Frontmatter da home

Arquivo: `content/home/index.md`

```markdown
---
heroTitle: Histórias reais, registradas com sensibilidade
heroText: Casamentos, ensaios, família, newborn e eventos. Cada encontro é acompanhado com calma,
  atenção e olhar atento aos detalhes que fazem parte da sua história.
heroImage: images/hero-home.jpg
heroAlt: Foto provisória de um casal durante a cerimônia de casamento, ao ar livre.
featuredCategories:
  - casamentos
  - ensaios
  - familia
aboutTitle: Sobre a Faby
aboutText: |-
  A fotografia é a minha forma de guardar o que passa rápido: o abraço antes da cerimônia, o riso
  solto, a mão que procura a outra.

  Meu trabalho é acompanhar cada história com calma e atenção, para que as imagens continuem fazendo
  sentido daqui a muitos anos.
---
```

O corpo do Markdown não é usado: todo o conteúdo vem do frontmatter. O arquivo existe para que o
painel trate a home como uma entrada única e para manter a mídia ao lado do conteúdo.

| Campo | Tipo | Obrigatório | Contrato |
|---|---|---|---|
| `heroTitle` | string | sim | 1–80 caracteres; renderizado como único `h1` |
| `heroText` | string | sim | 1–240 caracteres; parágrafo de abertura |
| `heroImage` | string | sim | `images/<arquivo>`; resolve para `content/home/images/<arquivo>` |
| `heroAlt` | string | sim | 1–160 caracteres; descreve a imagem **atual** |
| `featuredCategories` | string[] | sim | exatamente 3 slugs distintos, todos ativos |
| `aboutTitle` | string | sim | 1–60 caracteres; renderizado como `h2` |
| `aboutText` | string | sim | 1–600 caracteres; `\n\n` separa parágrafos |

## Contrato de mídia

- Diretório de origem: `content/home/images/`.
- Caminho público escrito no frontmatter: `images/<arquivo>` (relativo ao Markdown).
- Formatos aceitos: `jpg`, `jpeg`, `png`, `webp`.
- Limite do original: 10 MB.
- Nome do arquivo: slug seguro, sem espaços nem acentos (`rename: safe` no CMS).
- Exportação recomendada: lado maior de 2400 px, qualidade ~80.
- A mídia da home é independente de `content/photos/images/`; excluir uma foto do portfólio não
  altera a home.

## Invariantes verificadas no build

1. `content/home/index.md` existe e pode ser lido.
2. Todos os campos obrigatórios estão presentes e dentro dos limites.
3. `heroImage` existe, tem extensão permitida e não passa de 10 MB.
4. `featuredCategories` tem exatamente três slugs, sem repetição.
5. Todo slug em destaque existe em `content/categories/` e está ativo.
6. As variantes WebP usadas na home respeitam o orçamento de imagens.

Falha em qualquer invariante interrompe o build com o arquivo e o campo responsáveis na mensagem. O
deploy não acontece até a correção; o site anterior continua no ar.

## Edição pelo painel

1. Abrir **Página inicial** no Pages CMS.
2. Alterar os textos ou enviar uma nova foto de destaque.
3. Atualizar o texto alternativo para descrever a nova foto.
4. Selecionar exatamente três categorias ativas em **Categorias em destaque**.
5. Publicar e aguardar o workflow **Deploy**.

O passo a passo voltado para a administradora está em
[`docs/admin.md`](../../docs/admin.md).
