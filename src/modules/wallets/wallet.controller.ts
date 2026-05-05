import type { Request, Response } from 'express';

import { walletService } from './wallet.service';

class WalletController {
  getMyWallet = async (_request: Request, response: Response) => {
    const wallet = await walletService.getAuthenticatedWallet();

    response.status(200).json(wallet);
  };

  fundWallet = async (request: Request, response: Response) => {
    const result = await walletService.fundWallet(request.body);

    response.status(200).json(result);
  };

  transferFunds = async (request: Request, response: Response) => {
    const result = await walletService.transferFunds(request.body);

    response.status(200).json(result);
  };

  withdrawFunds = async (request: Request, response: Response) => {
    const result = await walletService.withdrawFunds(request.body);

    response.status(200).json(result);
  };
}

export const walletController = new WalletController();
