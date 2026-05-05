import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../shared/middlewares/auth.middleware';
import { sendSuccessResponse } from '../../shared/utils/response';
import { walletService } from './wallet.service';

class WalletController {
  getMyWallet = async (request: AuthenticatedRequest, response: Response) => {
    const wallet = await walletService.getAuthenticatedWallet(request.auth!.userId);

    return sendSuccessResponse(response, 200, wallet);
  };

  fundWallet = async (request: AuthenticatedRequest, response: Response) => {
    const result = await walletService.fundWallet(request.auth!.userId, request.body);

    return sendSuccessResponse(response, 200, result);
  };

  transferFunds = async (request: AuthenticatedRequest, response: Response) => {
    const result = await walletService.transferFunds(request.auth!.userId, request.body);

    return sendSuccessResponse(response, 200, result);
  };

  withdrawFunds = async (request: AuthenticatedRequest, response: Response) => {
    const result = await walletService.withdrawFunds(request.auth!.userId, request.body);

    return sendSuccessResponse(response, 200, result);
  };
}

export const walletController = new WalletController();
