# Contrato: Política de Privacidade e Consentimento

**Funcionalidade**: 003-formulario-contato | **Data**: 2026-10-25

## Rota e navegação

- Rota pública: `/privacidade/` (build gera `dist/privacidade/index.html`).
- Título: `Política de Privacidade | Faby Fonseca Fotografia`.
- Link no rodapé de **todas** as páginas, com o texto "Política de Privacidade".
- Link no bloco de consentimento do formulário, com o texto "política de privacidade".
- Link no sitemap (gerado automaticamente pelo Astro).
- Nenhum link quebrado quando o site é publicado no subcaminho do GitHub Pages: usar
  `withBase('/privacidade/')`.

## Seções obrigatórias

A página deve conter, nesta ordem:

1. **Quem trata os dados** — Faby Fonseca Fotografia (MEI), com o e-mail de contato.
2. **Quais dados são coletados** — nome, telefone, e-mail, categoria de serviço e detalhes do
   evento; nada além disso.
3. **Para que servem** — responder ao pedido de orçamento e dar seguimento à contratação.
4. **Base legal** — consentimento do titular (art. 7º, I, da LGPD).
5. **Com quem são compartilhados** — Web3Forms, exclusivamente como operador de envio; provedor de
   e-mail; nenhuma venda ou cessão a terceiros.
6. **Por quanto tempo ficam guardados** — até 12 meses após o último contato, salvo obrigação
   legal; exclusão em até 15 dias após pedido.
7. **Direitos do titular** — confirmação, acesso, correção, exclusão, revogação do consentimento,
   portabilidade e informação sobre compartilhamento.
8. **Como exercer os direitos** — e-mail e WhatsApp publicados, com prazo de resposta de até 15
   dias.
9. **Cookies e analytics** — o site não usa cookies, rastreamento ou analytics de terceiros.
10. **Segurança** — acesso restrito à responsável, transmissão por HTTPS, sem base de dados
    própria.
11. **Versão e data de vigência** — visíveis no fim da página, iguais às constantes do código.

## Tom e forma

- Português do Brasil, frases curtas, sem jargão jurídico desnecessário.
- Cada seção pode ser lida isoladamente (títulos descritivos).
- Sem promessas absolutas de segurança e sem cláusulas que restrinjam direitos do titular.
- Sem dados pessoais de terceiros, sem exemplos com dados reais.
- Estrutura semântica: um `<h1>`, seções com `<h2>`, listas onde fizer sentido.

## Consentimento no formulário

```html
<p class="form-consent">
  <input type="checkbox" id="consent" name="consent" required>
  <label for="consent">
    Autorizo o contato e o uso dos meus dados para responder a este pedido, conforme a
    <a href="/privacidade/">política de privacidade</a>.
  </label>
</p>
```

Regras:

- Nunca pré-marcado, nunca escondido, nunca dentro de um bloco recolhido.
- A frase declara a finalidade e aponta para a política antes do botão de envio.
- Texto de apoio adicional informa que os dados não são usados para marketing.
- A versão aceita é enviada junto do pedido (`consent_version`).

## Versionamento

| Constante | Local | Regra |
|---|---|---|
| `PRIVACY_VERSION` | `src/lib/contact.ts` | ISO `AAAA-MM-DD`; nova versão a cada mudança relevante |
| `PRIVACY_EFFECTIVE_AT` | `src/lib/contact.ts` | data exibida na política e no bloco de consentimento |

A data de vigência aparece na página e o valor de `PRIVACY_VERSION` aparece no rodapé da política
("Versão X — vigente desde Y").

## Critérios de aceite automatizados

- `/privacidade/` responde 200 e é alcançável a partir do rodapé de `/`, `/portfolio/` e
  `/contato/`.
- A página contém as 11 seções e o e-mail de contato.
- O bloco de consentimento aponta para a política e não vem marcado.
- axe-core não encontra violações críticas em `/privacidade/`.
- O texto da política menciona o Web3Forms e a ausência de cookies.
