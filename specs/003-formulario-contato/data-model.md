# Modelo de Dados: Formulário de Contato com Envio e LGPD

**Funcionalidade**: [spec.md](./spec.md) | **Plano**: [plan.md](./plan.md) | **Data**: 2026-10-25

A funcionalidade **não cria banco de dados**. As entidades abaixo descrevem o formato dos dados em
trânsito, as validações e o ciclo de vida de cada informação.

## Entidade: Solicitação de Orçamento

Representa um pedido enviado pelo visitante. Existe apenas na requisição HTTP e na mensagem de
e-mail entregue à Faby. Não é persistida pelo site.

| Campo | Origem | Tipo | Obrigatório | Validação | Observações |
|---|---|---|---|---|---|
| `name` | formulário | texto | sim | 2–100 caracteres após `trim` | `autocomplete="name"` |
| `phone` | formulário | texto | sim | 10–13 dígitos após normalizar | aceita `+55`, espaços, parênteses e hífen |
| `email` | formulário | texto | sim | formato de e-mail, até 254 caracteres | usado como `replyto` |
| `category` | formulário | seleção | sim | slug de categoria ativa | vem pré-selecionado pela galeria |
| `details` | formulário | texto longo | sim | 10–1000 caracteres após `trim` | data, local e tipo de evento |
| `consent` | formulário | booleano | sim | precisa estar marcado | nunca pré-marcado |
| `consent_version` | sistema | texto | sim | versão vigente do aviso | ex.: `2026-10-25` |
| `consent_at` | sistema | data/hora | sim | ISO 8601 | preenchido no momento do envio |
| `source` | sistema | texto | não | `galeria:<slug>` ou `direto` | indica a origem da visita |

### Regras de normalização

- `name` e `details`: `String.prototype.trim()` antes de validar e enviar.
- `phone`: remove tudo que não for dígito; se começar com `55` e tiver 12 ou 13 dígitos, mantém o
  DDI; o valor enviado é o original aparado, para não perder a formatação escolhida pelo visitante.
- `email`: `trim` + minúsculas no domínio não são aplicados; o valor é enviado como digitado.

### Ciclo de vida

1. **Preenchimento** — os valores ficam apenas no DOM do formulário.
2. **Envio** — os valores vão no corpo da requisição para o Web3Forms.
3. **Entrega** — o serviço monta o e-mail e o encaminha ao endereço cadastrado.
4. **Pós-envio** — o formulário é limpo; nenhum valor permanece em memória persistente, URL,
   `localStorage`, `sessionStorage` ou cookies.
5. **Retenção** — a mensagem permanece na caixa de e-mail por até 12 meses após o último contato.
6. **Exclusão** — a pedido do titular, a mensagem é apagada da caixa e dos backups do provedor em
   até 15 dias.

## Entidade: Aviso de Privacidade

Representa o texto aceito no momento do consentimento.

| Campo | Onde vive | Exemplo |
|---|---|---|
| `version` | constante em `src/lib/contact.ts` | `2026-10-25` |
| `effectiveAt` | constante em `src/lib/contact.ts` | `2026-10-25` |
| `summary` | bloco do formulário | finalidade e link para a política |
| `policyPath` | rota | `/privacidade/` |

**Regra de versionamento**: qualquer mudança relevante em dados coletados, finalidade,
compartilhamento ou retenção exige nova `version` e atualização de `effectiveAt`. Mudanças de
redação sem efeito prático não exigem nova versão.

## Entidade: Configuração de Envio

| Item | Onde é configurado | Versionado? |
|---|---|---|
| Chave `PUBLIC_WEB3FORMS_KEY` | `.env` local e variável `WEB3FORMS_KEY` no GitHub | Não |
| E-mail de destino | painel do Web3Forms (conta criada com o endereço) | Não |
| Domínio autorizado | painel do Web3Forms | Não |
| Endpoint | constante no código | Sim |
| E-mail e WhatsApp públicos | `src/lib/contact.ts` | Sim |

## Estados do Formulário

```text
        ┌──────────┐  submit válido   ┌───────────┐  200 success   ┌─────────┐
        │  ocioso  │ ───────────────▶ │ enviando  │ ─────────────▶ │ sucesso │
        └──────────┘                  └───────────┘                └─────────┘
             ▲                             │
             │        erro/timeout         │
             └─────────────────────────────┘
                        (campos preservados)
```

- **ocioso**: formulário editável, botão habilitado.
- **enviando**: botão desabilitado, `aria-busy="true"`, sem novo envio.
- **sucesso**: painel `role="status"`, formulário limpo, foco no painel.
- **erro**: painel `role="alert"`, dados preservados, links de contato direto.

Estados nunca coexistem. Um novo envio só é possível a partir de `ocioso` ou `erro`.

## Contrato do Payload

```json
{
  "access_key": "<PUBLIC_WEB3FORMS_KEY>",
  "subject": "Novo pedido de orçamento — Casamentos — Maria Silva",
  "from_name": "Site Faby Fonseca",
  "name": "Maria Silva",
  "phone": "(11) 91234-5678",
  "email": "maria@exemplo.com",
  "category": "casamentos",
  "details": "Casamento em 12/09/2027, em São Paulo, cerca de 120 convidados.",
  "consent": "sim",
  "consent_version": "2026-10-25",
  "consent_at": "2026-10-25T18:42:11.000Z",
  "source": "galeria:casamentos"
}
```

- O honeypot `botcheck` fica no HTML do formulário (campo nativo do Web3Forms) e só é enviado no
  POST nativo; no envio por `fetch` ele nem entra no JSON.
- `website` é outro honeypot e também não compõe o payload.

- `replyto` é definido automaticamente pelo Web3Forms a partir do campo `email`.
- Campos vazios são omitidos do JSON pelo cliente.
- Nenhum campo adicional é coletado (FR-001).

## Respostas do Serviço

| Situação | HTTP | Corpo | Tratamento no cliente |
|---|---|---|---|
| Sucesso | 200 | `{ "success": true, "message": "..." }` | painel de sucesso, limpar formulário |
| Erro de validação | 400 | `{ "success": false, "message": "..." }` | painel de erro, dados preservados |
| Chave inválida/limite | 401/403/429 | `{ "success": false, "message": "..." }` | erro com contato direto |
| Falha do serviço | 5xx | texto ou HTML | erro com contato direto |
| Rede/timeout | — | — | erro com contato direto após 15 s |
