import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const ExperienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: LocalizedTextSchema,
  startDate: z.union([z.string().min(1), LocalizedTextSchema]),
  endDate: z.union([z.string().min(1), LocalizedTextSchema]).nullable(),
  isCurrent: z.boolean(),
  description: LocalizedTextSchema,
  achievements: z.array(LocalizedTextSchema).default([]),
  technologies: z.array(z.string()).min(1),
});

export const ExperienceListSchema = z.array(ExperienceSchema);

export type Experience = z.infer<typeof ExperienceSchema>;
