import type { Category } from './categories';
import { comparePhotoOrder } from './gallery-order.mjs';

export type Photo = Category['data']['photos'][number];

/** Ordena por `order` e desempata por data de publicação e título. */
export function comparePhotos(a: Photo, b: Photo): number {
  return comparePhotoOrder(a, b);
}

/** Fotos publicadas de uma categoria, na ordem de exibição. */
export function getPublishedPhotos(category: Category): Photo[] {
  return [...category.data.photos].filter((photo) => photo.published).sort(comparePhotos);
}

/** Mapa slug da categoria → fotos publicadas ordenadas. */
export function getPhotosByCategory(
  categories: Category[],
): Record<string, Photo[]> {
  return Object.fromEntries(
    categories.map((category) => [
      category.data.slug,
      getPublishedPhotos(category),
    ]),
  );
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
