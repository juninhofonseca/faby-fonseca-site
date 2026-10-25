# Contrato de Navegação e Interação

**Feature**: `002-portfolio-gallery` | **Data**: 2026-10-25

Contrato observável por quem usa o site e por quem escreve testes automatizados. Vale para a
galeria, a visualização ampliada e o encaminhamento ao orçamento.

## Rotas

| Rota | Conteúdo |
|------|----------|
| `/` | Página inicial; link para o portfólio |
| `/portfolio/` | Galeria com navegação por categoria e visualização ampliada |
| `/contato/` | Formulário de contato; recebe a categoria pré-selecionada |

## Parâmetro de categoria

- Nome: `categoria`.
- Valores: `slug` de uma categoria ativa (`casamentos`, `ensaios`, `familia`, `newborn`,
  `eventos`).
- Exemplo: `/portfolio/?categoria=casamentos`.
- Ausência do parâmetro: a primeira categoria ativa por `order` é exibida.
- Valor inválido ou de categoria oculta: ignorado; a primeira categoria ativa é exibida.
- A URL é a única fonte de verdade da categoria ativa; não há estado em `localStorage` nem cookie.
- O site é estático: o build não lê query string, então a resolução do parâmetro acontece no
  cliente, no primeiro carregamento. A URL continua compartilhável entre navegadores com
  JavaScript.

## Links de categoria

- Cada item da navegação é um `<a>` real com `href="/portfolio/?categoria=<slug>"`.
- Com JavaScript: o clique é interceptado, a grade é atualizada sem recarregar e a URL muda via
  `history.pushState` (o botão voltar retorna à categoria anterior).
- Sem JavaScript: o link recarrega a página e todas as categorias são exibidas em sequência, para
  que o conteúdo continue acessível em hospedagem estática (o build não lê query string).
- O item ativo recebe `aria-current="page"`.

## Cartão de foto

- Cada foto é um `<a>` cujo `href` aponta para a variante ampliada.
- Com JavaScript: o clique abre o `<dialog>` e impede a navegação.
- Sem JavaScript: o link abre a imagem ampliada diretamente.
- A imagem da grade tem `alt` do conteúdo, `width`/`height` explícitos e `loading="lazy"` (exceto
  as primeiras posições visíveis, que podem ser `eager` para preservar o LCP).
- O cartão é focável e responde a Enter e Espaço.

## Visualização ampliada

Elemento: `<dialog>` aberto com `showModal()`.

| Ação | Teclado | Mouse/toque | Resultado |
|------|---------|-------------|-----------|
| Abrir | Enter ou Espaço no cartão | Clique/toque no cartão | Diálogo abre na foto escolhida |
| Próxima | `ArrowRight` | Botão "Próxima" | Avança em ciclo dentro da categoria |
| Anterior | `ArrowLeft` | Botão "Anterior" | Retrocede em ciclo dentro da categoria |
| Fechar | `Esc` | Botão "Fechar" ou clique no fundo | Diálogo fecha e o foco volta ao cartão de origem |

**Regras de foco**

- Ao abrir, o foco vai para o botão "Fechar".
- `Tab` e `Shift+Tab` circulam apenas entre os controles do diálogo.
- Ao fechar, o foco retorna ao cartão que abriu a visualização.
- O conteúdo atrás do diálogo fica inerte enquanto ele está aberto.

**Anúncios para tecnologia assistiva**

- O diálogo tem `aria-labelledby` apontando para o título da foto.
- A posição é anunciada em uma região `aria-live="polite"` no formato "Foto 2 de 10".
- A imagem ampliada mantém o mesmo `alt` da grade.

**Movimento**

- Transições de abertura e troca respeitam `prefers-reduced-motion: reduce` (sem animação).

## Encaminhamento para orçamento

- O botão "Quero um orçamento desta categoria" é um `<a>` com
  `href="/contato/?categoria=<slug>"`.
- A página de contato lê o parâmetro, valida contra as categorias ativas e marca a opção
  correspondente no seletor (no cliente, já que o build é estático).
- Parâmetro inválido: o seletor abre sem opção marcada.
- O visitante pode trocar a categoria antes de enviar.
- Nenhum dado pessoal é transportado na URL.

## Estados vazios e de erro

| Situação | Comportamento |
|----------|---------------|
| Categoria sem fotos | Mensagem "Em breve novas fotos nesta categoria" e navegação preservada |
| Nenhuma categoria ativa | Estado vazio explicativo na página de portfólio |
| Falha ao carregar uma imagem | `alt` e espaço reservado permanecem visíveis; demais fotos seguem navegáveis |
| Foto removida com o diálogo aberto | Diálogo fecha com segurança, sem erro no console |

## Acessibilidade mínima verificada

- Contraste AA em textos e controles.
- Foco visível em todos os elementos interativos.
- Alvos de toque ≥ 44 × 44 px.
- Nenhuma informação transmitida apenas por cor.
- Ordem de cabeçalhos consistente (um `h1` por página).
