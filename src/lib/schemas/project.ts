import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: LocalizedTextSchema,
  summary: LocalizedTextSchema,
  role: LocalizedTextSchema,
  status: z.enum(['in-progress', 'completed']),
  technologies: z.array(z.string()).min(1),
  links: z.object({
    repo: z.string().url().optional().or(z.literal('')),
    demo: z.string().url().optional().or(z.literal('')),
  }),
  screenshots: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: LocalizedTextSchema,
        caption: LocalizedTextSchema.optional(),
      }),
    )
    .default([]),
  featured: z.boolean().default(false),
  caseStudy: z.object({
    es: z.string().min(1),
    en: z.string().min(1),
  }),
});

export const ProjectListSchema = z.array(ProjectSchema);

export type Project = z.infer<typeof ProjectSchema>;
