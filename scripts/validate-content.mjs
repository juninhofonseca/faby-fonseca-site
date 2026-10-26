import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import {
  MAX_ORIGINAL_BYTES,
  assertActiveCategoryCount,
  assertAlt,
  assertFeaturedCategories,
  assertHeroDimensions,
  assertSlugMatchesFolder,
  assertSobreBody,
  exceedsLimit,
  findDuplicateSlugs,
  formatBytes,
  isKnownPlaceholderHash,
  isSupportedImage,
  isValidSlug,
  sha256,
} from './content-rules.mjs';

const root = process.cwd();
const portfolioDir = path.join(root, 'content', 'portfolio');
const homeDir = path.join(root, 'content', 'home');
const homeFile = path.join(homeDir, 'index.md');
const sobreDir = path.join(root, 'content', 'sobre');
const sobreFile = path.join(sobreDir, 'index.md');
const errors = [];

function checkText(file, field, value, min, max) {
  if (typeof value !== 'string' || value.trim().length < min) {
    errors.push(`${file}: "${field}" é obrigatório.`);
    return false;
  }

  if (value.length > max) {
    errors.push(`${file}: "${field}" deve ter no máximo ${max} caracteres.`);
    return false;
  }

  return true;
}

async function checkImage(file, field, imagePath, baseDir) {
  if (typeof imagePath !== 'string' || imagePath.trim().length === 0) {
    errors.push(`${file}: "${field}" é obrigatório.`);
    return null;
  }

  const resolved = path.join(baseDir, imagePath);
  const relative = path.relative(root, resolved);

  if (!resolved.startsWith(`${baseDir}${path.sep}`)) {
    errors.push(`${relative}: o caminho da imagem deve ficar dentro da pasta do conteúdo.`);
    return null;
  }

  if (!isSupportedImage(resolved)) {
    errors.push(`${relative}: formato não suportado (use jpg, jpeg, png ou webp).`);
    return null;
  }

  try {
    const info = await stat(resolved);

    if (exceedsLimit(info.size, MAX_ORIGINAL_BYTES)) {
      errors.push(`${relative}: original acima de 10 MB (${formatBytes(info.size)}).`);
    }

    return resolved;
  } catch {
    errors.push(`${relative}: arquivo de imagem não encontrado.`);
    return null;
  }
}

