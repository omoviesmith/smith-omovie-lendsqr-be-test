import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import { hashValue } from '../../shared/utils/encryption';
import type { LoginInput, RegisterInput } from './auth.types';

class AuthService {
  async register(payload: RegisterInput) {
    const passwordHash = await hashValue(payload.password);

    return {
      message: 'Registration scaffold created',
      user: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
      },
      wallet: null,
      token: this.signToken({ sub: payload.email }),
      passwordHashPreview: passwordHash.slice(0, 12),
    };
  }

  async login(payload: LoginInput) {
    if (!payload.email || !payload.password) {
      throw new AppError('Email and password are required', 400);
    }

    return {
      message: 'Login scaffold created',
      token: this.signToken({ sub: payload.email }),
    };
  }

  private signToken(payload: Record<string, string>) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    });
  }
}

export const authService = new AuthService();
