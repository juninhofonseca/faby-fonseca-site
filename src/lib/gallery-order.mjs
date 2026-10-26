/**
 * Comparador puro usado pelo portfólio. Foto sem `publishedAt` conta como 0
 * no desempate, sem quebrar o build.
 */
export function comparePhotoOrder(a, b) {
  return (
    a.order - b.order ||
    (a.publishedAt?.getTime?.() ?? 0) - (b.publishedAt?.getTime?.() ?? 0) ||
    a.title.localeCompare(b.title, 'pt-BR')
  );
}
