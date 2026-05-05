import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env';

export interface AuthenticatedRequest extends Request {
  auth?: {
    sub: string;
  };
}

export const authMiddleware = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Missing bearer token' });
  }

  const token = authHeader.slice(7);
  const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };

  request.auth = { sub: payload.sub };

  return next();
};
