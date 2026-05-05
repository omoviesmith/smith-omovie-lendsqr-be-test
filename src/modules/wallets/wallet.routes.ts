import { Router } from 'express';

import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { validate } from '../../shared/middlewares/validate.middleware';
import { walletController } from './wallet.controller';
import {
  fundWalletSchema,
  transferFundsSchema,
  withdrawFundsSchema,
} from './wallet.validation';

export const walletRoutes = Router();

walletRoutes.get('/me', authMiddleware, walletController.getMyWallet);
walletRoutes.post('/fund', authMiddleware, validate(fundWalletSchema), walletController.fundWallet);
walletRoutes.post(
  '/transfer',
  authMiddleware,
  validate(transferFundsSchema),
  walletController.transferFunds,
);
walletRoutes.post(
  '/withdraw',
  authMiddleware,
  validate(withdrawFundsSchema),
  walletController.withdrawFunds,
);
