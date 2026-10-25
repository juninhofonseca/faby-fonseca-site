import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  MAX_ORIGINAL_BYTES,
  exceedsGridBudget,
  exceedsLimit,
  formatBytes,
  isGridVariant,
  isSupportedImage,
  parseSrcSet,
} from './content-rules.mjs';

const root = process.cwd();
const originalsDir = path.join(root, 'content', 'photos', 'images');
const distDir = path.join(root, 'dist');
const basePrefix =
  process.env.SITE_BASE && process.env.SITE_BASE !== '/'
    ? process.env.SITE_BASE.replace(/\/$/, '')
    : '';
const errors = [];

/** Converte a URL pública da variante no caminho do arquivo dentro de `dist/`. */
function assetPathFor(url) {
  const withoutBase =
    basePrefix && url.startsWith(`${basePrefix}/`)
      ? url.slice(basePrefix.length)
      : url;
  return path.join(distDir, withoutBase.replace(/^\/+/, ''));
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

try {
  const originals = await walk(originalsDir);

  for (const file of originals) {
    const relative = path.relative(root, file);

    if (!isSupportedImage(file)) {
      errors.push(`${relative}: formato não suportado (use jpg, jpeg, png ou webp).`);
      continue;
    }

    const info = await stat(file);
    if (exceedsLimit(info.size, MAX_ORIGINAL_BYTES)) {
      errors.push(
        `${relative}: original acima de 10 MB (${formatBytes(info.size)}).`,
      );
    }
  }
} catch {
  console.log('Nenhum original encontrado em content/photos/images.');
}

const checked = new Set();

try {
  const htmlFiles = (await walk(distDir)).filter((file) => file.endsWith('.html'));

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, 'utf8');

    for (const match of html.matchAll(/\ssrcset="([^"]+)"/g)) {
      for (const entry of parseSrcSet(match[1])) {
        if (!isGridVariant(entry) || /^https?:\/\//.test(entry.url)) continue;

        const assetPath = assetPathFor(entry.url);
        if (checked.has(assetPath)) continue;
        checked.add(assetPath);

        try {
          const info = await stat(assetPath);
          if (exceedsGridBudget(info.size)) {
            errors.push(
              `Variante de grade acima de 300 KB: ${entry.url} (${formatBytes(info.size)}).`,
            );
          }
        } catch {
          errors.push(`Arquivo do srcset não encontrado em dist: ${entry.url}.`);
        }
      }
    }
  }
} catch {
  console.log('dist/ ausente: verificando apenas os originais.');
}

if (checked.size > 0) {
  console.log(`Variantes de grade verificadas: ${checked.size}.`);
}

if (errors.length > 0) {
  console.error('Falhas no orçamento de imagens:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Orçamento de imagens OK (originais ≤ 10 MB e grade ≤ 300 KB).');
