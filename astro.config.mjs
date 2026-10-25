import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// O domínio deve corresponder ao domínio próprio configurado no GitHub Pages.
export default defineConfig({
  site: 'https://fabyfonseca.com.br',
  output: 'static',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
