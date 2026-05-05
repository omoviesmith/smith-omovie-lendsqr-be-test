import type { Knex } from 'knex';

import { getDb } from '../../config/database';
import type { PersistedUserRecord } from './user.types';

interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password_hash: string;
  identity_hash: string;
  encrypted_identity: string;
}

export class UserRepository {
  async findByEmail(email: string, db: Knex = getDb()) {
    return db<PersistedUserRecord>('users').where({ email }).first();
  }

  async findByPhone(phone: string, db: Knex = getDb()) {
    return db<PersistedUserRecord>('users').where({ phone }).first();
  }

  async findById(id: string, db: Knex = getDb()) {
    return db<PersistedUserRecord>('users').where({ id }).first();
  }

  async create(payload: CreateUserInput, db: Knex = getDb()) {
    const [id] = await db<CreateUserInput>('users').insert(payload);

    return this.findById(String(id), db);
  }
}

export const userRepository = new UserRepository();
