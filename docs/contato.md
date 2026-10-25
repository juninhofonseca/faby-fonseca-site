# Formulário de contato — guia de operação

Como os pedidos de orçamento chegam, como responder e o que fazer em cada situação. Escrito para
ser usado no dia a dia, sem precisar abrir código.

## Onde os pedidos chegam

Todo pedido enviado pelo formulário de `/contato/` chega como **e-mail** para
**juninho.fonseca@gmail.com**, o endereço cadastrado na conta do
[Web3Forms](https://web3forms.com/).

Não existe painel de pedidos no site, banco de dados nem cópia em outro lugar: a mensagem na caixa
de entrada é o único registro.

Cada e-mail traz:

- **Assunto** no formato `Novo pedido de orçamento — <Categoria> — <Nome>`.
- **Nome**, **telefone/WhatsApp**, **e-mail**, **categoria de interesse** e **detalhes do evento**.
- **Consentimento** (`sim`), a **versão do aviso de privacidade** aceita e a **data e hora** do envio.
- **Origem**: `direto` (veio da página de contato) ou `galeria:<categoria>` (chegou pelo botão do
  portfólio).
- **Responder para**: o e-mail informado pelo visitante, pronto no botão "Responder".

## Como responder

1. Abra o e-mail e confira nome, categoria e detalhes do evento.
2. Clique em **Responder** — a resposta vai direto para o visitante, não para o Web3Forms.
3. Responda em até **2 dias úteis**, prazo prometido na página.
4. Se o visitante pediu contato por WhatsApp, use o número informado no corpo do e-mail.

> Cuidado: se o visitante digitou um e-mail com erro, o botão "Responder" também aponta para o
> endereço errado. Nesse caso, use o telefone informado. O formulário valida o formato do e-mail,
> mas não é possível confirmar que a caixa existe.

## Prazo de retenção e limpeza

- As mensagens ficam na caixa por até **12 meses após o último contato**; depois disso devem ser
  apagadas.
- Pedidos já respondidos e sem contratação em andamento podem ser apagados antes, sem prejuízo.
- Uma rotina simples: uma vez por mês, apague as mensagens de pedidos encerrados com mais de 12
  meses e esvazie a lixeira do provedor de e-mail.

## Pedido de correção ou exclusão de dados

Quando alguém pedir para corrigir ou apagar os dados (por e-mail ou WhatsApp):

1. Confirme que o pedido veio do mesmo e-mail ou telefone usado no formulário. Se houver dúvida,
   peça o nome e o e-mail usados no envio.
2. Localize a mensagem na caixa de entrada pela busca do provedor.
3. **Exclusão**: apague a mensagem e esvazie a lixeira. Se o provedor mantiver backup, o prazo de
   expurgo é o do próprio serviço.
4. **Correção**: se o dado estiver errado, registre a correção na resposta ao titular; não é
   necessário manter uma cópia corrigida se o pedido for de exclusão.
5. Responda confirmando o que foi feito em até **15 dias**, prazo declarado na
   [política de privacidade](../src/pages/privacidade.astro).

Se o pedido vier por WhatsApp, vale pedir confirmação por escrito antes de apagar qualquer coisa.

## Limite mensal do Web3Forms

O plano gratuito permite **250 envios por mês**, renovados no ciclo da conta. O volume inicial do
site deve ficar muito abaixo disso.

Se o limite for atingido:

1. O visitante vê uma mensagem de erro com e-mail e WhatsApp como alternativa — o pedido **não** é
   apresentado como enviado.
2. Confira o consumo no painel do Web3Forms.
3. Se o volume justificar, faça upgrade do plano; se foi um pico isolado, o contato direto cobre o
   intervalo até a renovação.

Nunca altere a página para "fingir" envio quando o serviço estiver fora: o visitante precisa saber
que deve usar o e-mail ou o WhatsApp.

## Antispam — como funciona

Três camadas invisíveis para o visitante, sem captcha e sem cookie:

| Camada | O que faz |
|---|---|
| `botcheck` | Campo oculto nativo do Web3Forms. Robôs que marcam tudo são descartados pelo serviço. |
| `website` | Segundo campo oculto no formulário. Se vier preenchido, o envio é descartado no navegador, sem chamada de rede, e a página mostra sucesso para não revelar a proteção. |
| Tempo mínimo | Envios feitos menos de 3 segundos após abrir a página são recusados com pedido de nova tentativa. |

Quando um envio é descartado pelo honeypot, **nenhum e-mail chega** — é o comportamento esperado.

### Quando considerar hCaptcha

O honeypot e o tempo mínimo resolvem a maior parte dos robôs simples. Vale adicionar hCaptcha
(disponível no Web3Forms) se ocorrer algum destes sinais:

- spam recorrente chegando mesmo com as três camadas ativas;
- mensagens com links, propaganda ou texto aleatório em volume;
- picos de envio que consomem o limite mensal.

Antes de ativar, lembre que o hCaptcha adiciona um script de terceiros e uma etapa para o visitante:
isso afeta desempenho, privacidade e a política de privacidade, que precisa ser atualizada.

### Sobre restringir o domínio

A opção **Restrict to Domain** do Web3Forms (aceitar envios só de domínios autorizados) é um
**recurso PRO, pago** — não existe no plano gratuito. No plano gratuito, as proteções efetivas são
o honeypot, o tempo mínimo, o filtro antispam do próprio serviço e a rotação da chave:

- monitore o painel de envios e o consumo mensal;
- se aparecer spam, gere uma nova chave no painel, atualize o `.env` local e a variável
  `WEB3FORMS_KEY` no GitHub, e faça um novo deploy. A chave antiga para de funcionar na hora.

## Se o formulário sumir da página

A página de contato mostra o formulário somente quando a chave do Web3Forms está configurada no
build. Sem a chave, ela exibe e-mail e WhatsApp no lugar — de propósito, para não prometer um envio
que não funciona.

Se o formulário desaparecer depois de um deploy, confira:

1. A variável `WEB3FORMS_KEY` existe em **Settings → Secrets and variables → Actions → Variables**
   no GitHub (nome exato, sem `PUBLIC_`).
2. O workflow **Deploy** rodou depois da variável ser criada.
3. O valor da variável não está vazio nem com espaços.

Se o formulário aparece mas o envio falha, verifique no painel do Web3Forms se a chave está ativa e
se o limite de 250 envios do mês não foi atingido.

O passo a passo técnico está no [README](../README.md#formulário-de-contato).
