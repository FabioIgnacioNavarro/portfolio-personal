import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const LanguageSchema = z.object({
  id: z.string().min(1),
  language: LocalizedTextSchema,
  proficiency: LocalizedTextSchema,
  details: LocalizedTextSchema.optional(),
});

export const LanguageListSchema = z.array(LanguageSchema);

export type Language = z.infer<typeof LanguageSchema>;
