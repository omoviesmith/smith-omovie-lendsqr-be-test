import { Router } from 'express';

import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { walletController } from './wallet.controller';

export const walletRoutes = Router();

walletRoutes.get('/me', authMiddleware, walletController.getMyWallet);
walletRoutes.post('/fund', authMiddleware, walletController.fundWallet);
walletRoutes.post('/transfer', authMiddleware, walletController.transferFunds);
walletRoutes.post('/withdraw', authMiddleware, walletController.withdrawFunds);
