import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import type { CreateDocumentInput, ShareDocumentInput, UpdateDocumentInput } from '../validators/document.validator';

const EMPTY_TIPTAP_JSON: Prisma.InputJsonValue = {
  type: 'doc',
  content: [],
};

export const createDocument = async (ownerId: string, input: CreateDocumentInput) => {
  const document = await prisma.document.create({
    data: {
      title: input.title?.trim() || 'Untitled Document',
      content: (input.content as Prisma.InputJsonValue | undefined) ?? EMPTY_TIPTAP_JSON,
      ownerId,
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return document;
};

export const getOwnedDocuments = async (ownerId: string) => {
  return prisma.document.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

const getDocumentAccess = async (documentId: string, userId: string) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      id: true,
      title: true,
      content: true,
      ownerId: true,
      updatedAt: true,
      createdAt: true,
      owner: {
        select: { id: true, name: true, email: true },
      },
      sharedDocuments: {
        select: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!document) {
    throw new AppError(404, 'Document not found');
  }

  const isOwner = document.ownerId === userId;
  const isSharedUser = document.sharedDocuments.some((entry) => entry.user.id === userId);

  if (!isOwner && !isSharedUser) {
    throw new AppError(403, 'You do not have access to this document');
  }

  return document;
};

export const getDocumentById = async (documentId: string, userId: string) => {
  const document = await getDocumentAccess(documentId, userId);

  return {
    id: document.id,
    title: document.title,
    content: document.content,
    owner: document.owner,
    updatedAt: document.updatedAt,
    createdAt: document.createdAt,
  };
};

export const updateDocument = async (documentId: string, userId: string, input: UpdateDocumentInput) => {
  await getDocumentAccess(documentId, userId);

  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.content !== undefined ? { content: input.content as Prisma.InputJsonValue } : {}),
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedDocument;
};

export const deleteDocument = async (documentId: string, ownerId: string) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, ownerId: true },
  });

  if (!document) {
    throw new AppError(404, 'Document not found');
  }

  if (document.ownerId !== ownerId) {
    throw new AppError(403, 'Only the owner can delete this document');
  }

  await prisma.document.delete({
    where: { id: documentId },
  });

  return { deleted: true };
};

export const shareDocument = async (documentId: string, ownerId: string, input: ShareDocumentInput) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, ownerId: true },
  });

  if (!document) {
    throw new AppError(404, 'Document not found');
  }

  if (document.ownerId !== ownerId) {
    throw new AppError(403, 'Only the owner can share this document');
  }

  const userToShareWith = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true, name: true, email: true },
  });

  if (!userToShareWith) {
    throw new AppError(404, 'User not found');
  }

  if (userToShareWith.id === ownerId) {
    throw new AppError(409, 'You cannot share a document with yourself');
  }

  const existingShare = await prisma.sharedDocument.findUnique({
    where: {
      documentId_userId: {
        documentId,
        userId: userToShareWith.id,
      },
    },
  });

  if (existingShare) {
    throw new AppError(409, 'This document is already shared with the user');
  }

  await prisma.sharedDocument.create({
    data: {
      documentId,
      userId: userToShareWith.id,
    },
  });

  return {
    documentId,
    sharedWith: {
      id: userToShareWith.id,
      name: userToShareWith.name,
      email: userToShareWith.email,
    },
  };
};

export const getSharedDocumentsForUser = async (userId: string) => {
  const sharedDocuments = await prisma.sharedDocument.findMany({
    where: { userId },
    orderBy: {
      document: {
        updatedAt: 'desc',
      },
    },
    select: {
      document: {
        select: {
          id: true,
          title: true,
          updatedAt: true,
          owner: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  return sharedDocuments.map((entry) => ({
    id: entry.document.id,
    title: entry.document.title,
    ownerName: entry.document.owner.name,
    ownerEmail: entry.document.owner.email,
    updatedAt: entry.document.updatedAt,
  }));
};

export const getSharedUsersForDocument = async (documentId: string, ownerId: string) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      ownerId: true,
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!document) {
    throw new AppError(404, 'Document not found');
  }

  if (document.ownerId !== ownerId) {
    throw new AppError(403, 'Only the owner can view shared users');
  }

  const sharedUsers = await prisma.sharedDocument.findMany({
    where: { documentId },
    select: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return [
    {
      id: document.owner.id,
      name: document.owner.name,
      email: document.owner.email,
    },
    ...sharedUsers.map((entry) => ({
      id: entry.user.id,
      name: entry.user.name,
      email: entry.user.email,
    })),
  ];
};
