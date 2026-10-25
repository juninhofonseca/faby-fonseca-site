import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Use apenas letras minúsculas, números e hífens (ex.: casamentos, ensaio-urbano).',
  );

const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/categories' }),
  schema: z.object({
    name: z.string().min(1, 'O nome da categoria é obrigatório.').max(60),
    slug: slugSchema,
    description: z.string().max(160).optional(),
    order: z.number().int().min(0, 'A ordem deve ser 0 ou maior.'),
    active: z.boolean().default(true),
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/photos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1, 'O título interno é obrigatório.').max(80),
      alt: z
        .string()
        .min(1, 'O texto alternativo é obrigatório.')
        .max(160, 'O texto alternativo deve ter no máximo 160 caracteres.'),
      image: image(),
      category: slugSchema,
      order: z.number().int().min(0, 'A ordem deve ser 0 ou maior.'),
      publishedAt: z.coerce.date(),
      published: z.boolean().default(true),
    }),
});

const home = defineCollection({
  loader: glob({ pattern: 'index.md', base: './content/home' }),
  schema: ({ image }) =>
    z.object({
      heroTitle: z
        .string()
        .min(1, 'O título do destaque é obrigatório.')
        .max(80, 'O título do destaque deve ter no máximo 80 caracteres.'),
      heroText: z
        .string()
        .min(1, 'A frase de apresentação é obrigatória.')
        .max(240, 'A frase de apresentação deve ter no máximo 240 caracteres.'),
      heroImage: image(),
      heroAlt: z
        .string()
        .min(1, 'O texto alternativo da foto é obrigatório.')
        .max(160, 'O texto alternativo deve ter no máximo 160 caracteres.'),
      featuredCategories: z
        .array(slugSchema)
        .length(3, 'Escolha exatamente 3 categorias em destaque.')
        .refine((slugs) => new Set(slugs).size === slugs.length, {
          message: 'As categorias em destaque não podem se repetir.',
        }),
      aboutTitle: z
        .string()
        .min(1, 'O título da seção sobre a Faby é obrigatório.')
        .max(60, 'O título da seção sobre a Faby deve ter no máximo 60 caracteres.'),
      aboutText: z
        .string()
        .min(1, 'O texto sobre a Faby é obrigatório.')
        .max(600, 'O texto sobre a Faby deve ter no máximo 600 caracteres.'),
    }),
});

export const collections = { categories, photos, home };
