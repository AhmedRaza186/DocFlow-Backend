import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { importFile } from '../services/import.service';

export const importController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const ownerId = req.user?.id;

  if (!ownerId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const document = await importFile(ownerId, req.file);
  return sendSuccess(res, 201, 'Document imported successfully', document);
});
