import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const EducationSchema = z.object({
  id: z.string().min(1),
  institution: z.string().min(1),
  degree: LocalizedTextSchema,
  status: z.enum(['in-progress', 'paused', 'completed']),
  startDate: z.union([z.string().min(1), LocalizedTextSchema]),
  endDate: z.union([z.string().min(1), LocalizedTextSchema]).nullable(),
  description: LocalizedTextSchema.optional(),
});

export const EducationListSchema = z.array(EducationSchema);

export type Education = z.infer<typeof EducationSchema>;
