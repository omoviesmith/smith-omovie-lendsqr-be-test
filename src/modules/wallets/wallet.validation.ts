import { z } from 'zod';

export const fundWalletSchema = z.object({
  amount: z.coerce.number().positive(),
});

export const transferFundsSchema = z.object({
  recipientEmail: z.string().email(),
  amount: z.coerce.number().positive(),
  narration: z.string().max(255).optional(),
});

export const withdrawFundsSchema = z.object({
  amount: z.coerce.number().positive(),
});
