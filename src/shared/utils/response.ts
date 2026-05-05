import type { Response } from 'express';

export const sendSuccessResponse = <T>(response: Response, statusCode: number, data: T) => {
  return response.status(statusCode).json({
    success: true,
    data,
  });
};
