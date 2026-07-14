import { Response } from 'express';

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ErrorResponse = {
  success: false;
  message: string;
  errors: Record<string, unknown> | null;
};

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data: T): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (res: Response, statusCode: number, message: string, errors: Record<string, unknown> | null = null): Response<ErrorResponse> => {
  return res.status(statusCode).json({ success: false, message, errors });
};
