/**
 * Build usado pelos testes automatizados.
 *
 * O formulário completo só é renderizado quando `PUBLIC_WEB3FORMS_KEY` está definida. Os testes
 * precisam do formulário, mas nunca devem usar a chave real: aqui injetamos uma chave fictícia e
 * o Playwright intercepta as chamadas para `api.web3forms.com`.
 *
 * O build de produção continua usando `npm run build` com a variável real.
 */
import { execSync } from 'node:child_process';

const testKey = 'chave-de-teste-e2e';

execSync('npm run build', {
  stdio: 'inherit',
  env: { ...process.env, PUBLIC_WEB3FORMS_KEY: testKey },
});
