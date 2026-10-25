import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  MAX_ORIGINAL_BYTES,
  assertAlt,
  assertCategory,
  assertFeaturedCategories,
  exceedsLimit,
  findDuplicateSlugs,
  formatBytes,
  isSupportedImage,
  isValidSlug,
} from './content-rules.mjs';

const root = process.cwd();
const categoriesDir = path.join(root, 'content', 'categories');
const photosDir = path.join(root, 'content', 'photos');
const homeDir = path.join(root, 'content', 'home');
const homeFile = path.join(homeDir, 'index.md');
const errors = [];

async function listMarkdown(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(directory, entry.name));
}

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

const categoryFiles = await listMarkdown(categoriesDir);
const categories = [];

for (const file of categoryFiles) {
  const relative = path.relative(root, file);
  const { data } = matter(await readFile(file, 'utf8'));

  if (!isValidSlug(data.slug)) {
    errors.push(`${relative}: slug inválido "${data.slug}".`);
  }

  if (path.basename(file, '.md') !== data.slug) {
    errors.push(`${relative}: o nome do arquivo deve ser "${data.slug}.md".`);
  }

  if (typeof data.name !== 'string' || data.name.length === 0 || data.name.length > 60) {
    errors.push(`${relative}: "name" deve ter entre 1 e 60 caracteres.`);
  }

  if (!Number.isInteger(data.order) || data.order < 0) {
    errors.push(`${relative}: "order" deve ser um inteiro maior ou igual a 0.`);
  }

  if (typeof data.description === 'string' && data.description.length > 160) {
    errors.push(`${relative}: "description" deve ter no máximo 160 caracteres.`);
  }

  categories.push({ slug: data.slug, active: data.active !== false, file: relative });
}

const validSlugs = categories.map((category) => category.slug).filter(Boolean);
const activeSlugs = categories
  .filter((category) => category.active)
  .map((category) => category.slug)
  .filter(Boolean);

for (const duplicate of findDuplicateSlugs(validSlugs)) {
  errors.push(`Slug de categoria duplicado: "${duplicate}".`);
}

const photoFiles = await listMarkdown(photosDir);
let photoCount = 0;

for (const file of photoFiles) {
  const relative = path.relative(root, file);
  const { data } = matter(await readFile(file, 'utf8'));
  photoCount += 1;

  try {
    assertAlt(data.alt);
  } catch (error) {
    errors.push(`${relative}: ${error.message}`);
  }

  try {
    assertCategory(data.category, validSlugs);
  } catch (error) {
    errors.push(`${relative}: ${error.message}`);
  }

  if (typeof data.title !== 'string' || data.title.length === 0 || data.title.length > 80) {
    errors.push(`${relative}: "title" deve ter entre 1 e 80 caracteres.`);
  }

  if (!Number.isInteger(data.order) || data.order < 0) {
    errors.push(`${relative}: "order" deve ser um inteiro maior ou igual a 0.`);
  }

  if (!data.publishedAt) {
    errors.push(`${relative}: "publishedAt" é obrigatório.`);
  }

  if (typeof data.image !== 'string' || data.image.length === 0) {
    errors.push(`${relative}: "image" é obrigatório.`);
    continue;
  }

  const imagePath = path.join(photosDir, data.image);
  const imageRelative = path.relative(root, imagePath);

  if (!isSupportedImage(imagePath)) {
    errors.push(`${imageRelative}: formato não suportado (use jpg, jpeg, png ou webp).`);
    continue;
  }

  try {
    const info = await stat(imagePath);

    if (exceedsLimit(info.size, MAX_ORIGINAL_BYTES)) {
      errors.push(
        `${imageRelative}: original acima de 10 MB (${formatBytes(info.size)}).`,
      );
    }
  } catch {
    errors.push(`${imageRelative}: arquivo de imagem não encontrado.`);
  }
}

try {
  const relative = path.relative(root, homeFile);
  const { data: home } = matter(await readFile(homeFile, 'utf8'));

  checkText(relative, 'heroTitle', home.heroTitle, 1, 80);
  checkText(relative, 'heroText', home.heroText, 1, 240);
  checkText(relative, 'heroAlt', home.heroAlt, 1, 160);
  checkText(relative, 'aboutTitle', home.aboutTitle, 1, 60);
  checkText(relative, 'aboutText', home.aboutText, 1, 600);

  try {
    assertFeaturedCategories(home.featuredCategories, activeSlugs);
  } catch (error) {
    errors.push(`${relative}: ${error.message}`);
  }

  if (typeof home.heroImage !== 'string' || home.heroImage.length === 0) {
    errors.push(`${relative}: "heroImage" é obrigatório.`);
  } else {
    const imagePath = path.join(homeDir, home.heroImage);
    const imageRelative = path.relative(root, imagePath);

    if (!isSupportedImage(imagePath)) {
      errors.push(
        `${imageRelative}: formato não suportado (use jpg, jpeg, png ou webp).`,
      );
    } else {
      try {
        const info = await stat(imagePath);

        if (exceedsLimit(info.size, MAX_ORIGINAL_BYTES)) {
          errors.push(
            `${imageRelative}: original acima de 10 MB (${formatBytes(info.size)}).`,
          );
        }
      } catch {
        errors.push(`${imageRelative}: arquivo de imagem não encontrado.`);
      }
    }
  }
} catch (error) {
  errors.push(`${path.relative(root, homeFile)}: ${error.message}`);
}

if (errors.length > 0) {
  console.error('Falhas na validação do conteúdo:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Conteúdo válido: ${categories.length} categorias, ${photoCount} fotos e home.`,
);
