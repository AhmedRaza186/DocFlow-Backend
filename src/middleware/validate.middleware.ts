import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export const validate = (schema: ZodSchema) => {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error.issues.reduce<Record<string, string>>((acc, issue) => {
        const field = issue.path.join('.') || 'body';
        acc[field] = issue.message;
        return acc;
      }, {});

      throw new AppError(400, 'Validation failed', issues);
    }

    req.body = result.data;
    next();
  });
};
