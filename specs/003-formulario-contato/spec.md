# Especificação da Funcionalidade: Formulário de Contato com Envio e LGPD

**Feature Branch**: `003-formulario-contato`

**Created**: 2026-10-25

**Status**: Rascunho

**Input**: Descrição do usuário: "Vamos para a próxima feature: formulário de contato com envio de orçamento e conformidade com a LGPD."

## Cenários de Usuário e Testes *(obrigatório)*

### História de Usuário 1 - Enviar um pedido de orçamento (Prioridade: P1)

Um visitante que viu o portfólio decide pedir um orçamento. Na página de contato ele preenche
nome, telefone, e-mail, categoria de interesse e os detalhes do evento, confirma que leu o aviso de
privacidade e envia. O formulário valida os campos, mostra o estado de envio e confirma o
recebimento sem recarregar a página.

**Por que esta prioridade**: é o objetivo comercial do site. Sem o envio, todo o portfólio serve
apenas como vitrine e o contato depende de o visitante copiar um e-mail.

**Teste independente**: preencher todos os campos obrigatórios, marcar o consentimento e enviar;
confirmar a mensagem de sucesso e a chegada do pedido ao e-mail da Faby.

**Cenários de aceite**:

1. **Dado** que o visitante preencheu os campos obrigatórios e marcou o consentimento, **quando**
   envia, **então** vê uma confirmação clara de que o pedido foi recebido e o formulário não é
   enviado duas vezes.
2. **Dado** que o visitante deixou um campo obrigatório vazio ou com formato inválido, **quando**
   tenta enviar, **então** cada campo com problema é identificado com uma mensagem específica e o
   foco vai para o primeiro deles, sem perder o que já foi digitado.
3. **Dado** que o visitante chegou pela galeria com uma categoria pré-selecionada, **quando** abre a
   página de contato, **então** a categoria aparece marcada e pode ser alterada antes do envio.
4. **Dado** que o envio falhou por rede ou por indisponibilidade do serviço, **quando** o erro
   ocorre, **então** o visitante vê uma mensagem com a alternativa de contato direto e o conteúdo
   digitado permanece no formulário.

---

### História de Usuário 2 - Entender e consentir com o uso dos dados (Prioridade: P1)

Antes de enviar, o visitante lê, em linguagem direta, quais dados são coletados, para que servem,
quem os recebe e como pedir correção ou exclusão, e marca um consentimento explícito. A política de
privacidade completa fica disponível em uma página própria, linkada no formulário e no rodapé.

**Por que esta prioridade**: a constituição do projeto exige finalidade declarada e consentimento
registrado. Enviar dados pessoais sem esse passo tornaria o formulário impróprio para uso real.

**Teste independente**: abrir a página de contato, ler o aviso, seguir o link da política, voltar e
confirmar que o envio só é permitido com o consentimento marcado.

**Cenários de aceite**:

1. **Dado** que o visitante está preenchendo o formulário, **quando** chega ao fim, **então** vê a
   finalidade da coleta e um link para a política de privacidade antes do botão de envio.
2. **Dado** que o consentimento não foi marcado, **quando** o visitante tenta enviar, **então** o
   envio é bloqueado com uma explicação clara e o foco vai para o consentimento.
3. **Dado** que o pedido foi enviado, **quando** a Faby o recebe, **então** o registro inclui a
   confirmação de consentimento, a versão do aviso aceito e a data e hora do envio.
4. **Dado** que o visitante quer corrigir ou excluir seus dados, **quando** procura essa informação,
   **então** encontra na política um canal direto e o prazo de resposta.

---

### História de Usuário 3 - Receber e responder o pedido (Prioridade: P2)

A Faby recebe o pedido por e-mail, com os dados organizados e legíveis, e consegue responder
diretamente ao visitante pelo botão "Responder", sem consultar nenhum painel nem banco de dados.

**Por que esta prioridade**: o valor do formulário só se concretiza quando a mensagem chega em
condições de ser respondida rapidamente. Depende da História 1.

**Teste independente**: enviar um pedido de teste e conferir no e-mail recebido o nome, contato,
categoria, detalhes, consentimento e o endereço de resposta correto.

**Cenários de aceite**:

1. **Dado** que um pedido foi enviado, **quando** a Faby abre o e-mail, **então** identifica
   facilmente o nome do visitante, a categoria e o contato, e consegue responder ao visitante com um
   clique.
2. **Dado** que o visitante informou um e-mail válido, **quando** a Faby responde, **então** a
   resposta vai para o endereço dele, e não para um endereço interno do serviço de envio.
