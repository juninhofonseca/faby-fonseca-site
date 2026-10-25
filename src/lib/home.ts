import { getEntry, type CollectionEntry } from 'astro:content';
import type { Category } from './categories';

export type Home = CollectionEntry<'home'>;

/**
 * Lê a entrada única da home. O build falha com mensagem clara se o arquivo
 * `content/home/index.md` não existir, em vez de publicar uma home vazia.
 */
export async function getHome(): Promise<Home> {
  const home = await getEntry('home', 'index');

  if (!home) {
    throw new Error(
      'Conteúdo da home não encontrado: crie o arquivo content/home/index.md.',
    );
  }

  return home;
}

/**
 * Resolve as categorias em destaque mantendo a ordem escolhida no conteúdo.
 * Slugs inexistentes, inativos ou repetidos são ignorados e as vagas restantes
 * são completadas com as próximas categorias ativas, na ordem do portfólio.
 */
export function resolveFeaturedCategories(
  categories: Category[],
  slugs: string[],
  limit = 3,
): Category[] {
  const bySlug = new Map(
    categories.map((category) => [category.data.slug, category]),
  );
  const picked: Category[] = [];
  const seen = new Set<string>();

  for (const slug of slugs) {
    if (picked.length >= limit) break;

    const category = bySlug.get(slug);
    if (!category || seen.has(slug)) continue;

    picked.push(category);
    seen.add(slug);
  }

  for (const category of categories) {
    if (picked.length >= limit) break;

    const { slug } = category.data;
    if (seen.has(slug)) continue;

    picked.push(category);
    seen.add(slug);
  }

  return picked;
}

/** Divide o texto editável em parágrafos, respeitando linhas em branco. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
