import path from 'node:path';
import { createHash } from 'node:crypto';

export const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
export const MAX_ORIGINAL_BYTES = 10 * 1024 * 1024;
export const MAX_GRID_BYTES = 300 * 1024;
export const MIN_HERO_DIMENSION = 2400;
export const MAX_ABOUT_BODY = 4000;
export const EXPECTED_CATEGORY_COUNT = 5;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Hash do placeholder provisório usado antes da foto real do hero. */
export const KNOWN_PLACEHOLDER_HASHES = new Set([
  '67d6c4a1ca5d5913ad77649cefdee41b77dfd8ac36e36b4210c2ee561af3f315',
]);

export function isDotfile(name) {
  return name.startsWith('.');
}

export function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

export function isKnownPlaceholderHash(hash) {
  return KNOWN_PLACEHOLDER_HASHES.has(hash);
}

export function assertHeroDimensions(width, height, minimum = MIN_HERO_DIMENSION) {
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    throw new Error('Não foi possível ler as dimensões da foto do hero.');
  }

  if (width < minimum || height < minimum) {
    throw new Error(
      `A foto do hero precisa ter largura e altura de pelo menos ${minimum} px (atual: ${width} × ${height}).`,
    );
  }
}

export function assertSobreBody(body) {
  if (typeof body !== 'string' || body.trim().length === 0) {
    throw new Error('O texto de apresentação da página Sobre é obrigatório.');
  }

  if (body.length > MAX_ABOUT_BODY) {
    throw new Error(
      `O texto de apresentação da página Sobre deve ter no máximo ${MAX_ABOUT_BODY} caracteres.`,
    );
  }

  return body;
}

export function assertSlugMatchesFolder(slug, folderName) {
  if (slug !== folderName) {
    throw new Error(
      `O slug "${slug}" deve ser igual ao nome da pasta "${folderName}".`,
    );
  }
}

export function assertActiveCategoryCount(categories, expected = EXPECTED_CATEGORY_COUNT) {
  const active = categories.filter((category) => category.active !== false);

  if (active.length !== expected) {
    throw new Error(
      `Esperadas exatamente ${expected} categorias ativas, encontradas ${active.length}.`,
    );
  }

  return active;
}


export function isSupportedImage(filePath) {
  return SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

export function isValidSlug(value) {
  return typeof value === 'string' && SLUG_PATTERN.test(value);
}

export function assertAlt(alt) {
  if (typeof alt !== 'string' || alt.trim().length === 0) {
    throw new Error('O texto alternativo é obrigatório.');
  }

  if (alt.length > 160) {
    throw new Error('O texto alternativo deve ter no máximo 160 caracteres.');
  }

  return alt;
}

export function assertCategory(category, validSlugs) {
  if (!validSlugs.includes(category)) {
    throw new Error(`Categoria inexistente: "${category}".`);
  }
}

export function assertFeaturedCategories(featured, activeSlugs) {
  if (!Array.isArray(featured) || featured.length !== 3) {
    throw new Error('Escolha exatamente 3 categorias em destaque.');
  }

  if (featured.some((slug) => !isValidSlug(slug))) {
    throw new Error('As categorias em destaque devem ser slugs válidos.');
  }

  if (new Set(featured).size !== featured.length) {
    throw new Error('As categorias em destaque não podem se repetir.');
  }

  for (const slug of featured) {
    if (!activeSlugs.includes(slug)) {
      throw new Error(`Categoria em destaque inexistente ou inativa: "${slug}".`);
    }
  }

  return featured;
}

export function exceedsLimit(bytes, limit) {
  return bytes > limit;
}

export function exceedsGridBudget(bytes) {
  return bytes > MAX_GRID_BYTES;
}

export function findDuplicateSlugs(slugs) {
  const seen = new Set();
  const duplicates = new Set();

  for (const slug of slugs) {
    if (seen.has(slug)) duplicates.add(slug);
    seen.add(slug);
  }

  return Array.from(duplicates);
}

export function parseSrcSet(value) {
  if (!value) return [];

  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [url, descriptor = ''] = part.split(/\s+/);
      const widthMatch = descriptor.match(/^(\d+)w$/);

      return {
        url,
        descriptor,
        width: widthMatch ? Number(widthMatch[1]) : null,
      };
    })
    .filter((entry) => Boolean(entry.url));
}

export function isGridVariant(entry) {
  return entry.width !== null && entry.width <= 960;
}

export function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}
