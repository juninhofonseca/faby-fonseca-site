# Guia de Validação — Home com Foto de Destaque e Instagram

**Feature**: `004-home-destaque` | **Data**: 2026-10-25

Guia para provar, de ponta a ponta, que a home atende à especificação. Os detalhes de formato estão
em [contracts/](./contracts/) e [data-model.md](./data-model.md).

## Pré-requisitos

- Node.js 24 LTS e npm 10+.
- Dependências instaladas (`npm install`).
- Navegador moderno e Playwright instalado.
- Acesso ao Pages CMS com o repositório autorizado, para o cenário de edição manual.
- Acesso ao repositório no GitHub, para conferir o deploy.

## Instalação e execução

```bash
npm install
npm run dev          # http://localhost:4321
```

Build e verificações:

```bash
npm run validate:content   # conteúdo da home, categorias e imagens
npm run test:content       # regras unitárias
npm run check              # tipos e Astro
npm run build              # gera dist/ e verifica o orçamento de imagens
npm run preview            # serve o build
```

Testes automatizados:

```bash
npm run test:e2e           # home, galeria, contato, acessibilidade
npm run test:a11y          # axe-core, incluindo /
npm run test:lighthouse    # Lighthouse CI, incluindo /
```

## Cenário 1 — Primeira impressão e conversão

**História 1 · FR-001 a FR-003**

1. Abrir `/` em uma janela de 360 px.
2. Confirmar o título principal, a frase de apresentação e a foto de destaque.
3. Acionar "Ver portfólio" e confirmar o destino.
4. Voltar e acionar "Solicitar orçamento" e confirmar o destino.
5. Repetir em 768 px e 1280 px.

**Resultado esperado**: a foto e a proposta ficam claras na primeira tela; os dois caminhos levam a
`/portfolio/` e `/contato/`; nenhuma rolagem horizontal.

## Cenário 2 — Categorias em destaque

**História 2 · FR-004 a FR-006**

1. Na home, contar os cartões de categoria: devem ser exatamente três.
2. Confirmar nome, descrição e convite em cada um.
3. Abrir "Casamentos" e confirmar `/portfolio/?categoria=casamentos` com a categoria ativa.
4. Repetir para as outras duas categorias.
5. Desativar temporariamente uma categoria em destaque no conteúdo e rodar
   `npm run validate:content`; confirmar a mensagem de erro.
6. Reativar a categoria e confirmar que a validação volta a passar.
7. Remover as fotos de uma categoria em destaque (ou usar uma categoria vazia) e confirmar que o
   cartão continua sem imagem, sem quebrar o layout.

**Resultado esperado**: três cartões, links corretos, miniatura quando há foto, fallback de texto
quando não há, e validação bloqueando categoria inválida.

## Cenário 3 — Apresentação e Instagram

**História 3 · FR-007 a FR-009**

1. Rolar até a seção sobre a Faby e ler o texto.
2. Acionar o link do Instagram na home.
3. Confirmar que o perfil `@faby.fonseca.fotografia` abre em nova aba.
4. Abrir `/portfolio/` e `/contato/` e conferir o link **Instagram** no rodapé.
5. Confirmar que o link tem `rel="noopener noreferrer"` e que não há iframe nem script do Instagram.

**Resultado esperado**: texto curto e legível, link correto na home e no rodapé de todas as páginas,
sem conteúdo embutido nem rastreamento.

## Cenário 4 — Editar a home pelo Pages CMS

**História 4 · FR-010, FR-011**

1. Entrar no Pages CMS e abrir **Página inicial**.
2. Alterar o título do destaque e a frase de apresentação; publicar.
3. Enviar uma nova foto de destaque (JPG, lado maior de 2400 px, até 10 MB) e atualizar o texto
   alternativo; publicar.
4. Selecionar exatamente três categorias ativas em **Categorias em destaque**, mudando a ordem;
   publicar.
5. Alterar o texto sobre a Faby; publicar.
6. Aguardar o workflow **Deploy** e conferir cada mudança em `/`.
7. Tentar selecionar uma categoria inativa e publicar; confirmar que o deploy falha com mensagem
   clara e que o site anterior continua no ar.
8. Reverter para a configuração válida.

**Resultado esperado**: todas as mudanças aparecem sem editar código, na ordem escolhida, e uma
configuração inválida é recusada com mensagem útil.

**Observação**: a foto enviada neste cenário é de teste. Apagar a imagem de teste do repositório e
do painel depois da validação, mantendo o placeholder ou a foto real definitiva.

## Cenário 5 — Desempenho e imagens

1. Rodar `npm run build && npm run check:images`.
2. Confirmar que os originais de `content/home/images/` são verificados.
3. Confirmar que nenhuma variante de grade passa de 300 KB.
4. Rodar `npm run test:lighthouse` e conferir `/` na tabela.
5. Confirmar LCP < 3 s, CLS < 0,1, acessibilidade 100 e desempenho ≥ 90.
6. No navegador, simular 4G e recarregar `/`; confirmar que a foto de destaque aparece antes das
   miniaturas.

**Resultado esperado**: metas da constituição atingidas, hero prioritário e miniaturas sob demanda.

## Cenário 6 — Acessibilidade e responsividade

1. Rodar `npm run test:a11y` e confirmar zero violações.
2. Navegar pela home apenas com `Tab`, `Shift+Tab` e `Enter`.
3. Confirmar foco visível nos dois botões, nos três cartões e no link do Instagram.
4. Ampliar o zoom para 200% e confirmar que nada é cortado.
5. Confirmar que toda imagem tem texto alternativo e que os cartões têm `h3` sob o `h2` da seção.
6. Repetir em 360, 768 e 1280 px.

**Resultado esperado**: hierarquia correta, foco visível, contraste AA, alvos ≥ 44 px e layout
íntegro com zoom.

## Critérios de aceite da feature

- [ ] Home com foto de destaque, título, frase e dois caminhos (portfólio e orçamento).
- [ ] Exatamente três categorias em destaque, com links corretos e fallback sem foto.
- [ ] Apresentação da Faby e link do Instagram na home e no rodapé de todas as páginas.
- [ ] Foto, textos e categorias editáveis pelo Pages CMS sem alteração de código.
- [ ] Validação de conteúdo recusa campos inválidos, imagem ausente e categoria inativa.
- [ ] `npm run check` sem erros.
- [ ] `npm run test:e2e` verde (desktop e mobile, incluindo axe e sem JavaScript).
- [ ] Lighthouse ≥ 90 de desempenho e 100 de acessibilidade em `/`.
- [ ] LCP < 3 s, CLS < 0,1 e nenhuma rolagem horizontal em 360, 768 e 1280 px.
- [ ] `docs/validation.md` atualizado com data, resultados e pendências.
