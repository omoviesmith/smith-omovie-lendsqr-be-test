import type { Knex } from 'knex';

import { AppError } from '../../shared/errors/AppError';
import type { TransactionType } from '../transactions/transaction.types';
import { transactionRepository } from '../transactions/transaction.repository';
import { walletRepository, type WalletRecord } from './wallet.repository';

interface RecordWalletTransactionInput {
  amount: string;
  balanceAfter: string;
  balanceBefore: string;
  metadata?: Record<string, unknown>;
  narration: string;
  reference: string;
  status?: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  transactionType: TransactionType;
  walletId: number | string;
  sourceWalletId?: number | string | null;
  destinationWalletId?: number | string | null;
}

export const requireWalletByUserId = async (
  userId: string,
  db?: Knex | Knex.Transaction,
): Promise<WalletRecord> => {
  const wallet = db
    ? await walletRepository.getWalletByUserId(userId, db as Knex)
    : await walletRepository.getWalletByUserId(userId);

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  return wallet;
};

export const requireWalletByUserIdForUpdate = async (
  userId: string,
  trx: Knex.Transaction,
): Promise<WalletRecord> => {
  const wallet = await walletRepository.getWalletByUserIdForUpdate(userId, trx);

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  return wallet;
};

export const updateWalletBalanceOrThrow = async (
  walletId: string,
  balance: string,
  trx: Knex.Transaction,
) => {
  const wallet = await walletRepository.updateBalance(walletId, balance, trx);

  if (!wallet) {
    throw new AppError('Unable to update wallet balance', 500);
  }

  return wallet;
};

export const recordWalletTransaction = async (
  payload: RecordWalletTransactionInput,
  trx: Knex.Transaction,
) => {
  const transaction = await transactionRepository.create(
    {
      reference: payload.reference,
      wallet_id: payload.walletId,
      source_wallet_id: payload.sourceWalletId,
      destination_wallet_id: payload.destinationWalletId,
      type: payload.transactionType,
      amount: payload.amount,
      balance_before: payload.balanceBefore,
      balance_after: payload.balanceAfter,
      status: payload.status ?? 'SUCCESSFUL',
      narration: payload.narration,
      metadata: payload.metadata,
    },
    trx,
  );

  if (!transaction) {
    throw new AppError('Unable to create transaction record', 500);
  }

  return transaction;
};
