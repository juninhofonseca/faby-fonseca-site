/**
 * Prefixa links internos com o `base` do build, para que o site funcione tanto
 * na raiz do domínio próprio quanto na URL de projeto do GitHub Pages.
 */
const RAW_BASE = import.meta.env.BASE_URL;
const BASE = RAW_BASE === '/' ? '' : RAW_BASE.replace(/\/$/, '');

export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE}${path}`;
}

export { BASE as basePath };
