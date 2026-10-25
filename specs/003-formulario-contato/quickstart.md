# Guia de Validação: Formulário de Contato com Envio e LGPD

**Funcionalidade**: 003-formulario-contato | **Data**: 2026-10-25

## Pré-requisitos

- Node.js 24 e npm 10+.
- Conta no Web3Forms criada com o e-mail que deve receber os pedidos.
- Chave de acesso do Web3Forms em mãos.

## 1. Configurar a chave localmente

Crie `.env` na raiz (já ignorado pelo Git):

```text
PUBLIC_WEB3FORMS_KEY=sua-chave-aqui
```

Confira que o arquivo **não** aparece no `git status`:

```powershell
git status --short
```

## 2. Rodar o site

```powershell
npm install
npm run dev
```

Abra `http://localhost:4321/contato/`. O formulário completo deve aparecer. Sem a chave no `.env`,
a página mostra o painel de contato direto — confirme que e-mail e WhatsApp funcionam e que nenhum
formulário é exibido.

## 3. Envio real de teste

1. Preencha nome, telefone, e-mail, categoria e detalhes com **dados fictícios**.
2. Marque o consentimento.
3. Envie e confirme o painel de sucesso.
4. Verifique a caixa configurada no Web3Forms: o e-mail deve conter os cinco campos,
   `consentimento: sim`, a versão da política, a data/hora e o botão "Responder" apontando para o
   e-mail de teste.
5. Apague a mensagem de teste da caixa de entrada.

## 4. Cenários manuais

| Cenário | Passos | Resultado esperado |
|---|---|---|
| Categoria pré-selecionada | Abrir `/portfolio/?categoria=ensaios` e acionar o CTA | Contato abre com Ensaios marcado e nota visível |
| Troca de categoria | Alterar a seleção | Nota acompanha a nova categoria |
| Campo vazio | Enviar sem preencher | Erro específico no primeiro campo, foco nele |
| E-mail inválido | Digitar `maria@` | Erro de formato, sem chamada de rede |
| Sem consentimento | Preencher tudo e não marcar | Bloqueio com foco no consentimento |
| Detalhes curtos | Digitar 3 caracteres | Erro pedindo mais contexto |
| Limite de caracteres | Colar 1200 caracteres | Campo limita em 1000 e o contador acompanha |
| Duplo clique | Clicar duas vezes no envio | Botão desabilita, apenas um pedido é enviado |
| Falha de rede | DevTools → Offline → enviar | Painel de erro, dados preservados, contato direto visível |
| Serviço fora do ar | Interceptar a chamada com status 500 | Mesmo painel de erro, sem perda de dados |
| Sem JavaScript | Desabilitar JS, preencher e enviar | POST nativo e retorno em `/contato/enviado/` |
| Honeypot | Preencher o campo oculto via DevTools e enviar | Nenhum e-mail é gerado |
| Tempo mínimo | Enviar em menos de 3 segundos | Pedido de nova tentativa; envio seguinte funciona |
| Privacidade | Abrir `/privacidade/` pelo rodapé de três páginas | Página carrega, contém as 11 seções e a versão |
| Teclado | Percorrer o formulário só com Tab/Shift+Tab | Ordem lógica, foco visível, sem armadilha |
| Zoom 200% | Aplicar zoom no navegador | Sem rolagem horizontal, textos legíveis |

## 5. Limpeza dos dados de teste

- Apagar as mensagens de teste da caixa de entrada.
- Confirmar que nenhum dado fictício foi versionado (`git status`, `git diff`).
- Se a chave tiver sido colada em algum arquivo versionado, remover e rotacionar no painel.

## 6. Suíte automatizada

```powershell
npm run validate:content
npm run test:content
npm run check
npm run test:e2e
npm run test:lighthouse
```

Os testes de formulário usam uma chave fictícia (`scripts/build-test.mjs`) e interceptam a API; o
CI não depende da chave real.

## 7. Configurar o deploy

1. No GitHub: **Settings → Secrets and variables → Actions → Variables → New repository
   variable**.
2. Nome `WEB3FORMS_KEY`, valor igual à chave do Web3Forms.
3. Rode o workflow **Deploy** (push em `main` ou `workflow_dispatch`).
4. Opcional, apenas no plano **PRO**: ative **Restrict to Domain** no painel do Web3Forms e
   cadastre `juninhofonseca.github.io` (sem `https://`); ao ativar o domínio próprio, acrescente
   `fabyfonseca.com.br`. Depois disso o formulário deixa de funcionar em `localhost`.
5. Faça um envio real a partir do site publicado e confirme a chegada do e-mail.

## 8. Critérios de aceite da validação

- [x] Formulário completo com a chave configurada; contato direto sem ela.
- [x] Envio real recebido, com consentimento, versão e data/hora.
- [x] Todos os cenários da tabela aprovados.
- [x] `npm run check` sem erros.
- [x] `npm run test:e2e` verde (incluindo axe e sem JavaScript).
- [x] Lighthouse ≥ 90 em `/contato/` e `/privacidade/`.
- [x] Nenhum dado pessoal no repositório, na URL ou no armazenamento do navegador.
- [x] `docs/validation.md` atualizado com data, resultados e pendências.
