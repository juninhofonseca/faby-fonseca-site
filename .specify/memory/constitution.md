# Constituição - Faby Fonseca Fotografia

## Princípios Fundamentais

### I. Idioma e Conteúdo em Português do Brasil

Todo conteúdo entregue ao visitante DEVE estar em português do Brasil: textos de interface,
mensagens de erro e confirmação, textos alternativos de imagens, metadados e comunicações
geradas pelo site. Identificadores de código, nomes de arquivos técnicos e bibliotecas podem
permanecer em inglês. Nomes de categorias, serviços e descrições de pacotes DEVEM refletir a
forma como a Faby comunica seu trabalho, não traduções literais.

**Racional**: o público-alvo é brasileiro e a clareza do idioma reduz atrito comercial,
transmite profissionalismo e evita interpretações ambíguas em orçamentos.

### II. Mobile First

O projeto DEVE ser concebido, implementado e validado primeiro para telas móveis (a partir de
360 px de largura) e só então ampliado para tablets e desktops. Toda funcionalidade DEVE estar
completa e utilizável no celular — não apenas acessível. Layouts DEVEM usar breakpoints
progressivos e alvos de toque com no mínimo 44 × 44 px. Nenhuma informação ou ação pode existir
apenas em telas grandes.

**Racional**: a maioria dos visitantes chega pelo celular, frequentemente por links do
Instagram; uma experiência móvel incompleta compromete diretamente a conversão em orçamentos.

### III. Desempenho

Imagens DEVEM ser servidas em WebP (com fallback quando necessário), em tamanhos responsivos
via `srcset`/`sizes`, com dimensões explícitas para evitar deslocamento de layout e `loading="lazy"`
fora da dobra. A meta de desempenho é a página inicial carregar em menos de 3 segundos em rede
4G. CSS e JavaScript DEVEM ser mínimos, e nenhum recurso bloqueante pode ser adicionado sem
justificativa registrada no plano da feature.

**Racional**: portfólios fotográficos são pesados por natureza; sem disciplina de imagem e de
código o tempo de carregamento destrói a experiência e o posicionamento orgânico.

### IV. Acessibilidade

Toda imagem DEVE ter texto alternativo descritivo e significativo. A interface DEVE atender aos
critérios WCAG 2.1 nível AA aplicáveis: contraste mínimo de 4,5:1 para texto normal e 3:1 para
texto grande, navegação completa por teclado, foco visível, hierarquia correta de cabeçalhos,
rótulos associados a campos de formulário e mensagens de erro identificáveis por leitores de
tela. Conteúdo essencial não pode depender exclusivamente de cor.

**Racional**: acessibilidade amplia o alcance do site, melhora a experiência de todos os
visitantes e é requisito legal e ético para um serviço profissional.

### V. Simplicidade e Dependências

A solução DEVE priorizar HTML, CSS e JavaScript simples. É permitido no máximo um framework
leve, e sua adoção DEVE ser justificada por necessidade concreta registrada no plano. Toda
dependência adicionada DEVE ter manutenção ativa, licença compatível e impacto de tamanho
conhecido. Dependências, estilos e scripts não utilizados DEVEM ser removidos.

**Racional**: menos dependências significam menos vulnerabilidade, manutenção mais barata e
carregamento mais rápido para um projeto de pequeno porte.

### VI. Custo e Hospedagem

A entrega DEVE ser compatível com hospedagem estática gratuita ou de baixo custo, dentro do
orçamento de um MEI. Serviços com cobrança variável ou por uso DEVEM ser evitados; quando
inevitáveis, exigem aprovação explícita e limites de gasto definidos. O site DEVE funcionar em
HTTPS e o domínio DEVE ser próprio da marca.

**Racional**: o site é um canal de aquisição de clientes, não uma fonte de custo recorrente;
previsibilidade financeira é condição para a continuidade do projeto.

### VII. Privacidade e LGPD

