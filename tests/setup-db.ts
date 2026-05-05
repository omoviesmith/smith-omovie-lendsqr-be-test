import path from 'path';
import knex from 'knex';

import { closeDb, getDatabaseName, getDb } from '../src/config/database';

jest.setTimeout(30000);

beforeAll(async () => {
  const rootConnection = knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'password',
    },
  });

  await rootConnection.raw(`CREATE DATABASE IF NOT EXISTS \`${getDatabaseName()}\``);
  await rootConnection.destroy();

  const db = getDb();

  await db.migrate.rollback(undefined, true);
  await db.migrate.latest({
    directory: path.resolve(__dirname, '../src/database/migrations'),
    extension: 'ts',
  });
});

beforeEach(async () => {
  const db = getDb();

  await db.raw('SET FOREIGN_KEY_CHECKS = 0');
  await db('transactions').truncate();
  await db('wallets').truncate();
  await db('users').truncate();
  await db.raw('SET FOREIGN_KEY_CHECKS = 1');
});

afterAll(async () => {
  await closeDb();
});