const categoryDirs = (await readdir(portfolioDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
  .map((entry) => entry.name)
  .sort();

const categories = [];
let photoCount = 0;

for (const folder of categoryDirs) {
  const categoryDir = path.join(portfolioDir, folder);
  const file = path.join(categoryDir, 'index.md');
  const relative = path.relative(root, file);

  let parsed;

  try {
    parsed = matter(await readFile(file, 'utf8'));
  } catch {
    errors.push(`${relative}: arquivo index.md não encontrado.`);
    continue;
  }

  const { data } = parsed;

  if (!isValidSlug(data.slug)) {
    errors.push(`${relative}: slug inválido "${data.slug}".`);
  } else {
    try {
      assertSlugMatchesFolder(data.slug, folder);
    } catch (error) {
      errors.push(`${relative}: ${error.message}`);
    }
  }

  checkText(relative, 'name', data.name, 1, 60);
  checkText(relative, 'description', data.description, 1, 160);

  if (!Number.isInteger(data.order) || data.order < 0) {
    errors.push(`${relative}: "order" deve ser um inteiro maior ou igual a 0.`);
  }

  if (data.active !== true) {
    errors.push(`${relative}: "active" deve ser sempre true nesta versão.`);
  }

  const photos = Array.isArray(data.photos) ? data.photos : [];

  if (!Array.isArray(data.photos)) {
    errors.push(`${relative}: "photos" deve ser uma lista (pode ser vazia).`);
  }

  const orders = new Set();

  for (const [index, photo] of photos.entries()) {
    photoCount += 1;
    const photoLabel = `${relative} (foto ${index + 1})`;

    checkText(photoLabel, 'title', photo.title, 1, 80);

    try {
      assertAlt(photo.alt);
    } catch (error) {
      errors.push(`${photoLabel}: ${error.message}`);
    }

    if (!Number.isInteger(photo.order) || photo.order < 0) {
      errors.push(`${photoLabel}: "order" deve ser um inteiro maior ou igual a 0.`);
    } else if (orders.has(photo.order)) {
      errors.push(`${photoLabel}: "order" repetido (${photo.order}).`);
    } else {
      orders.add(photo.order);
    }

    if (photo.published !== undefined && typeof photo.published !== 'boolean') {
      errors.push(`${photoLabel}: "published" deve ser booleano.`);
    }

    if (photo.publishedAt !== undefined) {
      const date = new Date(photo.publishedAt);
      if (Number.isNaN(date.getTime())) {
        errors.push(`${photoLabel}: "publishedAt" deve ser uma data ISO válida.`);
      }
    }

    await checkImage(photoLabel, 'image', photo.image, categoryDir);
  }

  categories.push({
    slug: data.slug,
    active: data.active,
    file: relative,
  });
}

const validSlugs = categories.map((category) => category.slug).filter(Boolean);

for (const duplicate of findDuplicateSlugs(validSlugs)) {
  errors.push(`Slug de categoria duplicado: "${duplicate}".`);
}

try {
  assertActiveCategoryCount(categories);
} catch (error) {
  errors.push(error.message);
}

try {
  const relative = path.relative(root, homeFile);
  const { data: home } = matter(await readFile(homeFile, 'utf8'));

  checkText(relative, 'heroTitle', home.heroTitle, 1, 80);
  checkText(relative, 'heroText', home.heroText, 1, 240);
  checkText(relative, 'heroAlt', home.heroAlt, 1, 160);
  checkText(relative, 'aboutTitle', home.aboutTitle, 1, 60);
  checkText(relative, 'aboutSummary', home.aboutSummary, 1, 400);

  if (typeof home.heroAlt === 'string' && /provis[óo]ri/i.test(home.heroAlt)) {
    errors.push(`${relative}: "heroAlt" ainda descreve a foto provisória.`);
  }

  try {
    assertFeaturedCategories(home.featuredCategories, validSlugs);
  } catch (error) {
    errors.push(`${relative}: ${error.message}`);
  }

  const heroPath = await checkImage(relative, 'heroImage', home.heroImage, homeDir);

  if (heroPath) {
    try {
      const metadata = await sharp(heroPath).metadata();
      assertHeroDimensions(metadata.width, metadata.height);

      const buffer = await readFile(heroPath);
      const hash = sha256(buffer);

      if (isKnownPlaceholderHash(hash)) {
        errors.push(`${relative}: a foto do hero ainda é o placeholder provisório.`);
      }
    } catch (error) {
      errors.push(`${relative}: ${error.message}`);
    }
  }
} catch (error) {
  errors.push(`${path.relative(root, homeFile)}: ${error.message}`);
}

try {
  const relative = path.relative(root, sobreFile);
  const { data: sobre, content } = matter(await readFile(sobreFile, 'utf8'));

  checkText(relative, 'title', sobre.title, 1, 80);
  checkText(relative, 'intro', sobre.intro, 1, 240);

  try {
    assertSobreBody(content);
  } catch (error) {
    errors.push(`${relative}: ${error.message}`);
  }

  if (sobre.image) {
    await checkImage(relative, 'image', sobre.image, sobreDir);

    if (typeof sobre.imageAlt !== 'string' || sobre.imageAlt.trim().length === 0) {
      errors.push(`${relative}: "imageAlt" é obrigatório quando há imagem.`);
    } else {
      checkText(relative, 'imageAlt', sobre.imageAlt, 1, 160);
    }
  }
} catch (error) {
  errors.push(`${path.relative(root, sobreFile)}: ${error.message}`);
}

if (errors.length > 0) {
  console.error('Falhas na validação do conteúdo:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Conteúdo válido: ${categories.length} categorias, ${photoCount} fotos, home e Sobre.`,
);
