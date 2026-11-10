import { z } from 'zod';

export const LocalizedTextSchema = z.object({
  es: z.string().min(1, 'El texto en español es requerido'),
  en: z.string().min(1, 'English text is required'),
});

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;
