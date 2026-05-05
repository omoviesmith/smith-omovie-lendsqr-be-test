import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { sendSuccessResponse } from '../../shared/utils/response';
import { transactionService } from './transaction.service';

class TransactionController {
  listTransactions = async (request: AuthenticatedRequest, response: Response) => {
    const result = await transactionService.getWalletTransactions(request.auth!.userId);

    return sendSuccessResponse(response, 200, result);
  };
}

export const transactionController = new TransactionController();
