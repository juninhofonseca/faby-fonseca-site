# Pesquisa Técnica: Formulário de Contato com Envio e LGPD

**Funcionalidade**: [spec.md](./spec.md) | **Data**: 2026-10-25

Este documento registra as decisões técnicas da Fase 0, com as alternativas consideradas e o
motivo da escolha. Nenhuma decisão aqui altera o escopo aprovado na especificação.

## D1. Serviço de entrega das mensagens

**Decisão**: Web3Forms, plano gratuito, endpoint `https://api.web3forms.com/submit`.

| Critério | Web3Forms | Formspree | FormSubmit | mailto |
|---|---|---|---|---|
| Plano gratuito | 250 envios/mês | 50 envios/mês | Ilimitado, sem painel | — |
| Cadastro | Conta + chave | Conta + formulário | Confirmação por link | — |
| Uso em site estático | Sim | Sim | Sim | Sim |
| Histórico no painel | Sim | Sim | Não | Não |
| Dependência de runtime | Nenhuma (HTTP) | Nenhuma | Nenhuma | Cliente de e-mail |
| Experiência do visitante | Envio inline | Envio inline | Envio inline | Depende do app de e-mail |

**Racional**: 250 envios cobrem com folga o volume inicial de um estúdio de fotografia, o uso é
uma chamada HTTP simples (sem SDK), há painel para reenviar mensagens perdidas e o envio inline
não tira o visitante da página. O mailto foi descartado por perder o contato quando não há cliente
de e-mail configurado, o que é comum no celular.

**Configuração necessária fora do repositório**: conta criada com o e-mail de destino e chave de
acesso. A restrição de domínio do Web3Forms é recurso PRO e fica fora do escopo do plano gratuito.

## D2. Transporte do envio

**Decisão**: aprimoramento progressivo — formulário nativo `POST` para a API, interceptado por
JavaScript que envia JSON via `fetch`.

- **Com JavaScript**: `fetch` com `Content-Type: application/json`, resposta lida como JSON,
  confirmação na própria página, sem recarregar.
- **Sem JavaScript**: `action="https://api.web3forms.com/submit" method="post"` com campos ocultos
  `access_key` e `redirect` para `…/contato/enviado/` (URL absoluta, exigência do plano gratuito).
  A confirmação é uma página estática: a saída do Astro não lê query string no build.

**Racional**: atende FR-016 sem duplicar a lógica de envio. O plano gratuito do Web3Forms permite
redirecionar apenas para o mesmo domínio, o que é exatamente o caso.

## D3. Chave de acesso e variáveis de ambiente

**Decisão**: `PUBLIC_WEB3FORMS_KEY` injetada no build; no GitHub Actions vem da variável de
repositório `WEB3FORMS_KEY`.

- `src/lib/contact.ts` lê `import.meta.env.PUBLIC_WEB3FORMS_KEY`.
- `.env` local (já ignorado pelo `.gitignore`) guarda a chave para desenvolvimento e validação.
- `.env.example` documenta o nome da variável, sem valor.
- O workflow mapeia `PUBLIC_WEB3FORMS_KEY: ${{ vars.WEB3FORMS_KEY }}` nos passos de build.

**Análise de segurança**: a chave do Web3Forms é pública por projeto — ela aparece no HTML de
qualquer site que usa o serviço e só permite enviar mensagens para o endereço cadastrado, sujeitas
a limite e filtro de spam. Ainda assim:

- nenhuma chave real é versionada (apenas a referência à variável);
- a restrição de domínio do painel é recurso PRO; no plano gratuito valem honeypot, tempo mínimo e
  filtro antispam do serviço;
- se a chave vazar e virar fonte de spam, ela é rotacionada no painel sem alteração de código.

Quando a chave estiver ausente no build, a página entra em **modo de contato direto**: mostra
e-mail e WhatsApp em vez de um formulário que não envia (FR-020).

## D4. Proteção antispam

**Decisão**: três camadas passivas, sem interação do visitante.

1. `botcheck` — campo oculto nativo do Web3Forms, que descarta envios automatizados.
2. `website` — segundo campo oculto, com `tabindex="-1"` e `aria-hidden="true"`, para capturar
   robôs que preenchem todos os inputs.
3. Tempo mínimo — envios em menos de 3 segundos após o carregamento são descartados no cliente.

**Racional**: atende FR-015 e a História 4 sem adicionar script de terceiros, cookie ou etapa
visual. hCaptcha foi descartado nesta versão por custo de atenção, dependência externa e impacto
em privacidade; fica como alternativa caso o spam apareça (registrado no plano).

