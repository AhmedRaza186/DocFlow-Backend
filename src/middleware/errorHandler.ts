import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.details ?? null);
    return;
  }

  if (err instanceof Error) {
    console.error('Unhandled error:', err);
    sendError(res, 500, 'Internal server error');
    return;
  }

  console.error('Unhandled non-error:', err);
  sendError(res, 500, 'Internal server error');
};
