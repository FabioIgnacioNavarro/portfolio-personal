import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const ExperienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: LocalizedTextSchema,
  startDate: z.string().min(1),
  endDate: z.string().nullable(),
  isCurrent: z.boolean(),
  description: LocalizedTextSchema,
  achievements: z.array(LocalizedTextSchema).default([]),
  technologies: z.array(z.string()).min(1),
});

export const ExperienceListSchema = z.array(ExperienceSchema);

export type Experience = z.infer<typeof ExperienceSchema>;
