import path from 'node:path';

export const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
export const MAX_ORIGINAL_BYTES = 10 * 1024 * 1024;
export const MAX_GRID_BYTES = 300 * 1024;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
