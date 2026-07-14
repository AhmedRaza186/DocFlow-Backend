import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';

interface JwtPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const tokenFromCookie = req.cookies?.token;
  const header = req.headers.authorization;
  const token = tokenFromCookie || (header?.startsWith('Bearer ') ? header.split(' ')[1] : undefined);

  if (!token) {
    throw new AppError(401, 'Authentication token missing');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, 'Token expired');
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(401, 'Invalid token');
    }

    throw error;
  }
});
