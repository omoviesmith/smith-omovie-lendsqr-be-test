import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import { AppError } from '../errors/AppError';

export const validate = (schema: ZodSchema) => {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      return next(new AppError(result.error.issues[0]?.message ?? 'Validation failed', 400));
    }

    request.body = result.data;

    return next();
  };
};
