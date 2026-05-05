import { Router } from 'express';

import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import { authController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.validation';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), authController.register);
authRoutes.post('/login', validate(loginSchema), authController.login);
authRoutes.get('/me', authMiddleware, authController.me);
