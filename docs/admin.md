# Guia da administradora — Pages CMS

Este guia explica como a Faby publica, reordena e remove fotos do portfólio sem programar.

## Acesso

1. Peça ao responsável técnico para convidar seu e-mail no Pages CMS.
2. Acesse <https://app.pagescms.org> e entre com o convite.
3. Autorize o aplicativo a acessar o repositório `juninhofonseca/faby-fonseca-site`.
4. Selecione o repositório e a branch `main`.

O site publicado é atualizado alguns minutos após cada publicação.

## Publicar uma categoria

1. Abra a coleção **Categorias**.
2. Crie uma entrada com:
   - **Nome**: como aparece no site (ex.: Casamentos).
   - **Slug**: versão curta sem acentos (ex.: `casamentos`). Não altere depois de publicada.
   - **Descrição curta**: até 160 caracteres.
   - **Ordem**: número que define a posição (10, 20, 30...).
   - **Ativa**: ligada para aparecer no site.
3. Publique.

## Publicar uma foto

1. Abra a coleção **Fotos** e crie uma entrada.
2. Preencha:
   - **Título interno**: identificação da foto (não aparece no site).
   - **Texto alternativo**: descrição objetiva da cena, até 160 caracteres. É obrigatório.
   - **Imagem**: envie o arquivo.
   - **Categoria**: selecione a categoria correspondente.
   - **Ordem na categoria**: número que define a posição (10, 20, 30...).
   - **Data de publicação**.
   - **Publicada**: ligada para aparecer no site.
3. Publique e aguarde o workflow de deploy terminar.

### Preparar a imagem

- Exporte do Lightroom com o lado maior de **2400 px** e qualidade **~80**.
- Use JPG, PNG ou WebP.
- Mantenha o arquivo abaixo de **10 MB**.
- O site gera automaticamente as versões otimizadas; você não precisa redimensionar para a web.

## Editar a página inicial

1. Abra **Página inicial** no menu do Pages CMS.
2. Ajuste os campos:
   - **Título do destaque**: a frase principal da home (até 80 caracteres).
   - **Frase de apresentação**: resume o trabalho em uma ou duas frases (até 240 caracteres).
   - **Foto de destaque**: envie o arquivo. A imagem fica em `content/home/images/`, separada das
     fotos do portfólio.
   - **Texto alternativo da foto**: descreva a **nova** foto para quem não pode vê-la (até 160
     caracteres). Não deixe o texto da imagem anterior.
   - **Categorias em destaque**: selecione exatamente **três** categorias ativas. A ordem dos
     cartões na home é a ordem da seleção.
   - **Título da seção sobre a Faby** e **Texto sobre a Faby**: a apresentação exibida depois das
     categorias. Deixe uma linha em branco entre parágrafos.
3. Publique e aguarde o workflow **Deploy** terminar.

O link do Instagram (`@faby.fonseca.fotografia`) é público e fixo no site: aparece na home e no
rodapé de todas as páginas. Para trocar o perfil, peça ao responsável técnico — é uma constante no
código, não um campo do painel.

### Erros comuns na página inicial

| Mensagem | O que fazer |
|---|---|
| `Escolha exatamente 3 categorias em destaque` | Selecione três categorias, nem mais nem menos. |
| `Categoria em destaque inexistente ou inativa` | Ative a categoria ou escolha outra que esteja ativa. |
| `As categorias em destaque não podem se repetir` | Remova a categoria repetida. |
| `"heroImage" é obrigatório` | Envie a foto de destaque novamente. |
| `arquivo de imagem não encontrado` | Verifique se a foto foi enviada e publicada na mídia da home. |
| `original acima de 10 MB` | Exporte a foto menor e envie novamente. |
| `texto alternativo é obrigatório` | Preencha o texto alternativo da foto. |

## Reordenar

Altere o campo **Ordem** das fotos ou categorias. Números menores aparecem primeiro. Use
intervalos (10, 20, 30) para inserir itens depois sem renumerar tudo.

## Remover

- **Foto**: abra a entrada na coleção **Fotos** e exclua. A imagem original pode ser removida
  depois, se desejar.
- **Categoria**: exclua a entrada somente se não houver fotos publicadas nela; caso contrário,
  desligue **Ativa** para ocultá-la.

## Se o workflow falhar

Abra a aba **Actions** do repositório e veja a mensagem do workflow **Deploy**.

| Mensagem | O que fazer |
|---|---|
| `original acima de 10 MB` | Exporte a imagem menor e envie novamente. |
| `formato não suportado` | Use JPG, PNG ou WebP. |
| `texto alternativo é obrigatório` | Preencha o campo **Texto alternativo**. |
| `Categoria inexistente` | Selecione uma categoria válida ou crie a categoria antes. |
| `Slug de categoria duplicado` | Use um slug único. |

Depois de corrigir, publique novamente. O site continua no ar com a versão anterior até o novo
deploy terminar.

## Validação do fluxo

Em 2026-10-25 o fluxo foi executado no Pages CMS real com uma foto de teste na categoria Ensaios:
a publicação (commits `994f434` e `57f24eb`) e a remoção (commit `150f72f`) funcionaram, com deploy
automático e site atualizado sem editar código.

Atenção: excluir a entrada da coleção **Fotos** não apaga o arquivo original em
`content/photos/images/`. Para limpar o repositório, exclua também a imagem pela seção de mídia
do painel.
