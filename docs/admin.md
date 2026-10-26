# Guia da administradora — Pages CMS

Este guia explica como a Faby publica, reordena e remove fotos, edita a descrição das categorias e
atualiza a home e a página Sobre sem programar.

## Acesso

1. Peça ao responsável técnico para convidar seu e-mail no Pages CMS.
2. Acesse <https://app.pagescms.org> e entre com o convite.
3. Autorize o aplicativo a acessar o repositório `juninhofonseca/faby-fonseca-site`.
4. Selecione o repositório e a branch `main`.

O site publicado é atualizado alguns minutos após cada publicação.

## Como o conteúdo está organizado

O menu **Portfólio** tem cinco pastas fixas: **Casamentos**, **Ensaios**, **Família**, **Newborn** e
**Eventos**. Cada pasta reúne a descrição curta e a lista de fotos daquela categoria. Não é preciso
criar uma pasta nova nem escolher a categoria da foto: ao abrir a pasta certa, a imagem é gravada em
`content/portfolio/<slug>/imagens/`.

## Publicar uma foto

1. Abra **Portfólio** e escolha a categoria.
2. Em **Fotos**, clique para adicionar um item.
3. Preencha:
   - **Título interno**: identificação da foto (aparece também na legenda do lightbox).
   - **Texto alternativo**: descrição objetiva da cena, até 160 caracteres. É obrigatório.
   - **Imagem**: envie o arquivo.
   - **Ordem**: número que define a posição (10, 20, 30...).
   - **Data**: data de publicação, usada como desempate.
   - **Publicada**: ligada para aparecer no site.
4. Publique e aguarde o workflow **Deploy** terminar.

### Preparar a imagem

- Exporte do Lightroom com o lado maior de **2400 px** e qualidade **~80**.
- Use JPG, PNG ou WebP.
- Mantenha o arquivo abaixo de **10 MB**.
- O site gera automaticamente as versões otimizadas; você não precisa redimensionar para a web.

## Editar a descrição de uma categoria

1. Abra **Portfólio** e escolha a categoria.
2. Altere **Descrição curta** (até 160 caracteres).
3. Publique.

O campo **Ativa** aparece somente para leitura e permanece ligado: as cinco categorias fazem parte da
estrutura do site nesta versão. Não é possível ocultar ou criar uma sexta categoria pelo painel.

## Editar a página inicial

1. Abra **Página inicial** no menu do Pages CMS.
2. Ajuste os campos:
   - **Título do destaque**: a frase principal da home (até 80 caracteres).
   - **Frase de apresentação**: resume o trabalho em uma ou duas frases (até 240 caracteres).
   - **Foto de destaque**: envie o arquivo. A imagem fica em `content/home/images/`.
   - **Texto alternativo da foto**: descreva a foto atual para quem não pode vê-la (até 160
     caracteres). Não deixe o texto da imagem anterior.
   - **Categorias em destaque**: selecione exatamente **três** categorias. A ordem dos cartões segue
     a ordem do portfólio (10, 20, 30...), não a ordem do clique.
   - **Título da seção sobre a Faby**: até 60 caracteres.
   - **Resumo sobre a Faby**: até 400 caracteres. O texto completo fica na página Sobre.
3. Publique e aguarde o workflow **Deploy** terminar.

A foto do hero precisa ter largura e altura de pelo menos **2400 px**. O texto alternativo não pode
descrever a foto provisória antiga.

## Editar a página Sobre

1. Abra **Sobre** no menu do Pages CMS.
2. Ajuste:
   - **Título**: aparece como título principal da página.
   - **Introdução**: primeiro parágrafo curto, até 240 caracteres.
   - **Texto de apresentação**: editor de texto formatado com o texto completo da Faby. O conteúdo é
     gravado abaixo do frontmatter e o Astro o renderiza como Markdown.
   - **Retrato** e **Texto alternativo do retrato**: opcionais; se houver retrato, o texto
     alternativo é obrigatório.
   - **Atualizado em**: data exibida ao final da página.
3. Publique e aguarde o workflow **Deploy** terminar.

## Reordenar

Altere o campo **Ordem** das fotos ou das categorias. Números menores aparecem primeiro. Use
intervalos (10, 20, 30) para inserir itens depois sem renumerar tudo.

## Remover

- **Foto**: abra a categoria, localize o item em **Fotos** e exclua. Depois, se quiser, apague a
  imagem original pela seção de mídia da categoria.
- **Categoria**: não exclua. As cinco pastas são fixas; para trocar o conteúdo, edite a descrição ou
  remova as fotos.

## Se o workflow falhar

Abra a aba **Actions** do repositório e veja a mensagem do workflow **Deploy**.

| Mensagem | O que fazer |
|---|---|
| `original acima de 10 MB` | Exporte a imagem menor e envie novamente. |
| `formato não suportado` | Use JPG, PNG ou WebP. |
| `texto alternativo é obrigatório` | Preencha o campo **Texto alternativo**. |
| `A foto do hero precisa ter largura e altura de pelo menos 2400 px` | Envie a foto aprovada em alta resolução. |
| `heroAlt ainda descreve a foto provisória` | Atualize o texto alternativo para a foto atual. |
| `a foto do hero ainda é o placeholder provisório` | Substitua pela foto real aprovada. |
| `"active" deve ser sempre true nesta versão` | Não desligue **Ativa**; avise o responsável técnico. |
| `Esperadas exatamente 5 categorias ativas` | Uma pasta foi removida ou renomeada; restaure a estrutura. |
| `O texto de apresentação da página Sobre é obrigatório` | Preencha o campo **Texto de apresentação**. |
| `Categoria em destaque inexistente ou inativa` | Escolha uma das cinco categorias existentes. |
| `As categorias em destaque não podem se repetir` | Remova a categoria repetida. |

Depois de corrigir, publique novamente. O site continua no ar com a versão anterior até o novo
deploy terminar.

## Validação do fluxo

A configuração do painel para as cinco pastas, a home e a Sobre foi validada por build local com o
mesmo formato que o Pages CMS grava. A execução do cenário completo no painel real — foto de teste,
edição do corpo da Sobre, deploy e recusa de foto sem `alt` — depende de acesso ao Pages CMS e está
registrada como pendência em [`docs/validation.md`](./validation.md).

Atenção: excluir um item da lista **Fotos** não apaga automaticamente o arquivo original em
`content/portfolio/<slug>/imagens/`. Para limpar o repositório, exclua também a imagem pela seção de
mídia da categoria.
