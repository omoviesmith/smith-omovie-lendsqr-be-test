import { Router } from 'express';

import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { transactionController } from './transaction.controller';

export const transactionRoutes = Router();

transactionRoutes.get('/', authMiddleware, transactionController.listTransactions);
