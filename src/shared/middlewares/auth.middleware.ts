import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../../config/env';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
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

  try {
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (typeof payload.sub !== 'string') {
      return response.status(401).json({ message: 'Invalid authentication token' });
    }

    request.auth = { userId: payload.sub };

    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid authentication token' });
  }
};
