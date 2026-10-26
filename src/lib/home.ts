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
 * Resolve as categorias em destaque. Exige exatamente três slugs distintos,
 * existentes e ativos, e devolve os cartões na ordem `order` das categorias.
 * Qualquer divergência falha o build em vez de completar as vagas.
 */
export function resolveFeaturedCategories(
  categories: Category[],
  slugs: string[],
): Category[] {
  if (!Array.isArray(slugs) || slugs.length !== 3) {
    throw new Error('Escolha exatamente 3 categorias em destaque.');
  }

  if (new Set(slugs).size !== slugs.length) {
    throw new Error('As categorias em destaque não podem se repetir.');
  }

  const bySlug = new Map(
    categories.map((category) => [category.data.slug, category]),
  );

  const selected = slugs.map((slug) => {
    const category = bySlug.get(slug);

    if (!category) {
      throw new Error(`Categoria em destaque inexistente ou inativa: "${slug}".`);
    }

    return category;
  });

  return selected.sort(
    (a, b) =>
      a.data.order - b.data.order ||
      a.data.name.localeCompare(b.data.name, 'pt-BR'),
  );
}
