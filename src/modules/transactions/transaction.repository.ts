export class TransactionRepository {
  async listByWalletId(walletId: string) {
    return [{ walletId, reference: 'txn_placeholder' }];
  }
}

export const transactionRepository = new TransactionRepository();
