import { z } from 'zod';
import { LocalizedTextSchema } from './common';

export const CertificationSchema = z.object({
  id: z.string().min(1),
  name: LocalizedTextSchema,
  issuer: z.string().min(1),
  issueDate: z.union([z.string().min(1), LocalizedTextSchema]),
  status: z.enum(['completed', 'in-progress']).default('completed'),
  credentialUrl: z.string().url().optional().or(z.literal('')),
});

export const CertificationListSchema = z.array(CertificationSchema);

export type Certification = z.infer<typeof CertificationSchema>;
