import { Router } from 'express';

import { walletController } from './wallet.controller';

export const walletRoutes = Router();

walletRoutes.get('/me', walletController.getMyWallet);
walletRoutes.post('/fund', walletController.fundWallet);
walletRoutes.post('/transfer', walletController.transferFunds);
walletRoutes.post('/withdraw', walletController.withdrawFunds);
