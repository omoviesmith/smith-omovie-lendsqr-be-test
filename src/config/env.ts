import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_NAME: z.string().default('demo-credit-api'),
  API_PREFIX: z.string().default('/api/v1'),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default('password'),
  DB_NAME: z.string().default('demo_credit'),
  DB_SSL: z.coerce.boolean().default(false),
  DB_SSL_REJECT_UNAUTHORIZED: z.coerce.boolean().default(true),
  DB_SSL_CA: z.string().optional(),
  JWT_SECRET: z.string().min(8).default('change-me'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  ADJUTOR_API_KEY: z.string().default('change-me'),
  ADJUTOR_BASE_URL: z.string().url().default('https://adjutor.lendsqr.com'),
  ENCRYPTION_KEY: z.string().min(32).default('12345678901234567890123456789012'),
});

export const env = envSchema.parse(process.env);
