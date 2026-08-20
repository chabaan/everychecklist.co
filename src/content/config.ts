import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    metaDescription: z.string(),
    dek: z.string(),
    readTime: z.number(),
    updated: z.string(),
    sections: z.array(
      z.object({
        title: z.string(),
        items: z.array(z.string()),
      })
    ),
  }),
});

export const collections = { articles };
