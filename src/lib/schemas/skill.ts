import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const SkillItemSchema = z.object({
  name: z.union([z.string().min(1), LocalizedTextSchema]),
  level: z.string().optional(),
  highlight: z.boolean().default(false),
});

export const SkillCategorySchema = z.object({
  id: z.string().min(1),
  category: LocalizedTextSchema,
  skills: z.array(SkillItemSchema).min(1),
});

export const SkillCategoryListSchema = z.array(SkillCategorySchema);

export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type SkillItem = z.infer<typeof SkillItemSchema>;
