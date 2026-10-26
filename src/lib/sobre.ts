import { getEntry, type CollectionEntry } from 'astro:content';

export type Sobre = CollectionEntry<'sobre'>;

const BODY_MIN = 1;
const BODY_MAX = 4000;

/**
 * Lê a página Sobre e valida o corpo Markdown, que vive fora do frontmatter
 * e por isso não é coberto pelo schema da coleção.
 */
export async function getSobre(): Promise<Sobre> {
  const sobre = await getEntry('sobre', 'index');

  if (!sobre) {
    throw new Error(
      'Conteúdo da página Sobre não encontrado: crie o arquivo content/sobre/index.md.',
    );
  }

  const body = sobre.body?.trim() ?? '';

  if (body.length < BODY_MIN) {
    throw new Error(
      'O texto de apresentação da página Sobre é obrigatório: preencha o corpo Markdown de content/sobre/index.md.',
    );
  }

  if (body.length > BODY_MAX) {
    throw new Error(
      `O texto de apresentação da página Sobre deve ter no máximo ${BODY_MAX} caracteres.`,
    );
  }

  return sobre;
}
