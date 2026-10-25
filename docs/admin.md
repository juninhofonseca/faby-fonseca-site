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
