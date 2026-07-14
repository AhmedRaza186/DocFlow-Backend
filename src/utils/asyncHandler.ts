import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (fn: AsyncController): RequestHandler => {
  return (req, res, next) => {
    void Promise.resolve(fn(req, res, next)).catch((error: unknown) => next(error));
  };
};
