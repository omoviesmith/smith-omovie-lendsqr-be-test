import type { Knex } from 'knex';

import { getDb } from '../../config/database';

export interface WalletRecord {
  id: number | string;
  user_id: number | string;
  balance: string;
  currency: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export class WalletRepository {
  async create(userId: number | string, db: Knex = getDb()) {
    const [id] = await db('wallets').insert({
      user_id: userId,
    });

    return this.findById(String(id), db);
  }

  async findById(id: string, db: Knex = getDb()) {
    return db<WalletRecord>('wallets').where({ id }).first();
  }

  async getWalletByUserId(userId: string, db: Knex = getDb()) {
    return db<WalletRecord>('wallets').where({ user_id: userId }).first();
  }
}

export const walletRepository = new WalletRepository();
