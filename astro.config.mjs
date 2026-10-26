import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/*
 * `SITE_URL` e `SITE_BASE` permitem publicar temporariamente na URL de projeto do
 * GitHub Pages (`https://<usuario>.github.io/<repositorio>/`). Sem essas variáveis
 * o site usa o domínio próprio na raiz, que é o destino final.
 */
const site = process.env.SITE_URL ?? 'https://fabyfonseca.com.br';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/contato/enviado/'),
    }),
  ],
});
