import type { Request, Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { authService } from './auth.service';

class AuthController {
  register = async (request: Request, response: Response) => {
    const result = await authService.register(request.body);

    response.status(201).json(result);
  };

  login = async (request: Request, response: Response) => {
    const result = await authService.login(request.body);

    response.status(200).json(result);
  };

  me = async (request: AuthenticatedRequest, response: Response) => {
    const result = await authService.getAuthenticatedUser(request.auth!.userId);

    response.status(200).json(result);
  };
}

export const authController = new AuthController();
