import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { transactionService } from './transaction.service';

class TransactionController {
  listTransactions = async (request: AuthenticatedRequest, response: Response) => {
    const result = await transactionService.getWalletTransactions(request.auth!.userId);

    response.status(200).json(result);
  };
}

export const transactionController = new TransactionController();
