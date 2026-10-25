# Guia de Validação — Galeria de Portfólio

**Feature**: `002-portfolio-gallery` | **Data**: 2026-10-25

Guia para provar, de ponta a ponta, que a galeria atende à especificação. Não contém código de
implementação; os detalhes de formato estão em [contracts/](./contracts/) e
[data-model.md](./data-model.md).

## Pré-requisitos

- Node.js 24 LTS e npm 10+.
- Git com acesso ao repositório `juninhofonseca/faby-fonseca-site`.
- Repositório público no GitHub com Pages habilitado (Settings → Pages → GitHub Actions).
- Conta no Pages CMS com o aplicativo autorizado no repositório.
- Navegador moderno e, para os testes, Playwright instalado.

## Instalação e execução

```bash
npm install
npm run dev          # servidor local em http://localhost:4321
```

O build de produção e as verificações:

```bash
npm run check:images   # valida originais e variantes (≤ 300 KB na grade)
npm run build          # gera o site estático em dist/
npm run preview        # serve o build localmente
```

Testes automatizados:

```bash
npm run test:e2e        # Playwright: galeria, lightbox, CTA, responsividade
npm run test:a11y       # axe-core na página de portfólio
npm run test:lighthouse # Lighthouse CI em modo mobile com throttling 4G
```

## Cenário 1 — Navegar por categoria

**História 1 · FR-001 a FR-003**

1. Abrir `/portfolio/`.
2. Confirmar que as categorias ativas aparecem na ordem definida.
3. Selecionar "Casamentos".
4. Confirmar que apenas fotos de casamentos aparecem, sem recarregar a página.
5. Confirmar que a URL passa a ser `/portfolio/?categoria=casamentos`.
6. Reduzir a janela para 360 px e repetir.

**Resultado esperado**: grade filtrada, sem recarregamento, URL compartilhável, sem rolagem
horizontal em 360, 768 e 1280 px. Ao abrir a URL diretamente em outra aba, a mesma categoria é
exibida (resolução no cliente). Com JavaScript desabilitado, todas as categorias são exibidas em
sequência, mantendo o conteúdo acessível.

## Cenário 2 — Visualizar e navegar entre fotos

**História 2 · FR-007 a FR-010**

1. Em uma categoria com pelo menos três fotos, abrir a segunda foto.
2. Confirmar que a mesma foto aparece ampliada e que a posição é anunciada ("Foto 2 de N").
3. Pressionar `ArrowRight` até a última foto e mais uma vez (deve voltar à primeira).
4. Pressionar `ArrowLeft` e confirmar o ciclo no sentido inverso.
5. Pressionar `Esc`; confirmar que o foco volta ao cartão de origem.
6. Repetir a abertura e fechar pelo botão "Fechar".
7. Repetir todo o fluxo usando apenas `Tab`, `Shift+Tab`, `Enter`, setas e `Esc`.

**Resultado esperado**: navegação circular dentro da categoria, foco preso ao diálogo, retorno de
foco correto e nenhuma armadilha de teclado.

## Cenário 3 — Solicitar orçamento da categoria

**História 3 · FR-011, FR-012**

1. Selecionar "Newborn" no portfólio.
2. Acionar "Quero um orçamento desta categoria".
3. Confirmar que a página de contato abre com "Newborn" selecionado.
4. Trocar a categoria no seletor e confirmar que a alteração é aceita.
5. Acessar `/contato/` diretamente e confirmar que o seletor abre sem seleção.

**Resultado esperado**: URL `/contato/?categoria=newborn`, opção marcada, alteração permitida e
nenhum dado pessoal na URL. O envio do formulário e o consentimento LGPD pertencem à feature de
contato e não são validados aqui.

## Cenário 4 — Publicar conteúdo pelo painel

**História 4 · FR-013 a FR-017**

1. Entrar no Pages CMS e abrir a coleção "Fotos".
2. Criar uma foto com título, texto alternativo, categoria, ordem e data.
3. Enviar uma imagem JPG exportada com lado maior de 2400 px e menos de 10 MB.
4. Salvar e publicar; aguardar o workflow de deploy.
5. Abrir a galeria e confirmar a foto na posição definida.
6. Remover a foto pelo painel e confirmar que ela deixa de aparecer após o deploy.
7. Tentar enviar um arquivo `.gif` (deve ser recusado pela restrição de extensões).
8. Tentar publicar um original acima de 10 MB (o workflow deve falhar com mensagem indicando o
   arquivo e o limite).

**Resultado esperado**: publicação e remoção sem editar código, ordem respeitada e recusa de
formatos não suportados. O limite de tamanho é aplicado no fluxo de publicação (ver
research.md, seção 11).

## Cenário 5 — Desempenho e orçamento de imagens

1. Rodar `npm run build && npm run check:images`.
2. Confirmar que o script não aponta nenhuma variante de grade acima de 300 KB.
3. Rodar `npm run test:lighthouse` com throttling mobile 4G.
4. Confirmar LCP < 3 s, CLS < 0,1 e nenhuma regressão de acessibilidade.
5. No navegador, simular 4G e recarregar a página de portfólio; confirmar que as primeiras fotos
   aparecem rapidamente e as demais carregam ao rolar.

**Resultado esperado**: orçamento de imagem respeitado, metas da constituição atingidas e
carregamento preguiçoso perceptível.

## Cenário 6 — Acessibilidade

1. Rodar `npm run test:a11y` e confirmar zero violações críticas.
2. Navegar pela página apenas com teclado, do topo até o CTA de orçamento.
3. Verificar contraste de textos e botões com uma ferramenta de inspeção.
4. Verificar que toda foto tem texto alternativo significativo.
5. Ampliar o zoom para 200% e confirmar que nada é cortado.

**Resultado esperado**: foco visível, ordem lógica, contraste AA, alternativos presentes e layout
íntegro com zoom.

## Critérios de aceite da feature

- [ ] Galeria funciona em celular (360 px) e desktop (1280 px+) sem rolagem horizontal.
- [ ] Nenhuma imagem da grade acima de 300 KB.
- [ ] Navegação completa apenas pelo teclado, incluindo lightbox.
- [ ] Filtro por categoria sem recarregar e com URL compartilhável.
- [ ] CTA leva ao contato com a categoria correta pré-selecionada.
- [ ] Publicação e remoção de fotos pelo Pages CMS sem editar código.
- [ ] LCP < 3 s em 4G e zero violações críticas de acessibilidade.
