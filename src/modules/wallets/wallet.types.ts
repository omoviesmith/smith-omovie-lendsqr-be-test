import type { z } from 'zod';

import {
  fundWalletSchema,
  transferFundsSchema,
  withdrawFundsSchema,
} from './wallet.validation';

export type FundWalletInput = z.infer<typeof fundWalletSchema>;
export type TransferFundsInput = z.infer<typeof transferFundsSchema>;
export type WithdrawFundsInput = z.infer<typeof withdrawFundsSchema>;