3. **Dado** que o pedido chegou, **quando** a Faby o encaminha ou arquiva, **então** nenhum dado
   pessoal foi gravado no repositório do site nem no código entregue ao navegador.

---

### História de Usuário 4 - Evitar spam sem atrapalhar visitantes (Prioridade: P3)

Robôs que varrem formulários são barrados por proteções invisíveis para pessoas, de modo que a caixa
de entrada da Faby receba apenas pedidos reais, sem exigir que o visitante resolva desafios.

**Por que esta prioridade**: protege o canal comercial, mas não altera a experiência de quem envia
um pedido legítimo. Sem ela, o formulário funciona, porém fica suscetível a lixo.

**Teste independente**: simular um envio automatizado (campo oculto preenchido e envio imediato) e
confirmar que é descartado, mantendo o envio humano normal.

**Cenários de aceite**:

1. **Dado** que um robô preenche o campo oculto, **quando** envia, **então** o pedido é descartado
   sem gerar e-mail e sem revelar a proteção.
2. **Dado** que o formulário acabou de ser aberto, **quando** um envio ocorre rápido demais para ser
   humano, **então** o pedido é descartado.
3. **Dado** um visitante que usa leitor de tela ou teclado, **quando** preenche o formulário,
   **então** não encontra nenhuma etapa extra de verificação.

---

### Casos Limite

- **JavaScript desabilitado**: o formulário ainda envia por POST nativo e mostra o retorno do
  serviço; nenhum campo obrigatório some.
- **Falha de rede ou serviço fora do ar**: mensagem de erro com contato direto alternativo e campos
  preservados.
- **Clique duplo ou reenvio**: o botão entra em estado de envio e é bloqueado até a resposta.
- **Chave de envio ausente ou inválida no build**: o formulário é exibido em modo de contato direto,
  sem prometer um envio que não funciona.
- **Limite mensal do serviço atingido**: o erro é apresentado como falha temporária com o contato
  direto, nunca como sucesso.
- **Texto muito longo**: o campo de detalhes tem limite declarado e contador; o envio não quebra o
  layout do e-mail.
- **Visitante tenta enviar sem consentimento**: bloqueio com explicação, sem perder os dados.
- **Zoom de 200%, celular pequeno e leitor de tela**: rótulos, erros e mensagens continuam legíveis e
  associados aos campos.
- **Visitante volta pelo histórico após enviar**: não reenvia o pedido automaticamente.

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **FR-001**: O formulário deve coletar apenas nome, telefone, e-mail, categoria de serviço e
  detalhes do evento, conforme a constituição do projeto.
- **FR-002**: Nome, telefone, e-mail, categoria e consentimento são obrigatórios; os detalhes do
  evento são obrigatórios por serem necessários para orçar.
- **FR-003**: A validação deve ocorrer no navegador, com mensagens específicas por campo, antes de
  qualquer envio, e ser repetida no servidor de envio.
- **FR-004**: O envio deve ser feito por requisição ao serviço Web3Forms, sem recarregar a página,
  usando chave obtida de variável de ambiente no momento do build.
- **FR-005**: A chave de envio não pode ser versionada nem aparecer em código de exemplo com valor
  real; o repositório deve conter apenas a referência à variável.
- **FR-006**: O formulário deve exibir estado de envio, bloquear envios repetidos e apresentar
  confirmação ou erro de forma acessível (região anunciada por leitor de tela).
- **FR-007**: Em caso de sucesso, os dados digitados devem ser limpos da página e não podem ser
  gravados em URL, `localStorage`, cookies ou qualquer armazenamento do navegador.
- **FR-008**: Em caso de falha, os dados digitados devem permanecer no formulário e deve haver um
  caminho de contato direto (e-mail e/ou WhatsApp).
- **FR-009**: O formulário deve declarar a finalidade da coleta e exigir consentimento explícito,
  nunca pré-marcado, com link para a política de privacidade.
- **FR-010**: O pedido enviado deve registrar a confirmação de consentimento, a versão do aviso
  aceito e a data e hora do envio, junto aos dados informados.
- **FR-011**: O e-mail recebido deve trazer os dados em formato legível, assunto que identifique
  categoria e nome, e endereço de resposta igual ao e-mail do visitante.
- **FR-012**: Deve existir uma página de política de privacidade em `/privacidade/`, escrita em
  português do Brasil, cobrindo dados coletados, finalidade, base legal, compartilhamento com o
  serviço de envio, prazo de retenção, direitos do titular e canal para correção ou exclusão.
