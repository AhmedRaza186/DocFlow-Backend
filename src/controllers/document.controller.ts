import { NextFunction, Request, Response } from 'express';
import { createDocument, deleteDocument, getDocumentById, getOwnedDocuments, getSharedDocumentsForUser, getSharedUsersForDocument, shareDocument, updateDocument } from '../services/document.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export const createDocumentController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const ownerId = req.user?.id;

  if (!ownerId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const document = await createDocument(ownerId, req.body);
  return sendSuccess(res, 201, 'Document created successfully', document);
});

export const listDocumentsController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const ownerId = req.user?.id;

  if (!ownerId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const documents = await getOwnedDocuments(ownerId);
  return sendSuccess(res, 200, 'Documents fetched successfully', documents);
});

export const getDocumentController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const ownerId = req.user?.id;
  const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!ownerId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const document = await getDocumentById(documentId, ownerId);
  return sendSuccess(res, 200, 'Document fetched successfully', document);
});

export const updateDocumentController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const ownerId = req.user?.id;
  const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!ownerId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const document = await updateDocument(documentId, ownerId, req.body);
  return sendSuccess(res, 200, 'Document updated successfully', document);
});

export const deleteDocumentController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const ownerId = req.user?.id;
  const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!ownerId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const result = await deleteDocument(documentId, ownerId);
  return sendSuccess(res, 200, 'Document deleted successfully', result);
});

export const shareDocumentController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const ownerId = req.user?.id;
  const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!ownerId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const result = await shareDocument(documentId, ownerId, req.body);
  return sendSuccess(res, 200, 'Document shared successfully', result);
});

export const listSharedDocumentsController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const documents = await getSharedDocumentsForUser(userId);
  return sendSuccess(res, 200, 'Shared documents fetched successfully', documents);
});

export const getSharedUsersController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const ownerId = req.user?.id;
  const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!ownerId) {
    return sendSuccess(res, 401, 'Authentication required', null);
  }

  const users = await getSharedUsersForDocument(documentId, ownerId);
  return sendSuccess(res, 200, 'Shared users fetched successfully', users);
});
