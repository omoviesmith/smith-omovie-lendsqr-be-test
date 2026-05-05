import type { Request, Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { sendSuccessResponse } from '../../shared/utils/response';
import { authService } from './auth.service';

class AuthController {
  register = async (request: Request, response: Response) => {
    const result = await authService.register(request.body);

    return sendSuccessResponse(response, 201, result);
  };

  login = async (request: Request, response: Response) => {
    const result = await authService.login(request.body);

    return sendSuccessResponse(response, 200, result);
  };

  me = async (request: AuthenticatedRequest, response: Response) => {
    const result = await authService.getAuthenticatedUser(request.auth!.userId);

    return sendSuccessResponse(response, 200, result);
  };
}

export const authController = new AuthController();