**Tratamento do falso positivo**: o tempo mínimo é medido desde o carregamento da página e nunca
bloqueia um preenchimento real; se disparar, a mensagem pede para tentar novamente, preservando os
dados.

## D5. Validação dos campos

**Decisão**: restrições HTML nativas (`required`, `type`, `maxlength`, `pattern`) + validação
TypeScript própria, sem biblioteca.

| Campo | Regra |
|---|---|
| `name` | obrigatório, 2 a 100 caracteres após remover espaços nas pontas |
| `phone` | obrigatório, 10 a 13 dígitos após normalizar (DDD + número, com ou sem `+55`) |
| `email` | obrigatório, formato válido e até 254 caracteres |
| `category` | obrigatório, um dos slugs ativos |
| `details` | obrigatório, 10 a 1000 caracteres |
| `consent` | obrigatório, marcado pelo visitante |

Mensagens de erro em pt-BR, específicas por campo, com `aria-describedby` e `aria-invalid`. O foco
vai para o primeiro campo inválido ao enviar. A API repete a validação do lado do serviço.

**Racional**: evita dependência, mantém o formulário leve e cumpre FR-003 e FR-017. O limite de
1000 caracteres protege a legibilidade do e-mail e evita abuso.

## D6. Estados de envio e acessibilidade

**Decisão**: estados explícitos em regiões `aria-live`.

- **Enviando**: botão desabilitado, `aria-busy="true"`, texto "Enviando…", sem segundo envio.
- **Sucesso**: painel `role="status"` com título focável, formulário limpo e foco movido para o
  painel.
- **Erro**: painel `role="alert"`, campos preservados, links de e-mail e WhatsApp em destaque.
- **Falha de rede/timeout**: mesma apresentação do erro, com `AbortController` de 15 segundos.

**Racional**: cumpre FR-006, FR-008 e FR-018; evita o padrão de "nada acontece" que gera envio
duplicado.

## D7. Tratamento de dados pessoais

**Decisão**: os dados existem apenas no corpo da requisição e no e-mail entregue.

- Nada é gravado em `localStorage`, `sessionStorage`, cookies, URL ou logs do navegador.
- O site não usa analytics, pixel ou cookie.
- O e-mail recebido é a única cópia, na caixa da Faby, com `replyto` igual ao e-mail informado.
- A política de privacidade declara o Web3Forms como operador e informa retenção de 12 meses após
  o último contato, além dos direitos do titular e o canal para exercê-los.

**Racional**: cumpre o Princípio VII da constituição com o menor volume de dados possível e sem
criar base própria.

## D8. Versionamento do aviso de consentimento

**Decisão**: constante `PRIVACY_VERSION` em `src/lib/contact.ts`, enviada em campo oculto a cada
pedido, junto de `consent_at` (ISO 8601, preenchido no envio).

Quando o texto da política mudar de forma relevante, a versão é incrementada e a data de vigência
atualizada na página. Pedidos antigos continuam rastreáveis à versão aceita.

**Racional**: atende FR-010 sem banco de dados; o próprio e-mail é o registro.

## D9. Estratégia de testes

**Decisão**: Playwright intercepta `https://api.web3forms.com/submit` com `page.route`, simulando
sucesso, erro HTTP e falha de rede. Nenhuma chave real é usada no CI.

- Testes de formulário cobrem: envio válido, consentimento ausente, e-mail inválido, honeypot
  preenchido, erro da API, dados preservados e ausência de persistência no navegador.
- Teste sem JavaScript verifica o `action` nativo, os campos ocultos e o redirecionamento.
- axe-core roda em `/contato/` e `/privacidade/`.
- Lighthouse CI inclui `/contato/` e `/privacidade/`.

**Validação manual** com a chave real é feita uma vez, localmente, antes do deploy (ver
`quickstart.md`).

## D10. Retenção e direitos do titular

**Decisão**: retenção de 12 meses após o último contato; exclusão a pedido em até 15 dias.

O pedido é feito pelo mesmo e-mail usado no formulário ou pelo WhatsApp publicado no site. Como
não há base própria, a exclusão consiste em apagar a mensagem da caixa de entrada e eventuais
cópias de backup do provedor de e-mail. A política descreve esse caminho em linguagem simples.

**Racional**: prazo compatível com o ciclo comercial de um estúdio e com o art. 19 da LGPD, sem
infraestrutura adicional.
