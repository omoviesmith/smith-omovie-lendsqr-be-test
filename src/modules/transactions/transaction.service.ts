import { transactionRepository } from './transaction.repository';

export class TransactionService {
  async getWalletTransactions(walletId: string) {
    return transactionRepository.listByWalletId(walletId);
  }
}

export const transactionService = new TransactionService();
