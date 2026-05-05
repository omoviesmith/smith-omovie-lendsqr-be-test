import type { Request, Response } from 'express';

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

  me = async (_request: Request, response: Response) => {
    response.status(200).json({
      message: 'Authenticated user profile endpoint placeholder',
    });
  };
}

export const authController = new AuthController();
