import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { env } from '../../config/env';

export const hashValue = async (value: string) => bcrypt.hash(value, 10);

export const compareHash = async (value: string, hash: string) => bcrypt.compare(value, hash);

export const encryptValue = (value: string) => {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(env.ENCRYPTION_KEY).subarray(0, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};
