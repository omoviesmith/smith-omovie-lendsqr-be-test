import { formatMoneyInput } from '../../shared/utils/money';
import { generateReference } from '../../shared/utils/reference';
import type {
  FundWalletInput,
  TransferFundsInput,
  WithdrawFundsInput,
} from './wallet.types';

class WalletService {
  async getAuthenticatedWallet() {
    return {
      message: 'Wallet scaffold created',
      wallet: {
        balance: '0.00',
        currency: 'NGN',
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
