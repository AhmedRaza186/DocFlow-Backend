import multer from 'multer';
import { AppError } from '../utils/AppError';
import prisma from '../prisma/client';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.txt', '.md'];
    const extension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

    if (!allowedExtensions.includes(extension)) {
      cb(new AppError(400, 'Only .txt and .md files are supported'));
      return;
    }

    cb(null, true);
  },
});

const toTipTapJson = (text: string) => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text,
        },
      ],
    },
  ],
});

export const importFileMiddleware = upload.single('file');

export const importFile = async (ownerId: string, file: Express.Multer.File | undefined) => {
  if (!file) {
    throw new AppError(400, 'File is required');
  }

  const extension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

  if (!['.txt', '.md'].includes(extension)) {
    throw new AppError(400, 'Only .txt and .md files are supported');
  }

  const content = file.buffer.toString('utf8');
  const title = file.originalname.replace(/\.[^.]+$/, '');

  const document = await prisma.document.create({
    data: {
      title,
      content: toTipTapJson(content),
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
