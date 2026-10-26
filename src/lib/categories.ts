import { getCollection, type CollectionEntry } from 'astro:content';

export type Category = CollectionEntry<'categories'>;

const EXPECTED_CATEGORIES = 5;

/**
 * Retorna as categorias publicadas, ordenadas por `order` e nome.
 * Também garante que existam exatamente cinco slugs únicos.
 */
export async function getActiveCategories(): Promise<Category[]> {
  const categories = await getCollection('categories', ({ data }) => data.active);
  assertUniqueSlugs(categories);
  assertCategoryCount(categories);

  return categories.sort(
    (a, b) =>
      a.data.order - b.data.order ||
      a.data.name.localeCompare(b.data.name, 'pt-BR'),
  );
}

export function assertUniqueSlugs(categories: Category[]): void {
  const seen = new Map<string, string>();

  for (const category of categories) {
    const previous = seen.get(category.data.slug);
    if (previous) {
      throw new Error(
        `Slug de categoria duplicado: "${category.data.slug}" em ${previous} e ${category.id}.`,
      );
    }
    seen.set(category.data.slug, category.id);
  }
}

export function assertCategoryCount(categories: Category[]): void {
  if (categories.length !== EXPECTED_CATEGORIES) {
    throw new Error(
      `Esperadas exatamente ${EXPECTED_CATEGORIES} categorias ativas, encontradas ${categories.length}.`,
    );
  }
}

export function findCategoryBySlug(
  categories: Category[],
  slug: string | null | undefined,
): Category | undefined {
  if (!slug) return undefined;
  return categories.find((category) => category.data.slug === slug);
}

/**
 * Resolve a categoria pedida na URL. Slug ausente ou inválido significa
 * “Todos” — nunca a primeira categoria.
 */
export function resolveCategorySlug(
  categories: Category[],
  requested: string | null | undefined,
): Category | undefined {
  return findCategoryBySlug(categories, requested);
}
