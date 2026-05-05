import { AppError } from '../../shared/errors/AppError';
import { walletRepository } from '../wallets/wallet.repository';
import { toTransactionResponse } from './transaction.mapper';
import { transactionRepository } from './transaction.repository';

export class TransactionService {
  async getWalletTransactions(userId: string) {
    const wallet = await walletRepository.getWalletByUserId(userId);

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    const transactions = await transactionRepository.listByWalletId(String(wallet.id));

    return {
      transactions: transactions.map(toTransactionResponse),
    };
  }
}

export const transactionService = new TransactionService();
