import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from './categories';

export type Photo = CollectionEntry<'photos'>;

/** Ordena por `order` e desempata por data de publicação e título. */
export function comparePhotos(a: Photo, b: Photo): number {
  return (
    a.data.order - b.data.order ||
    a.data.publishedAt.getTime() - b.data.publishedAt.getTime() ||
    a.data.title.localeCompare(b.data.title, 'pt-BR')
  );
}

/** Fotos publicadas de uma categoria, na ordem de exibição. */
export async function getPublishedPhotos(categorySlug: string): Promise<Photo[]> {
  const photos = await getCollection(
    'photos',
    ({ data }) => data.published && data.category === categorySlug,
  );

  return photos.sort(comparePhotos);
}

/** Mapa slug da categoria → fotos publicadas ordenadas. */
export async function getPhotosByCategory(
  categories: Category[],
): Promise<Record<string, Photo[]>> {
  const entries = await Promise.all(
    categories.map(async (category) => {
      const photos = await getPublishedPhotos(category.data.slug);
      return [category.data.slug, photos] as const;
    }),
  );

  return Object.fromEntries(entries);
}

/** Próximo índice em ciclo contínuo. */
export function nextIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return (index + 1) % length;
}

/** Índice anterior em ciclo contínuo. */
export function previousIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return (index - 1 + length) % length;
}

/** Rótulo anunciado para tecnologia assistiva. */
export function positionLabel(index: number, length: number): string {
  return `Foto ${index + 1} de ${length}`;
}
