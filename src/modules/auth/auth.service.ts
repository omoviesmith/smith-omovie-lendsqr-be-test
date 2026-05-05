import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Knex } from 'knex';

import { getDb } from '../../config/database';
import { env } from '../../config/env';
import { adjutorService } from '../adjutor/adjutor.service';
import { toUserProfile } from '../users/user.mapper';
import { userRepository } from '../users/user.repository';
import { walletRepository } from '../wallets/wallet.repository';
import { AppError } from '../../shared/errors/AppError';
import {
  compareHash,
  digestValue,
  encryptValue,
  hashValue,
} from '../../shared/utils/encryption';
import { normalizePhoneNumber } from '../../shared/utils/phone';
import type { LoginInput, RegisterInput } from './auth.types';

class AuthService {
  async register(payload: RegisterInput) {
    const email = payload.email.trim().toLowerCase();
    const phone = normalizePhoneNumber(payload.phone);

    const existingUserByEmail = await userRepository.findByEmail(email);

    if (existingUserByEmail) {
      throw new AppError('Email is already registered', 409);
    }

    const existingUserByPhone = await userRepository.findByPhone(phone);

    if (existingUserByPhone) {
      throw new AppError('Phone number is already registered', 409);
    }

    const blacklistCheck = await adjutorService.checkKarmaBlacklist(phone);

    if (blacklistCheck.blacklisted) {
      throw new AppError('User failed blacklist screening', 403);
    }

    const passwordHash = await hashValue(payload.password);
    const identityHash = digestValue(phone);
    const encryptedIdentity = encryptValue(phone);

    const result = await getDb().transaction(async (trx) => {
      const user = await this.createUserAndWallet(
        {
          firstName: payload.firstName.trim(),
          lastName: payload.lastName.trim(),
          email,
          phone,
          passwordHash,
          identityHash,
          encryptedIdentity,
        },
        trx,
      );

      return user;
    });

    return {
      message: 'Registration successful',
      user: result.user,
      wallet: result.wallet,
      token: this.signToken({ sub: String(result.user.id) }),
    };
  }

  async login(payload: LoginInput) {
    if (!payload.email || !payload.password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await userRepository.findByEmail(payload.email.trim().toLowerCase());

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const passwordMatches = await compareHash(payload.password, user.password_hash);

    if (!passwordMatches) {
      throw new AppError('Invalid email or password', 401);
    }

    const wallet = await walletRepository.getWalletByUserId(String(user.id));

    if (!wallet) {
      throw new AppError('Wallet not found for user', 500);
    }

    return {
      message: 'Login successful',
      token: this.signToken({ sub: String(user.id) }),
      user: toUserProfile(user),
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
      },
    };
  }

  async getAuthenticatedUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('Authenticated user not found', 404);
    }

    return {
      user: toUserProfile(user),
    };
  }

  private signToken(payload: Record<string, string>) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    });
  }

  private async createUserAndWallet(
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      passwordHash: string;
      identityHash: string;
      encryptedIdentity: string;
    },
    trx: Knex.Transaction,
  ) {
    const user = await userRepository.create(
      {
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        password_hash: payload.passwordHash,
        identity_hash: payload.identityHash,
        encrypted_identity: payload.encryptedIdentity,
      },
      trx,
    );

    if (!user) {
      throw new AppError('Unable to create user', 500);
    }

    const wallet = await walletRepository.create(user.id, trx);

    if (!wallet) {
      throw new AppError('Unable to create wallet', 500);
    }

    return {
      user: toUserProfile(user),
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
      },
    };
  }
}

export const authService = new AuthService();
