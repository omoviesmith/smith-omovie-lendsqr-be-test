import type { Knex } from 'knex';

const USERS_TABLE = 'users';
const WALLETS_TABLE = 'wallets';
const TRANSACTIONS_TABLE = 'transactions';

const TRANSACTION_TYPES = [
  'FUNDING',
  'WITHDRAWAL',
  'TRANSFER_DEBIT',
  'TRANSFER_CREDIT',
] as const;

const TRANSACTION_STATUSES = ['PENDING', 'SUCCESSFUL', 'FAILED'] as const;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(USERS_TABLE, (table) => {
    table.bigIncrements('id').primary();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('phone', 30).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('identity_hash', 255).notNullable();
    table.text('encrypted_identity').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable(WALLETS_TABLE, (table) => {
    table.bigIncrements('id').primary();
    table
      .bigInteger('user_id')
      .unsigned()
      .notNullable()
      .unique()
      .references('id')
      .inTable(USERS_TABLE)
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.decimal('balance', 19, 4).notNullable().defaultTo(0);
    table.string('currency', 3).notNullable().defaultTo('NGN');
    table.timestamps(true, true);
  });

  await knex.schema.createTable(TRANSACTIONS_TABLE, (table) => {
    table.bigIncrements('id').primary();
    table.string('reference', 100).notNullable().unique();
    table
      .bigInteger('wallet_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(WALLETS_TABLE)
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .bigInteger('source_wallet_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable(WALLETS_TABLE)
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .bigInteger('destination_wallet_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable(WALLETS_TABLE)
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table
      .enu('type', [...TRANSACTION_TYPES], {
        useNative: true,
        enumName: 'transaction_type',
      })
      .notNullable();
    table.decimal('amount', 19, 4).notNullable();
    table.decimal('balance_before', 19, 4).notNullable();
    table.decimal('balance_after', 19, 4).notNullable();
    table
      .enu('status', [...TRANSACTION_STATUSES], {
        useNative: true,
        enumName: 'transaction_status',
      })
      .notNullable()
      .defaultTo('PENDING');
    table.string('narration', 255).nullable();
    table.json('metadata').nullable();
    table.timestamps(true, true);

    table.index(['wallet_id'], 'idx_transactions_wallet_id');
    table.index(['source_wallet_id'], 'idx_transactions_source_wallet_id');
    table.index(['destination_wallet_id'], 'idx_transactions_destination_wallet_id');
    table.index(['type', 'status'], 'idx_transactions_type_status');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TRANSACTIONS_TABLE);
  await knex.schema.dropTableIfExists(WALLETS_TABLE);
  await knex.schema.dropTableIfExists(USERS_TABLE);
}
