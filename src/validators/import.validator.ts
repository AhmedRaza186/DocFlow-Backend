import { z } from 'zod';

export const importFileSchema = z.object({
  file: z.unknown().optional(),
});

export type ImportFileInput = z.infer<typeof importFileSchema>;
