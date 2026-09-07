import { z } from 'zod';

export const ArticleRequestSchema = z.object({
  id: z.number(),
  cluster: z.string(),
  slug: z.string(),
  titleDe: z.string(),
  titleEn: z.string(),
  keywordDe: z.string(),
  searchVolDe: z.number(),
  kd: z.number(),
  keywordEn: z.string(),
  searchVolEn: z.number(),
  lsiKeywords: z.array(z.string()),
  format: z.string(),
  targetLength: z.number(),
  taSegments: z.array(z.string()),
  priority: z.enum(['high', 'medium', 'low']),
  plannedDate: z.string(),
  language: z.string(),
  category: z.string(),
  status: z.string(),
  unsplashQuery: z.string(),
  author: z
    .object({
      name: z.string(),
      role: z.string(),
    })
    .optional(),
});

export type ArticleRequest = z.infer<typeof ArticleRequestSchema>;

export type Author = {
  name: string;
  role: string;
  expertise: string[];
};
