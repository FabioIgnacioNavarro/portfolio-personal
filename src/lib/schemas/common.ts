import { z } from 'zod';

export const LocalizedTextSchema = z.object({
  es: z.string().min(1, 'El texto en español es requerido'),
  en: z.string().min(1, 'English text is required'),
});

export type LocalizedText = z.infer<typeof LocalizedTextSchema>;

// Resuelve texto bilingüe o plano al idioma solicitado con respaldo seguro
export function resolveLocalizedText(
  text: LocalizedText | string | null | undefined,
  lang: 'es' | 'en' = 'es',
): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.es || text.en || '';
}
