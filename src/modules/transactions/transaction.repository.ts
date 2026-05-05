import type { Knex } from 'knex';

import { getDb } from '../../config/database';
import type { TransactionStatus, TransactionType } from './transaction.types';

export interface TransactionRecord {
  id: number | string;
  reference: string;
  wallet_id: number | string;
  source_wallet_id: number | string | null;
  destination_wallet_id: number | string | null;
  type: TransactionType;
  amount: string;
  balance_before: string;
  balance_after: string;
  status: TransactionStatus;
  narration: string | null;
  metadata: unknown;
  created_at: Date | string;
  updated_at: Date | string;
}

interface CreateTransactionInput {
  reference: string;
  wallet_id: number | string;
  source_wallet_id?: number | string | null;
  destination_wallet_id?: number | string | null;
  type: TransactionType;
  amount: string;
  balance_before: string;
  balance_after: string;
  status: TransactionStatus;
  narration?: string | null;
  metadata?: unknown;
}

export class TransactionRepository {
  async create(payload: CreateTransactionInput, db: Knex | Knex.Transaction = getDb()) {
    const [id] = await db<CreateTransactionInput>('transactions').insert({
      ...payload,
      metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
    });

    return this.findById(String(id), db as Knex);
  }

  async findById(id: string, db: Knex = getDb()) {
    return db<TransactionRecord>('transactions').where({ id }).first();
  }

  async listByWalletId(walletId: string, db: Knex = getDb()) {
    return db<TransactionRecord>('transactions')
      .where({ wallet_id: walletId })
      .orderBy('created_at', 'desc')
      .orderBy('id', 'desc');
  }
}

export const transactionRepository = new TransactionRepository();
