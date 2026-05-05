import { formatMoneyInput } from '../../shared/utils/money';
import { generateReference } from '../../shared/utils/reference';
import { AppError } from '../../shared/errors/AppError';
import { walletRepository } from './wallet.repository';
import type {
  FundWalletInput,
  TransferFundsInput,
  WithdrawFundsInput,
} from './wallet.types';

class WalletService {
  async getAuthenticatedWallet(userId: string) {
    const wallet = await walletRepository.getWalletByUserId(userId);

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    return {
      wallet: {
        id: wallet.id,
        userId: wallet.user_id,
        balance: wallet.balance,
        currency: wallet.currency,
      },
    };
  }

  async fundWallet(payload: FundWalletInput) {
    return {
      message: 'Funding scaffold created',
      reference: generateReference('fund'),
      amount: formatMoneyInput(payload.amount),
    };
  }

  async transferFunds(payload: TransferFundsInput) {
    return {
      message: 'Transfer scaffold created',
      reference: generateReference('trf'),
      recipientEmail: payload.recipientEmail,
      amount: formatMoneyInput(payload.amount),
    };
  }

  async withdrawFunds(payload: WithdrawFundsInput) {
    return {
      message: 'Withdrawal scaffold created',
      reference: generateReference('wdr'),
      amount: formatMoneyInput(payload.amount),
    };
  }
}

export const walletService = new WalletService();
