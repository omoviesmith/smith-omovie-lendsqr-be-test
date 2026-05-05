import type { TransactionRecord } from './transaction.repository';

export const toTransactionResponse = (transaction: TransactionRecord) => {
  return {
    id: transaction.id,
    reference: transaction.reference,
    walletId: transaction.wallet_id,
    sourceWalletId: transaction.source_wallet_id,
    destinationWalletId: transaction.destination_wallet_id,
    type: transaction.type,
    amount: transaction.amount,
    balanceBefore: transaction.balance_before,
    balanceAfter: transaction.balance_after,
    status: transaction.status,
    narration: transaction.narration,
    metadata:
      typeof transaction.metadata === 'string' && transaction.metadata.length > 0
        ? JSON.parse(transaction.metadata)
        : transaction.metadata,
    createdAt: transaction.created_at,
  };
};