O site DEVE coletar apenas os dados necessários para responder a uma solicitação de orçamento:
nome, telefone, e-mail, categoria de serviço e detalhes do evento. A finalidade da coleta DEVE
ser declarada no formulário e o consentimento registrado. Dados pessoais NÃO PODEM ser
versionados no repositório nem expostos no código do cliente. Formulários DEVEM usar serviços de
terceiros ou funções serverless com conformidade LGPD, e o visitante DEVE ter caminho claro para
solicitar correção ou exclusão dos seus dados.

**Racional**: dados de clientes são ativo sensível; o tratamento inadequado gera risco jurídico
e reputacional para a marca e para o MEI.

### VIII. Identidade de Marca

Cores, tipografia e tom de voz DEVEM ser formalizados e aprovados pela Faby antes da
implementação de qualquer interface definitiva. Enquanto não estiverem definidos, decisões
visuais são provisórias e DEVEM ser isoladas em variáveis de estilo para troca barata. A
fotografia é o elemento principal da interface; elementos gráficos e textos NÃO PODEM competir
com as imagens. A identidade DEVE permanecer consistente entre todas as páginas e canais.

**Racional**: a marca é o diferencial competitivo da fotógrafa; inconsistência visual reduz a
percepção de qualidade do trabalho exibido.

## Restrições Técnicas e Operacionais

- O site DEVE ser entregue como conteúdo estático (HTML, CSS e JavaScript) ou com funções
  serverless gratuitas para o formulário de orçamento; backend próprio dedicado não é
  justificável no escopo atual.
- Credenciais, chaves de API e tokens NUNCA PODEM ser commitados; DEVEM vir de variáveis de
  ambiente ou do painel do serviço utilizado.
- Conteúdo e imagens são fornecidos pela Faby Fonseca; o direito de uso das fotografias DEVE ser
  confirmado antes da publicação.
- Analytics, quando existir, DEVE ser orientado a privacidade (sem cookies de rastreamento
  entre sites) e informado na política de privacidade.
- O projeto DEVE ser versionado em Git, com commits descritivos e histórico legível.

## Fluxo de Desenvolvimento e Portões de Qualidade

- Toda feature DEVE seguir o fluxo Spec Kit: `/speckit.specify` → `/speckit.plan` →
  `/speckit.tasks` → `/speckit.implement`.
- Todo plano DEVE conter uma seção **Constitution Check**; violações a estes princípios exigem
  justificativa registrada e aprovação antes da implementação.
- Antes de considerar uma entrega concluída, ela DEVE ser verificada em viewports de 360 px,
  768 px e 1280 px, com navegação por teclado, contraste e textos alternativos revisados.
- A página inicial DEVE ser medida em 4G simulado; se a meta de 3 segundos não for atingida, a
  entrega não é considerada concluída.
- Textos novos DEVEM passar por revisão de português do Brasil e de tom de voz.
- Features que coletam dados pessoais DEVEM incluir checklist de privacidade e LGPD no plano.

## Governança

Esta constituição supersede quaisquer outras práticas, convenções ou preferências não
registradas. Em caso de conflito, o disposto aqui prevalece.

**Emendas**: qualquer alteração DEVE ser proposta com justificativa, aprovada pela Faby Fonseca
(ou responsável designado), registrada no Sync Impact Report e versionada em commit próprio.
Emendas que removam ou redefinam princípios exigem plano de migração para o que já foi
implementado.

**Versionamento**: a constituição segue Versionamento Semântico. MAJOR para remoção ou
redefinição incompatível de princípios ou governança; MINOR para novo princípio, nova seção ou
expansão material de orientação; PATCH para esclarecimentos, correções de redação e refinamentos
sem mudança de sentido. A versão e as datas DEVEM ser atualizadas no rodapé a cada emenda.

**Revisão de conformidade**: planos, tarefas e revisões de código DEVEM verificar aderência a
esta constituição. Complexidade adicional DEVE ser justificada contra o Princípio V. O descumprimento
identificado deve ser corrigido ou registrado como dívida explícita antes da entrega.

**Version**: 1.0.0 | **Ratified**: 2026-10-25 | **Last Amended**: 2026-10-25
