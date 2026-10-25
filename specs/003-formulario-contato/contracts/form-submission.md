# Contrato: Formulário de Contato e Envio

**Funcionalidade**: 003-formulario-contato | **Data**: 2026-10-25

Este contrato fixa o que o HTML, o script e os testes podem assumir. Alterações aqui exigem
atualização de `src/components/ContactForm.astro`, `src/scripts/contact.client.ts` e dos testes.

## Marcação e ganchos de teste

| Seletor | Elemento | Contrato |
|---|---|---|
| `[data-contact-form]` | `<form>` | único formulário de orçamento da página |
| `[data-category-select]` | `<select name="category">` | valores iguais aos slugs das categorias ativas |
| `[data-category-note]` | `<p>` | texto auxiliar da categoria; `hidden` quando não há seleção |
| `[data-field="name"]` | `<input name="name">` | obrigatório |
| `[data-field="phone"]` | `<input name="phone">` | obrigatório |
| `[data-field="email"]` | `<input name="email">` | obrigatório |
| `[data-field="details"]` | `<textarea name="details">` | obrigatório, `maxlength="1000"` |
| `[data-field="consent"]` | `<input type="checkbox" name="consent">` | obrigatório, não pré-marcado |
| `[data-error-for="<campo>"]` | `<p>` | mensagem do campo, `id="erro-<campo>"` |
| `[data-form-status]` | `<div role="status">` | confirmação de sucesso |
| `[data-form-error]` | `<div role="alert">` | falha de envio com contato direto |
| `[data-submit]` | `<button type="submit">` | desabilitado durante o envio |
| `[data-direct-contact]` | `<section>` | modo sem chave configurada |
| `[data-honeypot="website"]` | `<input>` | oculto, `tabindex="-1"`, `aria-hidden="true"` |
| `[data-honeypot="botcheck"]` | `<input type="checkbox">` | oculto, nome nativo do Web3Forms |

## Campos ocultos obrigatórios

O formulário sempre inclui:

```html
<input type="hidden" name="access_key" value="<chave do build>">
<input type="hidden" name="subject" value="Novo pedido de orçamento — site">
<input type="hidden" name="from_name" value="Site Faby Fonseca">
<input type="hidden" name="consent_version" value="<PRIVACY_VERSION>">
<input type="hidden" name="consent_at" value="">
<input type="hidden" name="source" value="direto|galeria:<slug>">
<input type="hidden" name="redirect" value="<URL absoluta>/contato/enviado/">
```

- `subject` é atualizado pelo script para incluir categoria e nome quando disponíveis.
- `consent_at` é preenchido pelo script no envio e fica vazio quando não há JavaScript.
- `source` começa como `direto` e o script troca para `galeria:<slug>` quando o visitante chega com
  `?categoria=`.
- `redirect` só é usado no envio nativo (sem JavaScript) e aponta para uma página estática.

## Atributos do `<form>`

```html
<form
  data-contact-form
  data-min-fill-ms="3000"
  method="post"
  action="https://api.web3forms.com/submit"
>
```

- O HTML **não** traz `novalidate`; sem JavaScript o navegador valida pelos atributos nativos
  (`required`, `type="email"`).
- Com JavaScript, o script define `form.noValidate = true` e assume as mensagens próprias; as
  restrições HTML continuam no DOM para leitores de tela.
- `data-min-fill-ms` é lido a cada submit (permite ajuste em teste sem recriar o formulário); o
  padrão vem de `MIN_FILL_TIME_MS` em `src/lib/contact.ts`.

## Regras do script

1. Ao carregar, registra o instante inicial para o tempo mínimo (3 s) e ajusta a nota da categoria.
2. No `submit`, sempre `preventDefault()` quando há JavaScript.
3. Valida todos os campos na ordem do DOM; no primeiro erro, define `aria-invalid="true"`, mostra a
   mensagem e move o foco para o campo.
4. Descarta o envio, sem chamada de rede, quando: `botcheck` marcado, `website` preenchido ou
   tempo decorrido menor que 3 s. Nos dois primeiros casos apresenta sucesso; no tempo mínimo pede
   nova tentativa.
5. Durante o envio: `aria-busy="true"` no formulário, botão desabilitado com texto "Enviando…".
6. Em sucesso (HTTP 200 e `success: true`): limpa o formulário, esconde os erros, mostra
   `[data-form-status]`, move o foco para o título do painel e mantém o botão desabilitado.
7. Em erro: mostra `[data-form-error]`, preserva os valores, reabilita o botão e move o foco para o
   painel de erro.
8. Aborta a requisição após 15 s e trata como erro.
9. Nunca grava dados em `localStorage`, `sessionStorage`, cookies ou na URL.

## Modo de contato direto (sem chave)

Quando `PUBLIC_WEB3FORMS_KEY` está ausente no build:

- `[data-contact-form]` não é renderizado;
- `[data-direct-contact]` exibe e-mail e WhatsApp com links acionáveis;
- a mensagem explica que o formulário volta a funcionar assim que o envio for configurado;
- nenhum campo oculto com `access_key` vazio é emitido.

## Confirmação sem JavaScript

O Web3Forms redireciona o envio nativo para `/contato/enviado/`, uma página estática com o mesmo
painel de sucesso. Como a saída do Astro é estática, não há leitura de query string no servidor: a
página é dedicada e marcada com `noindex`. Nenhum dado pessoal vai na URL.

## Critérios de aceite automatizados

- `POST` interceptado recebe exatamente os campos do payload de `data-model.md`.
- `consent_version` e `consent_at` sempre presentes em envios com JavaScript.
- Nenhuma chamada de rede quando o consentimento não está marcado ou há erro de validação.
- `localStorage`, `sessionStorage` e `document.cookie` vazios após envio bem-sucedido.
- Formulário e painéis operáveis por teclado, sem armadilha de foco.
