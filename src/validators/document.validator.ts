import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().trim().min(1).optional(),
  content: z.unknown().optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().trim().min(1).optional(),
  content: z.unknown().optional(),
});

export const shareDocumentSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Email must be a valid email'),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