- **FR-013**: A política de privacidade deve estar linkada no formulário, no rodapé de todas as
  páginas e no aviso de consentimento.
- **FR-014**: Nenhum dado pessoal pode ser versionado no repositório, exposto em código do cliente,
  registrado em logs ou enviado a serviços não declarados na política.
- **FR-015**: O formulário deve conter proteção antispam por campo oculto e tempo mínimo de
  preenchimento, sem exigir interação do visitante.
- **FR-016**: O formulário deve funcionar sem JavaScript por meio de envio nativo ao serviço, e a
  versão com JavaScript deve apenas melhorar a experiência.
- **FR-017**: Todos os campos devem ter rótulo associado, indicação de obrigatoriedade, texto de
  apoio quando necessário e erros vinculados por `aria-describedby`.
- **FR-018**: O formulário deve ser integralmente operável por teclado, com foco visível e ordem de
  foco lógica, em conformidade com WCAG AA.
- **FR-019**: O formulário não deve carregar scripts de terceiros que atrasem a página; a meta de
  LCP abaixo de 3 segundos em 4G deve ser mantida.
- **FR-020**: Se a chave de envio não estiver configurada no build, a página deve apresentar o modo
  de contato direto, sem exibir um formulário que não envia.

### Entidades-Chave *(incluir se a funcionalidade envolver dados)*

- **Solicitação de orçamento**: pedido enviado pelo visitante. Atributos: nome, telefone, e-mail,
  categoria, detalhes do evento, consentimento (marcado, versão do aviso, data e hora) e origem do
  acesso. Existe apenas na mensagem entregue à Faby; não é armazenada pelo site.
- **Aviso de privacidade**: texto e versão apresentados ao visitante no momento do consentimento,
  com data de vigência, finalidade, compartilhamento e direitos do titular.
- **Configuração de envio**: chave do serviço e endereço de destino, mantidos fora do repositório e
  injetados no build.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: Um visitante consegue preencher e enviar um pedido completo em menos de 2 minutos, em
  uma única visita à página.
- **SC-002**: 100% dos envios resultam em confirmação explícita ou mensagem de erro com alternativa
  de contato; nenhum envio termina em silêncio.
- **SC-003**: Nenhum dado pessoal é encontrado no repositório, no HTML publicado, em `localStorage`,
  cookies ou URLs após o envio.
- **SC-004**: 100% dos pedidos recebidos contêm nome, contato, categoria, detalhes, consentimento e
  data e hora.
- **SC-005**: O formulário é concluído apenas com teclado e não apresenta violações críticas de
  acessibilidade em auditoria automatizada.
- **SC-006**: O formulário funciona com JavaScript desabilitado.
- **SC-007**: A página de contato mantém LCP abaixo de 3 segundos em 4G simulada e desempenho no
  Lighthouse igual ou superior a 90.
- **SC-008**: Envios automatizados de teste são descartados sem gerar e-mail, e nenhum envio humano
  de teste é bloqueado pelas proteções antispam.

## Fora de Escopo

- Banco de dados, CRM, painel de pedidos ou histórico no site.
- Resposta automática ao visitante.
- Anexos de arquivo no formulário.
- Agendamento de datas, pagamento ou emissão de contrato.
- Múltiplos destinatários ou cadastro de equipe.
- Desafios de captcha com interação.
- Integração com WhatsApp Business API (apenas link direto, se já existir no site).
- Analytics ou rastreamento de conversão nesta versão.

## Assunções

- O serviço de envio é o Web3Forms, no plano gratuito, com entrega no e-mail definido pela Faby.
- A chave do Web3Forms é publicável por natureza, mas será injetada por variável de ambiente no
  build (`PUBLIC_WEB3FORMS_KEY`), mantendo o repositório livre de configuração específica.
- O endereço de destino é o e-mail profissional da Faby e não aparece como texto no site, apenas no
  painel do serviço.
- A Faby é a controladora dos dados, na condição de MEI, e o canal de contato indicado na política é
  o mesmo e-mail usado para receber os pedidos.
- A versão do aviso de privacidade é mantida no código e incrementada manualmente quando o texto
  mudar.
- O limite de 250 envios mensais do plano gratuito é suficiente para o volume inicial do site.
- A proteção antispam por campo oculto e tempo mínimo é suficiente nesta versão; captcha fica como
  alternativa futura se o spam aparecer.
- Todo o conteúdo permanece em português do Brasil, conforme a constituição.
