import { NextFunction, Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
};

const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, cookieOptions);
};

export const registerController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await registerUser(req.body);
  setAuthCookie(res, result.token);

  return sendSuccess(res, 201, 'User registered successfully', {
    user: result.user,
  });
});

export const loginController = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await loginUser(req.body);
  setAuthCookie(res, result.token);

  return sendSuccess(res, 200, 'Login successful', {
    user: result.user,
  });
});

export const logoutController = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });

  return sendSuccess(res, 200, 'Logged out successfully', null);
});
