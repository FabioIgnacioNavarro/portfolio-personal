import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const ProfileSchema = z.object({
  name: z.string().min(1),
  role: LocalizedTextSchema,
  headline: LocalizedTextSchema,
  summary: LocalizedTextSchema,
  location: LocalizedTextSchema,
  links: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
    email: z.string().email(),
    portfolioRepo: z.string().url().optional(),
    cvUrl: z.object({
      es: z.string(),
      en: z.string(),
    }),
  }),
});

export type Profile = z.infer<typeof ProfileSchema>;
