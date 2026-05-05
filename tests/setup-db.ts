import { getDb, closeDb } from '../src/config/database';

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
